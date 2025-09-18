import { Widget } from "scrivito";
import { INLINE_VIEW, TYPE } from "../../constants/constants";

export const isAlignmentEnabled = (widget: Widget) => {
	const inlineViewEnabled = widget.get(INLINE_VIEW) as boolean;
	// const floatingLabelEnabled = widget.get("useFloatingLabel") as boolean;
	const type = widget.get(TYPE) as string;
	// if (type == "string_dropdown") {
	// 	return !floatingLabelEnabled;
	// }
	if (type == "string_radio" || type == "string_checkboxes") {
		return inlineViewEnabled;
	}
	return true;
}
