import { ONCE_UPDATABLE, REPEATABLE } from "../../../constants/constants";

export const questionnaireEditingAttributes = {
	title: {
		title: "Title",
	},
	externalId: {
		title: "External ID",
		description: "The external id reference to the Questionnaire GID.",
	},
	questionnaireId: {
		title: "Questionnaire ID (GID)",
	},

	inputType: {
		title: "Response Mode",
		description: "Defines how answers are handled. “Multiple Submissions” creates a new answer set for each submission, while “Single Submission with Edits” allows modifying a single answer set.",
		values: [
			{ value: REPEATABLE, title: "Multiple Submissions" },
			{ value: ONCE_UPDATABLE, title: "Single Submission with Edits" },
		],
	},
	activityId: { title: "Activity ID" },
	projectId: { title: "Project ID", description: "Can be either a project GID or a project number" },
	contactId: { title: "Contact ID", description: "Can be either a contact GID or a contact number" },

	customClassNames: {
		title: "Additional CSS Classes",
		description:
			"Specify additional CSS class names to be added to the main container of the Questionnaire. Separate multiple class names with spaces.",
	},

	submittingMessage: {
		title: "Message shown while the form is being submitted",
	},
	submittedMessage: {
		title: "Message shown after the form was successfully submitted",
	},
	failedMessage: {
		title: "Message shown if the form submission failed",
	},
	failedMessageType: {
		title: "Submission failure message type",
		description:
			"Select the type of failure message displayed upon submission failure.",
		values: [
			{ value: "default", title: "Default text" },
			{ value: "widget-list", title: "Custom content" },
		],
	},
	submittedMessageType: {
		title: "Submission success message type",
		description:
			"Select the type of message displayed after successful form submission.",
		values: [
			{ value: "default", title: "Default text" },
			{ value: "widget-list", title: "Custom content" },
		],
	},
	submittingMessageType: {
		title: "Submitting message type",
		description:
			"Select the type of message displayed while the form is being submitted.",
		values: [
			{ value: "default", title: "Default text" },
			{ value: "widget-list", title: "Custom content" },
		],
	},
	failedMessageWidgets: {
		title: "Submission failure content",
		description:
			"Customize the content to be displayed upon submission failure.",
	},
	submittedMessageWidgets: {
		title: "Submission success content",
		description:
			"Customize the content to be displayed after successful form submission.",
	},
	submittingMessageWidgets: {
		title: "Submitting content",
		description:
			"Customize the content to be displayed while the form is being submitted.",
	},
	previewFailedMessage: {
		title: "Preview failed message/content",
		description: "Preview the failure message or content in edit mode.",
	},
	previewSubmittedMessage: {
		title: "Preview success message/content",
		description: "Preview the success message or content in edit mode.",
	},
	previewSubmittingMessage: {
		title: "Preview submitting message/content",
		description:
			"Preview the message or content displayed while the form is being submitted in edit mode.",
	},
	showRetryButton: { title: "Show retry button" },
	retryButtonText: { title: "Retry button text" },
	retryButtonAlignment: {
		title: "Retry button alignment",
		values: [
			{ value: "left", title: "Left" },
			{ value: "text-center", title: "Center" },
			{ value: "text-end", title: "Right" },
			{ value: "block", title: "Full width" },
		],
	},

	hiddenFields: {
		title: "Hidden fields",
	},
	forwardButtonText: {
		title: "Forward button text",
	},
	backwardButtonText: {
		title: "Backward button text",
	},
	submitButtonText: {
		title: "Submit button text",
	},

	singleSubmitButtonAlignment: {
		title: "Alignment",
		values: [
			{ value: "left", title: "Left" },
			{ value: "text-center", title: "Center" },
			{ value: "text-end", title: "Right" },
			{ value: "block", title: "Full width" },
		],
	},
	fixedFormHeight: {
		title: "Enable fixed height",
		description: "Manually set the form height."

	},
	overscrollBehavior: {
		title: "Overscroll behavior",
		description: "Select how overscrolling should behave, i.e. it scrolls also the container.",
		values: [
			{ value: "default", title: "Default" },
			{ value: "none", title: "No scroll" }
		]
	},
	formHeight: {
		title: "Form height",
		description: "Enter the height of the form content in em."
	},
	scrollbarWidth:
	{
		title: "Scrollbar width",
		description: 'The width of the scrollbar. "None" will hide the scrollbar.',
		values: [{ value: "default", title: "Default" }, { value: "thin", title: "Thin" }, { value: "none", title: "None" }]
	},
	activityIdDataItemField: {
		title: 'Name of the data attribute in question',
	},
	contactIdDataItemField: {
		title: 'Name of the data attribute in question',
	},
	projectIdDataItemField: {
		title: 'Name of the data attribute in question',
	},
	activityIdSource: {
		title: "Activity ID Source",
		description: "Select whether to manually enter the Activity ID or retrieve it from a DataItem attribute.",
		values: [
			{ value: "manual", title: "Manual" },
			{ value: "data-item", title: "DataItem" },
		],
	},
	projectIdSource: {
		title: "Project ID Source",
		description: "Select whether to manually enter the Project ID or retrieve it from a DataItem attribute.",
		values: [
			{ value: "manual", title: "Manual" },
			{ value: "data-item", title: "DataItem" },
		],
	},
	contactIdSource: {
		title: "Contact ID Source",
		description: "Select whether to manually enter the Contact ID or retrieve it from a DataItem attribute. ",
		values: [
			{ value: "manual", title: "Manual" },
			{ value: "data-item", title: "DataItem" },
		],
	},
	activityIdDataItemFieldValue: {
		title: "Activity ID data attribute value"
	},
	contactIdDataItemFieldValue: {
		title: "Contact ID data attribute value"
	},
	projectIdDataItemFieldValue: {
		title: "Project ID data attribute value"
	},
	buttonsSize: {
		title: "Buttons size",
		description: "Select the size of all buttons. Default: Medium",
		values: [{ value: "btn-sm", title: "Small" }, { value: "btn-md", title: "Medium" }, { value: "btn-lg", title: "Large" }]
	},
	buttonsStyle: {
		title: "Buttons style",
		values: [{ value: "btn-primary", title: "Primary" }, { value: "btn-secondary", title: "Secondary" }]
	},
}