import { useCallback, useEffect, useMemo, useState } from "react";
import * as Scrivito from "scrivito";
import "./DropdownQuestionWidget.scss";
import { DropdownQuestionWidget } from "./DropdownQuestionWidgetClass";
import { each, find, isEmpty } from "lodash-es";
import { DropdownOption } from "../../Components/DropdownOption";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { useExternalId } from "../../hooks/useExternalId";
import { useAnswer } from "../../hooks/useAnswer";
import { Dropdown } from "./Dropdown";
import { Select } from "./Select";


Scrivito.provideComponent(DropdownQuestionWidget, ({ widget }) => {
  const id = `questionnaire_dropdown_widget_${widget.id()}`;
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


  //TODO: move to hook
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

  useExternalId(widget);

  useEffect(() => {
    if (!Scrivito.isInPlaceEditingActive()) {
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


  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption =
      event.target.options[event.target.selectedIndex];
    const value = selectedOption.value;
    const identifier = selectedOption.dataset.identifier || "";
    handleChange([value], [identifier])
  };

  return (

      <div className="select-container mb-3">
        {type == "string_dropdown" ?
          (<Dropdown
            widget={widget}
            externalId={externalId}
            required={required}
            id={id}
            onChange={handleChange}
            title={text}
            value={values[0]}
            addEmptyOption={addEmptyOption}
          />)
          :
          (<>
            {text && <div className="select-title">
              <Scrivito.ContentTag
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
              widget={widget}
              externalId={externalId}
              values={values}
              onChange={handleChange}
            />
          </>)
        }
      </div>

  );
});