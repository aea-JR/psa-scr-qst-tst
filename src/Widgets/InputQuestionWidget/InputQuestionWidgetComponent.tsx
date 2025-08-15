import { useEffect } from "react";
import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { isEmpty } from "../../utils/lodashPolyfills";
import { QuestionnaireInputQuestionWidget } from "./InputQuestionWidgetClass";
import { HelpText } from "../../Components/HelpText/HelpText";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { useExternalId } from "../../hooks/useExternalId";
import { useAnswer } from "../../hooks/useAnswer";
import { StringSingleLineInput } from "./Inputs/StringSingleLineInput";
import { StringMultiLineInput } from "./Inputs/StringMultiLineInput";
import { NumberInput } from "./Inputs/NumberInput";
import { DateInput } from "./Inputs/DateInput";
import { DateTimeInput } from "./Inputs/DateTimeInput";
import { DEFAULT_VALUE, EXTERNAL_ID, HELP, MANDATORY, PLACEHOLDER, QUESTION_ID, TEXT, TYPE } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import "./InputQuestionWidget.scss";

provideComponent(QuestionnaireInputQuestionWidget, ({ widget }) => {
  const id = `questionnaire_input_widget_${widget.id()}`;
  const externalId = widget.get(EXTERNAL_ID);
  const required = widget.get(MANDATORY);
  const placeholder = widget.get(PLACEHOLDER);
  const title = widget.get(TEXT);
  const helpText = widget.get(HELP);
  const defaultValue = widget.get(DEFAULT_VALUE);
  const type = widget.get(TYPE) || "string_single_line";
  const questionId = widget.get(QUESTION_ID);

  const { values, handleChange } = useAnswer(questionId, [defaultValue]);

  useExternalId(widget);

  useEffect(() => {
    if (isInPlaceEditingActive()) {
      handleChange([defaultValue]);
    }
  }, [defaultValue]);

  const ctx = useFormContext();
  if (!ctx) {
    return <QuestionnaireMessageBlock status="noFormContext" />
  }

  const inputComponents = {
    string_single_line: StringSingleLineInput,
    string_multi_line: StringMultiLineInput,
    integer: NumberInput,
    float: NumberInput,
    date: DateInput,
    date_time: DateTimeInput,
  } as const;

  type InputType = keyof typeof inputComponents;

  const InputComponent = inputComponents[type as InputType] || StringSingleLineInput;

  return (
    <div className={`mb-3 form-input-container ${type}`}>
      {!isEmpty(title) && (
        <label htmlFor={id} className="input-label">
          <ContentTag attribute={TEXT} content={widget} tag="span" />
          {required && <Mandatory />}
          {helpText && <HelpText widget={widget} />}
        </label>
      )}
      <InputComponent
        id={id}
        externalId={externalId}
        placeholder={placeholder}
        value={values[0]}
        type={type}
        defaultValue={defaultValue}
        required={required}
        onInputChange={handleChange}
      />
    </div>
  );
});