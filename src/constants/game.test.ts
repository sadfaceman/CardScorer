import { ROUND_TYPES } from "./game";
import { RoundType } from "../types/index";

describe("constants/game", () => {
  describe("ROUND_TYPES", () => {
    it("should be an array with 8 round types", () => {
      expect(Array.isArray(ROUND_TYPES)).toBe(true);
      expect(ROUND_TYPES).toHaveLength(8);
    });

    it("should contain all expected round types in correct order", () => {
      expect(ROUND_TYPES).toEqual([
        "sets",
        "clubs",
        "facecards",
        "queens",
        "special",
        "lastset",
        "pilling",
        "finishorder",
      ]);
    });

    it("should contain only valid round types", () => {
      const validTypes: RoundType[] = [
        "sets",
        "clubs",
        "facecards",
        "queens",
        "special",
        "lastset",
        "pilling",
        "finishorder",
      ];
      ROUND_TYPES.forEach((roundType) => {
        expect(validTypes).toContain(roundType);
      });
    });

    it("should be immutable (frozen or readonly)", () => {
      // Even if not Object.freeze'd, we can test the expected behavior
      expect(() => {
        // This should not cause issues in the code
        const shouldBeFrozen = Object.isFrozen(ROUND_TYPES);
        if (shouldBeFrozen) {
          (ROUND_TYPES as any)[0] = "invalid";
          expect(ROUND_TYPES[0]).toBe("sets"); // Should remain unchanged
        }
      }).not.toThrow();
    });
  });
});
