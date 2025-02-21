import { Widget } from "scrivito";
import { ACTIVITY_ID, ACTIVITY_ID_DATA_ITEM_FIELD, ACTIVITY_ID_DATA_ITEM_FIELD_VALUE, ACTIVITY_ID_SOURCE, BACKWARD_BUTTON_TEXT, CONTACT_ID, CONTACT_ID_DATA_ITEM_FIELD, CONTACT_ID_DATA_ITEM_FIELD_VALUE, CONTACT_ID_SOURCE, CUSTOM_CLASS_NAMES, EXTERNAL_ID, FAILED_MESSAGE, FAILED_MESSAGE_TYPE, FAILED_MESSAGE_WIDGETS, FIXED_FORM_HEIGHT, FORM_HEIGHT, FORM_TYPE, FORWARD_BUTTON_TEXT, INCLUDE_EMPTY_ANSWERS, INPUT_TYPE, OVERSCROLL_BEHAVIOR, PREVIEW_FAILED_MESSAGE, PREVIEW_SUBBMITTED_MESSAGE, PREVIEW_SUBMITTING_MESSAGE, PROJECT_ID, PROJECT_ID_DATA_ITEM_FIELD, PROJECT_ID_DATA_ITEM_FIELD_VALUE, PROJECT_ID_SOURCE, QUESTIONNAIRE_ID, RETRY_BUTTON_ALIGNMENT, RETRY_BUTTON_TEXT, REVIEW_BUTTON_TEXT, REVIEW_CLOSE_BUTTON_TEXT, REVIEW_HEADER_TITLE, SCROLLBAR_WIDTH, SHOW_RETRY_BUTTON, SHOW_REVIEW, SHOW_REVIEW_FOOTER, SHOW_REVIEW_HEADER, SHOW_STEPS_IN_REVIEW, SINGLE_SUBMIT_BUTTON_ALIGNMENT, STEPS, SUBMIT_BUTTON_TEXT, SUBMITTED_MESSAGE, SUBMITTED_MESSAGE_TYPE, SUBMITTED_MESSAGE_WIDGETS, SUBMITTING_MESSAGE, SUBMITTING_MESSAGE_TYPE, SUBMITTING_MESSAGE_WIDGETS, TITLE } from "../../../constants/constants";
import { QuestionnaireManagementTab } from "../../../Components/QuestionnaireManagementTab/QuestionnaireManagementTab";

export const questionnaieEditingProperties = (widget: Widget) => {
	const fixedHeght = widget.get(FIXED_FORM_HEIGHT) as boolean || false;
	return [
		TITLE,
		INPUT_TYPE,
		CUSTOM_CLASS_NAMES,
		FIXED_FORM_HEIGHT,
		[FORM_HEIGHT, { enabled: fixedHeght }],
		[SCROLLBAR_WIDTH, { enabled: fixedHeght }],
		[OVERSCROLL_BEHAVIOR, { enabled: fixedHeght }]
	];
};

export const questionnaireEditingPropertiesGroups = (widget: Widget) => {
	const showSubmittingMessage = widget.get(SUBMITTING_MESSAGE_TYPE) !== "widget-list";
	const showSubmittedMessage = widget.get(SUBMITTED_MESSAGE_TYPE) !== "widget-list";
	const showFailedMessage = widget.get(FAILED_MESSAGE_TYPE) !== "widget-list";
	const showRetryButton = widget.get(SHOW_RETRY_BUTTON);
	const groups = [
		{
			title: "ID's",
			key: "QuestionnaireContainerIds",
			properties: [
				[EXTERNAL_ID, { enabled: false }],
				[QUESTIONNAIRE_ID, { enabled: false }],
			],
		},
		{
			title: "Answer Context",
			key: "QuestionnaireAnswerContext",
			properties: getContextProperties(widget as any),
		},
		{
			title: "Submission Messages",
			key: "FormStepContainerWidgetSubmissionMessages",
			properties: [
				SUBMITTING_MESSAGE_TYPE,
				showSubmittingMessage ? SUBMITTING_MESSAGE : SUBMITTING_MESSAGE_WIDGETS,
				PREVIEW_SUBMITTING_MESSAGE,
				SUBMITTED_MESSAGE_TYPE,
				showSubmittedMessage ? SUBMITTED_MESSAGE : SUBMITTED_MESSAGE_WIDGETS,
				PREVIEW_SUBBMITTED_MESSAGE,
				FAILED_MESSAGE_TYPE,
				showFailedMessage ? FAILED_MESSAGE : FAILED_MESSAGE_WIDGETS,
				SHOW_RETRY_BUTTON,
				[RETRY_BUTTON_TEXT, { enabled: showRetryButton }],
				[RETRY_BUTTON_ALIGNMENT, { enabled: showRetryButton }],
				PREVIEW_FAILED_MESSAGE
			]
		},
		{
			title: "Steps",
			key: "QuestionnaireSteps",
			properties: [STEPS]

		},
		{
			title: "Review",
			key: "FormReview",
			properties: getReviewProperties(widget as any)
		},
		{
			title: "Navigation area",
			key: "QuestionnaireNavigationButtons",
			properties: getNavigationProperties(widget as any)
		},
		{
			title: "PisaSales Questionnaire Management",
			key: "QuestionnaireBuilder",
			component: QuestionnaireManagementTab,
		},
	];

	return groups;
};


/**
 * Retrieves the properties for the navigation tab
 * @param {*} widget
 * @returns an array of strings containing the properties to be shown
 */
const getNavigationProperties = (widget: Widget): string[] => {
	const singleStepNavigationProps = [
		SUBMIT_BUTTON_TEXT,
		SINGLE_SUBMIT_BUTTON_ALIGNMENT
	];
	const MultiStepNavigationProps = [
		FORWARD_BUTTON_TEXT,
		BACKWARD_BUTTON_TEXT,
		SUBMIT_BUTTON_TEXT
	];
	if (widget.get(FORM_TYPE) == "single-step") {
		return singleStepNavigationProps;
	} else {
		return MultiStepNavigationProps;
	}
}

/**
 * Retrieves the properties for the review tab
 * @param {*} widget
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getReviewProperties(widget: Widget): string[] | any[] {
	const reviewPropsDisabled = [SHOW_REVIEW];
	const reviewPropsEnabled = [
		SHOW_REVIEW,
		REVIEW_BUTTON_TEXT,
		SHOW_STEPS_IN_REVIEW,
		INCLUDE_EMPTY_ANSWERS,
		SHOW_REVIEW_HEADER,
		[REVIEW_HEADER_TITLE, { enabled: widget.get(SHOW_REVIEW_HEADER) }],
		SHOW_REVIEW_FOOTER,
		[REVIEW_CLOSE_BUTTON_TEXT, { enabled: widget.get(SHOW_REVIEW_FOOTER) }]
	];
	return widget.get(SHOW_REVIEW) ? reviewPropsEnabled : reviewPropsDisabled;
}

const getContextProperties = (widget: Widget) => {
	const activityIdSource = widget.get(ACTIVITY_ID_SOURCE);
	const projectIdSource = widget.get(PROJECT_ID_SOURCE);
	const contactIdSource = widget.get(CONTACT_ID_SOURCE);
	const activityIdProps = [ACTIVITY_ID_SOURCE];
	const projectIdProps = [PROJECT_ID_SOURCE];
	const contactIdProps = [CONTACT_ID_SOURCE];
	if (activityIdSource == "manual") {
		activityIdProps.push(ACTIVITY_ID);
	} else {
		activityIdProps.push(ACTIVITY_ID_DATA_ITEM_FIELD, [ACTIVITY_ID_DATA_ITEM_FIELD_VALUE, { enabled: false }] as any);
	}
	if (projectIdSource == "manual") {
		projectIdProps.push(PROJECT_ID);
	} else {
		projectIdProps.push(PROJECT_ID_DATA_ITEM_FIELD, [PROJECT_ID_DATA_ITEM_FIELD_VALUE, { enabled: false }] as any);
	}
	if (contactIdSource == "manual") {
		contactIdProps.push(CONTACT_ID);
	} else {
		contactIdProps.push(CONTACT_ID_DATA_ITEM_FIELD, [CONTACT_ID_DATA_ITEM_FIELD_VALUE, { enabled: false }] as any);
	}

	const props = [...activityIdProps, ...contactIdProps, ...projectIdProps]
	return props;
}
