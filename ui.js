import { players, roundTypes, createPlayer } from "./state";
import { calculateScore, getMaxPoints, getWildCardCount } from "./score";
const playerForm = document.getElementById("player-form");
const playerInput = document.getElementById("player-input");
const headerRow = document.getElementById("header-row");
const scoreRows = document.getElementById("score-rows");
function updateHeader() {
    if (!headerRow) {
        return;
    }
    headerRow.innerHTML = "<th>Round</th>";
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
function updateScoreboard() {
    if (!scoreRows) {
        return;
    }
    scoreRows.innerHTML = "";
    for (let r = 0; r < roundTypes.length; r++) {
        const row = document.createElement("tr");
        const roundType = roundTypes[r] || "";
        const maxPoints = getMaxPoints(r, players.length);
        const roundSum = players.reduce((sum, p) => sum + (p.scores[r] || 0), 0);
        // Highlight row if rund is overallocated
        if (maxPoints !== Infinity && roundSum > maxPoints) {
            row.style.backgroundColor = "#ffcccc"; // light red
        }
        row.innerHTML = `<td>${r + 1} (${roundType})</td>`;
        players.forEach((p, idx) => {
            const score = p.scores[r] || 0;
            const finishOrder = p.finishOrders[r] || 0;
            const otherSum = roundSum - score;
            const playerMax = maxPoints !== Infinity ? Math.max(0, maxPoints - otherSum) : undefined;
            const max = playerMax !== undefined ? `max="${playerMax}"` : "";
            if (roundType === "pilling") {
                row.innerHTML += `<td><input type="number" value="${score}" min="0" ${max} data-player="${idx}" data-round="${r}" style="width:40px" /> <label>Finish order:</label> <input type="number" value="${finishOrder}" min="0" max="${players.length - 1}" data-player="${idx}" data-round="${r}" class="finish-order-input" style="width:40px" tabindex="0" /></td>`;
            }
            else {
                row.innerHTML += `<td><input type="number" value="${score}" min="0" ${max} data-player="${idx}" data-round="${r}" style="width:60px" /></td>`;
            }
        });
        scoreRows.appendChild(row);
    }
    // Totals row
    if (players.length > 0) {
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = "<td><b>Total</b></td>";
        players.forEach((p) => {
            const total = p.scores.reduce((sum, score, r) => {
                const roundType = roundTypes[r] || "";
                const finishOrder = p.finishOrders[r] || 0;
                return sum + calculateScore(roundType, score, finishOrder);
            }, 0);
            totalRow.innerHTML += `<td><b>${total}</b></td>`;
        });
        scoreRows.appendChild(totalRow);
    }
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
        });
    }
    // Keep the scoreboard responsive without re-attaching listeners on every refresh
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
                players[playerIdx].finishOrders[roundIdx] = value;
            }
            else {
                players[playerIdx].scores[roundIdx] = value;
            }
            updateScoreboard();
        });
    }
}
export function init() {
    setupEventListeners();
    updateWildCardDisplay();
}
