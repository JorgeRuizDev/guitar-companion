'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PracticeChallenge,
  StringNumber,
  ChordNotesUserState,
  UserFretboardState,
  StringHarmonicInfo,
  ChallengeStatus,
} from '../types';
import {
  getChordHarmonicAnalysis,
  getLocalizedIntervalAbbr,
} from '../domain/harmonicAnalysis';
import { formatPromptTitle } from '../domain/dualNotation';
import { FretboardDiagram } from './FretboardDiagram';
import {
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  SkipForward,
  Sparkles,
  Check,
  AlertCircle,
  Lightbulb,
  Info,
} from 'lucide-react';

export interface ChordNotesChallengeProps {
  challenge: PracticeChallenge;
  status?: ChallengeStatus;
  onComplete?: () => void;
  onNext: () => void;
  onSkip: () => void;
  lang?: 'en' | 'es';
  compact?: boolean;
}

export const ChordNotesChallenge: React.FC<ChordNotesChallengeProps> = ({
  challenge,
  status,
  onComplete,
  onNext,
  onSkip,
  lang = 'en',
  compact = false,
}) => {
  const targetChord = challenge.targetChord;
  const isSolfege = challenge.notation === 'solfege';

  // Compute or reuse harmonic analysis
  const analysis = useMemo(() => {
    return challenge.harmonicAnalysis ?? getChordHarmonicAnalysis(targetChord);
  }, [challenge.harmonicAnalysis, targetChord]);

  // Expected notes per string number
  const expectedNotes = useMemo(() => {
    const map: Partial<Record<StringNumber, string>> = {};
    for (const str of analysis.strings) {
      if (str.state !== 'muted') {
        map[str.stringNumber] = isSolfege ? str.solfegeName : str.noteLetter;
      }
    }
    return map;
  }, [analysis, isSolfege]);

  // Sounding string numbers
  const soundingStrings = useMemo(() => {
    return analysis.strings
      .filter((s) => s.state !== 'muted')
      .map((s) => s.stringNumber);
  }, [analysis]);

  // Extract all unique harmonic interval roles present in the chord (Root, 3rd, 5th, 7th, etc.)
  const uniqueIntervalRoles = useMemo(() => {
    const seen = new Set<string>();
    const list: StringHarmonicInfo[] = [];
    for (const str of analysis.strings) {
      if (str.state !== 'muted' && str.intervalAbbr) {
        if (!seen.has(str.intervalAbbr)) {
          seen.add(str.intervalAbbr);
          list.push(str);
        }
      }
    }
    return list.sort((a, b) => a.semitonesFromRoot - b.semitonesFromRoot);
  }, [analysis]);

  // Upper bank tokens: unique chord notes + 2 distractors (shuffled deterministically per challenge ID)
  const tokenBank = useMemo(() => {
    const notes = isSolfege
      ? [...analysis.uniqueSolfege, ...analysis.distractorsSolfege]
      : [...analysis.uniqueNotes, ...analysis.distractors];

    // Seeded shuffle using challenge ID
    let seed = 0;
    for (let i = 0; i < challenge.id.length; i++) {
      seed = (seed * 31 + challenge.id.charCodeAt(i)) & 0xffffffff;
    }
    const shuffled = [...notes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(seed) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [analysis, isSolfege, challenge.id]);

  // User state
  const [userState, setUserState] = useState<ChordNotesUserState>({
    assignments: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    },
    isSubmitted: false,
    isComplete: false,
    isCorrect: false,
    revealedHarmonics: false,
    errorStrings: [],
  });

  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showIntervalsHint, setShowIntervalsHint] = useState<boolean>(false);
  const [isSkippedLocally, setIsSkippedLocally] = useState<boolean>(false);

  // Synchronized skip & finish flags
  const isSkipped = status === 'SKIPPED' || isSkippedLocally;
  const isFinished = userState.isComplete || isSkipped;

  // Reset when challenge changes
  useEffect(() => {
    setUserState({
      assignments: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
      isSubmitted: false,
      isComplete: false,
      isCorrect: false,
      revealedHarmonics: false,
      errorStrings: [],
    });
    setSelectedToken(null);
    setShowIntervalsHint(false);
    setIsSkippedLocally(false);
  }, [challenge.id]);

  // Convert target chord to fretboard state for diagram display
  const diagramFretboardState: UserFretboardState = useMemo(() => {
    return [
      targetChord.strings.find((s) => s.stringNumber === 6) ?? { stringNumber: 6, state: 'muted', fret: null },
      targetChord.strings.find((s) => s.stringNumber === 5) ?? { stringNumber: 5, state: 'open', fret: 0 },
      targetChord.strings.find((s) => s.stringNumber === 4) ?? { stringNumber: 4, state: 'open', fret: 0 },
      targetChord.strings.find((s) => s.stringNumber === 3) ?? { stringNumber: 3, state: 'open', fret: 0 },
      targetChord.strings.find((s) => s.stringNumber === 2) ?? { stringNumber: 2, state: 'open', fret: 0 },
      targetChord.strings.find((s) => s.stringNumber === 1) ?? { stringNumber: 1, state: 'open', fret: 0 },
    ];
  }, [targetChord]);

  // Place a token immediately onto a target string without premature rejection
  const handleAssign = useCallback(
    (stringNumber: StringNumber, token: string) => {
      if (isFinished) return;

      const expected = expectedNotes[stringNumber];
      if (!expected) return; // Muted string cannot receive notes

      // Assign note immediately ("se ponga la nota al momento")
      const newAssignments = {
        ...userState.assignments,
        [stringNumber]: token,
      };

      // Clear error on this string if it was previously flagged
      const newErrors = userState.errorStrings.filter((s) => s !== stringNumber);

      setUserState((prev) => ({
        ...prev,
        assignments: newAssignments,
        errorStrings: newErrors,
        isSubmitted: false, // Reset submission state to allow re-checking
      }));

      setSelectedToken(null);
    },
    [isFinished, userState.assignments, userState.errorStrings, expectedNotes]
  );

  // Handle clicking a target string on the diagram
  const handleStringClick = useCallback(
    (stringNumber: StringNumber) => {
      if (isFinished) return;

      if (selectedToken) {
        handleAssign(stringNumber, selectedToken);
      } else if (userState.assignments[stringNumber]) {
        // Tap already placed note to remove it
        setUserState((prev) => ({
          ...prev,
          assignments: {
            ...prev.assignments,
            [stringNumber]: null,
          },
          errorStrings: prev.errorStrings.filter((s) => s !== stringNumber),
          isSubmitted: false,
        }));
      }
    },
    [isFinished, userState.assignments, selectedToken, handleAssign]
  );

  // Validate the full chord note configuration at the end ("se valide al final, al enviar la configuración")
  const handleCheck = useCallback(() => {
    if (isFinished) return;

    const errors: StringNumber[] = [];
    for (const strNum of soundingStrings) {
      const assigned = userState.assignments[strNum];
      const expected = expectedNotes[strNum];
      if (!assigned || assigned !== expected) {
        errors.push(strNum);
      }
    }

    const isAllCorrect = errors.length === 0;

    if (isAllCorrect) {
      setUserState({
        assignments: userState.assignments,
        isSubmitted: true,
        isComplete: true,
        isCorrect: true,
        revealedHarmonics: true,
        errorStrings: [],
      });
      onComplete?.();
    } else {
      setUserState((prev) => ({
        ...prev,
        isSubmitted: true,
        isComplete: false,
        isCorrect: false,
        revealedHarmonics: true, // Reveal harmonic functions so learner knows what interval each string is!
        errorStrings: errors,
      }));
    }
  }, [isFinished, userState.assignments, soundingStrings, expectedNotes, onComplete]);

  // Reset assignments
  const handleReset = useCallback(() => {
    setUserState({
      assignments: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
      },
      isSubmitted: false,
      isComplete: false,
      isCorrect: false,
      revealedHarmonics: false,
      errorStrings: [],
    });
    setSelectedToken(null);
  }, []);

  // Handle Skip action: reveals solution notes and harmonic intervals, then enables "Siguiente Acorde"
  const handleSkipClick = useCallback(() => {
    setIsSkippedLocally(true);
    onSkip?.();
  }, [onSkip]);

  // Format harmonic labels for diagram: active upon submission, completion, manual hint reveal, or skip
  const shouldShowHarmonicLabels =
    userState.isSubmitted || userState.revealedHarmonics || showIntervalsHint || isSkipped;

  const diagramHarmonicLabels: Partial<Record<StringNumber, string>> | undefined =
    shouldShowHarmonicLabels
      ? analysis.strings.reduce((acc, str) => {
          if (str.state !== 'muted') {
            acc[str.stringNumber] = getLocalizedIntervalAbbr(str.intervalAbbr, lang);
          }
          return acc;
        }, {} as Partial<Record<StringNumber, string>>)
      : undefined;

  // Active notes for diagram: if skipped, show full solution notes
  const activeNoteLabels = useMemo(() => {
    if (isSkipped) {
      return expectedNotes;
    }
    return userState.assignments;
  }, [isSkipped, expectedNotes, userState.assignments]);

  const prompt = formatPromptTitle(targetChord, lang, 'draw', challenge.notation);

  // Progress metrics
  const assignedCount = isSkipped
    ? soundingStrings.length
    : soundingStrings.filter((strNum) => Boolean(userState.assignments[strNum])).length;
  const totalSounding = soundingStrings.length;
  const allAssigned = assignedCount === totalSounding;
  const hasErrors = userState.isSubmitted && !userState.isCorrect && !isSkipped;

  // Keyboard shortcut listener for Enter (check or next) when ready
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isFinished && allAssigned) {
          e.preventDefault();
          handleCheck();
        } else if (isFinished) {
          e.preventDefault();
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFinished, allAssigned, handleCheck, onNext]);

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      {/* Challenge Title */}
      <div className="w-full text-center mb-1">
        <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
          {lang === 'es' ? 'Identifica las Notas del Acorde' : 'Identify Chord Notes'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
          {prompt.subtitle}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === 'es'
            ? 'Arrastra o toca una nota para colocarla en su cuerda'
            : 'Drag or tap a note to place it on its sounding string'}
        </p>

        {/* Optional Harmonic Roles Hint Toggle before submission */}
        {!userState.isSubmitted && !isFinished && !compact && (
          <button
            type="button"
            onClick={() => setShowIntervalsHint((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/80 hover:text-amber-300 transition-colors mt-1 cursor-pointer"
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>
              {showIntervalsHint
                ? lang === 'es'
                  ? 'Ocultar funciones (Tónica, 3ª, 5ª...)'
                  : 'Hide roles (Root, 3rd, 5th...)'
                : lang === 'es'
                ? '¿Mostrar funciones (Tónica, 3ª, 5ª...)?'
                : 'Show roles (Root, 3rd, 5th...)?'}
            </span>
          </button>
        )}
      </div>

      {/* UPPER BANK OF NOTE TOKENS (strictly above diagram to prevent overflow) */}
      <div
        data-testid="chord-notes-bank"
        className="w-full max-w-[320px] p-2.5 my-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner flex flex-col items-center gap-1.5"
      >
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{lang === 'es' ? 'Banco de Notas' : 'Note Bank'}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {tokenBank.map((note, index) => {
            const isSelected = selectedToken === note;

            return (
              <button
                key={`bank-token-${note}-${index}`}
                type="button"
                data-testid={`note-token-${note}`}
                draggable={!isFinished}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', note);
                }}
                onClick={() => {
                  if (isFinished) return;
                  setSelectedToken((prev) => (prev === note ? null : note));
                }}
                className={`min-w-[44px] min-h-[44px] px-3.5 py-2 rounded-xl font-black text-sm flex items-center justify-center transition-all select-none cursor-pointer touch-manipulation ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 scale-105 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-amber-400/30'
                    : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white border border-slate-700 shadow-sm'
                }`}
                aria-pressed={isSelected}
                aria-label={`Note token ${note}`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Feedback Banner: Selected Token Prompt */}
      {selectedToken && !isFinished && (
        <div className="text-xs font-semibold text-amber-300 mb-1 animate-pulse">
          {lang === 'es'
            ? `Nota seleccionada: ${selectedToken}. Toca su posición en el mástil.`
            : `Selected note: ${selectedToken}. Tap its target position on the fretboard.`}
        </div>
      )}

      {/* Skipped Banner upon clicking Saltar */}
      {isSkipped && (
        <div
          data-testid="chord-notes-skipped-banner"
          className="w-full max-w-[320px] mb-2 p-2.5 rounded-xl border bg-amber-950/40 border-amber-500/50 text-amber-200 text-xs shadow-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1"
        >
          <SkipForward className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">
              {lang === 'es' ? 'Solución mostrada' : 'Solution revealed'}
            </span>
            <p className="text-[11px] text-amber-100/90 leading-tight">
              {lang === 'es'
                ? `Se han revelado las notas y funciones armónicas de ${targetChord.symbol} (${targetChord.solfegeName}).`
                : `Notes and harmonic roles for ${targetChord.symbol} (${targetChord.solfegeName}) are revealed above.`}
            </p>
          </div>
        </div>
      )}

      {/* Error Remediation Banner with explicit harmonic functions upon submission */}
      {hasErrors && (
        <div
          data-testid="chord-notes-error-banner"
          className="w-full max-w-[320px] mb-2 p-2.5 rounded-xl border bg-rose-950/40 border-rose-500/50 text-rose-200 text-xs shadow-sm flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1"
        >
          <div className="flex items-center gap-1.5 font-bold text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {lang === 'es'
                ? 'Algunas notas no son correctas'
                : 'Some notes are incorrect'}
            </span>
          </div>

          <p className="text-[11px] text-rose-200/90 leading-tight">
            {lang === 'es'
              ? 'Revisa las cuerdas marcadas en rojo. Toca una nota para sustituirla y vuelve a comprobar.'
              : 'Review the strings highlighted in red. Tap a note to replace it and check again.'}
          </p>

          {/* Detailed per-string error feedback with expected harmonic intervals */}
          {userState.errorStrings.length > 0 && (
            <div className="text-[10.5px] text-rose-300 bg-rose-950/60 p-1.5 rounded-lg border border-rose-500/30 font-medium space-y-0.5">
              {userState.errorStrings.map((strNum) => {
                const expected = analysis.strings.find((s) => s.stringNumber === strNum);
                const assigned = userState.assignments[strNum];
                if (!expected) return null;
                const expectedNote = isSolfege ? expected.solfegeName : expected.noteLetter;
                const intervalName = lang === 'es' ? expected.intervalRoleEs : expected.intervalRole;
                const intervalAbbr = getLocalizedIntervalAbbr(expected.intervalAbbr, lang);
                return (
                  <div key={`err-str-${strNum}`}>
                    {lang === 'es'
                      ? `• Cuerda ${strNum}: colocaste "${assigned}". Debe ser la ${intervalName} (${intervalAbbr}: ${expectedNote})`
                      : `• String ${strNum}: you placed "${assigned}". Should be the ${intervalName} (${intervalAbbr}: ${expectedNote})`}
                  </div>
                );
              })}
            </div>
          )}

          {/* Harmonic structure pills with Root, 3rds, 5ths, 7ths, etc. */}
          <div className="mt-0.5 pt-1.5 border-t border-rose-500/20 flex flex-col gap-1">
            <div className="text-[10.5px] text-amber-300 font-semibold flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {lang === 'es'
                  ? 'Estructura armónica del acorde:'
                  : 'Chord harmonic structure:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {uniqueIntervalRoles.map((roleStr) => (
                <span
                  key={`hint-role-${roleStr.intervalAbbr}`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/80 text-white font-mono text-[10px]"
                >
                  <span className="font-extrabold text-amber-400">
                    {isSolfege ? roleStr.solfegeName : roleStr.noteLetter}
                  </span>
                  <span className="text-slate-300 text-[9px]">
                    ({getLocalizedIntervalAbbr(roleStr.intervalAbbr, lang)}:{' '}
                    {lang === 'es' ? roleStr.intervalRoleEs : roleStr.intervalRole})
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fretboard Diagram Container with Drop Handlers */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const token = e.dataTransfer.getData('text/plain');
          if (!token) return;

          // Find drop target from element under cursor
          const element = document.elementFromPoint(e.clientX, e.clientY);
          const dropTarget = element?.closest('[data-testid^="drop-target-"]');
          if (dropTarget) {
            const testId = dropTarget.getAttribute('data-testid');
            const stringNum = Number(testId?.replace('drop-target-', '')) as StringNumber;
            if (stringNum >= 1 && stringNum <= 6) {
              handleAssign(stringNum, token);
            }
          }
        }}
        className="w-full flex justify-center"
      >
        <FretboardDiagram
          fretboardState={diagramFretboardState}
          targetChord={targetChord}
          isInteractive={false}
          showFingerNumbers={!isFinished && !shouldShowHarmonicLabels}
          showRootIndicator={shouldShowHarmonicLabels}
          compact={compact}
          harmonicLabels={diagramHarmonicLabels}
          noteLabels={activeNoteLabels}
          errorStrings={isSkipped ? [] : userState.errorStrings}
          onStringTargetClick={handleStringClick}
          lang={lang}
        />
      </div>

      {/* Placed Progress Indicator */}
      {!isFinished && (
        <div className="text-[11px] font-medium text-slate-400 mt-1">
          {lang === 'es'
            ? `${assignedCount} de ${totalSounding} cuerdas con nota asignada`
            : `${assignedCount} of ${totalSounding} strings assigned`}
        </div>
      )}

      {/* Educational Harmonic Breakdown & Completion Card covering all intervals (Roots, 3rds, 5ths, 7ths, etc.) */}
      {isFinished && (
        <div
          data-testid="harmonic-breakdown-card"
          className="w-full max-w-[320px] mt-2 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-sm mb-1.5">
            {isSkipped ? (
              <>
                <Info className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">
                  {lang === 'es' ? 'Estructura armónica del acorde:' : 'Harmonic structure of chord:'}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'es' ? '¡Excelente! Estructura armónica:' : 'Great! Harmonic structure:'}
                </span>
              </>
            )}
          </div>

          <div
            className={`grid gap-1.5 mt-2 text-center ${
              uniqueIntervalRoles.length === 3
                ? 'grid-cols-3'
                : uniqueIntervalRoles.length >= 4
                ? 'grid-cols-4'
                : 'grid-cols-2'
            }`}
          >
            {uniqueIntervalRoles.map((roleStr) => {
              const isRoot = roleStr.semitonesFromRoot === 0;
              const isThird = roleStr.intervalAbbr.includes('3');
              const isFifth = roleStr.intervalAbbr.includes('5');
              const isSeventh = roleStr.intervalAbbr.includes('7');

              const badgeColor = isRoot
                ? 'text-amber-300'
                : isThird
                ? 'text-emerald-300'
                : isFifth
                ? 'text-blue-300'
                : isSeventh
                ? 'text-purple-300'
                : 'text-teal-300';

              return (
                <div
                  key={`breakdown-role-${roleStr.intervalAbbr}`}
                  className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-500/30 flex flex-col items-center"
                >
                  <div className={`font-black text-xs ${badgeColor}`}>
                    {getLocalizedIntervalAbbr(roleStr.intervalAbbr, lang)}
                  </div>
                  <div className="text-[9.5px] text-emerald-200/90 line-clamp-1">
                    {lang === 'es' ? roleStr.intervalRoleEs : roleStr.intervalRole}
                  </div>
                  <div className="font-black text-white text-xs mt-0.5">
                    {isSolfege ? roleStr.solfegeName : roleStr.noteLetter}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons: Reset, Skip, Check (deferred validation) or Next Chord */}
      <div className="w-full max-w-[300px] flex items-center justify-between gap-2.5 mt-3">
        {!isFinished ? (
          <>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'es' ? 'Reiniciar' : 'Reset'}</span>
            </button>

            <button
              type="button"
              data-testid="skip-chord-notes"
              onClick={handleSkipClick}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all active:scale-95 cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'es' ? 'Saltar' : 'Skip'}</span>
            </button>

            <button
              type="button"
              data-testid="check-chord-notes"
              onClick={handleCheck}
              disabled={!allAssigned}
              className={`flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                allAssigned
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/60 opacity-60 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{lang === 'es' ? 'Comprobar' : 'Check'}</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            data-testid="next-chord-notes"
            onClick={onNext}
            autoFocus
            className="w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
          >
            <span>{lang === 'es' ? 'Siguiente Acorde' : 'Next Chord'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
