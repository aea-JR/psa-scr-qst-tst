import { useQuestionnaireWidgetAttributesContext } from "../../../contexts/QuestionnaireWidgetAttributesContext";
import { FileItem } from "../../../types/types";
import { FileRow } from "./FileRow";

interface Props {
  selectButtonText: string;
  files: FileItem[];
  disabled: boolean;
  onPick: () => void;
  onRemove: (id: string) => void;
}

export const FileQuestionMulti: React.FC<Props> = ({ selectButtonText, files, disabled, onPick, onRemove }) => {
  const { buttonsSize, buttonsStyle } = useQuestionnaireWidgetAttributesContext();

  return (
    <div>
      <div className="multi-upload">
        <button disabled={disabled} type="button" className={`upload-box btn btn-primary ${buttonsSize} ${buttonsStyle}`} onClick={onPick} aria-label="Add files">
          <i className="bi bi-upload" />
          <span>{selectButtonText}</span>
        </button>
      </div>

      <div className="file-list">
        {(files || []).map((file, idx) => (
          <FileRow key={`${file.id}-${idx}`} file={file} onRemove={() => onRemove(file.id)} />
        ))}
      </div>
    </div>
  );
};
