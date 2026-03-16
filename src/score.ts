import { RoundType } from "./types.js";

export function calculateScore(
  roundType: RoundType,
  value: number,
  finishOrder: number,
): number {
  switch (roundType) {
    case "sets":
    case "clubs":
      return value * 2;
    case "facecards":
      return value * 5;
    case "queens":
      return value * 10;
    case "special":
      return value * 15;
    case "lastset":
      return value > 0 ? 20 : 0;
    case "pilling": {
      let score = value * 2;
      // finishOrder: 1 = 0 points, >1 = (finishOrder-1)*5
      if (finishOrder > 1) {
        score += (finishOrder - 1) * 5;
      }
      return score;
    }
    case "finishorder":
      return 0; // Finish order is handled separately in the UI
    default:
      return value;
  }
}

export function getWildCardCount(playerCount: number): number {
  if (playerCount < 1 || playerCount > 10) {
    return 0;
  }
  const deckSize = 52;
  const remainder = deckSize % playerCount;
  return remainder === 0 ? 0 : playerCount - remainder;
}

export function getMaxPoints(roundIdx: number, playerCount: number): number {
  switch (roundIdx) {
    case 0: // Round 1
      const deckSize = 52;
      const wildCount = getWildCardCount(playerCount);
      return Math.floor((deckSize + wildCount) / playerCount);
    case 1: // Round 2
      return 13;
    case 2: // Round 3
      return 12;
    case 3: // Round 4
      return 4;
    case 4: // Round 5
      return 2;
    case 5: // Round 6
      return 1;
    default:
      return Infinity;
  }
}
