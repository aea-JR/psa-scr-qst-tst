import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { SelectQuestionWidget } from "./SelectQuestionWidgetClass";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { Dropdown } from "./Dropdown";
import { Select } from "./Select";
import { ConditionProvider } from "../../contexts/ConditionContext";
import { useSelectQuestion } from "./useSelectQuestion";
import "./SelectQuestionWidget.scss";

provideComponent(SelectQuestionWidget, ({ widget }) => {

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
    onChangeSelect,
    getConditionData,
  } = useSelectQuestion(widget);

  return (
    <ConditionProvider value={{ getConditionData }}>
      <>
        {useAsConditionals && isInPlaceEditingActive() && (
          <span className="header-info" style={{ backgroundColor: titleBgColor || "transparent" }}>Conditional Header</span>
        )}
        <div className={`select-container mb-3 ${useAsConditionals ? "conditional-header-border" : ""}`} >
          {type == "string_dropdown" ?
            (<Dropdown
              widget={widget}
              externalId={externalId}
              required={required}
              onChange={onChangeSelect}
              title={text}
              value={values[0]}
            />)
            :
            (<>
              {text && <div className="select-title">
                <ContentTag
                  attribute="text"
                  content={widget}
                  tag="span"
                />
                {!isMultiSelect && required && <Mandatory />}
                {helpText && <HelpText widget={widget} />}
              </div>
              }
              <Select
                type={type}
                options={options}
                required={required}
                externalId={externalId}
                values={values}
                onChange={onChangeSelect}
              />
            </>)
          }
        </div>
        {useAsConditionals &&
          <ContentTag content={widget} attribute="options" />
        }
      </>
    </ConditionProvider >
  );
});