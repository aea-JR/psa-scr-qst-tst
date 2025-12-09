import { FC } from "react";
import { connect } from "scrivito";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { useFormContext } from "../../contexts/FormContext";


interface SingleStepFooterProps {
	submitDisabled: boolean;
}

export const SingleStepFooter: FC<SingleStepFooterProps> =
	connect(({ submitDisabled }) => {
		const { onSubmit } = useFormContext()!;
		const { singleSubmitButtonAlignment, submitButtonText, buttonsSize, buttonsStyle } = useQuestionnaireWidgetAttributesContext();
		return (
			<div
				className={`${singleSubmitButtonAlignment === "block"
					? ""
					: singleSubmitButtonAlignment
					}`}>
				<button
					className={`btn ${buttonsStyle} ${buttonsSize} ${singleSubmitButtonAlignment === "block"
						? " btn-block"
						: ""
						}`}
					onClick={onSubmit}
					disabled={submitDisabled}
				>
					{submitButtonText}
				</button>
			</div>
		);
	});
