import { filter, isEmpty, isNil, some } from "lodash-es";
import { Widget } from "scrivito";
import { isUTCDate } from "./isUTCDate";
import { isPisaDate } from "./isPisaDate";

export const isQuestionnaireStructureValid = (qstMainWidget: Widget): boolean => {
  const title = qstMainWidget.get("title") as string;

  if (isEmpty(title)) {
    return false;
  }
  const allWidgets = qstMainWidget.widgets();
  if (isNil(allWidgets)) {
    return false;
  }
  if (allWidgets.length <= 0) {
    return false;
  }
  //TODO: improve
  const questions = filter(
    allWidgets,
    (c) =>
      c.objClass() == "InputQuestionWidget" ||
      c.objClass() == "SelectQuestionWidget",
  );
  if (isEmpty(questions)) {
    return false;
  }
  // check questions & options
  for (const question of questions) {
    if (isEmpty(question.get("text"))) {
      return false;
    }
    if (question.objClass() == "SelectQuestionWidget") {
      const options = question.get("options") as Widget[];

      const hasEmptyOption = some(options, (option) =>
        isEmpty(option.get("text"))
      );

      if (hasEmptyOption) {
        return false;
      }
      //TODO: check default value against identifier
    } else if (question.objClass() == "InputQuestionWidget") {

      // check defaultValue
      const type = question.get("type") as string;
      const defaultValue = question.get("defaultValue") as string || "";
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
