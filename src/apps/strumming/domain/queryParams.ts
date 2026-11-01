/**
 * URL Query Parameter Parsing, Normalization, and Serialization for Strumming Pattern Trainer
 * @module apps/strumming/domain/queryParams
 */

import {
  StrummingPattern,
  StrokeDirection,
  SubdivisionUnit,
  MetronomeSubdivision,
  clampBpm,
  BeatSlot,
} from "../types";
import { beginnerPresets } from "../presets/beginnerPatterns";

export interface StrummingUrlConfig {
  bpm?: number;
  subdivision?: SubdivisionUnit;
  pattern?: StrummingPattern;
  presetId?: string;
  accent?: boolean;
  countIn?: 0 | 1 | 2 | 3;
  metroSub?: MetronomeSubdivision;
  strict?: boolean;
}

export interface StrummingShareOptions {
  pattern: StrummingPattern;
  bpm: number;
  accent: boolean;
  countIn: 0 | 1 | 2 | 3;
  metroSub: MetronomeSubdivision;
  strict: boolean;
  baseUrl?: string;
}

/**
 * Normalizes a stroke token to StrokeDirection ('down', 'up', 'none').
 */
export function normalizeStrokeToken(token: string): StrokeDirection {
  const clean = token.trim().toLowerCase();
  if (clean === "d" || clean === "down" || clean === "↓") return "down";
  if (clean === "u" || clean === "up" || clean === "↑") return "up";
  return "none";
}

/**
 * Serializes a pattern's strokes into a URL-friendly compact string.
 * Example: "d,-,d,u,-,u,d,u"
 */
export function serializePatternStrokes(pattern: StrummingPattern): string {
  return pattern.slots
    .map((s) => {
      if (s.strokeDirection === "down") return "d";
      if (s.strokeDirection === "up") return "u";
      return "-";
    })
    .join(",");
}

/**
 * Builds a custom StrummingPattern entity from an array of StrokeDirections.
 */
export function createCustomPatternFromStrokes(
  strokes: StrokeDirection[],
  subdivision: SubdivisionUnit,
  customName: string = "Shared Custom Pattern"
): StrummingPattern {
  const count = subdivision === "sixteenth" ? 16 : 8;
  const safeStrokes: StrokeDirection[] = Array.from({ length: count }, (_, i) => strokes[i] ?? "none");

  const slots: BeatSlot[] = safeStrokes.map((dir, i) => {
    let beatLabel = "";
    const isQuarterBeat = subdivision === "eighth" ? i % 2 === 0 : i % 4 === 0;

    if (subdivision === "eighth") {
      beatLabel = isQuarterBeat ? `${i / 2 + 1}` : "&";
    } else {
      const beatNum = Math.floor(i / 4) + 1;
      const subIdx = i % 4;
      if (subIdx === 0) beatLabel = `${beatNum}`;
      else if (subIdx === 1) beatLabel = "e";
      else if (subIdx === 2) beatLabel = "&";
      else beatLabel = "a";
    }

    return {
      index: i,
      beatLabel,
      strokeDirection: dir,
      isQuarterBeat,
      isMeasureStart: i === 0,
    };
  });

  return {
    id: `custom-shared-${Date.now()}`,
    name: customName,
    timeSignature: [4, 4],
    subdivision,
    slots,
    isPreset: false,
    ownerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Parses and normalizes incoming URL query parameters with graceful fallbacks.
 */
export function parseStrummingParams(
  searchParams?: URLSearchParams | Record<string, string | string[] | undefined>
): StrummingUrlConfig {
  if (!searchParams) return {};

  const getParam = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key);
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] ?? null : val ?? null;
  };

  const bpmRaw = getParam("bpm");
  const subRaw = getParam("subdivision") || getParam("sub");
  const presetRaw = getParam("preset");
  const strokesRaw = getParam("strokes") || getParam("pattern");
  const accentRaw = getParam("accent");
  const countInRaw = getParam("countIn") || getParam("count_in");
  const metroSubRaw = getParam("metroSub") || getParam("metro_sub");
  const strictRaw = getParam("strict");

  const config: StrummingUrlConfig = {};

  // 1. BPM
  if (bpmRaw) {
    const parsed = parseInt(bpmRaw, 10);
    if (!isNaN(parsed)) {
      config.bpm = clampBpm(parsed);
    }
  }

  // 2. Subdivision
  let detectedSubdivision: SubdivisionUnit | undefined;
  if (subRaw) {
    const cleanSub = subRaw.toLowerCase();
    if (cleanSub === "16th" || cleanSub === "sixteenth" || cleanSub === "16") {
      detectedSubdivision = "sixteenth";
    } else if (cleanSub === "8th" || cleanSub === "eighth" || cleanSub === "8") {
      detectedSubdivision = "eighth";
    }
  }

  // 3. Pattern / Preset resolution
  if (presetRaw) {
    const cleanPreset = presetRaw.toLowerCase().trim();
    const matchedPreset = beginnerPresets.find(
      (p) =>
        p.id.toLowerCase() === cleanPreset ||
        p.id.toLowerCase().replace("preset-", "") === cleanPreset ||
        p.name.toLowerCase().includes(cleanPreset)
    );

    if (matchedPreset) {
      config.presetId = matchedPreset.id;
      config.pattern = matchedPreset;
      detectedSubdivision = matchedPreset.subdivision;
    }
  } else if (strokesRaw) {
    // Parse stroke sequence: "d,-,d,u,-,u,d,u" or "D-DU-UDU"
    let tokens: string[] = [];
    if (strokesRaw.includes(",")) {
      tokens = strokesRaw.split(",");
    } else if (strokesRaw.includes("-") && strokesRaw.length > 2) {
      // Split on comma or treat as token sequence
      tokens = strokesRaw.split("-");
    } else {
      tokens = strokesRaw.split("");
    }

    const strokes = tokens.map(normalizeStrokeToken);
    const sub: SubdivisionUnit =
      detectedSubdivision || (strokes.length > 8 ? "sixteenth" : "eighth");

    config.pattern = createCustomPatternFromStrokes(strokes, sub);
    detectedSubdivision = sub;
  }

  if (detectedSubdivision) {
    config.subdivision = detectedSubdivision;
  }

  // 4. Accent Beat 1
  if (accentRaw !== null) {
    config.accent = accentRaw === "1" || accentRaw.toLowerCase() === "true";
  }

  // 5. Count-In Measures (0, 1, 2, 3)
  if (countInRaw !== null) {
    const val = parseInt(countInRaw, 10);
    if (val === 0 || val === 1 || val === 2 || val === 3) {
      config.countIn = val;
    }
  }

  // 6. Metronome Subdivision
  if (metroSubRaw) {
    const validSubs: MetronomeSubdivision[] = ["quarter", "eighth", "sixteenth", "triplet", "swing"];
    const match = validSubs.find((s) => s.toLowerCase() === metroSubRaw.toLowerCase());
    if (match) {
      config.metroSub = match;
    }
  }

  // 7. Strict Alternation
  if (strictRaw !== null) {
    config.strict = strictRaw === "1" || strictRaw.toLowerCase() === "true";
  }

  return config;
}

/**
 * Generates a full shareable URL containing the current configuration.
 */
export function generateStrummingShareUrl(options: StrummingShareOptions): string {
  const { pattern, bpm, accent, countIn, metroSub, strict, baseUrl } = options;
  const basePath = "/strumming";
  const params = new URLSearchParams();

  // Pattern or preset
  if (pattern.isPreset) {
    const presetSlug = pattern.id.replace(/^preset-/, "");
    params.set("preset", presetSlug);
  } else {
    params.set("sub", pattern.subdivision === "eighth" ? "8th" : "16th");
    params.set("strokes", serializePatternStrokes(pattern));
  }

  // BPM
  params.set("bpm", String(bpm));

  // Accent Beat 1 (only if false, or always for clarity)
  if (!accent) {
    params.set("accent", "0");
  }

  // Count-in
  if (countIn !== 1) {
    params.set("countIn", String(countIn));
  }

  // Metronome subdivision (only if not default 'quarter')
  if (metroSub !== "quarter") {
    params.set("metroSub", metroSub);
  }

  // Strict alternation (only if false)
  if (!strict) {
    params.set("strict", "0");
  }

  const query = params.toString();
  const relativeUrl = query ? `${basePath}?${query}` : basePath;

  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/$/, "");
    return `${cleanBase}${relativeUrl}`;
  }

  return relativeUrl;
}
