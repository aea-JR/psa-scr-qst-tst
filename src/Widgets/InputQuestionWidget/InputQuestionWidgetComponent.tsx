import { useEffect } from "react";
import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { isEmpty } from "lodash-es";
import { InputQuestionWidget } from "./InputQuestionWidgetClass";
import { HelpText } from "../../Components/HelpText/HelpText";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import "./InputQuestionWidget.scss";
import { useExternalId } from "../../hooks/useExternalId";
import { useAnswer } from "../../hooks/useAnswer";
import { StringSingleLineInput } from "./Inputs/StringSingleLineInput";
import { StringMultiLineInput } from "./Inputs/StringMultiLineInput";
import { NumberInput } from "./Inputs/NumberInput";
import { DateInput } from "./Inputs/DateInput";
import { DateTimeInput } from "./Inputs/DateTimeInput";

provideComponent(InputQuestionWidget, ({ widget }) => {
  const id = `questionnaire_input_widget_${widget.id()}`;
  const externalId = widget.get("externalId");
  const required = widget.get("mandatory");
  const placeholder = widget.get("placeholder");
  const title = widget.get("text");
  const helpText = widget.get("help");
  const defaultValue = widget.get("defaultValue");
  const type = widget.get("type") || "string_single_line";
  const questionId = widget.get("questionId");

  const { values, handleChange } = useAnswer(questionId, [defaultValue]);

  useExternalId(widget);

  useEffect(() => {
    if (isInPlaceEditingActive()) {
      handleChange([defaultValue]);
    }
  }, [defaultValue]);

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
          <ContentTag attribute="text" content={widget} tag="span" />
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