import { players, roundTypes } from "./index.js";
const SESSION_KEY = "card-scorer-session";
export function saveState() {
    try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(players));
    }
    catch (_a) {
        // Ignore storage errors.
    }
}
export function clearStoredState() {
    try {
        window.sessionStorage.removeItem(SESSION_KEY);
    }
    catch (_a) {
        // Ignore storage errors.
    }
}
export function loadStoredState() {
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
