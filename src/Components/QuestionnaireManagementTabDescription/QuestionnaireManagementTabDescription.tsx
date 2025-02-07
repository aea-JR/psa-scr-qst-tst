import * as React from "react";
import "./QuestionnaireManagementTabDescription.scss";
import { QuestionnaireStatus } from "../../types/questionnaire";



interface DescriptionProps {
	isValid: boolean;
	status: QuestionnaireStatus;
}
//TODO: refactor
export const Description: React.FC<DescriptionProps> = ({ isValid, status }) => {

	const getMessage = (): string => {
		switch (status) {
			case "creationPending":
				return "This questionnaire has not been created in PisaSales yet.";
			case "inCreation":
				return "Creating the questionnaire in PisaSales. Please wait...";
			case "invalid":
				return "This questionnaire contains invalid attributes. Please review and correct them.";
			case "pendingUpdate":
				return "Unsaved changes detected. Push these updates to PisaSales to keep your questionnaire up to date.";
			case "updating":
				return "Updating questionnaire data. Please wait...";
			default:
				return "The questionnaire is ready for use.";
		}
	};
	return <div className="description notice-body">
		{status == "inCreation" && <span
			className="spinner-border spinner-border-sm"
			role="status"
			aria-hidden="true"
		></span>}
		<span className="message">
			{getMessage()}
		</span>
	</div>;
};