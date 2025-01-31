import { ChangeEvent, useCallback, useEffect, useMemo } from "react";
import * as Scrivito from "scrivito";
import "./DropdownQuestionWidget.scss";
import { DropdownQuestionWidget } from "./DropdownQuestionWidgetClass";
import { each, find, isEmpty } from "lodash-es";
import { DropdownOption } from "../../Components/DropdownOption";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { HelpText } from "../../Components/HelpText/HelpText";
import { useExternalId } from "../../hooks/useExternalId";
import { useAnswer } from "../../hooks/useAnswer";

Scrivito.provideComponent(DropdownQuestionWidget, ({ widget }) => {
  const id = `questionnaire_dropdown_widget_${widget.id()}`;
  const externalId = widget.get("externalId");
  const required = widget.get("mandatory");
  const title = widget.get("text");
  const helpText = widget.get("help");
  const defaultValue = widget.get("defaultValue");
  const addEmptyOption = widget.get("emptyOption");
  const options = widget.get("options");
  const questionId = widget.get("questionId");

  const getInitialValueAndIdentifier = useCallback(() => {
    if (!isEmpty(defaultValue)) {
      const defaultOption = find(options, (option) =>
        defaultValue.includes(option.get("identifier") as string)
      );
      if (defaultOption) {
        return {
          value: defaultOption.get("text") as string,
          identifier: defaultOption.get("identifier") as string,
        };
      }
    }
    return { value: "", identifier: "" };
  }, [defaultValue, options]);

  const initialValues = useMemo(() => getInitialValueAndIdentifier(), [getInitialValueAndIdentifier]);


  const { values, handleChange } = useAnswer(questionId, [initialValues.value], [initialValues.identifier]);

  useExternalId(widget);

  useEffect(() => {
    if (!Scrivito.isInPlaceEditingActive()) {
      return;
    }
    each(options, (option, index) => {
      if (!option.get("type")) {
        option.update({ type: "dropdown" });
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
      <div className="dropdown-wrapper">
        {title && (
          <label htmlFor={id} className="dropdown-label">
            <Scrivito.ContentTag
              attribute="text"
              content={widget}
              tag="span"
            />
            {required && <Mandatory />}
            {helpText && <HelpText widget={widget} />}
          </label>
        )}
        <select
          className="dropdown-select form-select form-control"
          name={externalId}
          id={id}
          required={required}
          onChange={onChange}
          value={values[0]}
        >
          {addEmptyOption && (
            <DropdownOption
              value=""
              id="empty-option"
              key="empty-option"
              identifier=""
            />
          )}
          {options.map((option) => (
            <DropdownOption
              value={option.get("text") as string}
              id={option.id()}
              key={option.id()}
              identifier={option.get("identifier") as string}
            />
          ))}

        </select>

      </div>
    </div>
  );
});