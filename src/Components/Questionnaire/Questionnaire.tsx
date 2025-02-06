import { FC } from "react";
import { Widget, ContentTag } from "scrivito";
import { useFormContext } from "../../contexts/FormContext";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { FormSubmissionStatesRenderer } from "../FormSubmissionStates/FormSubmissionStatesRenderer";
import { QuestionnaireFooter } from "../QuestionnaireFormFooter/QuestionnaireFormFooter";



interface QuestionnaireProps {
	widget: Widget;

}
export const Questionnaire: FC<QuestionnaireProps> = ({
	widget,

}) => {

	const { isSubmitting, submissionFailed, successfullySent } = useFormContext();

	const { isCreated } = useQuestionnaireWidgetAttributesContext();
	if (isSubmitting || successfullySent || submissionFailed) {
		return <FormSubmissionStatesRenderer widget={widget} />;
	}

	return (
		<>
			<form
				method="post"
				id={widget.get("externalId") as string}
			>
				<ContentTag content={widget} attribute="steps" />
			</form>
			<QuestionnaireFooter
				widget={widget}
				isCreated={isCreated}
			/>
		</>
	);
};