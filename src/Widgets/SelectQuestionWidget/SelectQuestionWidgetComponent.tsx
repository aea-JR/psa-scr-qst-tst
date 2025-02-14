import { useCallback, useEffect, useMemo, useState } from "react";
import { ContentTag, isInPlaceEditingActive, provideComponent } from "scrivito";
import { SelectQuestionWidget } from "./SelectQuestionWidgetClass";
import { each, find, isEmpty } from "lodash-es";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { useExternalId } from "../../hooks/useExternalId";
import { useAnswer } from "../../hooks/useAnswer";
import { Dropdown } from "./Dropdown";
import { Select } from "./Select";
import { ConditionProvider } from "../../contexts/ConditionContext";
import { useDynamicBackground } from "../../hooks/useDynamicBackground";
import "./SelectQuestionWidget.scss";


provideComponent(SelectQuestionWidget, ({ widget }) => {
  const externalId = widget.get("externalId");
  const required = widget.get("mandatory");
  const text = widget.get("text");
  const helpText = widget.get("help");
  const defaultValue = widget.get("defaultValue");
  const addEmptyOption = widget.get("emptyOption");
  const options = widget.get("options");
  const questionId = widget.get("questionId");
  const type = widget.get("type") || "string_dropdown";
  const isMultiSelect = type == "string_checkboxes";
  const useAsCondtionals = widget.get("enableConditionals") as boolean || false;

  const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>([]);

  //TODO: move to hook
  //TODO: handle initial selection for conditions
  //TODO: hamdle answer reset after condition change
  const getInitialValueAndIdentifiers = useCallback(() => {
    if (isEmpty(defaultValue)) {
      return { values: [""], identifiers: [""] };
    }
    if (isMultiSelect) {
      const selectedOptions = options.filter((option) =>
        defaultValue.includes(option.get("identifier") as string)
      );
      return {
        values: selectedOptions.map((option) => option.get("text") as string),
        identifiers: selectedOptions.map((option) => option.get("identifier") as string),
      };
    } else {
      const defaultOption = find(options, (option) =>
        defaultValue.includes(option.get("identifier") as string)
      );
      if (defaultOption) {
        return {
          values: [defaultOption.get("text") as string],
          identifiers: [defaultOption.get("identifier") as string],
        };
      }
    }

    return { values: [""], identifiers: [""] };
  }, [defaultValue, options, isMultiSelect]);

  const initialValues = useMemo(() => getInitialValueAndIdentifiers(), [getInitialValueAndIdentifiers]);

  const { values, handleChange } = useAnswer(questionId, initialValues.values, initialValues.identifiers);
  const titleBgColor = useDynamicBackground(".header-info");
  useExternalId(widget);

  useEffect(() => {
    if (!isInPlaceEditingActive()) {
      return;
    }
    each(options, (option, index) => {
      if (!option.get("type")) {
        const realType = type == "string_dropdown" ? "dropdown" : type == "string_checkboxes" ? "checkbox" : "radio";
        option.update({ type: realType });
      }
      if (option.get("position") !== (index + 1) * 10) {
        option.update({ position: (index + 1) * 10 });
      }
    })
  }, [options]);

  useEffect(() => {
    each(options, o => o.update({ isCondition: useAsCondtionals }))
  }, [useAsCondtionals]);

  const onChangeSelect = (externalIds: string[], newValues: string[], identifiers?: string[]) => {
    setSelectedConditionIds(externalIds);
    handleChange(newValues, identifiers);
  }

  const getConditionData = (externalId: string) => {
    let isActive = false;
    options.some(condition => {
      if (condition.get("externalId") === externalId) {
        isActive = selectedConditionIds.includes(externalId);
        return true;
      }
      return false;
    });
    return { isActive };
  };

  return (
    <ConditionProvider value={{ getConditionData }}>
      <>
        {useAsCondtionals && isInPlaceEditingActive() && (
          <span className="header-info" style={{ backgroundColor: titleBgColor || "transparent" }}>Conditional Header</span>
        )}
        <div className={`select-container mb-3 ${useAsCondtionals ? "conditional-header-border" : ""}`} >
          {type == "string_dropdown" ?
            (<Dropdown
              widget={widget}
              externalId={externalId}
              required={required}
              onChange={onChangeSelect}
              title={text}
              value={values[0]}
              addEmptyOption={addEmptyOption}
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
        {useAsCondtionals &&
          <ContentTag content={widget} attribute="options" />
        }
      </>

    </ConditionProvider >
  );
});