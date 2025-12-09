import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { QuestionnaireSelectQuestionWidget } from "./SelectQuestionWidgetClass";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { Dropdown } from "./Dropdown";
import { Select } from "./Select";
import { ConditionProvider } from "../../contexts/ConditionContext";
import { useSelectQuestion } from "./useSelectQuestion";
import { OPTIONS, STRING_DROPDOWN, TEXT } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { ResetRadioInputsButton } from "./ResetRadioInputsButton";
import "./SelectQuestionWidget.scss";

provideComponent(QuestionnaireSelectQuestionWidget, ({ widget }) => {

  const {
    externalId,
    required,
    text,
    helpText,
    options,
    type,
    useAsConditionals,
    values,
    titleBgColor,
    clearSelectionButtonText,
    inlineView,
    alignment,
    validationText,
    validator,
    onChangeSelect,
    getConditionData,
    showReset,
    onReset
  } = useSelectQuestion(widget);

  const ctx = useFormContext();
  if (!ctx || !validator) {
    return <QuestionnaireMessageBlock status="noFormContext" />
  }

  const isInvalid = required && !validator.isLocallyValid;

  return (
    <ConditionProvider value={{ getConditionData }}>
      <>
        {useAsConditionals && isInPlaceEditingActive() && (
          <span className="header-info" style={{ backgroundColor: titleBgColor || "transparent" }}>Conditional Header</span>
        )}
        <div ref={validator.ref} className={`select-container mb-3 ${useAsConditionals ? "conditional-header-border" : ""}`} >
          {type == STRING_DROPDOWN ?
            (
              <div className={alignment}>
                <Dropdown
                  widget={widget}
                  externalId={externalId}
                  required={required}
                  isInvalid={isInvalid}
                  onChange={onChangeSelect}
                  title={text}
                  value={values[0]}
                />
              </div>
            )
            :
            (<div className={alignment}>
              {text && <div className="select-title">
                <ContentTag
                  attribute={TEXT}
                  content={widget}
                  tag="span"
                />
                {required && <Mandatory />}
                {helpText && <HelpText widget={widget} />}
              </div>
              }
              <Select
                type={type}
                options={options}
                required={required}
                isInvalid={isInvalid}
                externalId={externalId}
                values={values}
                inlineView={inlineView}
                onChange={onChangeSelect}
              />
              {showReset() && (
                <ResetRadioInputsButton
                  onReset={onReset}
                  text={clearSelectionButtonText}
                  parentRef={validator.ref}
                />
              )}
            </div>)
          }
          {isInvalid && <div className={`invalid-feedback ${alignment}`}>
            {validationText}
          </div>}
        </div>
        {useAsConditionals &&
          <ContentTag content={widget} attribute={OPTIONS} />
        }
      </>
    </ConditionProvider >
  );
});