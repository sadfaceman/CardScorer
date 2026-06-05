describe("render", () => {
  let players: Array<{ name: string; scores: number[] }> = [];
  let roundTypes: string[] = [];

  beforeEach(async () => {
    jest.resetModules();
    document.body.innerHTML = "";

    const stateModule = await import("../state/index");
    players = stateModule.players;
    roundTypes = stateModule.roundTypes;
    players.splice(0, players.length);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    players.splice(0, players.length);
  });

  describe("rendering functions", () => {
    it("should export render functions", async () => {
      const renderModule = await import("./render");
      expect(typeof renderModule.updateHeader).toBe("function");
      expect(typeof renderModule.updateScoreboard).toBe("function");
      expect(typeof renderModule.updateWildCardDisplay).toBe("function");
      expect(typeof renderModule.displayMissingPoints).toBe("function");
    });

    it("should handle missing DOM elements gracefully", async () => {
      const {
        updateHeader,
        updateScoreboard,
        updateWildCardDisplay,
        displayMissingPoints,
      } = await import("./render");

      expect(() => updateHeader()).not.toThrow();
      expect(() => updateScoreboard()).not.toThrow();
      expect(() => updateWildCardDisplay()).not.toThrow();
      expect(() => displayMissingPoints()).not.toThrow();
    });

    it("should have 8 round types", () => {
      expect(roundTypes).toHaveLength(8);
    });

    it("should manipulate player state correctly", () => {
      players.push({ name: "Alice", scores: [1, 2, 3, 4, 5, 6, 7, 8] });
      expect(players).toHaveLength(1);
      expect(players[0].scores).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

      players[0].scores[0] = 10;
      expect(players[0].scores[0]).toBe(10);
    });

    it("should handle displayMissingPoints with missing points", async () => {
      const container = document.createElement("div");
      container.id = "missing-points-display";
      document.body.appendChild(container);

      players.push({ name: "Alice", scores: [5, 0, 0, 0, 0, 0, 0, 0] });

      const { displayMissingPoints } = await import("./render");
      displayMissingPoints();

      expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it("should handle displayMissingPoints with duplicate finish order", async () => {
      const container = document.createElement("div");
      container.id = "missing-points-display";
      document.body.appendChild(container);

      players.push({ name: "Alice", scores: [13, 6, 6, 2, 1, 0, 0, 1] });
      players.push({ name: "Bob", scores: [13, 7, 6, 2, 1, 1, 0, 1] });

      const { displayMissingPoints } = await import("./render");
      displayMissingPoints();

      expect(container.innerHTML).toContain("Duplicate");
    });

    it("should render computed point values when requested", async () => {
      const tableBody = document.createElement("tbody");
      tableBody.id = "score-rows";
      document.body.appendChild(tableBody);

      players.push({ name: "Alice", scores: [3, 2, 0, 0, 0, 0, 0, 1] });

      const { updateScoreboard } = await import("./render");
      updateScoreboard(true);

      const rows = tableBody.querySelectorAll("tr");
      expect(rows.length).toBeGreaterThan(0);

      const firstRoundCells = rows[0].querySelectorAll("td");
      expect(firstRoundCells[1].textContent).toBe("6");
      expect(firstRoundCells[1].querySelector("input")).toBeNull();
    });
  });
});
