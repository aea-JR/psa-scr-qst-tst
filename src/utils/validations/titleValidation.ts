export const titleValidation = [
	"text",
	(text: string) => {
		if (!text) return "Title can not be empty.";
	},
];
