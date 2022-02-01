import { getRandomWord, isWordInList } from "./words.js";
import { GuessResult, GuessOutcomeState, LetterResult } from "../types.js";

export default class Game {
	private targetWord;
	private numAttempts = 0;
	private maxAttempts = 6;
	private isGameOver = false;

	/* --------------------------------------------------------
	 * Properties
	 * -------------------------------------------------------- */
	public getAttemptNumber() {
		return this.numAttempts;
	}

	public getMaxAttempts() {
		return this.maxAttempts;
	}

	/* --------------------------------------------------------
	 * Constructor(s)
	 * -------------------------------------------------------- */
	constructor(numLetters: number, maxAttempts?: number) {
		// Generate the Word
		this.targetWord = getRandomWord(numLetters);

		// Set up the other details
		if (maxAttempts) {
			this.maxAttempts = maxAttempts;
		}
	}
	/* --------------------------------------------------------
	 * Public Methods
	 * -------------------------------------------------------- */

	/**
	 * Checks the user's guess against the target word and uses the
	 * results to calculate the game state.
	 *
	 * @param word The guess that the user entered
	 * @returns An object containing the results for the user's guess
	 * 			and a string containing the game state
	 */
	public guess(word: string): GuessResult {
		if (this.isGameOver) {
			return {
				status: "game_over",
				results: undefined
			};
		}
		if (word.length !== this.targetWord.length) {
			return {
				status: "mismatched_length",
				results: undefined
			};
		}
		if (!isWordInList(word)) {
			return {
				status: "not_in_list",
				results: undefined
			};
		}
		this.numAttempts++;

		const results = this.compareGuessToTarget(word);
		const state = this.calcGameState(results);
		if (state === "win") {
			this.isGameOver = true;
			return {
				status: "win",
				results: results
			};
		} else if (state === "loss") {
			this.isGameOver = true;
			return {
				status: "loss",
				results: results
			};
		} else {
			return {
				status: "continue",
				results: results
			};
		}
	}

	/* --------------------------------------------------------
	 * Private Methods
	 * -------------------------------------------------------- */

	/**
	 * Compares the user's guess against the target word, returning a result
	 * for each letter.  The letter can have a status of 'correct', 'match',
	 * or 'wrong'.
	 *
	 * If 'correct', the guess and target word share the letter at that location
	 *
	 * If 'match', the letter is present in the target word, but not at the
	 * guessed location.
	 *
	 * If 'wrong', the letter is not present in the target word at all.
	 *
	 * @param guess The word the user guessed
	 * @returns	An array of LetterResults detailing how the guess matched up
	 * 			against the target word
	 */
	private compareGuessToTarget(guess: string): Array<LetterResult> {
		const results = [];
		const guessLen = guess.length;
		for (let i = 0; i < guessLen; i++) {
			let result;
			if (guess[i] === this.targetWord[i]) {
				result = "correct";
			} else if (this.targetWord.indexOf(guess[i]) !== -1) {
				result = "match";
			} else {
				result = "wrong";
			}
			results.push({ letter: guess[i], status: result });
		}
		return results;
	}

	/**
	 * Calculates the game state based on how the guess matched up to the
	 * target word.
	 *
	 * @param results	The results of how the guess matched the target
	 * @returns	A string stating whether the game is over or if the user can
	 * 			continue guessing.
	 */
	private calcGameState(results: Array<LetterResult>): GuessOutcomeState {
		let numCorrect = 0;
		let numResults = results.length;
		for (let i = 0; i < numResults; i++) {
			if (results[i].status === "correct") numCorrect++;
		}

		if (numCorrect === this.targetWord.length) {
			return "win";
		} else if (this.numAttempts >= this.maxAttempts) {
			return "loss";
		} else {
			return "continue";
		}
	}
}
