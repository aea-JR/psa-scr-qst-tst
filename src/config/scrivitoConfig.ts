import { isEmpty } from "../utils/lodashPolyfills";

interface Options {
  pisaApiUrl: string;
}

const GLOBAL_OBJ = typeof window !== "undefined" ? window : global;
//TODO:CHECK
const API_SALESPORTAL = "salesportal";

/**
 * Initialize Pisa Questionnaire Widgets
 * @param options Configuration options including Pisa URL
 */
export const initPisaQuestionnaireWidgets = async (options?: Options): Promise<void> => {
  loadWidgets();
  if (!isEmpty(options?.pisaApiUrl)) {
    setPisaSalesApiUrl(options!.pisaApiUrl);
  }
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
export const setPisaSalesApiUrl = async (pisaUrl: string | null) => {
  setPisaUrl(pisaUrl);

  const event = new CustomEvent("pisaUrlChanged");
  window.dispatchEvent(event);
}

const setPisaUrl = (pisaApiUrl: string | null): void => {
  if (!pisaApiUrl) {
    (GLOBAL_OBJ as any).pisaUrl = "";
    return
  }
  (GLOBAL_OBJ as any).pisaUrl = pisaApiUrl.includes(API_SALESPORTAL) ? pisaApiUrl : `${pisaApiUrl}/${API_SALESPORTAL}` || "";
}

/**
 * Get the configured Pisa URL
 * @returns Pisa URL string
 */
export const getPisaUrl = (): string => (GLOBAL_OBJ as any).pisaUrl;
