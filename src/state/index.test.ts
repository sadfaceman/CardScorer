import { clearStoredState, loadStoredState, saveState } from "./storage";
import { createPlayer, players, roundTypes } from "./index";

describe("state storage", () => {
  let storageMock: Record<string, string>;

  beforeEach(() => {
    storageMock = {};
    (globalThis as any).window = {
      sessionStorage: {
        getItem: (key: string) =>
          key in storageMock ? storageMock[key] : null,
        setItem: (key: string, value: string) => {
          storageMock[key] = String(value);
        },
        removeItem: (key: string) => {
          delete storageMock[key];
        },
      },
    };
    players.splice(0, players.length);
  });

  afterEach(() => {
    delete (globalThis as any).window;
    players.splice(0, players.length);
  });

  it("should save players to session storage", () => {
    players.push({ name: "Alice", scores: [1, 2, 3, 4, 5, 6, 7, 8] });

    saveState();

    expect(window.sessionStorage.getItem("card-scorer-session")).toBe(
      JSON.stringify(players),
    );
  });

  it("should remove stored state", () => {
    window.sessionStorage.setItem("card-scorer-session", "value");

    clearStoredState();

    expect(window.sessionStorage.getItem("card-scorer-session")).toBeNull();
  });

  it("should load valid stored data and normalize scores length", () => {
    window.sessionStorage.setItem(
      "card-scorer-session",
      JSON.stringify([{ name: "Bob", scores: [1, 2, 3] }]),
    );

    loadStoredState();

    expect(players).toEqual([
      {
        name: "Bob",
        scores: [1, 2, 3, 0, 0, 0, 0, 0],
      },
    ]);
  });

  it("should ignore malformed stored entries", () => {
    window.sessionStorage.setItem(
      "card-scorer-session",
      JSON.stringify([
        { name: "Carol", scores: "bad" },
        123,
        { name: 456, scores: [1, 2, 3] },
      ]),
    );

    loadStoredState();

    expect(players).toEqual([]);
  });

  it("should ignore invalid JSON stored data without throwing", () => {
    players.push(createPlayer("Existing"));
    window.sessionStorage.setItem("card-scorer-session", "not valid json");

    expect(() => loadStoredState()).not.toThrow();
    expect(players).toEqual([createPlayer("Existing")]);
  });
});

describe("createPlayer", () => {
  it("should create a player with the correct score array length", () => {
    const player = createPlayer("Test Player");

    expect(player.name).toBe("Test Player");
    expect(player.scores).toHaveLength(roundTypes.length);
    expect(player.scores.every((score) => score === 0)).toBe(true);
  });

  it("should create multiple players with different names", () => {
    const player1 = createPlayer("Alice");
    const player2 = createPlayer("Bob");

    expect(player1.name).toBe("Alice");
    expect(player2.name).toBe("Bob");
    expect(player1.scores).toEqual(player2.scores);
  });

  it("should initialize all scores to 0", () => {
    const player = createPlayer("Charlie");

    expect(player.scores).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe("roundTypes and roundCount", () => {
  it("should export roundTypes as an array", () => {
    expect(Array.isArray(roundTypes)).toBe(true);
  });

  it("should export roundCount equal to roundTypes length", () => {
    expect(roundTypes).toHaveLength(8);
  });

  it("should have 8 rounds", () => {
    // From ROUND_TYPES constant
    expect(roundTypes).toEqual([
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
});

describe("players array", () => {
  beforeEach(() => {
    players.splice(0, players.length);
  });

  it("should be an empty array initially", () => {
    expect(players).toEqual([]);
  });

  it("should be mutable", () => {
    const player = createPlayer("Test");
    players.push(player);

    expect(players).toHaveLength(1);
    expect(players[0].name).toBe("Test");
  });

  it("should allow adding and removing players", () => {
    players.push(createPlayer("Alice"));
    players.push(createPlayer("Bob"));

    expect(players).toHaveLength(2);

    players.pop();

    expect(players).toHaveLength(1);
  });
});
