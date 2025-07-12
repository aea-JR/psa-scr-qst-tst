import * as React from "react";
import * as Scrivito from "scrivito";
import { QuestionnaireMessageBlock } from "../QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { SingleStepFooter } from "./SingleStepFooter";
import { MultiStepsFooter } from "./MultiStepsFooter";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";
import { QuestionnaireStatus } from "../../types/questionnaire";
import "./QuestionnaireFormFooter.scss";

interface QuestionnaireFooterProps {
	widget: Scrivito.Widget;
	status: QuestionnaireStatus;
}

export const QuestionnaireFooter: React.FC<QuestionnaireFooterProps> =
	Scrivito.connect(({ widget, status }) => {
		const { isSingleStep } = useQuestionnaireStepsContext();
		return (
			<div className="qst-footer-container">
				{
					isSingleStep ? (
						<SingleStepFooter
							submitDisabled={status != "void"}
						/>
					) : (
						<MultiStepsFooter
							submitDisabled={status != "void"}
						/>
					)
				}
				{<QuestionnaireMessageBlock status={status} />}

			</div>
		);
	});
