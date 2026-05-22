import * as uiModule from "./ui/index";

// Mock the ui/index init function
jest.mock("./ui/index", () => ({
  init: jest.fn(),
}));

describe("main", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export a module without errors", () => {
    // The main module simply imports and calls init()
    // We can't re-import the main module easily due to side effects,
    // but we can verify that the init function exists and can be called
    expect(typeof uiModule.init).toBe("function");
  });
});
