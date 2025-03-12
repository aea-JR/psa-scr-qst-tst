import { DataClass } from "scrivito";
import { provideQuestion } from "../Data/Question/QuestionDataClass";
import { provideQuestionnaire } from "../Data/Questionnaire/QuestionnaireDataClass";
import { provideAnswerOption } from "../Data/AnswerOption/AnswerOptionDataClass";
import { provideAnswers } from "../Data/Answers/AnswersDataClass";
import { isEmpty } from "lodash-es";

interface Options {
  pisaUrl: string;
}

const GLOBAL_OBJ = typeof window !== "undefined" ? window : global;

/**
 * Initialize Pisa Questionnaire Widgets
 * @param options Configuration options including Pisa URL
 */
export const initPisaQuestionnaireWidgets = async (options: Options): Promise<void> => {
  (GLOBAL_OBJ as any).pisaUrl = options.pisaUrl || "";

  loadWidgets();

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

/**
 * Get the configured Pisa URL
 * @returns Pisa URL string
 */
export const getPisaUrl = (): string => (GLOBAL_OBJ as any).pisaUrl;

/**
 * Get the Question Data Class
 * @returns QuestionDataClass
 */
export const QuestionDataClass = (): DataClass => provideQuestion();

/**
 * Get the Questionnaire Data Class
 * @returns QuestionnaireDataClass
 */
export const QuestionnaireDataClass = (): DataClass => provideQuestionnaire()

/**
 * Get the AnswerOption Data Class
 * @returns AnswerOptionDataClass
 */
export const AnswerOptionDataClass = (): DataClass => provideAnswerOption()

/**
 * Get the Answers Data Class
 * @returns AnswerDataClass
 */
export const AnswersDataClass = (): DataClass => provideAnswers()