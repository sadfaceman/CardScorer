import { players, roundTypes, createPlayer } from "./index.js";

const SESSION_KEY = "card-scorer-session";

export function saveState() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(players));
  } catch {
    // Ignore storage errors.
  }
}

export function clearStoredState() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function loadStoredState() {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (!stored) {
      return;
    }

    const data = JSON.parse(stored) as Array<unknown>;
    if (!Array.isArray(data)) {
      return;
    }

    players.splice(0, players.length);

    data.forEach((item) => {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof (item as any).name !== "string" ||
        !Array.isArray((item as any).scores)
      ) {
        return;
      }

      const scores = (item as any).scores.map((value: unknown) =>
        typeof value === "number" ? value : Number(value) || 0,
      );
      const normalizedScores = Array.from(
        { length: roundTypes.length },
        (_, idx) => scores[idx] || 0,
      );

      players.push({
        name: (item as any).name,
        scores: normalizedScores,
      });
    });
  } catch {
    // Ignore invalid stored data.
  }
}
