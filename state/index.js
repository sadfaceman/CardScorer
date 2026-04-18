import { ROUND_TYPES } from "../constants/game.js";
export const roundTypes = [...ROUND_TYPES];
export const roundCount = ROUND_TYPES.length;
export const players = [];
export function createPlayer(name) {
    return {
        name,
        scores: Array.from({ length: roundCount }, () => 0),
    };
}
