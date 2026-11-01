"use client";

import React, { useState, useEffect } from "react";
import {
  StrummingPattern,
  StrokeDirection,
  SubdivisionUnit,
  MetronomeSubdivision,
  getPositionalStrokeDirection,
  alignSlotsToStrictAlternation,
} from "../types";
import { VisualTimeline } from "./VisualTimeline";
import { ControlsBar } from "./ControlsBar";
import { usePlaybackEngine } from "../hooks/usePlaybackEngine";
import { useWakeLock } from "../hooks/useWakeLock";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { beginnerPresets } from "../presets/beginnerPatterns";
import { strummingStorage } from "../storage/strummingStorage";
import { PresetSelector } from "./PresetSelector";
import { PracticeTimer } from "./PracticeTimer";
import { StrummingUrlConfig, parseStrummingParams } from "../domain/queryParams";

export interface StrummingPlayerProps {
  initialPattern?: StrummingPattern;
  initialConfig?: StrummingUrlConfig;
}

export const StrummingPlayer: React.FC<StrummingPlayerProps> = ({
  initialPattern = beginnerPresets[0],
  initialConfig,
}) => {
  // Pattern state
  const [pattern, setPattern] = useState<StrummingPattern>(initialConfig?.pattern || initialPattern);
  // Default strict alternating motion UDUD (item 1 from user request)
  const [strictAlternation, setStrictAlternation] = useState<boolean>(
    initialConfig?.strict !== undefined ? initialConfig.strict : true
  );

  const engine = usePlaybackEngine({
    initialBpm: initialConfig?.bpm || 80,
    initialPattern: initialConfig?.pattern || pattern,
    initialAccent: initialConfig?.accent !== undefined ? initialConfig.accent : true,
    initialCountIn: initialConfig?.countIn !== undefined ? initialConfig.countIn : 1,
    initialSubdivision: initialConfig?.metroSub || "quarter",
  });

  // Client-side initialization: Priority given to incoming URL query params, then localStorage fallback
  useEffect(() => {
    // 1. Resolve URL query parameters (from initialConfig or window.location.search)
    let urlConfig = initialConfig;
    if ((!urlConfig || Object.keys(urlConfig).length === 0) && typeof window !== "undefined" && window.location.search) {
      urlConfig = parseStrummingParams(new URLSearchParams(window.location.search));
    }

    const hasUrlParams = urlConfig && Object.keys(urlConfig).length > 0;

    if (hasUrlParams && urlConfig) {
      // Apply URL configuration & persist to localStorage so it becomes the user's active setting
      if (urlConfig.bpm) {
        engine.setBpm(urlConfig.bpm);
        strummingStorage.savePreferences({ lastBpm: urlConfig.bpm });
      }
      if (typeof urlConfig.accent === "boolean") {
        engine.setAccentFirstBeat(urlConfig.accent);
        strummingStorage.savePreferences({ lastAccentFirstBeat: urlConfig.accent });
      }
      if (urlConfig.countIn !== undefined) {
        engine.setCountInMeasures(urlConfig.countIn);
      }
      if (urlConfig.metroSub) {
        engine.setMetronomeSubdivision(urlConfig.metroSub);
        strummingStorage.savePreferences({ lastMetronomeSubdivision: urlConfig.metroSub });
      }
      if (typeof urlConfig.strict === "boolean") {
        setStrictAlternation(urlConfig.strict);
        strummingStorage.savePreferences({ strictAlternation: urlConfig.strict });
      }
      if (urlConfig.pattern) {
        setPattern(urlConfig.pattern);
        strummingStorage.saveLastActivePattern(urlConfig.pattern);
        if (!urlConfig.pattern.isPreset) {
          strummingStorage.saveCustomPattern(urlConfig.pattern);
        }
        strummingStorage.savePreferences({
          lastPatternId: urlConfig.pattern.id,
          lastSubdivision: urlConfig.pattern.subdivision,
        });
      }
    } else {
      // No URL parameters: restore previous session preferences & last active pattern from localStorage
      const prefs = strummingStorage.getPreferences();
      if (prefs.lastBpm) {
        engine.setBpm(prefs.lastBpm);
      }
      if (typeof prefs.lastAccentFirstBeat === "boolean") {
        engine.setAccentFirstBeat(prefs.lastAccentFirstBeat);
      }
      if (prefs.lastMetronomeSubdivision) {
        engine.setMetronomeSubdivision(prefs.lastMetronomeSubdivision);
      }
      if (typeof prefs.strictAlternation === "boolean") {
        setStrictAlternation(prefs.strictAlternation);
      }

      // Try restoring the exact last active pattern saved in localStorage
      const lastActivePattern = strummingStorage.getLastActivePattern();
      if (lastActivePattern) {
        setPattern(lastActivePattern);
      } else {
        // Fallback to custom patterns or beginner presets
        const customPatterns = strummingStorage.getCustomPatterns();
        const savedPattern =
          [...customPatterns, ...beginnerPresets].find((p) => p.id === prefs.lastPatternId) ||
          beginnerPresets[0];

        if (savedPattern) {
          setPattern(savedPattern);
        }
      }
    }
  }, []);

  // Screen Wake Lock while playing
  useWakeLock(engine.isPlaying);

  // Global Keyboard Shortcuts (SPACE to toggle play/pause, BACKSPACE <- to restart with count-in, RETURN to reset)
  useKeyboardShortcuts({
    onTogglePlayPause: engine.togglePlayPause,
    onReset: engine.reset,
    onRestartCountIn: engine.restartWithCountIn,
    isEnabled: true,
  });

  // Handle slot click: Enforces alternating arrows (odds: Down, evens: Up) by default, or free-form if toggle is off
  const handleSlotClick = (index: number) => {
    const currentDirection = pattern.slots[index]?.strokeDirection || "none";
    let updatedSlots = [...pattern.slots];

    if (strictAlternation) {
      // Alternating Mode (Default):
      // Odds (pos 1, 3, 5, etc. -> index % 2 === 0) -> Down
      // Evens (pos 2, 4, 6, etc. -> index % 2 === 1) -> Up
      // Specifically in 16th subdivisions: '1' and '&' are Down, while 'e' and 'a' are Up
      if (currentDirection !== "none") {
        // Slot is active -> turn it off
        updatedSlots[index] = { ...updatedSlots[index], strokeDirection: "none" };
      } else {
        // Slot is empty -> turn it on with its positional direction
        updatedSlots[index] = {
          ...updatedSlots[index],
          strokeDirection: getPositionalStrokeDirection(index),
        };
      }
    } else {
      // Free-form cycling: none -> down -> up -> none (allows arbitrary patterns like DDDU, DDU, etc.)
      let nextDirection: StrokeDirection = "none";
      if (currentDirection === "none") nextDirection = "down";
      else if (currentDirection === "down") nextDirection = "up";
      else if (currentDirection === "up") nextDirection = "none";

      updatedSlots[index] = { ...updatedSlots[index], strokeDirection: nextDirection };
    }

    const updatedPattern: StrummingPattern = {
      ...pattern,
      isPreset: false,
      slots: updatedSlots,
      updatedAt: new Date().toISOString(),
    };

    setPattern(updatedPattern);
    strummingStorage.saveLastActivePattern(updatedPattern);
    strummingStorage.saveCustomPattern(updatedPattern);
    strummingStorage.savePreferences({ lastPatternId: updatedPattern.id });
  };

  // Toggle strict alternating strokes
  const handleToggleStrictAlternation = () => {
    const nextVal = !strictAlternation;
    setStrictAlternation(nextVal);
    strummingStorage.savePreferences({ strictAlternation: nextVal });

    if (nextVal) {
      // Switching back to Alternating Mode: re-align active strokes to their positional D/U directions
      const reAlignedSlots = alignSlotsToStrictAlternation(pattern.slots);
      const updatedPattern: StrummingPattern = {
        ...pattern,
        slots: reAlignedSlots,
        updatedAt: new Date().toISOString(),
      };
      setPattern(updatedPattern);
      strummingStorage.saveLastActivePattern(updatedPattern);
      strummingStorage.saveCustomPattern(updatedPattern);
    }
  };

  // Handle Preset selection
  const handleSelectPreset = (selectedPreset: StrummingPattern) => {
    setPattern(selectedPreset);
    strummingStorage.saveLastActivePattern(selectedPreset);
    strummingStorage.savePreferences({
      lastPatternId: selectedPreset.id,
      lastSubdivision: selectedPreset.subdivision,
    });
  };

  // Handle Subdivision toggle (8th vs 16th)
  const handleSubdivisionChange = (subdivision: SubdivisionUnit) => {
    if (subdivision === pattern.subdivision) return;

    engine.pause();
    engine.reset();

    const slotsCount = subdivision === "eighth" ? 8 : 16;
    const newSlots = Array.from({ length: slotsCount }, (_, i) => {
      const isQuarterBeat = subdivision === "eighth" ? i % 2 === 0 : i % 4 === 0;
      let label = "";

      if (subdivision === "eighth") {
        label = isQuarterBeat ? `${i / 2 + 1}` : "&";
      } else {
        const beatNum = Math.floor(i / 4) + 1;
        const subIndex = i % 4;
        if (subIndex === 0) label = `${beatNum}`;
        else if (subIndex === 1) label = "e";
        else if (subIndex === 2) label = "&";
        else label = "a";
      }

      return {
        index: i,
        beatLabel: label,
        strokeDirection: (i === 0 ? "down" : "none") as StrokeDirection,
        isQuarterBeat,
        isMeasureStart: i === 0,
      };
    });

    const newPattern: StrummingPattern = {
      id: `custom-${subdivision}-${Date.now()}`,
      name: `Custom ${subdivision === "eighth" ? "8th" : "16th"} Pattern`,
      timeSignature: [4, 4],
      subdivision,
      slots: newSlots,
      isPreset: false,
      ownerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPattern(newPattern);
    strummingStorage.saveLastActivePattern(newPattern);
    strummingStorage.saveCustomPattern(newPattern);
    strummingStorage.savePreferences({
      lastPatternId: newPattern.id,
      lastSubdivision: subdivision,
    });
  };

  // Persist BPM adjustments
  const handleBpmChange = (newBpm: number) => {
    engine.setBpm(newBpm);
    strummingStorage.savePreferences({ lastBpm: newBpm });
  };

  // Persist Accent adjustments
  const handleAccentToggle = (enabled: boolean) => {
    engine.setAccentFirstBeat(enabled);
    strummingStorage.savePreferences({ lastAccentFirstBeat: enabled });
  };

  // Persist Metronome Subdivision adjustments and trigger instant preview if not playing
  const handleMetronomeSubdivisionChange = (sub: MetronomeSubdivision) => {
    engine.setMetronomeSubdivision(sub, !engine.isPlaying);
    strummingStorage.savePreferences({ lastMetronomeSubdivision: sub });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Pattern Presets & Subdivision Controls (US2) */}
      <PresetSelector
        activePatternId={pattern.id}
        activeSubdivision={pattern.subdivision}
        strictAlternation={strictAlternation}
        onSelectPreset={handleSelectPreset}
        onSubdivisionChange={handleSubdivisionChange}
        onToggleStrictAlternation={handleToggleStrictAlternation}
        shareProps={{
          pattern,
          bpm: engine.bpm,
          accent: engine.accentFirstBeat,
          countIn: engine.countInMeasures,
          metroSub: engine.metronomeSubdivision,
          strict: strictAlternation,
        }}
      />

      {/* Visual Timeline with Top-Right Alternation / Free Mode Toggle (US1) */}
      <VisualTimeline
        pattern={pattern}
        animationDriver={engine.animationDriver}
        isCountingIn={engine.isCountingIn}
        countInBeatRemaining={engine.countInBeatRemaining}
        totalCountInBeats={engine.totalCountInBeats}
        strictAlternation={strictAlternation}
        onToggleStrictAlternation={handleToggleStrictAlternation}
        onSlotClick={handleSlotClick}
        isInteractive={true}
      />

      {/* Practice Session Timer (US3) */}
      <PracticeTimer isPlaying={engine.isPlaying} />

      {/* Primary Playback & Metronome Controls (Configurable Subdivisions & Audio Sync) */}
      <ControlsBar
        isPlaying={engine.isPlaying}
        bpm={engine.bpm}
        accentFirstBeat={engine.accentFirstBeat}
        countInMeasures={engine.countInMeasures}
        metronomeSubdivision={engine.metronomeSubdivision}
        activeBeatIndex={engine.activeBeatIndex}
        onTogglePlayPause={engine.togglePlayPause}
        onReset={engine.reset}
        onBpmChange={handleBpmChange}
        onAccentToggle={handleAccentToggle}
        onCountInChange={engine.setCountInMeasures}
        onSubdivisionChange={handleMetronomeSubdivisionChange}
      />
    </div>
  );
};
