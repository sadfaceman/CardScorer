import { Player, RoundType } from "./types.js";

export const ROUND_TYPES: RoundType[] = [
  "sets",
  "clubs",
  "facecards",
  "queens",
  "special",
  "lastset",
  "pilling",
];

export const roundTypes: RoundType[] = [...ROUND_TYPES];
export const roundCount = ROUND_TYPES.length;

export const players: Player[] = [];

export function createPlayer(name: string): Player {
  return {
    name,
    scores: Array.from({ length: roundCount }, () => 0),
    finishOrders: Array.from({ length: roundCount }, () => 0),
  };
}
