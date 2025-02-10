import { FC } from "react";
import { registerComponent, uiContext, Widget } from "scrivito";
import { Description } from "../QuestionnaireManagementTabDescription/QuestionnaireManagementTabDescription";
import { useCreateQuestionnaire } from "./useCreateQuestionnaire";
import { useUpdateQuestionnaire } from "./useUpdateQuestionnaire";
import { QuestionnaireStatus } from "../../types/questionnaire";
import "./QuestionnaireManagementTab.scss";


interface QuestionnaireManagementTabProps {
	widget: Widget;
}
//TODO: show error to user for creation/update failure?
export const QuestionnaireManagementTab: FC<
	QuestionnaireManagementTabProps
> = ({ widget }) => {
	const questionnaireId = widget.get("questionnaireId") as string;
	const context = uiContext();
	const { createQuestionnaire, isCreating } = useCreateQuestionnaire(widget);
	const { updateQuestionnaire, isUpdating } = useUpdateQuestionnaire(widget);
	const status = widget.get("questionnaireStatus") as QuestionnaireStatus;

	const isCreated = !!questionnaireId;


	if (!context) return null;

	return (
		<div
			className={`questionnaire-management-tab-container scrivito-${context.theme}`}
		>
			<div className="detail-content">
				<div className="detail-content-inner">
					<Description status={status} />
					{!isCreated && <button
						className="btn btn-primary"
						disabled={status == "invalid" || isCreating}
						onClick={createQuestionnaire}
					>
						Create
					</button>}
					{(status == "pendingUpdate") &&
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