import React from 'react';
import './QuestionnaireMessageBlock.scss';

const messages = {
	creationPending: { prefix: "Editor's info:", content: "This questionnaire has not been created yet in PisaSales!" },
	invalidAttributes: { prefix: "Editor's info:", content: "Some attributes are invalid!" },
	warningCreationPending: { prefix: "Warning:", content: "This questionnaire has not been created yet in PisaSales!" },
	pisaOffline: { prefix: "Warning:", content: "PisaSales is not reachable. Please check your configuration or contact your administrator." },
};

interface Props {
	type: keyof typeof messages;
	className?: string;
}

export const QuestionnaireMessageBlock: React.FC<Props> = ({ type, className }) => {

	const message = messages[type];

	return (
		<div className="qst-message-block-container">
			<div className={`message-block alert fade show ${type == "creationPending" ? "alert-warning" : "alert-error"} ${className || ''}`}>
				<p>
					<strong>{message.prefix}</strong> {message.content}
				</p>
			</div>
		</div>
	);
};

