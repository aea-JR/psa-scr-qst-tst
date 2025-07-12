import { provideComponent } from "scrivito";
import { QuestionnaireCheckboxQuestionWidget } from "./CheckboxWidgetClass";
import { SingleCheckbox } from "./Checkboxes/SingleCheckbox";
import { TriStateCheckbox } from "./Checkboxes/TriStateCheckbox";
import { useExternalId } from "../../hooks/useExternalId";
import { TYPE, MANDATORY, EXTERNAL_ID, QUESTION_ID, IDENTIFIER, HELP, DEFAULT_VALUE } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import "./CheckboxWidget.scss";

provideComponent(QuestionnaireCheckboxQuestionWidget, ({ widget }) => {
  const type = widget.get(TYPE) || "logic";
  const required = widget.get(MANDATORY);
  const externalId = widget.get(EXTERNAL_ID);
  const questionId = widget.get(QUESTION_ID);
  const identifier = widget.get(IDENTIFIER);
  const help = widget.get(HELP);
  const defaultValue = widget.get(DEFAULT_VALUE);

  const ctx = useFormContext();

  useExternalId(widget);

  if (!ctx) {
    return <QuestionnaireMessageBlock status="noContext" />
  }

  return type === "logic_tristate" ? (
    <TriStateCheckbox
      required={required}
      externalId={externalId}
      questionId={questionId}
      identifier={identifier}
      help={help}
      widget={widget}
      defaultValue={defaultValue}
    />
  ) : (
    <SingleCheckbox
      required={required}
      externalId={externalId}
      questionId={questionId}
      identifier={identifier}
      help={help}
      widget={widget}
      defaultValue={defaultValue}

    />
  );
});