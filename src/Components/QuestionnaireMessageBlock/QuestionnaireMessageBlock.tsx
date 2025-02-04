import React from 'react';
import './QuestionnaireMessageBlock.scss';

const WARNING = "Warning:";
const EDITORS_INFO = "Editor's info:";
const messages = {
	creationPending: { prefix: EDITORS_INFO, content: "This questionnaire has not been created in PisaSales yet." },
	invalidAttributes: { prefix: EDITORS_INFO, content: "Some attributes are invalid. Please review and correct them." },
	warningCreationPending: { prefix: WARNING, content: "This questionnaire is missing in PisaSales. Ensure it has been created before using it." },
	pisaOffline: { prefix: WARNING, content: "PisaSales is not reachable. Please check your configuration or contact your administrator." },
	updatePending: { prefix: EDITORS_INFO, content: "This questionnaire has unsaved local changes. To ensure all modifications are reflected in PisaSales, please push the updates from the properties tab." }
};

interface Props {
	type: keyof typeof messages;
	className?: string;
}

export const QuestionnaireMessageBlock: React.FC<Props> = ({ type, className }) => {

	const message = messages[type];

	return (
		<div className="qst-message-block-container">
			<div className={`message-block alert fade show ${message.prefix == EDITORS_INFO ? "alert-warning" : "alert-error"} ${className || ''}`}>
				<p>
					<strong>{message.prefix}</strong> {message.content}
				</p>
			</div>
		</div>
	);
};

