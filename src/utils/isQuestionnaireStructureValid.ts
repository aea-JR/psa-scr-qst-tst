import { Widget } from "scrivito";
import { isUTCDate } from "./isUTCDate";
import { isPisaDate } from "./isPisaDate";
import { DEFAULT_VALUE, INPUT_TYPE, OPTIONS, TEXT, TITLE, TYPE } from "../constants/constants";
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
    if (question.objClass() == "QuestionnaireSelectQuestionWidget") {
      const options = question.get(OPTIONS) as Widget[];

      const hasEmptyOption = options.some((option) =>
        isEmpty(option.get(TEXT))
      );

      if (hasEmptyOption) {
        return false;
      }
      //TODO: check default value against identifier
    } else if (question.objClass() == "QuestionnaireInputQuestionWidget") {

      // check defaultValue
      const type = question.get(TYPE) as string;
      const defaultValue = question.get(DEFAULT_VALUE) as string || "";
      if (isEmpty((defaultValue.trim()))) {
        continue;
      }
      if (type == "string_single_line" || type == "string_multi_line") {
        continue;
      }
      if (type == "date" || type == "date_time") {
        if (!(isUTCDate(defaultValue) || isPisaDate(defaultValue))) {
          return false;
        }
      }
      if (type == "integer") {
        if (!/^-?\d+$/.test(defaultValue)) {
          return false;
        }
      }
      if (type == "floating_point") {
        if (!/^-?\d+(\.\d+)?$/.test(defaultValue)) {
          return false;
        }
      }
    }

  }
  return true;
};
