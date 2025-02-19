import { isEmpty, uniq } from "lodash-es";
import { Widget } from "scrivito";
import { InputElements, ReviewContent, ReviewItemContent } from "../types/review";
import { EXTERNAL_ID, STEP_NUMBER, TEXT, TITLE, TYPE } from "../constants/constants";


export function prepareReviewContent(externalId: string, steps: Widget[], includeEmptyAnswers: boolean): ReviewContent {
  const form = document.getElementById(
    externalId
  ) as HTMLFormElement;
  const data = new FormData(form);
  const joinedFormData = new FormData();
  // show all field-names with equal name as a comma separated string
  for (const [name] of data) {
    if (joinedFormData.has(name)) {
      continue;
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
    const answer = joinedFormData.get(key) as string;
    if (isEmpty(answer) && !includeEmptyAnswers) {
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
      reviewData[stepNumber].push({
        title: title,
        value: getAnswerValue(answer, widget)
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
  if (type == "date") {
    return new Date(answer).toLocaleDateString();
  } else if (type == "datetime-local") {
    return new Date(answer).toLocaleString();
  }
  return answer;
}
