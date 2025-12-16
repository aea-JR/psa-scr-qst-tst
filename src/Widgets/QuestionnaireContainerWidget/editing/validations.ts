import { Widget } from "scrivito";
import { INPUT_TYPE, QUESTIONNAIRE_STATUS, TITLE } from "../../../constants/constants";
import { isEmpty } from "../../../utils/lodashPolyfills";
import { getQuestionWidgets } from "../../../utils/getQuestionWidgets";
import { getQuestionnaireContainerWidget } from "../../../utils/getQuestionnaireContainerWidget";
import { hasContext } from "../../../utils/hasContext";

export const questionnaireContainerEditingValidations = [
	(widget: Widget) => {
		if (getQuestionnaireContainerWidget(widget)) {
			return "Needs to be outside of a Questionnaire form.";
		}
		const questions = getQuestionWidgets(widget);
		if (isEmpty(questions)) {
			return "The questionnaie must include at least one question.";
		}
		if (!hasContext(widget)) {
			return 'Specify at least one activity, contact or project ID in the “Answer Context” properties tab.';
		}
		return null;
	},
	[
		TITLE,
		(title: string) => {
			if (isEmpty(title)) { return "Title can not be empty."; }
			return null;
		},
	],
	[
		INPUT_TYPE,
		(inputType: string) => {
			if (!inputType) {
				return "Specify the Response Mode.";
			}

		},
	],
	[
		QUESTIONNAIRE_STATUS,
		(questionnaireStatus: string) => {
			if (questionnaireStatus == "creationPending") {
				return "This questionnaire has not been created in the backend yet.";
			}
			if (questionnaireStatus == "invalid") {
				return "Some attributes are invalid. Please review and correct them.";
			}
			if (questionnaireStatus == "pendingUpdate") {
				return "This questionnaire has unsaved local changes, please push the updates from the properties tab.";
			}
		},
	],
] as const;