import React, { useRef } from "react";
import { ContentTag, provideComponent } from "scrivito";
import { QuestionnaireFileQuestionWidget } from "./FileQuestionWidgetClass";
import { HelpText } from "../../Components/HelpText/HelpText";
import { Mandatory } from "../../Components/Mandatory/Mandatory";
import { useExternalId } from "../../hooks/useExternalId";
import { ALIGNMENT, FILE_ACCEPT, FILE_TOO_LARGE_TEXT_MULTI, FILE_TOO_LARGE_TEXT_SINGLE, FILE_TYPE_REJECT_TEXT_MULTI, FILE_TYPE_REJECT_TEXT_SINGLE, EXTERNAL_ID, HELP, MANDATORY, QUESTION_ID, SELECT_BUTTON_TEXT, TEXT, TYPE, VALIDATION_TEXT, DOCUMENT_SINGLE, DOCUMENT_MULTI } from "../../constants/constants";
import { useFormContext } from "../../contexts/FormContext";
import { getQuestionnaireStatus } from "../../utils/questionnaireStatus";
import { QuestionnaireMessageBlock } from "../../Components/QuestionnaireMessageBlock/QuestionnaireMessageBlock";
import { useValidationField } from "../../hooks/useValidationField";
import { isEmpty } from "../../utils/lodashPolyfills";
import { FileQuestionSingle } from "./components/FileQuestionSingle";
import { FileQuestionMulti } from "./components/FileQuestionMulti";
import { useFiles } from "../../hooks/useFiles";
import "./FileQuestionWidget.scss";

provideComponent(QuestionnaireFileQuestionWidget, ({ widget }) => {
  const id = `questionnaire_file_widget_${widget.id()}`;
  const externalId = widget.get(EXTERNAL_ID) as string;
  const required = widget.get(MANDATORY) as boolean;
  const title = widget.get(TEXT) as string;
  const helpText = widget.get(HELP);
  const type = (widget.get(TYPE) as string) || DOCUMENT_SINGLE;
  const questionId = widget.get(QUESTION_ID) as string || "";
  const alignment = (widget.get(ALIGNMENT) as string) || "left";
  const validationText = (widget.get(VALIDATION_TEXT) as string) || "Please select a file";
  const selectButtonText = (widget.get(SELECT_BUTTON_TEXT) as string) || "Choose file";
  const tooLargeTextSingle = (widget.get(FILE_TOO_LARGE_TEXT_SINGLE) as string) || "Selected file exceeds 8 MB and was skipped.";
  const tooLargeTextMulti = (widget.get(FILE_TOO_LARGE_TEXT_MULTI) as string) || "The following files exceed 8 MB and were skipped:";
  const typeRejectTextSingle = (widget.get(FILE_TYPE_REJECT_TEXT_SINGLE) as string) || "Selected file type is not allowed.";
  const typeRejectTextMulti = (widget.get(FILE_TYPE_REJECT_TEXT_MULTI) as string) || "The following files are not allowed and were skipped:";
  const fileAcceptRaw = (widget.get(FILE_ACCEPT) as string) || "";
  const fileAccept = fileAcceptRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.includes("/") || t.startsWith(".") ? t : `.${t}`))
    .join(",");

  const validator = useValidationField(externalId, required);

  useExternalId(widget);

  const setValidity = (nextValues: string[]) => {
    const any = nextValues.some((v) => !isEmpty(v));
    validator?.setIsLocallyValid(!required || any);
  };

  const isMultiple = type === DOCUMENT_MULTI;
  const { files, sizeRejected, typeRejected, onInputChange, removeFile } = useFiles(
    questionId,
    { multiple: isMultiple, maxSizeMB: 8, accept: fileAcceptRaw },
    setValidity
  );

  const hasQuestionId = !isEmpty(questionId);
  const qstStatus = getQuestionnaireStatus();
  // disable picker trigger for certain statuses
  const disableByStatus = [
    "offline",
    "invalidToken",
    "publicSiteNoContext",
    "unconfiguredUrl",
    "invalid",
  ].includes(qstStatus);

  const inputRef = useRef<HTMLInputElement>(null);
  const onPick = () => {
    const isDisabled = !hasQuestionId || isLoading || disableByStatus;
    if (isDisabled) return;
    inputRef.current?.click();
  };
  const isLoading = isMultiple
    ? files.some((f) => f.status === "loading")
    : (files[0]?.status === "loading");
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
  };


  const ctx = useFormContext();
  if (!ctx || !validator) {
    return <QuestionnaireMessageBlock status="noFormContext" />;
  }

  const isInvalid = !validator.isLocallyValid;



  return (
    <div ref={validator.ref} className={`mb-3 file-widget-container ${alignment}`}>
      {!isEmpty(title) && (
        <label htmlFor={id} className="file-label">
          <ContentTag attribute={TEXT} content={widget} tag="span" />
          {required && <Mandatory />}
          {helpText && <HelpText widget={widget} />}
        </label>
      )}

      {/* Hidden inputs used for review content (ready files only, preserve casing) */}
      {files
        .filter(f => f.status === "ready" && !!f?.title)
        .map((f, idx) => (
          <input key={`rv-${idx}`} type="hidden" className="show-in-review show-as-list" name={externalId} value={f.title} />
        ))}

      <input disabled={!hasQuestionId || isLoading || disableByStatus} ref={inputRef} className="d-none" type="file" multiple={isMultiple} accept={fileAccept} onChange={handleChange} />
      {isMultiple ? (
        <FileQuestionMulti
          disabled={!hasQuestionId || isLoading}
          selectButtonText={selectButtonText}
          files={files}
          onPick={onPick}
          onRemove={(id) => removeFile(id)}
        />
      ) : (
        <FileQuestionSingle
          disabled={!hasQuestionId || isLoading}
          selectButtonText={selectButtonText}
          file={files[0]}
          onPick={onPick}
          onRemove={(id) => removeFile(id)}
        />
      )}

      {!hasQuestionId && (
        <QuestionnaireMessageBlock status="fileUploadsDisabled" />
      )}

      {required && isInvalid && (
        <div className={`invalid-feedback ${alignment}`}>{validationText}</div>
      )}
      {sizeRejected.length > 0 && (
        <div className="text-danger small mt-1">
          {isMultiple ? `${tooLargeTextMulti} ${sizeRejected.join(", ")}.` : tooLargeTextSingle}
        </div>
      )}
      {typeRejected.length > 0 && (
        <div className="text-danger small mt-1">
          {isMultiple
            ? `${typeRejectTextMulti} ${typeRejected.join(", ")}.`
            : typeRejectTextSingle}
        </div>
      )}
    </div>
  );
});
