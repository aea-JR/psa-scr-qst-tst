import { FC } from "react";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { FormSubmissionFailed } from "./FormSubmissionFailed";
import { FormSubmissionSucceeded } from "./FormSubmissionSucceeded";
import { FormSubmitting } from "./FormSubmitting";
import { isInPlaceEditingActive, Widget } from "scrivito";
import { useFormContext } from "../../contexts/FormContext";
import { QuestionnaireMessageBlock } from "../QuestionnaireMessageBlock/QuestionnaireMessageBlock";

interface FormSubbmissionStatesRendererProps {
	widget: Widget
}

export const FormSubmissionStatesRenderer: FC<FormSubbmissionStatesRendererProps> = ({ widget }) => {
	const { onSubmit, isSubmitting, successfullySent, submissionFailed } = useFormContext()!;
	const {
		fixedFormHeight,
		formHeight,
		submittingMessageType,
		submittedMessage,
		submittedMessageType,
		submittingMessage,
		failedMessageType,
		showFailedPreview,
		showSubmittedPreview,
		showSubmittingPreview
	} = useQuestionnaireWidgetAttributesContext();

	const editMode = isInPlaceEditingActive();

	if (isSubmitting) {
		return (
			<>
				<FormSubmitting
					submittingText={submittingMessage}
					type={submittingMessageType}
					fixedFormHeight={fixedFormHeight}
					formHeight={formHeight}
					widget={widget}
				/>
				{(showSubmittingPreview && editMode) && <QuestionnaireMessageBlock status="submittingPreview" />}
			</>
		);
	}

	if (successfullySent) {
		return (
			<>
				<FormSubmissionSucceeded
					submissionSuccessText={submittedMessage}
					type={submittedMessageType}
					fixedFormHeight={fixedFormHeight}
					formHeight={formHeight}
					widget={widget}
				/>
				{(showSubmittedPreview && editMode) && <QuestionnaireMessageBlock status="submittedPreview" />}
			</>
		);
	}

	if (submissionFailed) {
		return (
			<>
				<FormSubmissionFailed
					type={failedMessageType}
					fixedFormHeight={fixedFormHeight}
					onReSubmit={onSubmit}
					widget={widget}
				/>
				{(showFailedPreview && editMode) && <QuestionnaireMessageBlock status="failedPreview" />}
			</>
		);
	}

	return null;
};
