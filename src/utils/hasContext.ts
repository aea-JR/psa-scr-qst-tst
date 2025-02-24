import { Widget } from "scrivito";
import { isEmpty } from "lodash-es";
import { ACTIVITY_ID, ACTIVITY_ID_DATA_ITEM_FIELD_VALUE, ACTIVITY_ID_SOURCE, CONTACT_ID, CONTACT_ID_DATA_ITEM_FIELD_VALUE, CONTACT_ID_SOURCE, PROJECT_ID, PROJECT_ID_DATA_ITEM_FIELD_VALUE, PROJECT_ID_SOURCE } from "../constants/constants";

export const hasContext = (qstMainWidget: Widget): boolean => {
	const activityId = qstMainWidget.get(ACTIVITY_ID_SOURCE) == "manual" ? qstMainWidget.get(ACTIVITY_ID) as string : qstMainWidget.get(ACTIVITY_ID_DATA_ITEM_FIELD_VALUE) as string;
	const contactId = qstMainWidget.get(CONTACT_ID_SOURCE) == "manual" ? qstMainWidget.get(CONTACT_ID) as string : qstMainWidget.get(CONTACT_ID_DATA_ITEM_FIELD_VALUE) as string;
	const projectId = qstMainWidget.get(PROJECT_ID_SOURCE) == "manual" ? qstMainWidget.get(PROJECT_ID) as string : qstMainWidget.get(PROJECT_ID_DATA_ITEM_FIELD_VALUE) as string;

	return !isEmpty(activityId) || !isEmpty(contactId) || !isEmpty(projectId);
}