import Game from "./modules/game.js";

const WORD_INPUT_ID = "word-input";
const SUBMIT_BUTTON_ID = "form-submit-btn";

let game = new Game(5, 6);

interface ElementMap {
	"word-input"?: HTMLInputElement;
	"form-submit-btn"?: HTMLButtonElement;
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
	const wordInput = document.getElementById(WORD_INPUT_ID);
	wordInput.addEventListener("input", function (event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.toUpperCase();
		if (input.value.length < 5) {
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

	game.guess(enteredWord);

	// Clean up
	wordInput.value = "";
	enableSubmitButton(false);
}

function enableSubmitButton(disabled: boolean) {
	const submitButton = document.getElementById(
		SUBMIT_BUTTON_ID
	) as HTMLButtonElement;
	submitButton.disabled = !disabled;
}

setupControls();
