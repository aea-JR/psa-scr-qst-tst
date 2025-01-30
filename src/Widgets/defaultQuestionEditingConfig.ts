import { titleValidation } from "../utils/validations/titleValidation";

export const defaultAttributes = {
	title: { title: "Question title" },
	required: { title: "Mandatory" },
	identifier: { title: "Identifier" },
	helpText: { title: "Help text" },
	defaultValue: { title: "Default Value" },
	position: { title: "Position" },
	externalId: { title: "External ID" },
	questionId: { title: "QuestionId ID (GID)" },

} as const;

export const defaultInitialContent = {
	questionId: null,
	externalId: null,
	position: null,
	title: "Question title",
	required: false,
	helpText: "",
	defaultValue: "",
	identifier: "",
} as const;

export const defaultProperties = [
	"title",
	"helpText",
	"defaultValue",
	"identifier",
	"required",
	["position", { enabled: false }]
] as const;

export const defaultValidations = [
	titleValidation,
] as const;