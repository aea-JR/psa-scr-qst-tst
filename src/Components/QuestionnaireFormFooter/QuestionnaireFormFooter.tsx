import * as React from "react";
import * as Scrivito from "scrivito";
import { QuestionnaireMessageBlock } from "../QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { SingleStepFooter } from "./SingleStepFooter";
import { MultiStepsFooter } from "./MultiStepsFooter";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { QuestionnaireStatus } from "../../types/questionnaire";
import "./QuestionnaireFormFooter.scss";
import { useFormContext } from "../../contexts/FormContext";

interface QuestionnaireFooterProps {
	widget: Scrivito.Widget;
	status: QuestionnaireStatus;
}

export const QuestionnaireFooter: React.FC<QuestionnaireFooterProps> =
	Scrivito.connect(({ widget, status }) => {
		const { isSingleStep } = useQuestionnaireStepsContext();
		const formCtx = useFormContext();
		const isSubmitDisabled = !(status == "void" || status == "publicSiteEditMode") || !!formCtx?.hasPendingUploads;
		return (
			<div className="qst-footer-container">
				{
					isSingleStep ? (
						<SingleStepFooter
							submitDisabled={isSubmitDisabled}
						/>
					) : (
						<MultiStepsFooter
							submitDisabled={isSubmitDisabled}
						/>
					)
				}
				{<QuestionnaireMessageBlock status={status} />}

			</div>
		);
	});
