export interface Result {
	letter: string;
	status: "correct" | "match" | "wrong"; // Wordle uses "correct", "present", and "absent"
}

export type GameState = "win" | "loss" | "in_progress";
