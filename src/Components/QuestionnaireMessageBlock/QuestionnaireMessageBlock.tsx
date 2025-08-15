import { FC } from 'react';
import './QuestionnaireMessageBlock.scss';
import { QuestionnaireStatus } from '../../types/questionnaire';

const WARNING = "Warning:";
const EDITORS_INFO = "Editor's info:";
const messages = {
	creationPending: { prefix: EDITORS_INFO, content: "This questionnaire has not been created in PisaSales yet." },
	invalid: { prefix: EDITORS_INFO, content: "Some attributes are invalid. Please review and correct them." },
	offline: { prefix: WARNING, content: "PisaSales is not reachable. Please check your configuration or contact your administrator." },
	pendingUpdate: { prefix: EDITORS_INFO, content: "This questionnaire has unsaved local changes. To ensure all modifications are reflected in PisaSales, please push the updates from the properties tab." },
	inCreation: { prefix: EDITORS_INFO, content: "Creating the questionnaire in PisaSales. Please wait..." },
	updating: { prefix: EDITORS_INFO, content: "Updating questionnaire data. Please wait..." },
	void: { prefix: EDITORS_INFO, content: "The questionnaire is ready for use." },
	unconfiguredUrl: { prefix: EDITORS_INFO, content: "PisaSales is not configured yet. " },
	noFormContext: { prefix: EDITORS_INFO, content: "This widget must be placed within a PisaSales Questionnaire! " },

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

	return (
		<div className="qst-message-block-container">
			<div className={`message-block alert fade show ${message.prefix == EDITORS_INFO ? "alert-warning" : "alert-error"} ${className || ''}`}>
				<p className='m-0'>
					<strong>{message.prefix}</strong> {message.content}
				</p>
			</div>
		</div>
	);
};

