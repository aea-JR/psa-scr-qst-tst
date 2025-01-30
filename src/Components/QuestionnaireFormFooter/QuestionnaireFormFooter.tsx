import * as React from "react";
import * as Scrivito from "scrivito";
import { useFormContext } from "../../contexts/FormContext";
import { isSubmitDisabled } from "../../utils/isSubmitDisabled";
import { isQuestionnaireCreationValid } from "../../utils/isQuestionnaireCreationValid";
import { QuestionnaireMessageBlock } from "../QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import "./QuestionnaireFormFooter.scss";
import { usePisaStatusContext } from "../../contexts/PisaStatusContext";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";

interface FormFooterSingleStepProps {
	widget: Scrivito.Widget;
	isCreated: boolean;
}

export const QuestionnaireFormFooter: React.FC<FormFooterSingleStepProps> =
	Scrivito.connect(({ widget, isCreated }) => {
		const { onSubmit } = useFormContext();
		const { isOnline } = usePisaStatusContext();
		const isValid = isQuestionnaireCreationValid(widget);
		const hasChanges = isCreated && compareQuestionnaireMeta(widget);
		const getMessageType = () => {
			if (!isOnline) { return "pisaOffline"; }
			if (hasChanges) { return "updatePending" }
			if (isCreated) { return null; }
			if (!Scrivito.isInPlaceEditingActive() && !isCreated) { return "warningCreationPending"; }
			if (Scrivito.isInPlaceEditingActive() && !isValid) { return "invalidAttributes"; }
			{ return "creationPending"; }
		};

		const messageType = getMessageType();
		return (
			<div
				className={`questionnaire-footer ${widget.get("singleSubmitButtonAlignment") === "block"
					? ""
					: widget.get("singleSubmitButtonAlignment")
					}`}>
				<button
					className={`btn btn-primary${widget.get("singleSubmitButtonAlignment") === "block"
						? " btn-block"
						: ""
						}`}
					onClick={onSubmit}
					disabled={isSubmitDisabled(widget)}
				>
					{widget.get("submitButtonText") as string || "Submit"}
				</button>
				{messageType && <QuestionnaireMessageBlock type={messageType} />}

			</div>
		);
	});
