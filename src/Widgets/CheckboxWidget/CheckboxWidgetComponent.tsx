import { provideComponent } from "scrivito";
import { QuestionnaireCheckboxQuestionWidget } from "./CheckboxWidgetClass";
import { SingleCheckbox } from "./Checkboxes/SingleCheckbox";
import { TriStateCheckbox } from "./Checkboxes/TriStateCheckbox";
import { useExternalId } from "../../hooks/useExternalId";
import { TYPE, MANDATORY, EXTERNAL_ID, QUESTION_ID, IDENTIFIER, HELP, DEFAULT_VALUE, ALIGNMENT, VALIDATION_TEXT } from "../../constants/constants";
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
  const alignment = widget.get(ALIGNMENT) || "left";
  const validationText = widget.get(VALIDATION_TEXT) || "Please tick the box";

  const ctx = useFormContext();

  useExternalId(widget);

  if (!ctx) {
    return <QuestionnaireMessageBlock status="noFormContext" />
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
      alignment={alignment}
      validationText={validationText}
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
      alignment={alignment}
      validationText={validationText}
    />
  );
});