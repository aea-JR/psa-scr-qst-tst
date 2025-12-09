import generateId from "../../utils/idGenerator";
import { FileItem } from "../../types/types";
import { DataItem } from "scrivito";

/**
 * Extracts key fields from a DataItem representing a document/blob.
 * @param fileItem Scrivito DataItem for the uploaded document
 * @returns Object with title, format (e.g., pdf, png) and questionId association
 */
export const extractBlobData = (fileItem: DataItem) => {
  const title = (fileItem.get("filename") as string) || "";
  const format = (fileItem.get("format") as string) || ""; // pdf, docx, ...
  const token = fileItem.get("accessToken") as string || "";
  return { title, format, token };
};

/**
 * Converts a list of DataItems to a grouped map by questionId -> FileItem[].
 * Used for initializing the UI from backend data.
 * @param fileDataItems List of Scrivito DataItems
 * @returns Map keyed by questionId with FileItems in status "ready"
 */
export const convertToFileItem = (fileDataItems: DataItem[]): FileItem[] => {
  const fileItems: FileItem[] = []
  for (const item of fileDataItems) {
    //TODO: Improve reading format
    const { title, format, token } = extractBlobData(item);

    const id = item.id();
    const type = getFileExtension(title);
    const fileItem: FileItem = { id, type, title, token, status: "ready" };
    fileItems.push(fileItem)
  }

  return fileItems
};

/**
 * Gets the lowercase extension (without dot stripping safety) from a filename.
 * @param filename Source filename
 * @returns Extension string or empty string if none
 */
export const getFileExtension = (filename: string): string => {
  return /[.]/.exec(filename) ? filename.split(".").pop() || "" : "";
};

/**
 * Deduplicates FileItems by title (case-insensitive), keeping the last occurrence.
 * @param items FileItem list to merge
 * @returns New array with unique titles
 */
export const mergeUniqueByTitle = (items: FileItem[]): FileItem[] => {
  const map = new Map<string, FileItem>();
  for (const it of items) {
    map.set((it.title || "").toLowerCase(), it);
  }
  return Array.from(map.values());
};

/**
 * Splits a File list into those within max size and those exceeding it.
 * @param all Files to evaluate
 * @param maxBytes Maximum allowed size in bytes
 * @returns { accepted, rejected } where rejected contains filenames
 */
export const filterBySize = (all: File[], maxBytes: number) => {
  const accepted: File[] = [];
  const rejected: string[] = [];
  for (const f of all) {
    if (f.size > maxBytes) rejected.push(f.name); else accepted.push(f);
  }
  return { accepted, rejected };
};

/**
 * Filters out files whose names already exist in the provided set (case-insensitive).
 * @param existing Set of lowercase names considered already present
 * @param all Candidate files
 * @returns Files not present in existing
 */
export const dedupeAgainst = (existing: Set<string>, all: File[]) => {
  const unique: File[] = [];
  for (const f of all) {
    const nameLc = (f.name || "").toLowerCase();
    if (existing.has(nameLc)) continue;
    existing.add(nameLc);
    unique.push(f);
  }
  return unique;
};

/**
 * Creates temporary FileItems for optimistic UI while uploads are in progress.
 * @param sel Selected File objects
 * @returns FileItem array with status "loading" and tmp IDs
 */
export const createTempItems = (sel: File[]): FileItem[] => sel.map((f) => ({
  id: `tmp_${generateId()}`,
  title: f.name,
  type: f.type || getFileExtension(f.name),
  status: "loading",
}));

/**
 * Resolves a bootstrap icon class based on filename/extension.
 * @param name Filename
 * @returns Bootstrap icon class
 */
export const getFileIconByName = (name: string): string => {
  const n = (name || "").toLowerCase();
  const ext = n.includes(".") ? n.split(".").pop() || "" : "";

  // Quick direct checks
  if (ext === "pdf") return "bi-file-earmark-pdf";
  if (/^(png|jpe?g|gif|webp|bmp|svg|tiff?|psd|tga|dds|yuv|thm)$/.test(ext)) return "bi-file-earmark-image";
  if (/^(docx?|odt)$/.test(ext)) return "bi-file-earmark-word";
  if (/^(xlsx?|ods|csv|tsv)$/.test(ext)) return "bi-file-earmark-spreadsheet";

  // Audio / Video / Archives / Code / Text / DB
  if (/^(mp3|aif|aiff|iff|m4a|mid|midi|mpa|wav|wma|ogg|flac)$/.test(ext)) return "bi-file-earmark-music";
  if (/^(3g2|3gp|asf|avi|flv|m4v|mov|mp4|mpg|mpeg|rm|swf|vob|wmv|mkv|webm)$/.test(ext)) return "bi-file-earmark-play";
  if (/^(7z|cbr|deb|gz|rar|zip|zipx|tar|tgz|bz2|xz)$/.test(ext)) return "bi-file-earmark-zip";
  if (/^(html?|css|js|jsx|ts|tsx|json|xml|yml|yaml|md|sh|bash|ps1|c|cpp|h|hpp|java|kt|go|rs|php|rb|py|swift|scala|cs|pl)$/.test(ext)) return "bi-file-earmark-code";
  if (/^(log|rtf|txt|wps|wpd)$/.test(ext)) return "bi-file-earmark-text";
  if (/^(accdb|db|dbf|mdb|pdb|sql|sqlite3?)$/.test(ext)) return "bi-database";

  return "bi-file-earmark";
};

/**
 * Normalizes an HTML input accept string into sets of extensions and MIME patterns.
 * @param raw Comma-separated accept patterns (e.g., ".png,.jpg,image/*")
 * @returns Object with exts (Set of ".ext") and mimes (["type/*" or full MIME])
 */
export const normalizeAccept = (raw?: string) => {
  if (!raw) return { exts: new Set<string>(), mimes: [] as string[] };
  const tokens = raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const exts = new Set(tokens.filter((t) => t.startsWith(".")));
  const mimes = tokens.filter((t) => !t.startsWith("."));
  return { exts, mimes };
};

/**
 * Checks if a File matches the normalized accept patterns.
 * Tries extension first, then MIME (supports wildcards like image/*).
 * @param f File to validate
 * @param accept Result of normalizeAccept
 * @returns True if allowed, otherwise false
 */
export const isTypeAllowed = (f: File, accept: { exts: Set<string>; mimes: string[] }) => {
  const { exts, mimes } = accept;
  if (exts.size === 0 && mimes.length === 0) return true;
  const nameLc = (f.name || "").toLowerCase();
  const ext = nameLc.includes(".") ? `.${nameLc.split(".").pop()}` : "";
  if (ext && exts.has(ext)) return true;
  const type = (f.type || "").toLowerCase();
  if (type) {
    for (const pat of mimes) {
      if (pat.endsWith("/*")) {
        const prefix = pat.replace("/*", "");
        if (type.startsWith(prefix)) return true;
      } else if (type === pat) {
        return true;
      }
    }
  }
  return false;
};
