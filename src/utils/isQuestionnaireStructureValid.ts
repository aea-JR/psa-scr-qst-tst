import { Widget } from "scrivito";
import { isUTCDate } from "./isUTCDate";
import { isPisaDate } from "./isPisaDate";
import { DATE, DATE_TIME, DEFAULT_VALUE, FLOATING_POINT, INPUT_TYPE, INTEGER, OPTIONS, QUESTIONNNAIRE_INPUT_QUESTION_WIDGET, QUESTIONNNAIRE_SELECT_QUESTION_WIDGET, STRING_MULTI_LINE, STRING_SINGLE_LINE, TEXT, TITLE, TYPE } from "../constants/constants";
import { getQuestionWidgets } from "./getQuestionWidgets";
import { hasContext } from "./hasContext";
import { isEmpty } from "./lodashPolyfills";

export const isQuestionnaireStructureValid = (qstMainWidget: Widget): boolean => {
  const title = qstMainWidget.get(TITLE) as string;
  const type = qstMainWidget.get(INPUT_TYPE);

  if (isEmpty(title) || isEmpty(type)) {
    return false;
  }
  if (!hasContext(qstMainWidget)) {
    return false;
  }
  const questions = getQuestionWidgets(qstMainWidget);
  if (isEmpty(questions)) {
    return false;
  }
  // check questions & options
  for (const question of questions) {
    // text
    if (isEmpty(question.get(TEXT))) {
      return false;
    }
    // type
    if (isEmpty(question.get(TYPE))) {
      return false;
    }
    if (question.objClass() == QUESTIONNNAIRE_SELECT_QUESTION_WIDGET) {
      const options = question.get(OPTIONS) as Widget[];

      const hasEmptyOption = options.some((option) =>
        isEmpty(option.get(TEXT))
      );

      if (hasEmptyOption) {
        return false;
      }
      //TODO: check default value against identifier
    } else if (question.objClass() == QUESTIONNNAIRE_INPUT_QUESTION_WIDGET) {

      // check defaultValue
      const type = question.get(TYPE) as string;
      const defaultValue = question.get(DEFAULT_VALUE) as string || "";
      if (isEmpty((defaultValue.trim()))) {
        continue;
      }
      if (type == STRING_SINGLE_LINE || type == STRING_MULTI_LINE) {
        continue;
      }
      if (type == DATE || type == DATE_TIME) {
        if (!(isUTCDate(defaultValue) || isPisaDate(defaultValue))) {
          return false;
        }
      }
      if (type == INTEGER) {
        if (!/^-?\d+$/.test(defaultValue)) {
          return false;
        }
      }
      if (type == FLOATING_POINT) {
        if (!/^-?\d+(\.\d+)?$/.test(defaultValue)) {
          return false;
        }
      }
    }

  }
  return true;
};
