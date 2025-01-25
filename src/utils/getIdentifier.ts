import { Widget } from "scrivito";

export function getIdentifier(widget: Widget): string {
  return widget.get("identifier") as string | "";
}
