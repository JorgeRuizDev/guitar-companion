import React from 'react';
import { ChromaticScaleVisualizer } from '@/apps/basic-note-trainer/components/ChromaticScaleVisualizer';
import { FretboardDiagram } from '@/apps/basic-chord-trainer/components/FretboardDiagram';
import type {
  ChordDefinition,
  UserFretboardState,
  StringNumber,
  StringState,
} from '@/apps/basic-chord-trainer/types';
import {
  visualRegistry,
  VisualRegistry,
  type VisualComponentProps,
  type VisualComponentType,
  type VisualRegistryInterface,
} from 'quiz-engine';

export {
  visualRegistry,
  VisualRegistry,
  type VisualComponentProps,
  type VisualComponentType,
  type VisualRegistryInterface,
};

// -------------------------------------------------------------
// Guitar Companion Visual Adapters
// -------------------------------------------------------------

export const ChromaticScaleVisualizerAdapter: React.FC<VisualComponentProps> = ({
  props,
  lang = 'en',
  compact = false,
}) => {
  return React.createElement(ChromaticScaleVisualizer, {
    highlightNote: props.highlightNote as string | undefined,
    lang: lang as 'en' | 'es',
    compact: compact,
    className: props.className as string | undefined,
  });
};

export const FretboardDiagramAdapter: React.FC<VisualComponentProps> = ({
  props,
  isInteractive = false,
  lang = 'en',
  compact = false,
}) => {
  const targetChord = props.targetChord as ChordDefinition | undefined;
  let fretboardState = props.fretboardState as UserFretboardState | undefined;

  if (!fretboardState && props.strings) {
    const rawStrings = props.strings as Array<{
      stringNumber: StringNumber;
      state: StringState;
      fret: number | null;
    }>;
    fretboardState = rawStrings as unknown as UserFretboardState;
  }

  if (!fretboardState && targetChord) {
    fretboardState = targetChord.strings.map((s) => ({
      stringNumber: s.stringNumber,
      state: s.state,
      fret: s.fret,
    })) as unknown as UserFretboardState;
  }

  if (!fretboardState) {
    fretboardState = [
      { stringNumber: 6, state: 'open', fret: 0 },
      { stringNumber: 5, state: 'open', fret: 0 },
      { stringNumber: 4, state: 'open', fret: 0 },
      { stringNumber: 3, state: 'open', fret: 0 },
      { stringNumber: 2, state: 'open', fret: 0 },
      { stringNumber: 1, state: 'open', fret: 0 },
    ];
  }

  return React.createElement(FretboardDiagram, {
    fretboardState,
    targetChord,
    isInteractive,
    compact,
    lang: lang as 'en' | 'es',
  });
};

// Register default visual components for Guitar Companion
visualRegistry.register('chromatic-scale', ChromaticScaleVisualizerAdapter);
visualRegistry.register('fretboard-diagram', FretboardDiagramAdapter);
