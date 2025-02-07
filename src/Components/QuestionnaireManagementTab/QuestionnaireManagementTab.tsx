import "./QuestionnaireManagementTab.scss";
import { isQuestionnaireStructureValid } from "../../utils/isQuestionnaireStructureValid";
import { isEmpty } from "lodash-es";
import { Description } from "../QuestionnaireManagementTabDescription/QuestionnaireManagementTabDescription";
import { QuestionnaireStatus } from "../../types/questionnaire";
import { compareQuestionnaireMeta } from "../../utils/compareQuestionnaireMeta";
import { useCreateQuestionnaire } from "./useCreateQuestionnaire";
import { useUpdateQuestionnaire } from "./useUpdateQuestionnaire";
import { FC, useEffect, useState } from "react";
import { registerComponent, uiContext, Widget } from "scrivito";


interface QuestionnaireManagementTabProps {
	widget: Widget;
}
//TODO: show error to user for creation/update failure?
export const QuestionnaireManagementTab: FC<
	QuestionnaireManagementTabProps
> = ({ widget }) => {
	const [status, setStatus] = useState<QuestionnaireStatus>("void");
	const isCreated = !isEmpty(widget.get("questionnaireId") as string);
	const context = uiContext();
	const isValid = isQuestionnaireStructureValid(widget);
	const hasChanges = compareQuestionnaireMeta(widget);
	const { createQuestionnaire, isCreating } = useCreateQuestionnaire(widget);
	const { updateQuestionnaire, isUpdating } = useUpdateQuestionnaire(widget);

	useEffect(() => {
		if (!isValid) {
			setStatus("invalid");
			return;
		}
		if (isCreating) {
			setStatus("inCreation");
			return;
		}
		if (!isCreated) {
			setStatus("creationPending");
			return;
		}
		if (isUpdating) {
			setStatus("updating");
			return;
		}
		if (hasChanges) {
			setStatus("pendingUpdate");
			return;
		}
		if (isCreated) {
			setStatus("void");
			return;
		}
	}, [isValid, hasChanges, isCreated, isUpdating, isCreating])

	if (!context) return null;

	return (
		<div
			className={`questionnaire-creation-tab-container scrivito-${context.theme}`}
		>
			<div className="detail-content">
				<div className="detail-content-inner">
					<Description status={status} isValid={isValid} />
					{!isCreated && <button
						className="btn btn-primary"
						disabled={!isValid || isCreating}
						onClick={createQuestionnaire}
					>
						Create
					</button>}
					{(isCreated && status == "pendingUpdate") &&
						<>
							<button
								className="btn btn-primary"
								onClick={updateQuestionnaire}
							>
								PUSH CHANGES TO PISASALES
							</button>
							<div className="notice-body note">
							</div>
						</>
					}
				</div>
			</div>
		</div>
	);
};

registerComponent(
	"QuestionnaireManagementTab",
	QuestionnaireManagementTab
);