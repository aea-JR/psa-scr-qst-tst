export interface Options {
  pisaApiUrl: string | Promise<string | null>;
}

export declare function initPisaQuestionnaireWidgets(
  options: Options
): void;
