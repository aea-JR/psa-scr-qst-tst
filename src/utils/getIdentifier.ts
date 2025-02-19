import { Widget } from "scrivito";
import { IDENTIFIER } from "../constants/constants";

export function getIdentifier(widget: Widget): string {
  return widget.get(IDENTIFIER) as string | "";
}
