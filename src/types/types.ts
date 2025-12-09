export type DateMode = "date" | "datetime";

export type FileStatus = "loading" | "ready" | "error" | "skipped";

export interface FileItem {
  id: string;
  title: string;
  type: string; // mime or extension
  status: FileStatus;
  token?: string;
}
