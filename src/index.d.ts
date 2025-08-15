export interface Options {
  apiUrl: string | Promise<string | null>;
  token: string | null;
}

export declare function initPisaSalesQuestionnaireWidgets(
  options: Options
): void;
