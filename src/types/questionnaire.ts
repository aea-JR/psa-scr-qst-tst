export interface Question {
	externalId: string;
	text?: string;
	type?: string;
	mandatory?: boolean;
	position: number;
	help?: string;
	defaultValue?: string;
	identifier?: string;

}

export interface AnswerOption {
	text: string;
	identifier: string;
	//type: string;
	externalId: string;
	position: number;
}

export interface QuestionnaireMeta {
	externalId: string;
	inputType: string;
	title: string;
}

export interface AnswerContext {
	activityId: string;
	contactId: string;
	projectId: string;
}

export interface Answer {
	questionId: string;
	value: string[];
	valueIdentifier: string[];
	updatedAt: string;
}

export interface QuestionnaireMetaSnapshot {
	qstMeta: {
		title: string;
		inputType: string;
		origin: string;
	};
	questions: { [key: string]: Question };
	options: { [questionId: string]: { [optionId: string]: AnswerOption } };
}

export type QuestionnaireStatus = "unconfiguredUrl" | "offline" | "inCreation" | "invalid" | "pendingUpdate" | "creationPending" | "updating" | "void" | "noFormContext";
