// import React, { useCallback, useEffect, useState } from "react";
// import { debounce, first, isEmpty } from "lodash-es";
// import { useFormContext } from "../../contexts/FormContext";
// import { InputQuestionWidget } from "./InputQuestionWidgetClass";
// import { ContentTag, provideComponent } from "scrivito";
// import { HelpText } from "../../Components/HelpText/HelpText";
// import { Mandatory } from "../../Components/Mandatory/Mandatory";
// import "./InputQuestionWidget.scss";
// import { useExternalId } from "../../hooks/useExternalId";
// provideComponent(InputQuestionWidget, ({ widget }) => {
//   const id = `questionnaire_input_widget_${widget.id()}`;
//   const externalId = widget.get("externalId");
//   const required = widget.get("required");
//   const placeholder = widget.get("placeholder");
//   const title = widget.get("title");
//   const helpText = widget.get("helpText");
//   const defaultValue = widget.get("defaultValue");
//   const type = widget.get("type") || "string_single_line";
//   const identifier = widget.get("identifier");
//   const questionId = widget.get("questionId");
//   const [value, setValue] = useState(defaultValue);

//   const { onChange, getAnswer } = useFormContext();

//   useExternalId(widget);

//   useEffect(() => {
//     if (!isEmpty(questionId)) {
//       onChange(questionId, [defaultValue]);
//     }
//   }, []);

//   useEffect(() => {
//     if (questionId) {
//       console.log("answer: ", getAnswer(questionId))
//       const answer = getAnswer(questionId);
//       if (answer) {
//         const value = first(answer.value) || "";
//         setValue(value);
//       }

//     }

//   }, [getAnswer])

//   const debouncedChangeHandler = useCallback(
//     debounce((value: string) => {
//       onChange(questionId, [value]);
//     }, 300),
//     [onChange, questionId, identifier]
//   );

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
//   ) => {
//     debouncedChangeHandler(event.target.value);
//   };


//   return (
//     <div className={`mb-3 form-input-container`}>
//       {!isEmpty(title) && (
//         <label htmlFor={id} className="input-label">
//           <ContentTag attribute="title" content={widget} tag="span" />
//           {required && <Mandatory />}
//           {helpText && <HelpText widget={widget} />}
//         </label>
//       )}

//       {type === "string_multi_line" ? (
//         <textarea
//           className="form-control"
//           id={id}
//           name={externalId}
//           maxLength={2000}
//           placeholder={placeholder}
//           value={value}
//           required={required}
//           onChange={handleInputChange}
//           rows={3}
//         />
//       ) : (
//         <input
//           className="form-control"
//           id={id}
//           name={externalId}
//           maxLength={2000}
//           placeholder={placeholder}
//           value={value}
//           required={required}
//           onChange={handleInputChange}
//           type={"text"}
//         />
//       )}
//     </div>
//   );
// });





import React, { useCallback, useEffect, useState } from "react";
import { debounce, first, isEmpty } from "lodash-es";
import { useFormContext } from "../../contexts/FormContext";
import { InputQuestionWidget } from "./InputQuestionWidgetClass";
import { ContentTag, provideComponent } from "scrivito";
import { HelpText } from "../../Components/HelpText/HelpText";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import "./InputQuestionWidget.scss";
import { useExternalId } from "../../hooks/useExternalId";
import { useAnswer } from "../../hooks/useAnswer";
provideComponent(InputQuestionWidget, ({ widget }) => {
  const id = `questionnaire_input_widget_${widget.id()}`;
  const externalId = widget.get("externalId");
  const required = widget.get("required");
  const placeholder = widget.get("placeholder");
  const title = widget.get("title");
  const helpText = widget.get("helpText");
  const defaultValue = widget.get("defaultValue");
  const type = widget.get("type") || "string_single_line";
  //const identifier = widget.get("identifier");
  const questionId = widget.get("questionId");

  const { values, handleChange } = useAnswer(questionId, [defaultValue]);

  useExternalId(widget);


  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    handleChange([event.currentTarget.value], [""])
  };


  return (
    <div className={`mb-3 form-input-container`}>
      {!isEmpty(title) && (
        <label htmlFor={id} className="input-label">
          <ContentTag attribute="title" content={widget} tag="span" />
          {required && <Mandatory />}
          {helpText && <HelpText widget={widget} />}
        </label>
      )}

      {type === "string_multi_line" ? (
        <textarea
          className="form-control"
          id={id}
          name={externalId}
          maxLength={2000}
          placeholder={placeholder}
          value={values[0]}
          required={required}
          onChange={handleInputChange}
          rows={3}
        />
      ) : (
        <input
          className="form-control"
          id={id}
          name={externalId}
          maxLength={2000}
          placeholder={placeholder}
          value={values[0]}
          required={required}
          onChange={handleInputChange}
          type={"text"}
        />
      )}
    </div>
  );
});