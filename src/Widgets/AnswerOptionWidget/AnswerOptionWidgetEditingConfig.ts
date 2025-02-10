import * as Scrivito from "scrivito";
import generateId from "../../utils/idGenerator";
import { isIdentifierUnique } from "../../utils/isIdentifierUnique";
import { getQuestionnaireContainerWidget } from "../../utils/getQuestionnaireContainerWidget";
import { isEmpty } from "lodash-es";

Scrivito.provideEditingConfig("AnswerOptionWidget", {
  initialize: (obj) => {
    if (!obj.get("externalId")) {
      console.log("setting externalId fron initialize");
      obj.update({ externalId: generateId() });
    }
  },
  initializeCopy: (child) => {
    const parent = getQuestionnaireContainerWidget(child as any);
    // Skip updating externalId if the parent container is marked as being copied
    if (parent && parent.get("isBeingCopied")) {
      console.log(
        "Child widget copied as part of container. No change to externalId.",
      );
      return;
    }
    console.log("Copying child widget");
    child.update({ externalId: generateId(), answerOptionId: null });
  },
  title: "PisaSales Answer Option",
  attributes: {
    text: { title: "Answer" },
    identifier: { title: "Identifier" },
    position: { title: "Position" }
  },
  initialContent: {
    answerOptionId: null,
    externalId: () => generateId(),
    text: "",
    identifier: "",
    type: null,
    position: null
  },
  properties: (widget) => {
    return ["text", "identifier", ["position", { enabled: false }], ["externalId", { enabled: false }], ["answerOptionId", { enabled: false }]];
  },
  validations: [
    [
      "identifier",
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
      "text",
      (text: string) => {
        if (isEmpty(text)) return "Answer can not be empty.";
      },
    ],
  ],
});
