import { Widget } from "scrivito";
import { IDENTIFIER, QUESTIONNNAIRE_ANSWER_OPTION_WIDGET } from "../../constants/constants";
import { isIdentifierUnique } from "../isIdentifierUnique";

export const identifierValidation = [
	IDENTIFIER,
	(identifier: string, { widget }: { widget: Widget }) => {
		const isAnswerOption = widget.objClass() === QUESTIONNNAIRE_ANSWER_OPTION_WIDGET;

		if (!isIdentifierUnique(widget, isAnswerOption ? "option" : "question")) {
			return `Specify a unique Identifier. There is at least one other ${isAnswerOption ? "option" : "question"} with the same Identfier.`;
		}

		if (identifier && !/^[A-Z0-9_]+$/.test(identifier)) {
			return "Specifiy a valid identifier! Follow the CRM Schema (A-Z0-9_)";
		}
		if (identifier.length > 32) {
			return "Maximum identifier character length of 32 exceeded!";
		}
	},
] as const;