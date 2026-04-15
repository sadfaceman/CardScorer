import { players, roundTypes, createPlayer } from "./state.js";
import { calculateScore, getMaxPoints, getWildCardCount } from "./score.js";
const playerForm = document.getElementById("player-form");
const playerInput = document.getElementById("player-input");
const headerRow = document.getElementById("header-row");
const scoreRows = document.getElementById("score-rows");
const calculateButton = document.getElementById("calculate-button");
const resetButton = document.getElementById("reset-button");
const SESSION_KEY = "card-scorer-session";
function saveState() {
    try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(players));
    }
    catch (_a) {
        // Ignore storage errors.
    }
}
function clearStoredState() {
    try {
        window.sessionStorage.removeItem(SESSION_KEY);
    }
    catch (_a) {
        // Ignore storage errors.
    }
}
function loadStoredState() {
    try {
        const stored = window.sessionStorage.getItem(SESSION_KEY);
        if (!stored) {
            return;
        }
        const data = JSON.parse(stored);
        if (!Array.isArray(data)) {
            return;
        }
        players.splice(0, players.length);
        data.forEach((item) => {
            if (typeof item !== "object" ||
                item === null ||
                typeof item.name !== "string" ||
                !Array.isArray(item.scores)) {
                return;
            }
            const scores = item.scores.map((value) => typeof value === "number" ? value : Number(value) || 0);
            const normalizedScores = Array.from({ length: roundTypes.length }, (_, idx) => scores[idx] || 0);
            players.push({
                name: item.name,
                scores: normalizedScores,
            });
        });
    }
    catch (_a) {
        // Ignore invalid stored data.
    }
}
function updateHeader() {
    if (!headerRow) {
        return;
    }
    headerRow.innerHTML = "<th>R</th>";
    players.forEach((p) => {
        headerRow.innerHTML += `<th>${p.name}</th>`;
    });
}
function updateWildCardDisplay() {
    const wildCardInfo = document.getElementById("wildcard-info");
    if (!wildCardInfo) {
        return;
    }
    const wildCount = getWildCardCount(players.length);
    wildCardInfo.textContent =
        wildCount > 0 ? `Wild cards to add: ${wildCount}` : "No wild cards needed.";
}
const ROUND_LABELS = {
    sets: "Sets",
    clubs: "Clubs",
    facecards: "Face",
    queens: "Ladies",
    special: "King of Clubs / Ace of Spades",
    lastset: "Last",
    pilling: "Solitaire",
    finishorder: "# Pass",
};
function updateScoreboard() {
    if (!scoreRows) {
        return;
    }
    scoreRows.innerHTML = "";
    for (let r = 0; r < roundTypes.length; r++) {
        const row = document.createElement("tr");
        const roundType = roundTypes[r] || "";
        const roundLabel = ROUND_LABELS[roundType] || `Round ${r + 1}`;
        const maxPoints = getMaxPoints(r, players.length);
        const roundSum = players.reduce((sum, p) => sum + (p.scores[r] || 0), 0);
        if (maxPoints !== Infinity && roundSum > maxPoints) {
            row.style.backgroundColor = "#ffcccc";
        }
        row.innerHTML = `<td title="${roundType}">${roundLabel}</td>`;
        players.forEach((p, idx) => {
            const score = p.scores[r] || 0;
            const otherSum = roundSum - score;
            const playerMax = maxPoints !== Infinity ? Math.max(0, maxPoints - otherSum) : undefined;
            const max = playerMax !== undefined ? `max="${playerMax}"` : "";
            if (roundType === "finishorder") {
                row.innerHTML += `<td><div><input type="number" value="${score}" min="0" max="${players.length}" data-player="${idx}" data-round="${r}" class="finish-order-input" tabindex="0" /></div></td>`;
            }
            else {
                row.innerHTML += `<td><div><input type="number" value="${score}" min="0" ${max} data-player="${idx}" data-round="${r}" /></div></td>`;
            }
        });
        scoreRows.appendChild(row);
    }
    if (players.length > 0) {
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = "<td><b>T</b></td>";
        players.forEach((p) => {
            const total = p.scores.reduce((sum, score, r) => {
                const roundType = roundTypes[r] || "";
                const finishOrder = p.scores[7] || 0;
                return sum + calculateScore(roundType, score, finishOrder);
            }, 0);
            totalRow.innerHTML += `<td><b>${total}</b></td>`;
        });
        scoreRows.appendChild(totalRow);
    }
}
function resetGame() {
    players.splice(0, players.length);
    clearStoredState();
    updateHeader();
    updateScoreboard();
    updateWildCardDisplay();
}
function setupEventListeners() {
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
        });
    }
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            resetGame();
        });
    }
}
export function init() {
    loadStoredState();
    updateHeader();
    updateScoreboard();
    updateWildCardDisplay();
    setupEventListeners();
}
