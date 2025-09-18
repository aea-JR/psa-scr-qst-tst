import { Widget } from "scrivito"
import { INPUT_TYPE, ONCE_UPDATABLE } from "../constants/constants";

/**
 * Determines whether the usage of a questionnaire widget is allowed on the current page.
 * The questionnaire is only allowed on **restricted sites**. 
 * @param qstMainWidget 
 * @returns `true`, if usage is restricted for the current site, otherwise `false`.
 */
export const isUsageRestricted = (qstMainWidget: Widget): boolean => {
	return !qstMainWidget.obj().isRestricted();
};

/**
 * Determines whether the usage of inputType ONCE_UPDATABLE is allowed on the current page.
 * The type is only allowed on **restricted sites**. 
 * @param qstMainWidget 
 * @returns `true`, if type is restricted for the current site, otherwise `false`.
 */
export const isInputTypeRestricted = (qstMainWidget: Widget): boolean => {
	const inputType = qstMainWidget.get(INPUT_TYPE);
	return inputType == ONCE_UPDATABLE && isUsageRestricted(qstMainWidget);
};