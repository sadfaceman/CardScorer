import { ROUND_LABELS } from "./constants";

describe("ui/constants", () => {
  describe("ROUND_LABELS", () => {
    it("should map all round types to their labels", () => {
      expect(ROUND_LABELS.sets).toBe("Sets");
      expect(ROUND_LABELS.clubs).toBe("Clubs");
      expect(ROUND_LABELS.facecards).toBe("Face");
      expect(ROUND_LABELS.queens).toBe("Ladies");
      expect(ROUND_LABELS.special).toBe("King of Clubs / Ace of Spades");
      expect(ROUND_LABELS.lastset).toBe("Last");
      expect(ROUND_LABELS.pilling).toBe("# Pass");
      expect(ROUND_LABELS.finishorder).toBe("Solitaire");
    });

    it("should have 8 round labels", () => {
      expect(Object.keys(ROUND_LABELS)).toHaveLength(8);
    });

    it("should have non-empty string values", () => {
      const labels = Object.keys(ROUND_LABELS).map(
        (key) => ROUND_LABELS[key as keyof typeof ROUND_LABELS],
      );
      labels.forEach((label: string) => {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });
});
