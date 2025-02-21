import { DEFAULT_VALUE, HELP, IDENTIFIER, MANDATORY, POSITION, TEXT } from "../constants/constants";
import { titleValidation } from "../utils/validations/titleValidation";
import { typeValidation } from "../utils/validations/typeValidation";

export const defaultAttributes = {
	text: { title: "Question Title" },
	mandatory: { title: "Mandatory" },
	identifier: { title: "Identifier" },
	help: { title: "Help Text" },
	defaultValue: { title: "Default Value" },
	position: { title: "Position" },
	externalId: { title: "External ID" },
	questionId: { title: "Question ID (GID)" },

} as const;

export const defaultInitialContent = {
	questionId: null,
	externalId: null,
	position: null,
	text: "Question title",
	mandatory: false,
	help: "",
	defaultValue: "",
	identifier: "",
} as const;

export const defaultProperties = [
	TEXT,
	HELP,
	DEFAULT_VALUE,
	IDENTIFIER,
	MANDATORY,
	[POSITION, { enabled: false }]
] as const;

export const defaultValidations = [
	titleValidation,
	typeValidation
] as const;