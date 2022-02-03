import Game from "./modules/game.js";
import { LetterResult, ElementMap } from "./types.js";

const WORD_INPUT_ID = "word-input";
const SUBMIT_BUTTON_ID = "form-submit-btn";

let game;

/* --------------------------------------------------------
* Setup
* -------------------------------------------------------- */
initGame();
setupBoard();
setupControls();

/* --------------------------------------------------------
 * Helper Functions
 * -------------------------------------------------------- */

function initGame() {
	game = new Game();
}

/**
 * Creates the table based on the number of letters in the target word and the
 * max number of attempts for the game.
 */
function setupBoard() {
	const numLettersInWord = game.getWordLength();
	const maxAttempts = game.getMaxAttempts();

	// Create table element
	const table = document.createElement('table');

	for (let i = 0; i < maxAttempts; i++) {
		// For each number of attempts, add a row to the table
		const row = document.createElement('tr');
		row.id = `r${i}`;
		for (let j = 0; j < numLettersInWord; j++) {
			// For each letter in the target word, add a cell to the row
			const cell = document.createElement('td');
			cell.id = `r${i}-c${j}`
			row.appendChild(cell);
		}
		table.appendChild(row);
	}

	// Add the table to the DOM
	const boardContainer = document.getElementById('game-board');
	boardContainer.appendChild(table);
}

function setupControls() {
	// Attach form submission handler
	const form = document.getElementById("game-input-form");
	form.addEventListener("submit", function (event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const elements = form.elements;
		const elementMap = {};
		for (const e in elements) {
			const elementId = elements[e].id;
			elementMap[elementId] = elements[e];
		}

		// Process the form
		processTurn(elementMap);
	});

	// Attach oninput event handler to word enter
	const wordInput = document.getElementById(WORD_INPUT_ID) as HTMLInputElement;
	const wordLength = game.getWordLength();
	wordInput.maxLength = wordLength; 
	wordInput.placeholder = `Enter a ${wordLength}-letter word`;
	wordInput.pattern = `[A-Z]{${wordLength}}`;
	wordInput.addEventListener("input", function (event) {
		const input = event.target as HTMLInputElement;
		const numLettersInWord = game.getWordLength();
		input.value = input.value.toUpperCase();
		if (input.value.length < numLettersInWord) {
			enableSubmitButton(false);
		} else {
			enableSubmitButton(true);
		}
	});

	// Start the submit button off as disabled
	enableSubmitButton(false);
}

function processTurn(elementMap: ElementMap) {
	const wordInput = elementMap[WORD_INPUT_ID];
	const enteredWord = wordInput.value;

	const attemptNumber = game.getAttemptNumber();
	const r = game.guess(enteredWord);
	const results = r.results;

	// Check for word not in the word list case
	if (r.status === 'not_in_list') {
		const message = `"${enteredWord}" is not in the word list.`;
		notifyUser(message);
	}
	// Check for mismatched length
	if (r.status === 'mismatched_length') {
		const message = `"${enteredWord}" is not the same length as the target word.`;
		notifyUser(message);
	}

	// Check for game over
	if (r.status === 'game_over') {
		const message = `The game is over. Refresh the page to play another one.`;
		notifyUser(message);
	}

	// Update the Table
	if (Array.isArray(results) && results.length > 0) {
		updateTable(results, attemptNumber);
	}

	// Check for win
	if (r.status === 'win') {
		notifyUser('You win!');
	}

	// Check for loss
	if (r.status === 'loss') {
		notifyUser('Better luck next time!');
	}

	// TODO Update (eventual) keyboard/letter tracking state

	// Reset word entry state
	wordInput.value = "";
	enableSubmitButton(false);
}

function updateTable(results: Array<LetterResult>, attemptNumber: number) {
	const numResults = results.length;
	for (let i = 0; i < numResults; i++) {
		const result = results[i];
		const selector = `[id="r${attemptNumber}-c${i}"]`;
		const cell = document.querySelector(selector) as HTMLTableCellElement;
		cell.innerText = result.letter;
		cell.dataset.letter = result.letter;
		cell.dataset.status = result.status;
	}
}

function enableSubmitButton(disabled: boolean) {
	const submitButton = document.getElementById(
		SUBMIT_BUTTON_ID
	) as HTMLButtonElement;
	submitButton.disabled = !disabled;
}

function notifyUser(message: string, variant?: string): void {
	if (!variant) {
		variant = 'info';
	}
	// Create a toast message and hide it after a few seconds
	console.log(message);
	const toastContainer = document.getElementById('toast-container');
	toastContainer.innerHTML = `
		<div class="toast toast-${variant}">
			<span>${message}</span>
		</div>
	`;

	const timeout = setTimeout(() => {
		console.log('Removing toast');
		toastContainer.innerHTML = '';
	}, 2000);
}
