import { StrummingPattern, StrokeDirection, BeatSlot } from "../types";

function create8thSlots(directions: StrokeDirection[]): BeatSlot[] {
  if (directions.length !== 8) {
    throw new Error("8th subdivision pattern must contain exactly 8 slots");
  }

  return directions.map((dir, i) => ({
    index: i,
    beatLabel: i % 2 === 0 ? `${(i / 2) + 1}` : "&",
    strokeDirection: dir,
    isQuarterBeat: i % 2 === 0,
    isMeasureStart: i === 0,
  }));
}

function create16thSlots(directions: StrokeDirection[]): BeatSlot[] {
  if (directions.length !== 16) {
    throw new Error("16th subdivision pattern must contain exactly 16 slots");
  }

  const subLabels = ["", "e", "&", "a"];

  return directions.map((dir, i) => {
    const beatNum = Math.floor(i / 4) + 1;
    const subIdx = i % 4;
    const label = subIdx === 0 ? `${beatNum}` : subLabels[subIdx];

    return {
      index: i,
      beatLabel: label,
      strokeDirection: dir,
      isQuarterBeat: subIdx === 0,
      isMeasureStart: i === 0,
    };
  });
}

function create34Slots(directions: StrokeDirection[]): BeatSlot[] {
  if (directions.length !== 6) {
    throw new Error("3/4 8th subdivision pattern must contain exactly 6 slots");
  }

  return directions.map((dir, i) => ({
    index: i,
    beatLabel: i % 2 === 0 ? `${(i / 2) + 1}` : "&",
    strokeDirection: dir,
    isQuarterBeat: i % 2 === 0,
    isMeasureStart: i === 0,
  }));
}

function create68Slots(directions: StrokeDirection[]): BeatSlot[] {
  if (directions.length !== 12) {
    throw new Error("6/8 compound pattern must contain exactly 12 slots");
  }

  return directions.map((dir, i) => ({
    index: i,
    beatLabel: i % 2 === 0 ? `${(i / 2) + 1}` : "&",
    strokeDirection: dir,
    isQuarterBeat: i % 2 === 0,
    isMeasureStart: i === 0,
  }));
}

export const beginnerPresets: StrummingPattern[] = [
  {
    id: "preset-island-strum",
    name: "Island Strum (D-DU-U-DU)",
    timeSignature: [4, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    // 1: D, &: -, 2: D, &: U, 3: -, &: U, 4: D, &: U
    slots: create8thSlots(["down", "none", "down", "up", "none", "up", "down", "up"]),
  },
  {
    id: "preset-basic-8th",
    name: "Basic Beginner (D-D-DU-U)",
    timeSignature: [4, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    // 1: D, &: -, 2: D, &: -, 3: D, &: U, 4: -, &: U
    slots: create8thSlots(["down", "none", "down", "none", "down", "up", "none", "up"]),
  },
  {
    id: "preset-folk-ballad",
    name: "Folk Ballad (D-DU-UDU)",
    timeSignature: [4, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    // 1: D, &: -, 2: D, &: U, 3: -, &: U, 4: D, &: U
    slots: create8thSlots(["down", "none", "down", "up", "none", "up", "down", "up"]),
  },
  {
    id: "preset-four-on-floor",
    name: "Four on the Floor (D-D-D-D)",
    timeSignature: [4, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    slots: create8thSlots(["down", "none", "down", "none", "down", "none", "down", "none"]),
  },
  {
    id: "preset-16th-groove",
    name: "16th-Note Pop Groove",
    timeSignature: [4, 4],
    subdivision: "sixteenth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    slots: create16thSlots([
      "down", "none", "down", "up", // 1 e & a
      "none", "up", "down", "up",   // 2 e & a
      "down", "none", "down", "up", // 3 e & a
      "none", "up", "down", "up",   // 4 e & a
    ]),
  },
  {
    id: "preset-waltz-basic",
    name: "Vals Básico 3/4 (6 strums: D-U-D-U-D-U)",
    timeSignature: [3, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    // 6 strums in 3/4 time: 3 Down and 3 Up (1 & 2 & 3 &)
    slots: create34Slots(["down", "up", "down", "up", "down", "up"]),
  },
  {
    id: "preset-waltz-ballad",
    name: "Vals Balada 3/4 (D-DU-DU)",
    timeSignature: [3, 4],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    // 1: D, &: -, 2: D, &: U, 3: D, &: U
    slots: create34Slots(["down", "none", "down", "up", "down", "up"]),
  },
  {
    id: "preset-ballad-68",
    name: "Balada 6/8 (12 strums: 6 D y 6 U)",
    timeSignature: [6, 8],
    subdivision: "eighth",
    isPreset: true,
    ownerId: null,
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    // 12 strums in 6/8 time: 6 Down and 6 Up
    slots: create68Slots([
      "down", "none", "down", "up", "down", "up",
      "down", "none", "down", "up", "down", "up",
    ]),
  },
];
