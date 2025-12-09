import { FC, useState } from "react";
import { connect, isInPlaceEditingActive } from "scrivito";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { useFormContext } from "../../contexts/FormContext";
import { ReviewPortal } from "../Review/ReviewPortal";

interface MultiStepsFooterProps {
	submitDisabled: boolean;
}

export const MultiStepsFooter: FC<MultiStepsFooterProps> =
	connect(
		({ submitDisabled }) => {
			const [show, setShow] = useState(false);
			const { onSubmit } = useFormContext()!;
			const { onPageChange, currentStep, isLastStep, stepsLength } = useQuestionnaireStepsContext();
			const { backwardButtonText, forwardButtonText, submitButtonText, showReview, reviewButtonText, buttonsSize, buttonsStyle } = useQuestionnaireWidgetAttributesContext();
			const doShowReview = (isLastStep || isInPlaceEditingActive()) && showReview;
			function onShowReview(setShow: (show: boolean) => void) {
				setShow(true);
			}
			return (
				<>
					<div className="buttons-container">
						<button
							className={`btn ${buttonsStyle} backward-button ${buttonsSize}`}
							onClick={() => onPageChange(false)}
							hidden={currentStep == 1 && !isInPlaceEditingActive()}>
							{backwardButtonText}
						</button>
						<div className="step-counter">
							{currentStep + " / " + stepsLength}
						</div>

						{doShowReview && (
							<button
								className={`btn ${buttonsStyle} review-button ${buttonsSize}`}
								onClick={() => onShowReview(setShow)}>
								{reviewButtonText}
							</button>
						)}
						<button
							className={`btn ${buttonsStyle} forward-button ${buttonsSize} ${isInPlaceEditingActive() ? "edit-mode-margin" : ""}`}
							onClick={() => onPageChange(true)}
							hidden={isLastStep}
						>
							{forwardButtonText}
						</button>

						<button
							className={`btn ${buttonsStyle} submit-button ${buttonsSize}`}
							onClick={onSubmit}
							disabled={submitDisabled}
							hidden={!(isLastStep || isInPlaceEditingActive())}
						>
							{submitButtonText}
						</button>

					</div>
					{doShowReview && show && (
						<ReviewPortal onHide={() => setShow(false)} />
					)}
				</>
			);
		}
	);

