import { Widget } from "scrivito";
import { isEmpty, uniq } from "./lodashPolyfills";
import { InputElements, ReviewContent } from "../types/review";
import { DATE, DATE_TIME, EXTERNAL_ID, STEP_NUMBER, TEXT, TITLE, TYPE } from "../constants/constants";
import { getFileIconByName } from "../Widgets/FileWidget/fileUtils";


export function prepareReviewContent(externalId: string, steps: Widget[], includeEmptyAnswers: boolean): ReviewContent {
  const form = document.getElementById(
    externalId
  ) as HTMLFormElement;
  const data = new FormData(form);
  const joinedFormData = new FormData();
  // determine which names should be rendered as a list (file answers)
  const showAsListNames = new Set(
    Array.from(form.querySelectorAll("input.show-as-list"))
      .map((el) => (el as HTMLInputElement).name)
  );
  // aggregate values; keep arrays for list-enabled names
  for (const [name] of data) {
    if (joinedFormData.has(name)) continue;
    if (showAsListNames.has(name)) {
      // keep as array
      joinedFormData.set(name, JSON.stringify(data.getAll(name)));
    } else {
      joinedFormData.set(name, data.getAll(name).join(", "));
    }
  }

  const widgets = steps.flatMap((s) => s.widgets());
  const inputs: InputElements[] = Array.from(
    form.querySelectorAll("input, select, textarea")
  );
  const inputNames = uniq(inputs.map((i) => i.name));
  const reviewData: ReviewContent = [];

  for (const key of inputNames) {
    const raw = joinedFormData.get(key) as string;
    if (isEmpty(raw) && !includeEmptyAnswers) {
      // do not show empty answers
      continue;
    }
    // check if is hidden
    const input = inputs.find((i) => i.name == key);
    if (
      key == "fax" ||
      (input &&
        input.type == "hidden" &&
        !input.classList.contains("show-in-review"))
    ) {
      // do not show hidden inputs
      continue;
    }
    // get title && step number
    const widget = widgets.find((w) => w.get(EXTERNAL_ID) == key);
    if (widget) {
      const step = steps.find((s) =>
        s.widgets().find((w) => w.get(EXTERNAL_ID) == key)
      );
      const stepNumber = step?.get(STEP_NUMBER) as number;
      const title = (widget.get(TEXT) ||
        widget.get(TITLE) ||
        "") as string;

      if (!reviewData[stepNumber]) {
        reviewData[stepNumber] = [];
      }
      const value = showAsListNames.has(key)
        ? getListHtml(raw)
        : getAnswerValue(raw, widget);
      reviewData[stepNumber].push({
        title: title,
        value
      });
    }
  }
  return reviewData;
}

function getAnswerValue(answer: string, widget: Widget): string {
  const emptyValue = "-";
  const type = widget.get(TYPE);

  if (isEmpty(answer)) {
    return emptyValue;
  }
  if (type == DATE) {
    return new Date(answer).toLocaleDateString();
  } else if (type == DATE_TIME) {
    return new Date(answer).toLocaleString();
  }
  return answer;
}

function getListHtml(serialized: string): string {
  try {
    const arr = JSON.parse(serialized) as string[];
    const items = arr.filter(Boolean);
    if (items.length === 0) return "-";
    const li = items
      .map((n) => `<li><i class=\"bi ${getFileIconByName(n)}\"></i> ${escapeHtml(n)}</li>`)
      .join("");
    return `<ul class=\"qst-file-list\">${li}</ul>`;
  } catch {
    return serialized;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
