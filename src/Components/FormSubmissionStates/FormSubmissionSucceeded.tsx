import * as React from "react";
import * as Scrivito from "scrivito";
import { SUBMITTED_MESSAGE_WIDGETS } from "../../constants/constants";

interface FormSubmissionSucceededProps {
	submissionSuccessText: string;
	type: string;
	widget: Scrivito.Widget;
	fixedFormHeight: boolean;
	formHeight: number;

}

export const FormSubmissionSucceeded: React.FC<
	FormSubmissionSucceededProps
> = ({ submissionSuccessText, type, widget, fixedFormHeight, formHeight }) => {
	return (
		<div className={`form-submission-succeeded`} style={fixedFormHeight ? { height: `${formHeight}px` } : {}}>
			{type == "default" ?
				<div className="text-center">
					<i className="bi bi-check-lg bi-2x" aria-hidden="true"></i>{" "}
					<span>{submissionSuccessText}</span>
				</div>
				:
				<Scrivito.ContentTag
					content={widget}
					attribute={SUBMITTED_MESSAGE_WIDGETS}
				/>
			}
		</div >
	);
};
