import { FC } from "react";
import { Widget, ContentTag } from "scrivito";
import { useFormContext } from "../../contexts/FormContext";
import { FormSubmissionStatesRenderer } from "../FormSubmissionStates/FormSubmissionStatesRenderer";
import { QuestionnaireFooter } from "../QuestionnaireFormFooter/QuestionnaireFormFooter";
import { EXTERNAL_ID, STEPS } from "../../constants/constants";
import { QuestionnaireStatus } from "../../types/questionnaire";

interface QuestionnaireProps {
	widget: Widget;
	status: QuestionnaireStatus;

}
export const Questionnaire: FC<QuestionnaireProps> = ({
	widget,
	status
}) => {

	const { isSubmitting, submissionFailed, successfullySent } = useFormContext()!;
	if (isSubmitting || successfullySent || submissionFailed) {
		return <FormSubmissionStatesRenderer widget={widget} />;
	}

	return (
		<>
			<form
				method="post"
				id={widget.get(EXTERNAL_ID) as string}
			>
				<ContentTag content={widget} attribute={STEPS} />
			</form>
			<QuestionnaireFooter
				widget={widget}
				status={status}
			/>
		</>
	);
};