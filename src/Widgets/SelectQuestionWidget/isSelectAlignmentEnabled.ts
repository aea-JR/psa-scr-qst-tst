import { Widget } from "scrivito";
import { INLINE_VIEW, STRING_CHECKBOXES, STRING_RADIO, TYPE } from "../../constants/constants";

export const isAlignmentEnabled = (widget: Widget) => {
	const inlineViewEnabled = widget.get(INLINE_VIEW) as boolean;
	// const floatingLabelEnabled = widget.get("useFloatingLabel") as boolean;
	const type = widget.get(TYPE) as string;
	// if (type == "string_dropdown") {
	// 	return !floatingLabelEnabled;
	// }
	if (type == STRING_RADIO || type == STRING_CHECKBOXES) {
		return inlineViewEnabled;
	}
	return true;
}
