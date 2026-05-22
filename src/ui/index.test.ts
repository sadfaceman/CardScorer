import { init } from "./index";
import * as storageModule from "../state/storage";
import * as renderModule from "./render";
import * as eventsModule from "./events";

// Mock all dependencies
jest.mock("../state/storage", () => ({
  loadStoredState: jest.fn(),
}));

jest.mock("./render", () => ({
  updateHeader: jest.fn(),
  updateScoreboard: jest.fn(),
  updateWildCardDisplay: jest.fn(),
}));

jest.mock("./events", () => ({
  setupEventListeners: jest.fn(),
}));

describe("ui/index", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize the UI by calling all setup functions", () => {
    init();

    expect(storageModule.loadStoredState).toHaveBeenCalledTimes(1);
    expect(renderModule.updateHeader).toHaveBeenCalledTimes(1);
    expect(renderModule.updateScoreboard).toHaveBeenCalledTimes(1);
    expect(renderModule.updateWildCardDisplay).toHaveBeenCalledTimes(1);
    expect(eventsModule.setupEventListeners).toHaveBeenCalledTimes(1);
  });

  it("should call functions in the correct order", () => {
    const calls: string[] = [];

    (storageModule.loadStoredState as jest.Mock).mockImplementation(() =>
      calls.push("loadStoredState"),
    );
    (renderModule.updateHeader as jest.Mock).mockImplementation(() =>
      calls.push("updateHeader"),
    );
    (renderModule.updateScoreboard as jest.Mock).mockImplementation(() =>
      calls.push("updateScoreboard"),
    );
    (renderModule.updateWildCardDisplay as jest.Mock).mockImplementation(() =>
      calls.push("updateWildCardDisplay"),
    );
    (eventsModule.setupEventListeners as jest.Mock).mockImplementation(() =>
      calls.push("setupEventListeners"),
    );

    init();

    expect(calls).toEqual([
      "loadStoredState",
      "updateHeader",
      "updateScoreboard",
      "updateWildCardDisplay",
      "setupEventListeners",
    ]);
  });
});
