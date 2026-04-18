import { Player, RoundType } from "../types/index.js";
import { ROUND_TYPES } from "../constants/game.js";

export const roundTypes: RoundType[] = [...ROUND_TYPES];
export const roundCount = ROUND_TYPES.length;

export const players: Player[] = [];

export function createPlayer(name: string): Player {
  return {
    name,
    scores: Array.from({ length: roundCount }, () => 0),
  };
}
