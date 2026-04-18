export type RoundType =
  | "sets"
  | "clubs"
  | "facecards"
  | "queens"
  | "special"
  | "lastset"
  | "pilling"
  | "finishorder";

export interface Player {
  name: string;
  scores: number[];
}
