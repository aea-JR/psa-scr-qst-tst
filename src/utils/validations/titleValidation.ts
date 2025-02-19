import { TEXT } from "../../constants/constants";

export const titleValidation = [
	TEXT,
	(text: string) => {
		if (!text) return "Title can not be empty.";
	},
];
