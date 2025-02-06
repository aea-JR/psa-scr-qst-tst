import * as React from "react";
import * as Scrivito from "scrivito";
import { isQuestionnaireCreationValid } from "../../utils/isQuestionnaireCreationValid";
import { QuestionnaireMessageBlock } from "../QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import "./QuestionnaireFormFooter.scss";
import { usePisaStatusContext } from "../../contexts/PisaStatusContext";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";
import { SingleStepFooter } from "./SingleStepFooter";
import { MultiStepsFooter } from "./MultiStepsFooter";
import { useQuestionnaireStepsContext } from "../../contexts/QuestionnaireStepsContext";

interface QuestionnaireFooterProps {
	widget: Scrivito.Widget;
	isCreated: boolean;
}

export const QuestionnaireFooter: React.FC<QuestionnaireFooterProps> =
	Scrivito.connect(({ widget, isCreated }) => {
		const { isSingleStep } = useQuestionnaireStepsContext();
		const { isOnline } = usePisaStatusContext();
		const isValid = isQuestionnaireCreationValid(widget);
		const hasChanges = isCreated && compareQuestionnaireMeta(widget);
		const getMessageType = () => {
			if (!isOnline) { return "pisaOffline"; }
			if (Scrivito.isInPlaceEditingActive() && !isValid) { return "invalidAttributes"; }
			if (hasChanges) { return "updatePending" }
			if (isCreated) { return null; }
			if (!Scrivito.isInPlaceEditingActive() && !isCreated) { return "warningCreationPending"; }
			{ return "creationPending"; }
		};

		const messageType = getMessageType();
		return (
			<div className="qst-footer-container">
				{
					isSingleStep ? (
						<SingleStepFooter
							submitDisabled={hasChanges || !isValid || !isOnline || !isCreated}
						/>
					) : (
						<MultiStepsFooter
							submitDisabled={hasChanges || !isValid || !isOnline || !isCreated}
						/>
					)
				}
				{messageType && <QuestionnaireMessageBlock type={messageType} />}

			</div>
		);
	});
