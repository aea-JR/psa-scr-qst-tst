import { isEmpty, isString } from "lodash-es";
import { Widget } from "scrivito";
import { QuestionnaireMetaSnapshot } from "../types/questionnaire";
import { extractQuestionsAndOptions } from "./extractQuestionsAndOptions";
import { ANSWER_OPTION_ID, CREATION_DATA, DEFAULT_VALUE, HELP, IDENTIFIER, INPUT_TYPE, MANDATORY, OPTIONS, POSITION, QUESTION_ID, QUESTIONNAIRE_ID, TEXT, TITLE, TYPE } from "../constants/constants";

export const compareQuestionnaireMeta = (widget: Widget): boolean => {
	const jsonMeta = widget.get(CREATION_DATA) as string;
	const qstId = widget.get(QUESTIONNAIRE_ID) as string;
	if (isEmpty(qstId)) {
		// not created yet!
		return false;
	}
	if (isEmpty(jsonMeta) || !isString(jsonMeta)) {
		console.log("Invalid questionnaire meta.");
		return false;
	}

	const storedMeta: QuestionnaireMetaSnapshot = JSON.parse(jsonMeta);
	const title = widget.get(TITLE) as string;
	const inputType = widget.get(INPUT_TYPE) as string;

	// Check if title or inputType changed
	if (title !== storedMeta.qstMeta.title || inputType !== storedMeta.qstMeta.inputType) {
		console.log("Qst meta changed");
		return true;
	}

	// Extract current questions and options
	const { questions, questionWidgets, answerOptions, optionWidgets } = extractQuestionsAndOptions(widget);

	// Convert stored questions/options into objects for easy comparison
	const storedQuestions = storedMeta.questions;
	const storedOptions = storedMeta.options;

	// Check if number of questions changed
	if (questionWidgets.length !== Object.keys(storedQuestions).length) {
		console.log("Question count changed");
		return true;
	}
	// Check if number of options changed
	const storedOptionCount = Object.values(storedOptions).reduce(
		(count, options) => count + Object.keys(options).length,
		0
	);
	if (optionWidgets.length !== storedOptionCount) {
		console.log("Answer option count changed");
		return true;
	}

	// Compare each question's attributes and options
	for (const question of questionWidgets) {
		const questionId = question.get(QUESTION_ID) as string;
		if (!questionId) {
			return true;
		}
		const storedQuestion = storedQuestions[questionId];

		// If the questionId is not found in storedMeta, it's a new question
		if (!storedQuestion) {
			console.log(`New question added: ${questionId}`);
			return true;
		}

		// Compare relevant attributes
		if (
			storedQuestion.text !== question.get(TEXT) ||
			storedQuestion.identifier !== question.get(IDENTIFIER) ||
			storedQuestion.mandatory !== question.get(MANDATORY) ||
			storedQuestion.help !== question.get(HELP) ||
			storedQuestion.defaultValue !== question.get(DEFAULT_VALUE) ||
			storedQuestion.type !== question.get(TYPE) ||
			storedQuestion.position !== question.get(POSITION)
		) {
			console.log(`Question changed: ${questionId}`);
			return true;
		}

		// Compare associated answer options if there are some
		if (question.objClass() != "SelectQuestionWidget") {
			continue;
		}
		const currentOptions = question.get(OPTIONS) as Widget[];
		const storedQuestionOptions = storedOptions[questionId] || {};

		// Check if the number of options changed
		if (currentOptions.length !== Object.keys(storedQuestionOptions).length) {
			console.log(`Option count changed for question: ${questionId}`);
			return true;
		}

		// Compare each option's attributes
		for (const option of currentOptions) {
			const optionId = option.get(ANSWER_OPTION_ID) as string;
			if (!optionId) {
				return true;
			}
			const storedOption = storedQuestionOptions[optionId];

			// If the optionId is not found in storedMeta, it's a new option
			if (!storedOption) {
				console.log(`New answer option added: ${optionId}`);
				return true;
			}

			// Compare relevant attributes
			if (
				storedOption.identifier !== option.get(IDENTIFIER) ||
				storedOption.text !== option.get(TEXT) ||
				storedOption.position !== option.get(POSITION)
			) {
				console.log(`Answer option changed: ${optionId}`);
				return true;
			}
		}
	}

	// If no differences were found
	return false;
};
