import { isEmpty } from "../utils/lodashPolyfills";

interface Options {
  pisaApiUrl: string | Promise<string | null>;
}

const GLOBAL_OBJ = typeof window !== "undefined" ? window : global;
const SALESPORTAL = "salesportal";

/**
 * Initialize Pisa Questionnaire Widgets
 * @param options Configuration options including Pisa URL
 */
export const initPisaQuestionnaireWidgets = async (options: Options): Promise<void> => {
  loadWidgets();
  const url = await resolveUrl(options.pisaApiUrl);
  await setPisaSalesApiUrl(url);
};

const resolveUrl = async (url: string | Promise<string | null>): Promise<string | null> => {
  return typeof url === "string" ? url : await url;
};

const loadWidgets = (): void => {

  if (isEmpty(import.meta)) {
    const widgetImportsContext = require.context(
      "../Widgets",
      true,
      /Widget(Class|Component)\.tsx?$/
    );
    widgetImportsContext.keys().forEach(widgetImportsContext);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).glob(
      ["../Widgets/**/*WidgetClass.ts", "../Widgets/**/*WidgetComponent.tsx"],
      {
        eager: true
      }
    );
  }

};
const setPisaSalesApiUrl = async (pisaUrl: string | null) => {
  doSetPisaUrl(pisaUrl);

  const event = new CustomEvent("pisaUrlChanged");
  window.dispatchEvent(event);
}

const doSetPisaUrl = (pisaApiUrl: string | null): void => {
  if (!pisaApiUrl) {
    (GLOBAL_OBJ as any).pisaUrl = "";
    return
  }
  (GLOBAL_OBJ as any).pisaUrl = pisaApiUrl.includes(SALESPORTAL) ? pisaApiUrl : `${pisaApiUrl}/${SALESPORTAL}` || "";
}

/**
 * Get the configured Pisa URL
 * @returns Pisa URL string
 */
export const getPisaUrl = (): string => (GLOBAL_OBJ as any).pisaUrl;
