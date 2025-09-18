type Options = { connection: Promise<{ apiUrl: string | null; token: string | null }> };


/**
 * Initialize Questionnaire Widgets
 * @param options An object containing a `connection` property, which is a promise that resolves to an object with:
 *   - `apiUrl`: The backend URL as a string, or `null` if unavailable.
 *   - `token`: A JWT string for authentication, or `null` if unavailable.
 */
export declare function initPisaSalesQuestionnaireWidgets(
  options: Options
): void;
