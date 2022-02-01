import { getRandomWord, isWordInList } from "./words.js";
import { GuessResult, GuessOutcomeState, LetterResult } from "../types.js";

export default class Game {
	targetWord;
	numAttempts = 0;
	maxAttempts = 6;

	constructor(numLetters: number, maxAttempts: number) {
		this.targetWord = getRandomWord(numLetters);

		console.log("Target Word Is: ", this.targetWord);
	}

	public guess(word: string): GuessResult {
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
			return {
				status: "win",
				results: results
			};
		} else if (state === "loss") {
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
