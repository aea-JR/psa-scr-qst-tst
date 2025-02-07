import { useEffect, useState } from "react";
import { Widget, useDataItem } from "scrivito";

export const useQuestionnaireContextIds = (qstContainerWidget: Widget) => {
	const dataItem = useDataItem();
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
				qstContainerWidget.get("activityIdSource") as string,
				qstContainerWidget.get("activityId") as string,
				qstContainerWidget.get("activityIdDataItemField") as string
			),
			contactId: resolveContextId(
				qstContainerWidget.get("contactIdSource") as string,
				qstContainerWidget.get("contactId") as string,
				qstContainerWidget.get("contactIdDataItemField") as string
			),
			projectId: resolveContextId(
				qstContainerWidget.get("projectIdSource") as string,
				qstContainerWidget.get("projectId") as string,
				qstContainerWidget.get("projectIdDataItemField") as string
			),
		});
	}, []);

	return contextIds;
};