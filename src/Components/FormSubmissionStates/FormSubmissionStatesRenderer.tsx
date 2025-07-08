import { FC } from "react";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { FormSubmissionFailed } from "./FormSubmissionFailed";
import { FormSubmissionSucceeded } from "./FormSubmissionSucceeded";
import { FormSubmitting } from "./FormSubmitting";
import { Widget } from "scrivito";
import { useFormContext } from "../../contexts/FormContext";

interface FormSubbmissionStatesRendererProps {
	widget: Widget
}

export const FormSubmissionStatesRenderer: FC<FormSubbmissionStatesRendererProps> = ({ widget }) => {
	const { onSubmit, isSubmitting, successfullySent, submissionFailed } = useFormContext()!;
	const {
		submissionFailureText,
		retryButtonText,
		showRetryButton,
		retryButtonAlignment,
		fixedFormHeight,
		formHeight,
		submittingMessageType,
		submittedMessage,
		submittedMessageType,
		submittingMessage,
		failedMessageType,
	} = useQuestionnaireWidgetAttributesContext();

	if (isSubmitting) {
		return (
			<FormSubmitting
				submittingText={submittingMessage}
				type={submittingMessageType}
				fixedFormHeight={fixedFormHeight}
				formHeight={formHeight}
				widget={widget}
			/>
		);
	}

	if (successfullySent) {
		return (
			<FormSubmissionSucceeded
				submissionSuccessText={submittedMessage}
				type={submittedMessageType}
				fixedFormHeight={fixedFormHeight}
				formHeight={formHeight}
				widget={widget}
			/>
		);
	}

	if (submissionFailed) {
		return (
			<FormSubmissionFailed
				submissionFailureText={submissionFailureText}
				type={failedMessageType}
				showRetryButton={showRetryButton}
				retryButtonText={retryButtonText}
				buttonAlignment={retryButtonAlignment}
				fixedFormHeight={fixedFormHeight}
				formHeight={formHeight}
				onReSubmit={onSubmit}
				widget={widget}
			/>
		);
	}

	return null;
};