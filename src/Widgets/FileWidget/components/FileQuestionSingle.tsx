import { useQuestionnaireWidgetAttributesContext } from "../../../contexts/QuestionnaireWidgetAttributesContext";
import { FileItem } from "../../../types/types";
import { FileRow } from "./FileRow";

interface Props {
  selectButtonText: string;
  file: FileItem;
  disabled: boolean;
  onPick: () => void;
  onRemove: (id: string) => void;
}

export const FileQuestionSingle: React.FC<Props> = ({ selectButtonText, disabled, file, onPick, onRemove }) => {
  const { buttonsSize, buttonsStyle } = useQuestionnaireWidgetAttributesContext();
  return (
    <div className="single-upload">
      <button disabled={disabled} type="button" className={`btn btn-primary pick-btn upload-button ${buttonsSize} ${buttonsStyle}`} onClick={onPick}>
        <i className="bi bi-upload" /> <span>{selectButtonText}</span>
      </button>
      <FileRow file={file} onRemove={() => onRemove(file.id)} />
    </div>
  );
};
