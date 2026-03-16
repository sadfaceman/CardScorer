export const ROUND_TYPES = [
    "sets",
    "clubs",
    "facecards",
    "queens",
    "special",
    "lastset",
    "pilling",
    "finishorder",
];
export const roundTypes = [...ROUND_TYPES];
export const roundCount = ROUND_TYPES.length;
export const players = [];
export function createPlayer(name) {
    return {
        name,
        scores: Array.from({ length: roundCount }, () => 0),
    };
}
