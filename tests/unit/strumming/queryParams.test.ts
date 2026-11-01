import { describe, it, expect } from "vitest";
import {
  parseStrummingParams,
  generateStrummingShareUrl,
  serializePatternStrokes,
  createCustomPatternFromStrokes,
  normalizeStrokeToken,
} from "@/apps/strumming/domain/queryParams";
import { beginnerPresets } from "@/apps/strumming/presets/beginnerPatterns";

describe("Strumming Query Parameters Domain", () => {
  describe("normalizeStrokeToken", () => {
    it("normalizes downstroke tokens correctly", () => {
      expect(normalizeStrokeToken("d")).toBe("down");
      expect(normalizeStrokeToken("D")).toBe("down");
      expect(normalizeStrokeToken("down")).toBe("down");
      expect(normalizeStrokeToken("↓")).toBe("down");
    });

    it("normalizes upstroke tokens correctly", () => {
      expect(normalizeStrokeToken("u")).toBe("up");
      expect(normalizeStrokeToken("U")).toBe("up");
      expect(normalizeStrokeToken("up")).toBe("up");
      expect(normalizeStrokeToken("↑")).toBe("up");
    });

    it("normalizes rests and unknown tokens to none", () => {
      expect(normalizeStrokeToken("-")).toBe("none");
      expect(normalizeStrokeToken("none")).toBe("none");
      expect(normalizeStrokeToken("")).toBe("none");
      expect(normalizeStrokeToken(" ")).toBe("none");
    });
  });

  describe("parseStrummingParams", () => {
    it("returns empty config when no parameters are provided", () => {
      const config = parseStrummingParams(undefined);
      expect(config).toEqual({});

      const configEmpty = parseStrummingParams(new URLSearchParams());
      expect(configEmpty).toEqual({});
    });

    it("parses BPM and clamps out-of-range values", () => {
      const configNormal = parseStrummingParams({ bpm: "95" });
      expect(configNormal.bpm).toBe(95);

      const configLow = parseStrummingParams({ bpm: "20" });
      expect(configLow.bpm).toBe(40);

      const configHigh = parseStrummingParams({ bpm: "300" });
      expect(configHigh.bpm).toBe(240);
    });

    it("parses built-in presets by slug or ID", () => {
      const config1 = parseStrummingParams({ preset: "island-strum" });
      expect(config1.presetId).toBe("preset-island-strum");
      expect(config1.pattern?.name).toContain("Island Strum");

      const config2 = parseStrummingParams({ preset: "16th-groove" });
      expect(config2.presetId).toBe("preset-16th-groove");
      expect(config2.subdivision).toBe("sixteenth");
    });

    it("parses custom stroke strings into valid StrummingPattern entities", () => {
      const config = parseStrummingParams({
        strokes: "d,-,d,u,-,u,d,u",
        bpm: "105",
      });

      expect(config.pattern).toBeDefined();
      expect(config.pattern?.isPreset).toBe(false);
      expect(config.pattern?.slots).toHaveLength(8);
      expect(config.pattern?.slots[0].strokeDirection).toBe("down");
      expect(config.pattern?.slots[1].strokeDirection).toBe("none");
      expect(config.pattern?.slots[2].strokeDirection).toBe("down");
      expect(config.pattern?.slots[3].strokeDirection).toBe("up");
      expect(config.bpm).toBe(105);
    });

    it("parses 16-slot stroke sequences as sixteenth subdivisions", () => {
      const strokes16 = "d,-,d,u,-,u,d,u,d,-,d,u,-,u,d,u";
      const config = parseStrummingParams({ strokes: strokes16 });

      expect(config.pattern?.subdivision).toBe("sixteenth");
      expect(config.pattern?.slots).toHaveLength(16);
    });

    it("parses boolean flags: accent and strict alternation", () => {
      expect(parseStrummingParams({ accent: "1" }).accent).toBe(true);
      expect(parseStrummingParams({ accent: "0" }).accent).toBe(false);
      expect(parseStrummingParams({ accent: "true" }).accent).toBe(true);
      expect(parseStrummingParams({ accent: "false" }).accent).toBe(false);

      expect(parseStrummingParams({ strict: "1" }).strict).toBe(true);
      expect(parseStrummingParams({ strict: "0" }).strict).toBe(false);
    });

    it("parses count-in measures (0 to 3)", () => {
      expect(parseStrummingParams({ countIn: "0" }).countIn).toBe(0);
      expect(parseStrummingParams({ countIn: "2" }).countIn).toBe(2);
      expect(parseStrummingParams({ countIn: "3" }).countIn).toBe(3);
      // Invalid numbers are ignored
      expect(parseStrummingParams({ countIn: "9" }).countIn).toBeUndefined();
    });

    it("parses metronome subdivisions", () => {
      expect(parseStrummingParams({ metroSub: "triplet" }).metroSub).toBe("triplet");
      expect(parseStrummingParams({ metroSub: "sixteenth" }).metroSub).toBe("sixteenth");
      expect(parseStrummingParams({ metroSub: "swing" }).metroSub).toBe("swing");
    });
  });

  describe("generateStrummingShareUrl", () => {
    it("generates clean URL for presets", () => {
      const url = generateStrummingShareUrl({
        pattern: beginnerPresets[0], // Island Strum
        bpm: 90,
        accent: true,
        countIn: 1,
        metroSub: "quarter",
        strict: true,
      });

      expect(url).toContain("/strumming?preset=island-strum");
      expect(url).toContain("bpm=90");
      // Default values (countIn 1, accent true, metroSub quarter) are omitted for concise URLs
      expect(url).not.toContain("metroSub");
    });

    it("generates full URL for custom patterns with non-default settings", () => {
      const customPattern = createCustomPatternFromStrokes(
        ["down", "none", "down", "up", "none", "up", "down", "up"],
        "eighth"
      );

      const url = generateStrummingShareUrl({
        pattern: customPattern,
        bpm: 115,
        accent: false,
        countIn: 2,
        metroSub: "triplet",
        strict: false,
        baseUrl: "https://guitarcompanion.app",
      });

      expect(url.startsWith("https://guitarcompanion.app/strumming?")).toBe(true);
      expect(url).toContain("strokes=d%2C-%2Cd%2Cu%2C-%2Cu%2Cd%2Cu");
      expect(url).toContain("bpm=115");
      expect(url).toContain("accent=0");
      expect(url).toContain("countIn=2");
      expect(url).toContain("metroSub=triplet");
      expect(url).toContain("strict=0");
    });

    it("supports round-trip serialization and deserialization", () => {
      const originalStrokes: ("down" | "up" | "none")[] = [
        "down", "none", "down", "up", "none", "up", "down", "up",
      ];
      const pattern = createCustomPatternFromStrokes(originalStrokes, "eighth");

      const url = generateStrummingShareUrl({
        pattern,
        bpm: 100,
        accent: true,
        countIn: 1,
        metroSub: "eighth",
        strict: true,
      });

      const queryString = url.split("?")[1];
      const parsed = parseStrummingParams(new URLSearchParams(queryString));

      expect(parsed.bpm).toBe(100);
      expect(parsed.metroSub).toBe("eighth");
      expect(parsed.pattern?.slots.map((s) => s.strokeDirection)).toEqual(originalStrokes);
    });
  });
});
