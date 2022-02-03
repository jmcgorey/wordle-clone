const WORDS = [
	"A",
	"I",
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
	"VIDEO",
	'TURKEY',
	'MEGHAN',
	'BREAKS',
	'SECOND'
];

export function getRandomWord(numLetters?: number) {
	let filteredWords = WORDS;
	if (numLetters) {
		filteredWords = WORDS.filter((w) => w.length === numLetters);
	}

	return getRandomValueFromList(filteredWords);

	function getRandomValueFromList(list: Array<any>) {
		const len = list.length;
		const index = Math.floor(Math.random() * len);
		return list[index];
	}
}

export function isWordInList(word: string) {
	return WORDS.includes(word);
}
