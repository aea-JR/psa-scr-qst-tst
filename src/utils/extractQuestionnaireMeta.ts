import { Widget } from "scrivito";
import { EXTERNAL_ID, INPUT_TYPE, LOCATION, QST_BUILDER_ORIGIN, TITLE } from "../constants/constants";
export const extractQuestionnaireMeta = (widget: Widget) => {
	const externalId = widget.get(EXTERNAL_ID) as string;
	const inputType = widget.get(INPUT_TYPE) as string;
	const title = widget.get(TITLE) as string;
	const url = widget.get(LOCATION) as string;

	return {
		externalId,
		title,
		inputType,
		origin: QST_BUILDER_ORIGIN,
		url
	}
}