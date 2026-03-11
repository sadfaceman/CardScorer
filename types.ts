export type RoundType =
  | "sets"
  | "clubs"
  | "facecards"
  | "queens"
  | "special"
  | "lastset"
  | "pilling";

export interface Player {
  name: string;
  scores: number[];
  finishOrders: number[];
}
