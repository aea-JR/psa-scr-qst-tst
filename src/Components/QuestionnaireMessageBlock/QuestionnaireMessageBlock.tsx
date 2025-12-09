import { FC } from 'react';
import './QuestionnaireMessageBlock.scss';
import { QuestionnaireStatus } from '../../types/questionnaire';

const WARNING = "Warning:";
const EDITORS_INFO = "Editor's info:";
const messages = {
	creationPending: { prefix: EDITORS_INFO, content: "This questionnaire has not been created in the backend yet." },
	invalid: { prefix: EDITORS_INFO, content: "Some attributes are invalid. Please review and correct them." },
	offline: { prefix: WARNING, content: "The backend is not reachable. Please check your configuration or contact your administrator." },
	pendingUpdate: { prefix: EDITORS_INFO, content: "This questionnaire has unsaved local changes. To ensure all modifications are reflected in the backend, please push the updates from the properties tab." },
	inCreation: { prefix: EDITORS_INFO, content: "Creating the questionnaire in the backend. Please wait..." },
	updating: { prefix: EDITORS_INFO, content: "Updating questionnaire data. Please wait..." },
	void: { prefix: EDITORS_INFO, content: "The questionnaire is ready for use." },
	unconfiguredUrl: { prefix: EDITORS_INFO, content: "The backend connection is not configured yet." },
	noFormContext: { prefix: EDITORS_INFO, content: "This widget must be placed within a Questionnaire widget! " },
	publicSiteEditMode: { prefix: EDITORS_INFO, content: "This questionnaire is ready for use but is placed on a public site. Only logged-in users or users with a valid access token can access it." },
	publicSiteNoContext: { prefix: null, content: "No valid login or access token found." },
	invalidToken: { prefix: null, content: "The access token is invalid or has expired." },
	submittingPreview: { prefix: EDITORS_INFO, content: "Previewing the submitting message/content." },
	submittedPreview: { prefix: EDITORS_INFO, content: "Previewing the submission success message/content." },
	failedPreview: { prefix: EDITORS_INFO, content: "Previewing the submission failure message/content." },
	fileUploadsDisabled: { prefix: EDITORS_INFO, content: "File uploads are disabled until you create or update the questionnaire." },
};
interface Props {
	className?: string;
	status: QuestionnaireStatus;
}


export const QuestionnaireMessageBlock: FC<Props> = ({ className, status }) => {
	if (status == "void") {
		return null;
	}
	const message = messages[status];
	const alertClass = status == "publicSiteEditMode" ? "alert-success" : message.prefix == EDITORS_INFO ? "alert-warning" : "alert-error";

	return (
		<div className="qst-message-block-container">
			<div className={`message-block alert fade show ${alertClass} ${className || ''}`}>
				<p className='m-0'>
					{message.prefix && <strong>{message.prefix}</strong>} {message.content}
				</p>
			</div>
		</div>
	);
};
