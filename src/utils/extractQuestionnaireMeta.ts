import { Widget } from "scrivito";

export const extractQuestionnaireMeta = (widget: Widget) => {
	const externalId = widget.get("externalId") as string;
	const inputType = widget.get("inputType") as string;
	const title = widget.get("title") as string;
	return {
		externalId: externalId,
		title: title,
		inputType: inputType,
	}
}