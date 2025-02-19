import * as React from "react";
import * as Scrivito from "scrivito";
import { SUBMITTING_MESSAGE_WIDGETS } from "../../constants/constants";


interface FormSubmittingProps {
	submittingText: string;
	type: string,
	widget: Scrivito.Widget
	fixedFormHeight: boolean
	formHeight: number

}
export const FormSubmitting: React.FC<FormSubmittingProps> = ({
	submittingText,
	type,
	widget,
	fixedFormHeight,
	formHeight,

}) => {


	return (
		<div className={`form-submission-submitting`} style={fixedFormHeight ? { height: `${formHeight}px` } : {}}>
			{
				type == "default" ?
					<div className="text-center">
						<i
							className="bi bi-arrow-repeat bi-2x rotate-form-submitting-icon"
							aria-hidden="true"></i>{" "}
						<span>{submittingText}</span>
					</div>
					:
					<Scrivito.ContentTag
						content={widget}
						attribute={SUBMITTING_MESSAGE_WIDGETS}
					/>
			}
		</div >
	);
};
