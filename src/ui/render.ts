import { players, roundTypes } from "../state/index.js";
import { calculateScore, getMaxPoints, getWildCardCount } from "../score/index.js";
import { ROUND_LABELS } from "./constants.js";

const headerRow = document.getElementById(
  "header-row",
) as HTMLTableRowElement | null;
const scoreRows = document.getElementById(
  "score-rows",
) as HTMLTableSectionElement | null;

export function updateHeader() {
  if (!headerRow) {
    return;
  }

  headerRow.innerHTML = "<th>R</th>";
  players.forEach((p) => {
    headerRow.innerHTML += `<th>${p.name}</th>`;
  });
}

export function updateWildCardDisplay() {
  const wildCardInfo = document.getElementById("wildcard-info");
  if (!wildCardInfo) {
    return;
  }

  const wildCount = getWildCardCount(players.length);
  wildCardInfo.textContent =
    wildCount > 0 ? `Wild cards to add: ${wildCount}` : "No wild cards needed.";
}

export function updateScoreboard() {
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