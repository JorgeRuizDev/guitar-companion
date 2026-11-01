import React from "react";

export interface SliderProps {
  id?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  className = "",
}) => {
  const inputId = id || `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full select-none ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <label htmlFor={inputId} className="font-medium text-slate-300">
          {label}
        </label>
        <span className="font-bold text-amber-400 tabular-nums text-base">
          {value}
          {unit && <span className="text-xs text-slate-400 ml-0.5">{unit}</span>}
        </span>
      </div>
      <div className="relative flex items-center min-h-[44px]">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>
    </div>
  );
};
