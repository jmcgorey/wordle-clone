import { getRandomWord, isWordInList } from "./words.js";
import { GameState, Result } from "../types.js";

export default class Game {
	targetWord;
	numAttempts = 0;
	maxAttempts = 6;

	constructor(numLetters: number, maxAttempts: number) {
		this.targetWord = getRandomWord(numLetters);

		console.log("Target Word Is: ", this.targetWord);
	}

	public guess(word: string) {
		if (word.length !== this.targetWord.length) {
			return "The word lengths are mismatched";
		}
		if (!isWordInList(word)) {
			return "Word not in list!";
		}
		this.numAttempts++;

		const results = this.compareGuessToTarget(word);

		console.log("Results: ", results);

		const state = this.calcGameState(results);
		if (state === "win") {
			console.log("You Win!");
		} else if (state === "loss") {
			console.log("You Lose!");
		} else {
			console.log("Keep Guessing!");
		}
	}

	private compareGuessToTarget(guess: string): Array<Result> {
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

	private calcGameState(results: Array<Result>): GameState {
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
			return "in_progress";
		}
	}
}
