export const titleValidation = [
	"title",
	(title: string) => {
		if (!title) return "Title can not be empty.";
	},
];
