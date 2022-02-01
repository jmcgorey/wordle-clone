export interface LetterResult {
	letter: string;
	status: "correct" | "match" | "wrong"; // Wordle uses "correct", "present", and "absent"
}

export interface GuessResult {
	status: GuessOutcomeState;
	results: Array<LetterResult>;
}

export type GuessOutcomeState =
	| "win"
	| "loss"
	| "continue"
	| "mismatched_length"
	| "not_in_list";
