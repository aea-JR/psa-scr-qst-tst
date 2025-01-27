import { currentPage, Widget } from "scrivito"

export const isRestricted = (widget: Widget): boolean => {
	//TODO: uncomment when repeatable gets implemented
	// const mode =  widget.get("inputType") as string;
	// if (mode === "repeatable") {
	// 	return false;
	// }
	return !currentPage()?.isRestricted() || false;
}
