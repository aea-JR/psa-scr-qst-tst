import { REPEATABLE } from "../../../constants/constants";
import generateId from "../../../utils/idGenerator";
import { QuestionnaireInputQuestionWidget } from "../../InputQuestionWidget/InputQuestionWidgetClass";
import { QuestionnaireStepWidget } from "../../QuestionnaireStepWidget/QuestionnaireStepWidgetClass";

export const initialQuestionnaireContent = {
	steps: [new QuestionnaireStepWidget({
		isSingleStep: true,
		content: [
			new QuestionnaireInputQuestionWidget({})
		]
	})],
	externalId: () => generateId(),
	questionnaireId: null,
	title: "Scrivito Questionnaire",
	inputType: REPEATABLE,
	isBeingCopied: false,
	singleSubmitButtonAlignment: "text-center",
	forwardButtonText: "Forward",
	backwardButtonText: "Backward",
	submitButtonText: "Submit",
	// submitting stuff
	submittingMessage: "Submitting...",
	submittedMessage:
		"Your message has been successfully sent. Thank you for your request. We will get back to you as soon as possible.",
	failedMessage:
		"We are sorry, your request could not be completed. Please try again later.",
	submittingMessageType: "default",
	submittedMessageType: "default",
	failedMessageType: "default",
	previewSubmittingMessage: false,
	previewSubmittedMessage: false,
	previewFailedMessage: false,
	showRetryButton: false,
	retryButtonText: "Retry",
	retryButtonAlignment: "text-center",
	fixedFormHeight: false,
	formHeight: 35,
	scrollbarWidth: "default",
	overscrollBehavior: "default",
	showReview: false,
	includeEmptyAnswers: false,
	showStepsInReview: false,
	showReviewHeader: false,
	showReviewFooter: false,
	reviewButtonText: "Review",
	reviewHeaderTitle: "Review",
	reviewCloseButtonText: "Close",
	activityIdSource: "manual",
	contactIdSource: "manual",
	projectIdSource: "manual",
	questionnaireStatus: "void",
	location: "",
	buttonsSize: "btn-md",
	buttonsStyle: "btn-primary",
} 