import { isInPlaceEditingActive, useDataItem, Widget } from "scrivito";
import { useEffect } from "react";
import { each } from "lodash-es";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { ACTIVITY_ID_DATA_ITEM_FIELD, ACTIVITY_ID_DATA_ITEM_FIELD_VALUE, ACTIVITY_ID_SOURCE, CONTACT_ID_DATA_ITEM_FIELD, CONTACT_ID_DATA_ITEM_FIELD_VALUE, CONTACT_ID_SOURCE, POSITION, PROJECT_ID_DATA_ITEM_FIELD, PROJECT_ID_DATA_ITEM_FIELD_VALUE, PROJECT_ID_SOURCE, STEPS } from "../../constants/constants";

export const useEditModeSync = (qstMainWidget: Widget) => {
	const isEditing = isInPlaceEditingActive();
	const steps = qstMainWidget.get(STEPS) as Widget[];
	const stepsLength = steps.length;
	const { questionWidgets } = extractQuestionsAndOptions(qstMainWidget);
	const dataItem = useDataItem();
	const projectIdSource = qstMainWidget.get(PROJECT_ID_SOURCE) as string;
	const contactIdSource = qstMainWidget.get(CONTACT_ID_SOURCE) as string;
	const activityIdSource = qstMainWidget.get(ACTIVITY_ID_SOURCE) as string;
	const projectIdDataItemField = qstMainWidget.get(PROJECT_ID_DATA_ITEM_FIELD) as string;
	const contactIdDataItemField = qstMainWidget.get(CONTACT_ID_DATA_ITEM_FIELD) as string;
	const activityIdDataItemField = qstMainWidget.get(ACTIVITY_ID_DATA_ITEM_FIELD) as string;

	// Sync Question Positions
	useEffect(() => {
		if (!isEditing) { return; }

		each(questionWidgets, (question, index) => {
			const newPos = (index + 1) * 10;
			if (question.get(POSITION) !== newPos) {
				question.update({ position: newPos });
			}
		});
	}, [steps]);

	// Sync Step Attributes & Form Type
	useEffect(() => {
		if (!isEditing) { return; }
		const steps = qstMainWidget.get(STEPS) as Widget[];
		steps.forEach((step, i) => {
			step.update({
				stepNumber: i + 1,
				isSingleStep: stepsLength === 1,
			});
		});

		qstMainWidget.update({
			formType: stepsLength > 1 ? "multi-step" : "single-step",
		});
	}, [steps]);

	// Sync Context ID Previews
	useEffect(() => {
		if (!isEditing) { return; }
		const updatePreview = (source: string, field: string, key: string) => {
			if (source === "data-item") {
				const value = dataItem?.get(field) as string || "";
				qstMainWidget.update({ [key]: value });
			}
		};

		updatePreview(projectIdSource, projectIdDataItemField, PROJECT_ID_DATA_ITEM_FIELD_VALUE);
		updatePreview(contactIdSource, contactIdDataItemField, CONTACT_ID_DATA_ITEM_FIELD_VALUE);
		updatePreview(activityIdSource, activityIdDataItemField, ACTIVITY_ID_DATA_ITEM_FIELD_VALUE);

	}, [dataItem]);
};