import { each, filter, find, isEmpty, isNil, some } from "lodash-es";
import { Widget } from "scrivito";

export const isQuestionnaireCreationValid = (widget: Widget): boolean => {
  const title = widget.get("title") as string;
  //TODO: check id if we stick to let user change it before creation.
  const externalId = widget.get("externalId") as string;
  if (isEmpty(title)) {
    return false;
  }
  const allWidgets = widget.widgets();
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
      c.objClass() == "DropdownQuestionWidget",
  );
  if (isEmpty(questions)) {
    return false;
  }
  // check questions & options
  for (const question of questions) {
    if (isEmpty(question.get("text"))) {
      return false;
    }
    if (question.objClass() == "DropdownQuestionWidget") {
      const options = question.get("options") as Widget[];

      const hasEmptyOption = some(options, (option) =>
        isEmpty(option.get("text"))
      );

      if (hasEmptyOption) {
        return false;
      }
      //TODO: check default value against identifier
    }
  }


  return true;
};
