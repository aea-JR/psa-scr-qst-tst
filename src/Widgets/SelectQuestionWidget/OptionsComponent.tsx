// import * as React from "react";
// import * as Scrivito from "scrivito";

// import generateId from "../../utils/idGenerator";
// //import { AnswerOption } from "../../Objs/AnswerOption/AnswerOptionObjClass";
// import "./OptionsComponent.scss";

// interface QuestionnaireExternalIdComponentProps {
//   widget: Scrivito.Widget;
// }

// export const OptionsComponent: React.FC<
//   QuestionnaireExternalIdComponentProps
// > = ({ widget }) => {
//   const [currentId, setCurrentId] = React.useState<string>(
//     widget.get("title") as string,
//   );

//   const options = widget.get("options") as Scrivito.Obj[];
//   console.log(currentId);

//   const uiContext = Scrivito.uiContext();
//   if (!uiContext) return null;

//   const onChangeValue = (
//     option: Scrivito.Obj,
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const value = e.currentTarget.value;
//     option.update({ text: value });
//   };
//   const onChangeIdn = (
//     option: Scrivito.Obj,
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const value = e.currentTarget.value;

//     option.update({ identifier: value });
//   };

//   // const addOption = () => {
//   //   const newOption = AnswerOption.create({ text: "", type: "dropdown", externalId: generateId() })
//   //   widget.update({ options: [...options, newOption] });
//   // };

//   const updateOption = (option: Scrivito.Obj, attr: string, value: string) => {
//     option.update({ [attr]: value });
//   };

//   const removeOption = (index: number) => {
//     const updatedOptions = options.filter((_, i) => i !== index);
//     widget.update({ options: updatedOptions });
//   };

//   return (
//     <div className={`answer-options-tab-container scrivito-${uiContext.theme}`}>
//       <div className="options-list">
//         {options.map((option, index) => (
//           <div key={index} className="option-item scrivito-has-columns">
//             <div className="option-field">
//               <label>Value</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={option.get("text") as string}
//                 onChange={(e) => updateOption(option, "text", e.target.value)}
//                 placeholder="Enter option value"
//               />
//             </div>
//             <div className="option-field">
//               <label>Identifier</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={option.get("identifier") as string}
//                 onChange={(e) =>
//                   updateOption(option, "identifier", e.target.value)
//                 }
//                 placeholder="Enter unique identifier"
//               />
//             </div>
//             <div className="option-actions">
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeOption(index)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <button
//         type="button"
//         className="btn btn-primary btn-sm add-option-button"
//         onClick={addOption}
//       >
//         Add Option
//       </button>
//     </div>
//   );
//   // return (
//   //   <div className={`questionnaire-external-id-tab-container scrivito-${uiContext.theme}`}>

//   //     <span>Hello</span>
//   //     <ul>
//   //       {options.map((option, index) => <li className={`scrivito_${uiContext.theme}`} key={index}>
//   //         <div className="scrivito_detail_label">
//   //           <span>
//   //             Value
//   //           </span>
//   //           <input
//   //             type="text"
//   //             value={option.get("text") as string}
//   //             onChange={(e) => onChangeValue(option, e)}
//   //           />
//   //           <span >
//   //             IDN
//   //           </span>
//   //           <input
//   //             type="text"
//   //             value={option.get("identifier") as string}
//   //             onChange={(e) => onChangeIdn(option, e)}
//   //           />
//   //         </div>
//   //         <hr style={{ border: "black solid 1px" }} />

//   //       </li>)}

//   //     </ul>
//   //     <div className="add-button-container">
//   //       <button type="button" onClick={onClick} className="btn btn-primary">+</button>
//   //     </div>
//   //   </div>
//   // );
// };

// Scrivito.registerComponent("OptionsComponent", OptionsComponent);
