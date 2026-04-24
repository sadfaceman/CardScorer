import {
  calculateScore,
  getWildCardCount,
  getMissingPoints,
  hasDuplicateFinishOrder,
} from "./index";
import { Player } from "../types/index";

describe("calculateScore", () => {
  it("should calculate sets and clubs correctly", () => {
    expect(calculateScore("sets", 3, 0)).toBe(6);
    expect(calculateScore("clubs", 4, 0)).toBe(8);
  });

  it("should calculate facecards correctly", () => {
    expect(calculateScore("facecards", 2, 0)).toBe(10);
  });

  it("should calculate queens correctly", () => {
    expect(calculateScore("queens", 1, 0)).toBe(10);
  });

  it("should calculate special correctly", () => {
    expect(calculateScore("special", 2, 0)).toBe(30);
  });

  it("should calculate lastset correctly", () => {
    expect(calculateScore("lastset", 0, 0)).toBe(0);
    expect(calculateScore("lastset", 1, 0)).toBe(20);
  });

  it("should calculate pilling correctly with finish order", () => {
    expect(calculateScore("pilling", 3, 1)).toBe(6);
    expect(calculateScore("pilling", 3, 2)).toBe(11);
    expect(calculateScore("pilling", 3, 3)).toBe(16);
  });
});

describe("getWildCardCount", () => {
  it("should return 0 for invalid player counts", () => {
    expect(getWildCardCount(0)).toBe(0);
    expect(getWildCardCount(11)).toBe(0);
  });

  it("should return 0 when deck divides evenly", () => {
    expect(getWildCardCount(4)).toBe(0);
    expect(getWildCardCount(13)).toBe(0);
  });

  it("should return required wild cards for uneven divisions", () => {
    expect(getWildCardCount(3)).toBe(2); // 52 % 3 = 1, need 2 wild cards to make 54
    expect(getWildCardCount(5)).toBe(3); // 52 % 5 = 2, need 3 wild cards to make 55
  });

  it("should return correct wild card counts for players 1–10", () => {
    expect(getWildCardCount(1)).toBe(0);
    expect(getWildCardCount(2)).toBe(0);
    expect(getWildCardCount(3)).toBe(2);
    expect(getWildCardCount(4)).toBe(0);
    expect(getWildCardCount(5)).toBe(3);
    expect(getWildCardCount(6)).toBe(2);
    expect(getWildCardCount(7)).toBe(4);
    expect(getWildCardCount(8)).toBe(4);
    expect(getWildCardCount(9)).toBe(2);
    expect(getWildCardCount(10)).toBe(8);
  });
});

describe("getMissingPoints", () => {
  it("should return 0 when round sum equals max points", () => {
    expect(getMissingPoints(0, 13, 4)).toBe(0);
    expect(getMissingPoints(1, 13, 3)).toBe(0);
  });

  it("should return correct missing points when sum is less than max", () => {
    expect(getMissingPoints(0, 8, 4)).toBe(5); // max is 13 for 4 players
    expect(getMissingPoints(1, 10, 3)).toBe(3); // max is 13 for round 1
  });

  it("should return 0 when round sum exceeds max points", () => {
    expect(getMissingPoints(0, 20, 4)).toBe(0);
  });

  it("should return 0 for rounds with infinity max points", () => {
    expect(getMissingPoints(7, 5, 3)).toBe(0); // finishorder round
  });

  it("should handle different player counts correctly", () => {
    // Round 2 (clubs) has max 13 points for any player count
    expect(getMissingPoints(1, 0, 2)).toBe(13); // all missing
    expect(getMissingPoints(1, 6, 2)).toBe(7); // half missing
    expect(getMissingPoints(1, 13, 2)).toBe(0); // complete
  });

  it("should return correct values for all standard rounds", () => {
    // Test each standard round with 3 players
    expect(getMissingPoints(0, 3, 3)).toBeGreaterThan(0); // Round 1 (sets)
    expect(getMissingPoints(1, 5, 3)).toBe(8); // Round 2 (clubs)
    expect(getMissingPoints(2, 4, 3)).toBe(8); // Round 3 (facecards)
    expect(getMissingPoints(3, 2, 3)).toBe(2); // Round 4 (queens)
    expect(getMissingPoints(4, 0, 3)).toBe(2); // Round 5 (special)
    expect(getMissingPoints(5, 0, 3)).toBe(1); // Round 6 (lastset)
  });

  it("should always return non-negative values", () => {
    const testCases = [
      [0, 0, 1],
      [1, 100, 5],
      [2, -10, 3],
      [3, 50, 2],
      [4, 1000, 4],
    ];

    testCases.forEach(([round, sum, players]) => {
      const result = getMissingPoints(
        round as number,
        sum as number,
        players as number,
      );
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("hasDuplicateFinishOrder", () => {
  it("should return no duplicates when all finish orders are unique", () => {
    const players: Player[] = [
      { name: "Player 1", scores: Array(8).fill(0).concat([1]) },
      { name: "Player 2", scores: Array(8).fill(0).concat([2]) },
      { name: "Player 3", scores: Array(8).fill(0).concat([3]) },
    ];
    players[0].scores[7] = 1;
    players[1].scores[7] = 2;
    players[2].scores[7] = 3;

    const result = hasDuplicateFinishOrder(players);
    expect(result.hasDuplicates).toBe(false);
    expect(result.duplicateValues).toEqual([]);
  });

  it("should detect duplicate finish order values", () => {
    const players: Player[] = [
      { name: "Player 1", scores: Array(8).fill(0) },
      { name: "Player 2", scores: Array(8).fill(0) },
      { name: "Player 3", scores: Array(8).fill(0) },
    ];
    players[0].scores[7] = 1;
    players[1].scores[7] = 2;
    players[2].scores[7] = 2; // Duplicate!

    const result = hasDuplicateFinishOrder(players);
    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicateValues).toEqual([2]);
  });

  it("should detect multiple duplicate finish order values", () => {
    const players: Player[] = [
      { name: "Player 1", scores: Array(8).fill(0) },
      { name: "Player 2", scores: Array(8).fill(0) },
      { name: "Player 3", scores: Array(8).fill(0) },
      { name: "Player 4", scores: Array(8).fill(0) },
    ];
    players[0].scores[7] = 1;
    players[1].scores[7] = 1; // Duplicate
    players[2].scores[7] = 2;
    players[3].scores[7] = 2; // Duplicate

    const result = hasDuplicateFinishOrder(players);
    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicateValues).toEqual([1, 2]);
  });

  it("should detect duplicate zero values in finish order", () => {
    const players: Player[] = [
      { name: "Player 1", scores: Array(8).fill(0) },
      { name: "Player 2", scores: Array(8).fill(0) },
      { name: "Player 3", scores: Array(8).fill(0) },
    ];
    players[0].scores[7] = 0; // Duplicate 0
    players[1].scores[7] = 1;
    players[2].scores[7] = 0; // Duplicate 0

    const result = hasDuplicateFinishOrder(players);
    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicateValues).toEqual([0]);
  });

  it("should handle empty player list", () => {
    const players: Player[] = [];

    const result = hasDuplicateFinishOrder(players);
    expect(result.hasDuplicates).toBe(false);
    expect(result.duplicateValues).toEqual([]);
  });

  it("should return sorted duplicate values", () => {
    const players: Player[] = [
      { name: "Player 1", scores: Array(8).fill(0) },
      { name: "Player 2", scores: Array(8).fill(0) },
      { name: "Player 3", scores: Array(8).fill(0) },
      { name: "Player 4", scores: Array(8).fill(0) },
    ];
    players[0].scores[7] = 5;
    players[1].scores[7] = 3;
    players[2].scores[7] = 3; // Duplicate 3
    players[3].scores[7] = 5; // Duplicate 5

    const result = hasDuplicateFinishOrder(players);
    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicateValues).toEqual([3, 5]); // Sorted
  });
});
