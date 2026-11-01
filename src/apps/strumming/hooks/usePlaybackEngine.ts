import { useState, useRef, useEffect, useCallback } from "react";
import { StrummingPattern, MetronomeSubdivision } from "../types";
import { LookaheadScheduler } from "../engine/LookaheadScheduler";
import { AnimationDriver } from "../engine/AnimationDriver";

export interface UsePlaybackEngineProps {
  initialBpm?: number;
  initialPattern: StrummingPattern;
  initialAccent?: boolean;
  initialCountIn?: 0 | 1 | 2 | 3;
  initialSubdivision?: MetronomeSubdivision;
}

export function usePlaybackEngine({
  initialBpm = 80,
  initialPattern,
  initialAccent = true,
  initialCountIn = 1,
  initialSubdivision = "quarter",
}: UsePlaybackEngineProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCountingIn, setIsCountingIn] = useState<boolean>(false);
  const [countInBeatRemaining, setCountInBeatRemaining] = useState<number | null>(null);
  const [totalCountInBeats, setTotalCountInBeats] = useState<number>(initialCountIn * 4);
  const [bpm, setBpmState] = useState<number>(initialBpm);
  const [accentFirstBeat, setAccentState] = useState<boolean>(initialAccent);
  const [countInMeasures, setCountInState] = useState<0 | 1 | 2 | 3>(initialCountIn);
  const [metronomeSubdivision, setSubdivisionState] = useState<MetronomeSubdivision>(initialSubdivision);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);

  const engineRef = useRef<LookaheadScheduler | null>(null);
  const driverRef = useRef<AnimationDriver | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Safe lazy initializer for browser-only audio engine
  const getOrCreateEngine = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!engineRef.current) {
      const engine = new LookaheadScheduler({
        bpm,
        pattern: initialPattern,
        accentFirstBeat,
        countInMeasures,
        subdivision: metronomeSubdivision,
        onCountInTick: (beatRemaining, total) => {
          setIsCountingIn(true);
          setCountInBeatRemaining(beatRemaining);
          setTotalCountInBeats(total);
        },
        onBeatTick: (beatIndex) => {
          setActiveBeatIndex(beatIndex);
        },
        onCountInComplete: () => {
          setIsCountingIn(false);
          setCountInBeatRemaining(null);
          driverRef.current?.start();
        },
      });

      const driver = new AnimationDriver(engine);
      engineRef.current = engine;
      driverRef.current = driver;
      setIsInitialized(true);
    }
    return engineRef.current;
  }, [bpm, initialPattern, accentFirstBeat, countInMeasures, metronomeSubdivision]);

  // Client-side mount initialization to guarantee 0 SSR hydration differences
  useEffect(() => {
    getOrCreateEngine();
  }, [getOrCreateEngine]);

  // Keep pattern updated
  useEffect(() => {
    engineRef.current?.setPattern(initialPattern);
  }, [initialPattern]);

  const start = useCallback(async () => {
    const engine = getOrCreateEngine();
    if (!engine) return;
    await engine.start();
    setIsPlaying(true);
    setIsCountingIn(engine.isCountingIn());
    if (!engine.isCountingIn()) {
      driverRef.current?.start();
    }
  }, [getOrCreateEngine]);

  const pause = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.pause();
    driverRef.current?.stop();
    setIsPlaying(false);
    setIsCountingIn(false);
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await start();
    }
  }, [isPlaying, pause, start]);

  const reset = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    driverRef.current?.reset();
    setIsPlaying(false);
    setIsCountingIn(false);
    setCountInBeatRemaining(null);
    setActiveBeatIndex(0);
  }, []);

  const restartWithCountIn = useCallback(async () => {
    if (!engineRef.current) return;
    engineRef.current.reset();
    driverRef.current?.reset();
    setIsPlaying(false);
    setIsCountingIn(false);
    setCountInBeatRemaining(null);
    setActiveBeatIndex(0);

    const engine = getOrCreateEngine();
    if (!engine) return;
    await engine.start();
    setIsPlaying(true);
    setIsCountingIn(engine.isCountingIn());
    if (!engine.isCountingIn()) {
      driverRef.current?.start();
    }
  }, [getOrCreateEngine]);

  const setBpm = useCallback((newBpm: number) => {
    setBpmState(newBpm);
    engineRef.current?.setBpm(newBpm);
  }, []);

  const setAccentFirstBeat = useCallback((enabled: boolean) => {
    setAccentState(enabled);
    engineRef.current?.setAccentFirstBeat(enabled);
  }, []);

  const setCountInMeasures = useCallback((measures: 0 | 1 | 2 | 3) => {
    setCountInState(measures);
    setTotalCountInBeats(measures * 4);
    engineRef.current?.setCountIn(measures);
  }, []);

  const setMetronomeSubdivision = useCallback((sub: MetronomeSubdivision, playPreview: boolean = false) => {
    setSubdivisionState(sub);
    engineRef.current?.setMetronomeSubdivision(sub);
    if (playPreview) {
      engineRef.current?.playSubdivisionPreview?.(sub);
    }
  }, []);

  const playSubdivisionPreview = useCallback((sub: MetronomeSubdivision) => {
    engineRef.current?.playSubdivisionPreview?.(sub);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      driverRef.current?.stop();
      engineRef.current?.dispose();
      engineRef.current = null;
      driverRef.current = null;
    };
  }, []);

  return {
    isPlaying,
    isCountingIn,
    countInBeatRemaining,
    totalCountInBeats,
    bpm,
    accentFirstBeat,
    countInMeasures,
    metronomeSubdivision,
    activeBeatIndex,
    animationDriver: driverRef.current,
    isInitialized,
    start,
    pause,
    togglePlayPause,
    reset,
    restartWithCountIn,
    setBpm,
    setAccentFirstBeat,
    setCountInMeasures,
    setMetronomeSubdivision,
    playSubdivisionPreview,
  };
}
