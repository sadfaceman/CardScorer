import { calculateScore, getWildCardCount } from "./score";

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
