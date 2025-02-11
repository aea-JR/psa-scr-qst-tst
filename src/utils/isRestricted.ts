import { Obj, Widget } from "scrivito"

/**
 * Determines whether the usage of a questionnaire widget is allowed on the current page.
 * The questionnaire is only allowed on **restricted sites**. 
 * @param qstMainWidget 
 * @returns `true`, if usage is restricted for the current site, otherwise `false`.
 */
export const isUsageRestricted = (qstMainWidget: Widget): boolean => {
	return !qstMainWidget.obj().isRestricted();
};
