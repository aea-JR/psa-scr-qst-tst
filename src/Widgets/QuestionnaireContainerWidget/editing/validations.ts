import { Widget } from "scrivito";
import { FAILED_MESSAGE, INPUT_TYPE, SUBMITTED_MESSAGE, SUBMITTING_MESSAGE, TITLE } from "../../../constants/constants";
import { isUsageRestricted } from "../../../utils/isRestricted";
import { isEmpty } from "../../../utils/lodashPolyfills";
import { getQuestionWidgets } from "../../../utils/getQuestionWidgets";
import { getQuestionnaireContainerWidget } from "../../../utils/getQuestionnaireContainerWidget";
import { hasContext } from "../../../utils/hasContext";

export const questionnaireContainerEditingValidations = [
	(widget: Widget) => {
		if (getQuestionnaireContainerWidget(widget)) {
			return "Needs to be outside of a PisaSales form.";
		}
		const questions = getQuestionWidgets(widget);
		if (isEmpty(questions)) {
			return "The questionnaie must include at least one question.";
		}
		if (isUsageRestricted(widget)) {
			return "This questionnaire can not be used on a public site. Please move it to a restricted site.";
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
		SUBMITTING_MESSAGE,
		(submittingMessage: string) => {
			if (!submittingMessage) {
				return "Specify the message to be displayed during form submission.";
			}
		},
	],
	[
		SUBMITTED_MESSAGE,
		(submittedMessage: string) => {
			if (!submittedMessage) {
				return "Specify the message to be displayed after successful form submission.";
			}
		},
	],
	[
		FAILED_MESSAGE,
		(failedMessage: string) => {
			if (!failedMessage) {
				return "Specify the message to be displayed after form submission failed.";
			}
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
] as const;