'use client';

import React from 'react';
import {
  ChordDefinition,
  ChallengeEvaluation,
  StringNumber,
  UserFretboardState,
} from '../types';

export interface FretboardDiagramProps {
  fretboardState: UserFretboardState;
  targetChord?: ChordDefinition;
  evaluation?: ChallengeEvaluation | null;
  isInteractive?: boolean;
  showFingerNumbers?: boolean;
  compact?: boolean;
  onFretClick?: (stringNumber: StringNumber, fret: number) => void;
  onNutClick?: (stringNumber: StringNumber) => void;
  className?: string;
  lang?: 'en' | 'es';
}

const STRING_X: Record<StringNumber, number> = {
  6: 40,
  5: 76,
  4: 112,
  3: 148,
  2: 184,
  1: 220,
};

const STRING_THICKNESS: Record<StringNumber, number> = {
  6: 3.8,
  5: 3.2,
  4: 2.6,
  3: 2.0,
  2: 1.5,
  1: 1.0,
};

const FRET_Y_BOUNDS: Record<number, { top: number; bottom: number; mid: number }> = {
  1: { top: 52, bottom: 104, mid: 78 },
  2: { top: 104, bottom: 156, mid: 130 },
  3: { top: 156, bottom: 208, mid: 182 },
  4: { top: 208, bottom: 260, mid: 234 },
};

export const FretboardDiagram: React.FC<FretboardDiagramProps> = ({
  fretboardState,
  targetChord,
  evaluation,
  isInteractive = true,
  showFingerNumbers = true,
  compact = false,
  onFretClick,
  onNutClick,
  className = '',
  lang = 'en',
}) => {
  const strings: StringNumber[] = [6, 5, 4, 3, 2, 1];
  const frets = [1, 2, 3, 4];

  // Helper to get evaluation result for a specific string
  const getStringEval = (stringNum: StringNumber) => {
    return evaluation?.stringResults?.find((r) => r.stringNumber === stringNum);
  };

  // Helper to find finger number from target chord
  const getFingerNumber = (stringNum: StringNumber, fret: number): number | null => {
    if (!targetChord) return null;
    const strDef = targetChord.strings.find((s) => s.stringNumber === stringNum);
    if (strDef && strDef.state === 'fretted' && strDef.fret === fret) {
      return strDef.finger ?? null;
    }
    return null;
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 260 280"
        className={`w-full ${
          compact ? 'max-w-[230px] max-h-[250px]' : 'max-w-[270px] max-h-[290px]'
        } h-auto drop-shadow-md`}
        role="img"
        aria-label={
          lang === 'es'
            ? `Diagrama de diapasón ${targetChord ? `para ${targetChord.symbol}` : ''}`
            : `Fretboard chord diagram ${targetChord ? `for ${targetChord.symbol}` : ''}`
        }
      >
        <defs>
          <filter id="dot-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Fretboard Wood Background */}
        <rect
          x="34"
          y="52"
          width="192"
          height="208"
          rx="4"
          fill="#1e293b"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Fret Position Markers (Single inlay at 3rd fret) */}
        <circle cx="130" cy="182" r="4.5" fill="#475569" opacity="0.6" />

        {/* Fret Wires (Horizontal Lines) */}
        {frets.map((fret) => (
          <line
            key={`wire-${fret}`}
            x1="34"
            y1={FRET_Y_BOUNDS[fret].bottom}
            x2="226"
            y2={FRET_Y_BOUNDS[fret].bottom}
            stroke="#94a3b8"
            strokeWidth="2.2"
          />
        ))}

        {/* Nut Bar (Thick Top Bar) */}
        <rect
          x="33"
          y="44"
          width="194"
          height="9"
          rx="2"
          fill="#cbd5e1"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Fret Number Labels along the Left Side */}
        {frets.map((fret) => (
          <text
            key={`fret-num-${fret}`}
            x="20"
            y={FRET_Y_BOUNDS[fret].mid + 5}
            textAnchor="middle"
            fill="#64748b"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {fret}
          </text>
        ))}

        {/* Strings (Vertical Lines with Gradient Thickness) */}
        {strings.map((strNum) => {
          const x = STRING_X[strNum];
          const stringEval = getStringEval(strNum);
          const hasError = stringEval && !stringEval.isCorrect;

          return (
            <line
              key={`str-${strNum}`}
              x1={x}
              y1="44"
              x2={x}
              y2="260"
              stroke={hasError ? '#f43f5e' : '#cbd5e1'}
              strokeWidth={STRING_THICKNESS[strNum]}
              opacity={hasError ? 0.9 : 0.85}
            />
          );
        })}

        {/* Nut Indicators (O / X) Above the Nut Bar */}
        {strings.map((strNum) => {
          const x = STRING_X[strNum];
          const strState = fretboardState.find((s) => s.stringNumber === strNum);
          const state = strState?.state ?? 'open';
          const isMuted = state === 'muted';
          const isOpen = state === 'open';
          const stringEval = getStringEval(strNum);
          const isErr = stringEval && !stringEval.isCorrect;

          let badgeColor = isErr ? '#f43f5e' : '#94a3b8';
          if (evaluation?.isCorrect) badgeColor = '#10b981';

          return (
            <g
              key={`nut-indicator-${strNum}`}
              onClick={() => isInteractive && onNutClick?.(strNum)}
              className={isInteractive ? 'cursor-pointer hover:opacity-80' : ''}
            >
              {/* Hitbox for Nut toggle */}
              {isInteractive && (
                <rect
                  x={x - 17}
                  y="4"
                  width="34"
                  height="36"
                  fill="transparent"
                  className="touch-manipulation"
                />
              )}

              {isMuted ? (
                // Muted 'X'
                <text
                  x={x}
                  y="26"
                  textAnchor="middle"
                  fill={isErr ? '#f43f5e' : '#f87171'}
                  fontSize="17"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  ✕
                </text>
              ) : isOpen ? (
                // Open 'O'
                <circle
                  cx={x}
                  cy="21"
                  r="6.5"
                  fill="none"
                  stroke={badgeColor}
                  strokeWidth="2"
                />
              ) : null}
            </g>
          );
        })}

        {/* Barre Visual Indicator (if applicable, e.g. F beginner on strings 1 & 2 fret 1) */}
        {targetChord?.barre && (
          <rect
            x={STRING_X[targetChord.barre.toString] - 12}
            y={FRET_Y_BOUNDS[targetChord.barre.fret].mid - 11}
            width={
              STRING_X[targetChord.barre.fromString] -
              STRING_X[targetChord.barre.toString] +
              24
            }
            height="22"
            rx="11"
            fill="#3b82f6"
            opacity="0.3"
          />
        )}

        {/* User Fretted Dots */}
        {strings.map((strNum) => {
          const strState = fretboardState.find((s) => s.stringNumber === strNum);
          if (strState?.state !== 'fretted' || strState.fret === null) return null;

          const fret = strState.fret;
          if (fret < 1 || fret > 4) return null;

          const x = STRING_X[strNum];
          const y = FRET_Y_BOUNDS[fret].mid;
          const stringEval = getStringEval(strNum);
          const isErr = stringEval && !stringEval.isCorrect;
          const isSuccess = evaluation?.isCorrect;
          const finger = getFingerNumber(strNum, fret);

          const dotColor = isSuccess
            ? '#10b981' // Green
            : isErr
            ? '#ef4444' // Red error
            : '#f59e0b'; // Amber interactive

          return (
            <g key={`dot-${strNum}-${fret}`} filter="url(#dot-glow)">
              <circle
                cx={x}
                cy={y}
                r="13"
                fill={dotColor}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Finger Number Label */}
              {showFingerNumbers && finger && (
                <text
                  x={x}
                  y={y + 4.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}

        {/* Target Solution Ghost Dots (when evaluation revealed errors or skipped) */}
        {evaluation &&
          !evaluation.isCorrect &&
          targetChord &&
          targetChord.strings.map((targetStr) => {
            if (targetStr.state !== 'fretted' || targetStr.fret === null) return null;

            const strNum = targetStr.stringNumber;
            const fret = targetStr.fret;
            const userStr = fretboardState.find((s) => s.stringNumber === strNum);

            // Only render target ghost if user placed wrong fret or missed it
            if (userStr?.state === 'fretted' && userStr.fret === fret) {
              return null; // Already fretted correctly
            }

            const x = STRING_X[strNum];
            const y = FRET_Y_BOUNDS[fret].mid;

            return (
              <g key={`target-ghost-${strNum}-${fret}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="13"
                  fill="#10b981"
                  opacity="0.8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                {targetStr.finger && (
                  <text
                    x={x}
                    y={y + 4.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {targetStr.finger}
                  </text>
                )}
              </g>
            );
          })}

        {/* Root String Indicator badge (R) below bottom wire */}
        {targetChord && (
          <g>
            <circle
              cx={STRING_X[targetChord.rootString]}
              cy="271"
              r="6.5"
              fill="#f59e0b"
            />
            <text
              x={STRING_X[targetChord.rootString]}
              y="274.5"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="9"
              fontWeight="black"
              fontFamily="sans-serif"
            >
              R
            </text>
          </g>
        )}

        {/* Interactive Fret Touch Hitboxes (>= 44x44px target) */}
        {isInteractive &&
          strings.map((strNum) => {
            const x = STRING_X[strNum];
            return frets.map((fret) => {
              const bounds = FRET_Y_BOUNDS[fret];
              return (
                <rect
                  key={`hitbox-${strNum}-${fret}`}
                  x={x - 18}
                  y={bounds.top}
                  width="36"
                  height={bounds.bottom - bounds.top}
                  fill="transparent"
                  className="cursor-pointer active:fill-amber-500/10 transition-colors touch-manipulation"
                  onClick={() => onFretClick?.(strNum, fret)}
                >
                  <title>
                    {lang === 'es'
                      ? `Cuerda ${strNum}, Traste ${fret}`
                      : `String ${strNum}, Fret ${fret}`}
                  </title>
                </rect>
              );
            });
          })}
      </svg>
    </div>
  );
};
