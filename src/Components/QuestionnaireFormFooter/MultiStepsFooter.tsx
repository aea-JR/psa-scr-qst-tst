import { FC } from "react";
import { connect, isInPlaceEditingActive } from "scrivito";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { useFormContext } from "../../contexts/FormContext";


interface MultiStepsFooterProps {
	submitDisabled: boolean;
}

export const MultiStepsFooter: FC<MultiStepsFooterProps> =
	connect(
		({ submitDisabled }) => {
			const { onSubmit } = useFormContext();
			const { onPageChange, currentStep, isLastStep, stepsLength } = useQuestionnaireStepsContext();
			const { backwardButtonText, forwardButtonText, submitButtonText } = useQuestionnaireWidgetAttributesContext();
			return (
				<>
					<div className="buttons-container">
						<button
							className="btn btn-primary backward-button"
							onClick={() => onPageChange(false)}
							hidden={currentStep == 1 && !isInPlaceEditingActive()}>
							{backwardButtonText}
						</button>
						<div className="step-counter">
							{currentStep + " / " + stepsLength}
						</div>


						<button
							className={`btn btn-primary forward-button ${isInPlaceEditingActive() ? "edit-mode-margin" : ""}`}
							onClick={() => onPageChange(true)}
							hidden={isLastStep}
						>
							{forwardButtonText}
						</button>

						<button
							className="btn btn-primary submit-button"
							onClick={onSubmit}
							disabled={submitDisabled}
							hidden={!(isLastStep || isInPlaceEditingActive())}
						>
							{submitButtonText}
						</button>

					</div>
				</>
			);
		}
	);

