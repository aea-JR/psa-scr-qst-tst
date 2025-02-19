import { Widget } from "scrivito";
import { AnswerContext } from "../types/questionnaire";
import { ACTIVITY_ID, CONTACT_ID, PROJECT_ID } from "../constants/constants";

export const getAnswerContext = (mainWidget: Widget): AnswerContext => {
	return {
		activityId: mainWidget.get(ACTIVITY_ID) as string || "",
		projectId: mainWidget.get(PROJECT_ID) as string || "",
		contactId: mainWidget.get(CONTACT_ID) as string || "",
	}
}