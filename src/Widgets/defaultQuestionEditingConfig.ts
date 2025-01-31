import { titleValidation } from "../utils/validations/titleValidation";

export const defaultAttributes = {
	text: { title: "Question title" },
	mandatory: { title: "Mandatory" },
	identifier: { title: "Identifier" },
	help: { title: "Help text" },
	defaultValue: { title: "Default Value" },
	position: { title: "Position" },
	externalId: { title: "External ID" },
	questionId: { title: "QuestionId ID (GID)" },

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
	"text",
	"help",
	"defaultValue",
	"identifier",
	"mandatory",
	["position", { enabled: false }]
] as const;

export const defaultValidations = [
	titleValidation,
] as const;