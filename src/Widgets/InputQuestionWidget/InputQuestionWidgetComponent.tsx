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
import { ALIGNMENT, DEFAULT_VALUE, EXTERNAL_ID, HELP, MANDATORY, PLACEHOLDER, QUESTION_ID, STRING_SINGLE_LINE, TEXT, TYPE, VALIDATION_TEXT } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { useValidationField } from "../../hooks/useValidationField";
import "./InputQuestionWidget.scss";

provideComponent(QuestionnaireInputQuestionWidget, ({ widget }) => {
  const id = `questionnaire_input_widget_${widget.id()}`;
  const externalId = widget.get(EXTERNAL_ID);
  const required = widget.get(MANDATORY);
  const placeholder = widget.get(PLACEHOLDER);
  const title = widget.get(TEXT);
  const helpText = widget.get(HELP);
  const defaultValue = widget.get(DEFAULT_VALUE);
  const type = widget.get(TYPE) || STRING_SINGLE_LINE;
  const questionId = widget.get(QUESTION_ID);
  const alignment = widget.get(ALIGNMENT) as string || "left";
  const validationText = widget.get(VALIDATION_TEXT) || "Please fill out this field";

  const { values, handleChange } = useAnswer(questionId, [defaultValue]);
  const validator = useValidationField(externalId, required);


  useExternalId(widget);

  useEffect(() => {
    if (isInPlaceEditingActive()) {
      handleChange([defaultValue]);
    }
  }, [defaultValue]);


  const ctx = useFormContext();
  if (!ctx || !validator) {
    return <QuestionnaireMessageBlock status="noFormContext" />
  }

  const isInvalid = !validator.isLocallyValid;

  const onInputChange = (newValues: string[], identifiers?: string[]) => {
    required && validator.setIsLocallyValid(!isEmpty(newValues[0]));
    handleChange(newValues, identifiers)
  }
  const inputComponents = {
    string_single_line: StringSingleLineInput,
    string_multi_line: StringMultiLineInput,
    integer: NumberInput,
    floating_point: NumberInput,
    date: DateInput,
    date_time: DateTimeInput,
  } as const;

  type InputType = keyof typeof inputComponents;

  const InputComponent = inputComponents[type as InputType] || StringSingleLineInput;

  return (
    <div ref={validator.ref} className={`mb-3 form-input-container ${type} ${alignment}`}>
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
        isInvalid={isInvalid}
        onInputChange={onInputChange}
      />
      {isInvalid && <div className={`invalid-feedback ${alignment}`}>
        {validationText}
      </div>}
    </div>
  );
});