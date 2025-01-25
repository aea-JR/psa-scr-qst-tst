import { Widget } from "scrivito";
import { AnswerContext } from "../types/questionnaire";

export const getAnswerContext = (mainWidget: Widget): AnswerContext => {
	return {
		activityId: mainWidget.get("activityId") as string || "",
		projectId: mainWidget.get("projectId") as string || "",
		contactId: mainWidget.get("contactId") as string || "",
	}
}