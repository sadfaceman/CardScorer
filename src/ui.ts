import { players, roundTypes, createPlayer } from "./state.js";
import { calculateScore, getMaxPoints, getWildCardCount } from "./score.js";

const playerForm = document.getElementById(
  "player-form",
) as HTMLFormElement | null;
const playerInput = document.getElementById(
  "player-input",
) as HTMLInputElement | null;
const headerRow = document.getElementById(
  "header-row",
) as HTMLTableRowElement | null;
const scoreRows = document.getElementById(
  "score-rows",
) as HTMLTableSectionElement | null;
const calculateButton = document.getElementById(
  "calculate-button",
) as HTMLButtonElement | null;

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

    row.innerHTML = `<td title="${roundType}">${r + 1}</td>`;

    players.forEach((p, idx) => {
      const score = p.scores[r] || 0;
      const otherSum = roundSum - score;

      const playerMax =
        maxPoints !== Infinity ? Math.max(0, maxPoints - otherSum) : undefined;
      const max = playerMax !== undefined ? `max="${playerMax}"` : "";

      if (roundType === "finishorder") {
        row.innerHTML += `<td><div><input type="number" value="${score}" min="0" max="${players.length}" data-player="${idx}" data-round="${r}" class="finish-order-input" tabindex="0" /></div></td>`;
      } else {
        row.innerHTML += `<td><div><input type="number" value="${score}" min="0" ${max} data-player="${idx}" data-round="${r}" /></div></td>`;
      }
    });

    scoreRows.appendChild(row);
  }

  // Totals row
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

  // Keep stored values in state; recalc only when the calculate button is pressed.
  if (scoreRows) {
    scoreRows.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (!target || !target.dataset.player || !target.dataset.round) {
        return;
      }

      const playerIdx = parseInt(target.dataset.player, 10);
      const roundIdx = parseInt(target.dataset.round, 10);
      const value = parseInt(target.value, 10) || 0;

      if (target.classList.contains("finish-order-input")) {
        players[playerIdx].scores[7] = value;
      } else {
        players[playerIdx].scores[roundIdx] = value;
      }
    });
  }

  if (calculateButton) {
    calculateButton.addEventListener("click", () => {
      updateScoreboard();
    });
  }
}

export function init() {
  setupEventListeners();
  updateWildCardDisplay();
}
