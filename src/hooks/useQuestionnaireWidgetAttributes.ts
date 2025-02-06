import { Widget } from "scrivito";
import { QuestionnaireWidgetAttributes } from "../contexts/QuestionnaireWidgetAttributesContext";

export const useQuestionnaireWidgetAttributes = (widget: Widget): QuestionnaireWidgetAttributes => ({
	isCreated: !!widget.get("questionnaireId"),
	formType: widget.get("formType") as string,
	showSubmittedPreview: widget.get("previewSubmittedMessage") as boolean || false,
	showSubmittingPreview: widget.get("previewSubmittingMessage") as boolean || false,
	showFailedPreview: widget.get("previewFailedMessage") as boolean || false,
	submissionFailureText: widget.get("failedMessage") as string || "",
	showRetryButton: widget.get("showRetryButton") as boolean || false,
	retryButtonText: widget.get("retryButtonText") as string || "Retry",
	retryButtonAlignment: widget.get("retryButtonAlignment") as string || "text-center",
	fixedFormHeight: widget.get("fixedFormHeight") as boolean || false,
	formHeight: widget.get("formHeight") as number || 35,
	submittingMessageType: widget.get("submittingMessageType") as string || "default",
	containerClassNames: widget.get("customClassNames") as string || "",
	formScrollbarWidth: widget.get("scrollbarWidth") as string || "default",
	formOverscrollBehavior: widget.get("overscrollBehavior") as string || "default",
	failedMessage: widget.get("failedMessage") as string,
	submittedMessage: widget.get("submittedMessage") as string,
	submittedMessageType: widget.get("submittedMessageType") as string || "default",
	submittingMessage: widget.get("submittingMessage") as string,
	failedMessageType: widget.get("failedMessageType") as string || "default",
	failedMessageWidgets: widget.get("failedMessageWidgets") as Widget[],
	submittedMessageWidgets: widget.get("submittedMessageWidgets") as Widget[],
	submittingMessageWidgets: widget.get("submittingMessageWidgets") as Widget[],
	backwardButtonText: widget.get("backwardButtonText") as string || "Back",
	forwardButtonText: widget.get("forwardButtonText") as string || "Forward",
	submitButtonText: widget.get("submitButtonText") as string || "Submit",
	singleSubmitButtonAlignment: widget.get("singleSubmitButtonAlignment") as string || "text-center"

});