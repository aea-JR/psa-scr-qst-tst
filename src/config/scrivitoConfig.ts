import { isUserLoggedIn } from "scrivito";
import { isEmpty } from "../utils/lodashPolyfills";

export type BackendConnectionData = { apiUrl: string | null; token: string | null };

export type BackendConnection = BackendConnectionData | Promise<BackendConnectionData>;

export type Options = { connection: BackendConnection };

const GLOBAL_OBJ: typeof globalThis = globalThis;
(GLOBAL_OBJ as any).pisaInitDispatched = null;
(GLOBAL_OBJ as any).pisaJwtToken = null;
const SALESPORTAL = "salesportal";

/**
 * Initialize Questionnaire Widgets
 * @param options Configuration options.
 * @param options.connection Connection data (or a promise resolving to it).
 *   Use an `async` function on the consumer side and pass `connection: yourFn()`.
 *   - `apiUrl`: The PisaSales backend URL, or `null` if unavailable.
 *   - `token`: Optional JWT token for public/token access, or `null`.
 *
 * Notes:
 * - If a `token` is provided but the user is logged in, the token is ignored.
 * - `apiUrl` is normalized to include `/salesportal`.
 */
export const initPisaSalesQuestionnaireWidgets = async (options: Options): Promise<void> => {
  loadWidgets();

  const connection = await options.connection;
  const url = connection.apiUrl;
  const token = connection.token;

  if (token && !isUserLoggedIn()) {
    (GLOBAL_OBJ as any).pisaJwtToken = token;
  }

  await setPisaSalesApiUrl(url);
  await register(url);
};

const loadWidgets = (): void => {
  import.meta.glob(
    ["../Widgets/**/*WidgetClass.ts", "../Widgets/**/*WidgetComponent.tsx"],
    { eager: true },
  );
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
