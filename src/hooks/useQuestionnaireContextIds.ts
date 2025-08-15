import { useEffect, useState } from "react";
import { Widget, useDataItem } from "scrivito";
import { ACTIVITY_ID, ACTIVITY_ID_DATA_ITEM_FIELD, ACTIVITY_ID_SOURCE, CONTACT_ID, CONTACT_ID_DATA_ITEM_FIELD, CONTACT_ID_SOURCE, PROJECT_ID, PROJECT_ID_DATA_ITEM_FIELD, PROJECT_ID_SOURCE } from "../constants/constants";

export const useQuestionnaireContextIds = (qstContainerWidget: Widget) => {
	const dataItem = useDataItem();
	const act = qstContainerWidget.get(ACTIVITY_ID) as string || "";
	const con = qstContainerWidget.get(CONTACT_ID) as string || "";
	const prj = qstContainerWidget.get(PROJECT_ID) as string || "";

	const [contextIds, setContextIds] = useState({
		activityId: "",
		contactId: "",
		projectId: "",
	});

	useEffect(() => {
		const resolveContextId = (source: string, manualValue: string, dataItemField: string) => {
			return source === "data-item" ? (dataItem?.get(dataItemField) as string) || "" : manualValue;
		};

		setContextIds({
			activityId: resolveContextId(
				qstContainerWidget.get(ACTIVITY_ID_SOURCE) as string,
				qstContainerWidget.get(ACTIVITY_ID) as string,
				qstContainerWidget.get(ACTIVITY_ID_DATA_ITEM_FIELD) as string
			),
			contactId: resolveContextId(
				qstContainerWidget.get(CONTACT_ID_SOURCE) as string,
				qstContainerWidget.get(CONTACT_ID) as string,
				qstContainerWidget.get(CONTACT_ID_DATA_ITEM_FIELD) as string
			),
			projectId: resolveContextId(
				qstContainerWidget.get(PROJECT_ID_SOURCE) as string,
				qstContainerWidget.get(PROJECT_ID) as string,
				qstContainerWidget.get(PROJECT_ID_DATA_ITEM_FIELD) as string
			),
		});
	}, [act, prj, con]);

	return contextIds;
};