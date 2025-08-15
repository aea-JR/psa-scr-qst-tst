import { isEmpty } from "../utils/lodashPolyfills";

interface Options {
  apiUrl: string | Promise<string | null>;
  token: string | null;
}

const GLOBAL_OBJ = typeof window !== "undefined" ? window : global;
(GLOBAL_OBJ as any).pisaInitDispatched = null;
(GLOBAL_OBJ as any).pisaJwtToken = null;
const SALESPORTAL = "salesportal";

/**
 * Initialize Pisa Questionnaire Widgets
 * @param options Configuration options including Pisa URL
 */
export const initPisaSalesQuestionnaireWidgets = async (options: Options): Promise<void> => {
  if (options.token) {
    (GLOBAL_OBJ as any).pisaJwtToken = options.token;
  }
  loadWidgets();
  const url = await resolveUrl(options.apiUrl);
  await setPisaSalesApiUrl(url);
  await register(url);
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
  if (typeof window !== "undefined") {
    const event = new CustomEvent("pisaUrlChanged");
    window.dispatchEvent(event);
  }
}

const doSetPisaUrl = (pisaApiUrl: string | null): void => {
  if (!pisaApiUrl) {
    (GLOBAL_OBJ as any).pisaUrl = "";
    return
  }
  (GLOBAL_OBJ as any).pisaUrl = pisaApiUrl.includes(SALESPORTAL) ? pisaApiUrl : `${pisaApiUrl}/${SALESPORTAL}` || "";
}

/**
 * Used to signal that Pisa URL setup was attempted —
 * needed for late-mounting widgets to detect that event already occurred.
 * @param url 
 */
const register = async (url: string | null) => {
  if (isEmpty(url)) {
    (GLOBAL_OBJ as any).pisaInitDispatched = false;
    return
  }
  (GLOBAL_OBJ as any).pisaInitDispatched = true
}

/**
 * Get the configured Pisa URL
 * @returns Pisa URL string
 */
export const getPisaUrl = (): string => (GLOBAL_OBJ as any).pisaUrl;
export const getJwtToken = (): string | null => (GLOBAL_OBJ as any).pisaJwtToken;
export const getPisaInitDispatched = (): boolean => (GLOBAL_OBJ as any).pisaInitDispatched;
