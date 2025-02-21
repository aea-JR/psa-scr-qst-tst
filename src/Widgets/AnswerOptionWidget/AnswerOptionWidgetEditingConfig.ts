import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { isEmpty } from "lodash-es";
import { ANSWER_OPTION_ID, CONTENT, EXTERNAL_ID, IDENTIFIER, IS_BEING_COPIED, IS_CONDITION, POSITION, TEXT } from "../../constants/constants";

Scrivito.provideEditingConfig("QuestionnaireAnswerOptionWidget", {
  initialize: (obj) => {
    if (!obj.get(EXTERNAL_ID)) {
      console.log("setting externalId fron initialize");
      obj.update({ externalId: generateId() });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);
    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get(IS_BEING_COPIED)) {
      console.log(
        "Child widget copied as part of container. No change to externalId.",
      );
      return;
    }
    console.log("Copying child widget");
    child.update({ externalId: generateId(), answerOptionId: null });
  },
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
    [
      IDENTIFIER,
      (identifier: string, { widget }: { widget: Scrivito.Widget }) => {
        if (!isIdentifierUnique(widget, "AnswerOptionWidget")) {
          return "Specify a unique Identifier. There is at least one other option with the same Identfier.";
        }

        if (identifier && !/^[A-Z0-9_]+$/.test(identifier)) {
          return "Specifiy a valid identifier! Follow the PisaSales Schema (A-Z0-9_)";
        }
        if (identifier.length > 32) {
          return "Maximum identifier character length of 32 exceeded!";
        }
      },
    ],
    [
      TEXT,
      (text: string) => {
        if (isEmpty(text)) return "Answer can not be empty.";
      },
    ],
  ],
});
