import { FileItem } from "../../../types/types";
import { isEmpty } from "../../../utils/lodashPolyfills";
import { getFileIconByName } from "../fileUtils";
import { getPisaUrl } from "../../../config/scrivitoConfig";

type FileRowProps = {
  file?: FileItem;
  onRemove: () => void;
};

export const FileRow: React.FC<FileRowProps> = ({ file, onRemove }) => {
  const title = file?.title || "";
  const status = file?.status || "";
  const iconClass = (() => {
    if (!title) return "";
    if (file?.status === "loading") return "spinner-border spinner-border-sm";
    if (file?.status === "error") return "bi-x-lg text-danger";
    return getFileIconByName(title);
  })();
  const url = file?.token ? getPisaUrl() + file.token : null;

  return (
    <div className="file-row">
      {!isEmpty(title) && <i className={`bi ${iconClass}`} />}
      {url && status === "ready" ? (
        <a
          href={url}
          download={file?.title}
          target="_blank"
          rel="noopener noreferrer"
          className={`file-name ${status}`}
          title={title}
        >
          {title}
        </a>
      ) : (
        <span className={`file-name ${status}`} title={title} aria-disabled="true">
          {title}
        </span>
      )}
      {!isEmpty(title) && status !== "loading" && (
        <button
          type="button"
          className="btn btn-link text-danger p-0 remove"
          onClick={onRemove}
          title="Remove file"
        >
          <i className="bi bi-trash" />
        </button>
      )}
    </div>
  );
};
