import { FC } from "react";
import { QuestionnaireStatus } from "../../types/questionnaire";
import "./QuestionnaireManagementTabDescription.scss";



interface DescriptionProps {
	status: QuestionnaireStatus
}
//TODO: refactor
export const Description: FC<DescriptionProps> = ({ status }) => {
	const getMessage = (): string => {
		switch (status) {
			case "creationPending":
				return "This questionnaire has not been created in the backend yet.";
			case "inCreation":
				return "Creating the questionnaire in the backend. Please wait...";
			case "invalid":
				return "This questionnaire contains invalid attributes. Please review and correct them.";
			case "pendingUpdate":
				return "Unsaved changes detected. Push these updates to the backend to keep your questionnaire up to date.";
			case "updating":
				return "Updating questionnaire data. Please wait...";
			case "unconfiguredUrl":
				return "The backend connection is not configured yet."
			case "offline":
				return "The backend is not reachable. Please check your configuration or contact your administrator."
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