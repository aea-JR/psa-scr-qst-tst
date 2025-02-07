import { useEffect } from "react";
import { isInPlaceEditingActive, Widget } from "scrivito";
import { extractQuestionsAndOptions } from "../../utils/extractQuestionsAndOptions";
import { each } from "lodash-es";
import { useDataItem } from "scrivito";

export const useEditModeSync = (widget: Widget) => {
	const isEditing = isInPlaceEditingActive();
	const steps = widget.get("steps") as Widget[];
	const stepsLength = steps.length;
	const { questionWidgets } = extractQuestionsAndOptions(widget);
	const dataItem = useDataItem();
	const projectIdSource = widget.get("projectIdSource") as string;
	const contactIdSource = widget.get("contactIdSource") as string;
	const activityIdSource = widget.get("activityIdSource") as string;
	const projectIdDataItemField = widget.get("projectIdDataItemField") as string;
	const contactIdDataItemField = widget.get("contactIdDataItemField") as string;
	const activityIdDataItemField = widget.get("activityIdDataItemField") as string;

	// Sync Question Positions
	useEffect(() => {
		if (!isEditing) { return; }

		each(questionWidgets, (question, index) => {
			const newPos = (index + 1) * 10;
			if (question.get("position") !== newPos) {
				question.update({ position: newPos });
			}
		});
	}, [steps]);

	// Sync Step Attributes & Form Type
	useEffect(() => {
		if (!isEditing) { return; }
		const steps = widget.get("steps") as Widget[];
		steps.forEach((step, i) => {
			step.update({
				stepNumber: i + 1,
				isSingleStep: stepsLength === 1,
			});
		});

		widget.update({
			formType: stepsLength > 1 ? "multi-step" : "single-step",
		});
	}, [steps]);

	// Sync Context ID Previews
	useEffect(() => {
		if (!isEditing) { return; }
		const updatePreview = (source: string, field: string, key: string) => {
			if (source === "data-item") {
				const value = dataItem?.get(field) as string || "";
				widget.update({ [key]: value });
			}
		};

		updatePreview(projectIdSource, projectIdDataItemField, "projectIdDataItemFieldValue");
		updatePreview(contactIdSource, contactIdDataItemField, "contactIdDataItemFieldValue");
		updatePreview(activityIdSource, activityIdDataItemField, "activityIdDataItemFieldValue");

	}, [dataItem]);
};