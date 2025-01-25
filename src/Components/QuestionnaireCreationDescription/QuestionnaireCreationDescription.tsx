import * as React from "react";
import "./QuestionnaireCreationDescription.scss";



interface DescriptionProps {
	isValid: boolean;
	isCreating: boolean
}
//TODO: refactor
export const Description: React.FC<DescriptionProps> = ({ isValid, isCreating }) => {
	let message = null;

	if (isCreating) {
		message = (
			<>
				<span
					className="spinner-border spinner-border-sm"
					role="status"
					aria-hidden="true"
				></span>
				<span className="message"> Creating the questionnaire on PisaSales side, please wait...</span>
			</>
		);
	} else if (!isValid) {
		message = (
			<span className="message">
				Questionnaire has invalid attributes, please check and fix the issues
				before creating.
			</span>
		);
	} else {
		message = <span className="message">Creates a questionnaire in PisaSales</span>;
	}

	return <div className="description notice-body">{message}</div>;
};