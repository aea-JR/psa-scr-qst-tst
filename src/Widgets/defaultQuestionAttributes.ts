export const defaultQuestionAttributes = {
	text: 'string',
	mandatory: "boolean",
	help: "string",
	externalId: "string",
	defaultValue: "string",
	identifier: "string",
	position: "integer",
	questionId: "string",
	alignment: [
		"enum", {
			values: ["left", "center", "right"]
		}
	],
	validationText: "string",
} as const;