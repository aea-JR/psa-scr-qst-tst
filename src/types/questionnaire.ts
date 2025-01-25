export interface Question {
	externalId: string;
	text?: string;
	type?: string;
	required?: boolean;
	help?: string;
	defaultValue?: string;
	identifier?: string;

}

export interface AnswerOption {
	text: string;
	identifier: string;
	//type: string;
	externalId: string;
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