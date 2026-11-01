"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { StrummingPattern, MetronomeSubdivision } from "../types";
import { generateStrummingShareUrl } from "../domain/queryParams";

export interface ShareConfigButtonProps {
  pattern: StrummingPattern;
  bpm: number;
  accent: boolean;
  countIn: 0 | 1 | 2 | 3;
  metroSub: MetronomeSubdivision;
  strict: boolean;
}

export const ShareConfigButton: React.FC<ShareConfigButtonProps> = ({
  pattern,
  bpm,
  accent,
  countIn,
  metroSub,
  strict,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>("");

  const handleShare = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = generateStrummingShareUrl({
      pattern,
      bpm,
      accent,
      countIn,
      metroSub,
      strict,
      baseUrl: origin,
    });

    setGeneratedUrl(url);

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        setShowDialog(true);
      }
    } catch {
      // Fallback: show dialog to manually copy
      setShowDialog(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "Enlace copiado al portapapeles" : "Compartir configuración y patrón actual"}
        title={copied ? "¡Enlace copiado!" : "Compartir configuración actual (copiar URL)"}
        className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all cursor-pointer shadow-md min-h-[40px] select-none ${
          copied
            ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 shadow-emerald-500/20"
            : "bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span className="font-semibold text-emerald-300">¡Enlace copiado!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Compartir</span>
          </>
        )}
      </button>

      {/* Manual fallback dialog when clipboard API is blocked */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Compartir Configuración</h3>
            <p className="text-xs text-slate-400">
              Copia este enlace para compartir tu patrón y velocidad exactos:
            </p>
            <input
              type="text"
              readOnly
              value={generatedUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-amber-300 select-all"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedUrl);
                  setShowDialog(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Copiar y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
