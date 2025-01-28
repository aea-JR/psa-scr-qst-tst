import { Obj, Widget } from "scrivito"

/**
 * Determines whether the usage of a questionnaire widget is allowed on the current page.
 * The questionnaire is only allowed on **restricted sites**. 
 * @param qstMainWidget 
 * @returns `true`, if usage is restricted for the current site, otherwise `false`.
 */
export const isUsageRestricted = (qstMainWidget: Widget): boolean => {
	let currentContainer = qstMainWidget.container();

	while (currentContainer) {
		if (currentContainer instanceof Obj) {
			return !currentContainer.isRestricted();
		}
		if (currentContainer instanceof Widget) {
			currentContainer = currentContainer.container();
		} else {
			console.warn("Unexpected structure: Widget is not part of a valid Obj.");
			break;
		}
	}
	console.error("Widget is not placed on any site.");
	return false;
};
