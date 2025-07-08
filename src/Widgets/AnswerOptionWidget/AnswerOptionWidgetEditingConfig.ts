import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { ANSWER_OPTION_ID, CONTENT, EXTERNAL_ID, IDENTIFIER, IS_BEING_COPIED, IS_CONDITION, POSITION, TEXT } from "../../constants/constants";
import { identifierValidation } from "../../utils/validations/identifierValidation";
import answerOptionThumbnail from "../../assets/images/crm-questionnaire-select-option.svg";
import { isEmpty } from "../../utils/lodashPolyfills";

Scrivito.provideEditingConfig("QuestionnaireAnswerOptionWidget", {
  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      obj.update({ externalId: generateId() });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);
    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get(IS_BEING_COPIED)) {
      return;
    }
    child.update({ externalId: generateId(), answerOptionId: null });
  },
  thumbnail: answerOptionThumbnail,
  title: "PisaSales Answer Option",
  titleForContent: (obj) => {
    if (obj.get(IS_CONDITION)) {
      return "PisaSales Answer Option Condition";
    }
    return "PisaSales Answer Option";
  },
  attributes: {
    text: { title: "Answer" },
    identifier: { title: "Identifier" },
    position: { title: "Position" },
    content: { title: "Condition Content" },
    externalId: { title: "External ID" },
    answerOptionId: { title: "Answer Option ID (GID)" },
  },
  initialContent: {
    answerOptionId: null,
    externalId: () => generateId(),
    text: "",
    identifier: "",
    type: null,
    position: null,
    isCondition: false,
  },
  properties: (widget) => {
    const props: any[] = [TEXT, IDENTIFIER, [POSITION, { enabled: false }], [EXTERNAL_ID, { enabled: false }], [ANSWER_OPTION_ID, { enabled: false }]];
    if ((widget.get(CONTENT) as Scrivito.Widget[]).length > 0) {
      props.push(CONTENT);
    }
    return props;
  },
  validations: [
    identifierValidation,
    [
      TEXT,
      (text: string) => {
        if (isEmpty(text)) return "Answer can not be empty.";
      },
    ],
  ],
});
