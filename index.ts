const WORD_INPUT_ID = "word-input";
const SUBMIT_BUTTON_ID = "form-submit-btn";
const WORDS = [
	"APPLE",
	"GREEN",
	"BAGLE",
	"PHONE",
	"DODGE",
	"CLIFF",
	"MOUNT",
	"SUGAR",
	"PROXY",
	"TROVE",
	"KNOLL",
	"BOXES",
	"PIANO",
	"QUERY",
	"TACOS",
	"VIDEO"
];

let targetWord = "PIANO";

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

	console.log("Entered Word: ", enteredWord);
	console.log("Target Word: ", targetWord);

	const letters = [];
	const enteredLen = enteredWord.length;
	for (let i = 0; i < enteredLen; i++) {
		let result;
		if (enteredWord[i] === targetWord[i]) {
			result = "MATCH";
		} else if (targetWord.indexOf(enteredWord[i]) !== -1) {
			result = "WRONG_LOC";
		} else {
			result = "INVALID";
		}
		letters.push({ letter: enteredWord[i], status: result });
	}

	console.log("Results: ", letters);

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
