import { FC } from "react";
import { registerComponent, uiContext, Widget } from "scrivito";
import { Description } from "../QuestionnaireManagementTabDescription/QuestionnaireManagementTabDescription";
import { useCreateQuestionnaire } from "./useCreateQuestionnaire";
import { useUpdateQuestionnaire } from "./useUpdateQuestionnaire";
import { QuestionnaireStatus } from "../../types/questionnaire";
import { QUESTIONNAIRE_ID, QUESTIONNAIRE_STATUS } from "../../constants/constants";
import { PisaDataClassProvider } from "../../contexts/PisaDataClassContext";
import "./QuestionnaireManagementTab.scss";


interface QuestionnaireManagementTabProps {
	widget: Widget;
	status: QuestionnaireStatus;
}
//TODO: show error to user for creation/update failure?
export const QuestionnaireManagementTab: FC<
	QuestionnaireManagementTabProps
> = ({ widget }) => {
	const status = widget.get(QUESTIONNAIRE_STATUS) as QuestionnaireStatus;
	const context = uiContext();

	if (!context) return null;

	return (
		<PisaDataClassProvider>
			<Tab widget={widget} status={status} />
		</PisaDataClassProvider>
	);
};

const Tab: FC<
	QuestionnaireManagementTabProps
> = ({ widget, status }) => {
	const questionnaireId = widget.get(QUESTIONNAIRE_ID) as string;
	const context = uiContext();
	const { createQuestionnaire } = useCreateQuestionnaire(widget);
	const { updateQuestionnaire } = useUpdateQuestionnaire(widget);

	const showCreateButton = !questionnaireId && status == "creationPending";

	if (!context) return null;

	return (
		<div
			className={`questionnaire-management-tab-container scrivito-${context.theme}`}
		>
			<div className="detail-content">
				<div className="detail-content-inner">
					<Description status={status} />
					{showCreateButton && <button
						className="btn btn-primary"
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
								PUSH CHANGES TO BACKEND
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