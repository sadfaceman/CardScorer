import { loadStoredState } from "../state/storage.js";
import { updateHeader, updateScoreboard, updateWildCardDisplay } from "./render.js";
import { setupEventListeners } from "./events.js";

export function init() {
  loadStoredState();
  updateHeader();
  updateScoreboard();
  updateWildCardDisplay();
  setupEventListeners();
}