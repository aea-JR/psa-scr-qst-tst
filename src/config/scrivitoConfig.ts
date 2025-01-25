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

// Singleton instances for data classes
let questionInstance: DataClass | null = null;
let questionnaireInstance: DataClass | null = null;
let answerOptionInstance: DataClass | null = null;
let answersInstance: DataClass | null = null;

/**
 * Initialize Pisa Questionnaire Widgets
 * @param options Configuration options including Pisa URL
 */
export const initPisaQuestionnaireWidgets = async (options: Options): Promise<void> => {
  (GLOBAL_OBJ as any).pisaUrl = options.pisaUrl || "";

  questionInstance = provideQuestion();
  questionnaireInstance = provideQuestionnaire();
  answerOptionInstance = provideAnswerOption();
  answersInstance = provideAnswers();

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

const ensureInitialized = (
  instance: DataClass | null,
  name: string,
): DataClass => {
  if (!instance) {
    throw new Error(
      `${name} is not initialized. Did you forget to call initPisaQuestionnaireWidgets?`,
    );
  }
  return instance;
};

/**
 * Get the configured Pisa URL
 * @returns Pisa URL string
 */
export const getPisaUrl = (): string => (GLOBAL_OBJ as any).pisaUrl;

/**
 * Get the Question Data Class
 * @returns Singleton instance of QuestionDataClass
 */
export const QuestionDataClass = (): DataClass =>
  ensureInitialized(questionInstance, "QuestionDataClass");

/**
 * Get the Questionnaire Data Class
 * @returns Singleton instance of QuestionnaireDataClass
 */
export const QuestionnaireDataClass = (): DataClass =>
  ensureInitialized(questionnaireInstance, "QuestionnaireDataClass");
/**
 * Get the AnswerOption Data Class
 * @returns Singleton instance of AnswerOptionDataClass
 */
export const AnswerOptionDataClass = (): DataClass =>
  ensureInitialized(answerOptionInstance, "AnswerOptionDataClass");
/**
 * Get the Answers Data Class
 * @returns Singleton instance of AnswerDataClass
 */
export const AnswersDataClass = (): DataClass =>
  ensureInitialized(answersInstance, "AnswersDataClass");
