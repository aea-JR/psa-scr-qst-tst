import * as React from "react";
import * as Scrivito from "scrivito";
import { FAILED_MESSAGE_WIDGETS } from "../../constants/constants";
import { useQuestionnaireWidgetAttributesContext } from "../../contexts/QuestionnaireWidgetAttributesContext";

interface FormSubmissionFailedProps {
	type: string;
	widget: Scrivito.Widget;
	fixedFormHeight: boolean;
	onReSubmit: React.MouseEventHandler;
}
//TODO: Use OWN text-center styles
export const FormSubmissionFailed: React.FC<FormSubmissionFailedProps> = ({
	type,
	widget,
	fixedFormHeight,
	onReSubmit
}) => {
	const { formHeight, showRetryButton, buttonsStyle, retryButtonAlignment, retryButtonText, failedMessage, buttonsSize } = useQuestionnaireWidgetAttributesContext();
	return (
		<div className={`form-submission-failed`} style={fixedFormHeight ? { height: `${formHeight}px` } : {}}>
			{type == "default" ?
				<div className="text-center">
					<i
						className="bi bi-exclamation-triangle-fill bi-2x"
						aria-hidden="true"></i>{" "}
					<span >{failedMessage}</span>
				</div>
				:
				<Scrivito.ContentTag
					content={widget}
					attribute={FAILED_MESSAGE_WIDGETS}
				/>
			}
			{showRetryButton &&
				<div
					className={`${retryButtonAlignment === "block"
						? ""
						: retryButtonAlignment
						}`}>
					<button
						className={`btn ${buttonsStyle} retry-button ${buttonsSize} ${retryButtonAlignment === "block"
							? " btn-block"
							: ""
							}`}
						onClick={onReSubmit}
					>
						{retryButtonText}
					</button>
				</div>
			}
		</div>
	);
};
