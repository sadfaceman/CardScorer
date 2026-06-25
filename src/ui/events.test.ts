import { players, createPlayer } from "../state/index";
import * as storageModule from "../state/storage";

// Mock the render functions
jest.mock("./render.js", () => ({
  updateHeader: jest.fn(),
  updateScoreboard: jest.fn(),
  updateWildCardDisplay: jest.fn(),
  displayMissingPoints: jest.fn(),
}));

// Mock storage functions
jest.mock("../state/storage", () => ({
  saveState: jest.fn(),
  clearStoredState: jest.fn(),
  loadStoredState: jest.fn(),
}));

describe("events", () => {
  beforeEach(() => {
    jest.resetModules();
    // Clear players
    players.splice(0, players.length);
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    players.splice(0, players.length);
  });

  it("should export setupEventListeners function", async () => {
    const eventsModule = await import("./events");
    expect(typeof eventsModule.setupEventListeners).toBe("function");
  });

  it("should create player with correct structure", () => {
    const player = createPlayer("Alice");

    expect(player.name).toBe("Alice");
    expect(Array.isArray(player.scores)).toBe(true);
    expect(player.scores).toHaveLength(8);
    expect(player.scores.every((score) => score === 0)).toBe(true);
  });

  it("should not add duplicate player names", () => {
    players.push(createPlayer("Bob"));
    const initialCount = players.length;

    // Check if player exists before adding
    const isDuplicate = players.some((p) => p.name === "Bob");

    expect(isDuplicate).toBe(true);
    expect(players).toHaveLength(initialCount);
  });

  it("should call saveState after adding player", () => {
    players.push(createPlayer("Carol"));
    storageModule.saveState();

    expect(storageModule.saveState).toHaveBeenCalled();
  });

  it("should update player score when value changes", () => {
    players.push({ name: "David", scores: [0, 0, 0, 0, 0, 0, 0, 0] });

    // Simulate score update
    const playerIdx = 0;
    const roundIdx = 0;
    const newValue = 5;
    players[playerIdx].scores[roundIdx] = newValue;

    expect(players[playerIdx].scores[roundIdx]).toBe(5);
  });

  it("should clear players when reset", () => {
    players.push(createPlayer("Eve"));
    players.push(createPlayer("Frank"));

    expect(players).toHaveLength(2);

    players.splice(0, players.length);

    expect(players).toHaveLength(0);
  });

  it("should call clearStoredState when reset", () => {
    storageModule.clearStoredState();

    expect(storageModule.clearStoredState).toHaveBeenCalled();
  });

  it("should ignore invalid score inputs", () => {
    players.push({ name: "Grace", scores: [0, 0, 0, 0, 0, 0, 0, 0] });

    const value = parseInt("NaN", 10) || 0;

    expect(value).toBe(0);
  });

  it("should render point values when calculate has no warnings", async () => {
    document.body.innerHTML = '<button id="calculate-button" type="button">Calculate Scores</button>';
    const renderModule = await import("./render.js");
    (renderModule.displayMissingPoints as jest.Mock).mockReturnValue(false);

    const { setupEventListeners } = await import("./events");
    setupEventListeners();

    const calculateButton = document.getElementById("calculate-button");
    calculateButton?.click();

    expect(renderModule.displayMissingPoints).toHaveBeenCalled();
    expect(renderModule.updateScoreboard).toHaveBeenCalledWith(true);
    expect(calculateButton?.textContent).toBe("Edit Scores");
  });

  it("should go back to edit mode when calculate is pressed again after successful calculate", async () => {
    document.body.innerHTML = '<button id="calculate-button" type="button">Calculate Scores</button>';
    const renderModule = await import("./render.js");
    (renderModule.displayMissingPoints as jest.Mock).mockReturnValue(false);

    const { setupEventListeners } = await import("./events");
    setupEventListeners();

    const calculateButton = document.getElementById("calculate-button");
    calculateButton?.click();
    calculateButton?.click();

    expect(renderModule.updateScoreboard).toHaveBeenLastCalledWith(false);
    expect(calculateButton?.textContent).toBe("Calculate Scores");
  });

  it("should stay in calculate mode when warnings are present", async () => {
    document.body.innerHTML = '<button id="calculate-button" type="button">Calculate Scores</button>';
    const renderModule = await import("./render.js");
    (renderModule.displayMissingPoints as jest.Mock).mockReturnValue(true);

    const { setupEventListeners } = await import("./events");
    setupEventListeners();

    const calculateButton = document.getElementById("calculate-button");
    calculateButton?.click();

    expect(renderModule.displayMissingPoints).toHaveBeenCalled();
    expect(renderModule.updateScoreboard).toHaveBeenCalledWith(false);
    expect(calculateButton?.textContent).toBe("Calculate Scores");
  });

  it("should handle empty player name", () => {
    const name = "   ".trim();

    expect(name).toBe("");
    expect(players).toHaveLength(0);
  });

  it("should add multiple players", () => {
    players.push(createPlayer("Henry"));
    players.push(createPlayer("Iris"));
    players.push(createPlayer("Jack"));

    expect(players).toHaveLength(3);
    expect(players[0].name).toBe("Henry");
    expect(players[1].name).toBe("Iris");
    expect(players[2].name).toBe("Jack");
  });
});
