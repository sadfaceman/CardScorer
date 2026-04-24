import { players, createPlayer } from "../state/index.js";
import { updateHeader, updateScoreboard, updateWildCardDisplay, displayMissingPoints, } from "./render.js";
import { saveState, clearStoredState } from "../state/storage.js";
const playerForm = document.getElementById("player-form");
const playerInput = document.getElementById("player-input");
const scoreRows = document.getElementById("score-rows");
const calculateButton = document.getElementById("calculate-button");
const resetButton = document.getElementById("reset-button");
function resetGame() {
    players.splice(0, players.length);
    clearStoredState();
    updateHeader();
    updateScoreboard();
    updateWildCardDisplay();
}
export function setupEventListeners() {
    if (playerForm) {
        playerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!playerInput) {
                return;
            }
            const name = playerInput.value.trim();
            if (!name || players.some((p) => p.name === name)) {
                return;
            }
            players.push(createPlayer(name));
            playerInput.value = "";
            updateHeader();
            updateScoreboard();
            updateWildCardDisplay();
            saveState();
        });
    }
    if (scoreRows) {
        scoreRows.addEventListener("change", (event) => {
            const target = event.target;
            if (!target || !target.dataset.player || !target.dataset.round) {
                return;
            }
            const playerIdx = parseInt(target.dataset.player, 10);
            const roundIdx = parseInt(target.dataset.round, 10);
            const value = parseInt(target.value, 10) || 0;
            if (target.classList.contains("finish-order-input")) {
                players[playerIdx].scores[7] = value;
            }
            else {
                players[playerIdx].scores[roundIdx] = value;
            }
            saveState();
        });
    }
    if (calculateButton) {
        calculateButton.addEventListener("click", () => {
            updateScoreboard();
            displayMissingPoints();
        });
    }
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            resetGame();
        });
    }
}
