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

  loadDataClasses();
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

const loadDataClasses = (): void => {
  if (isEmpty(import.meta)) {
    const dataClassImportsContext = require.context(
      "../Data",
      true,
      /DataClass.*\.ts$/
    );
    dataClassImportsContext.keys().forEach(dataClassImportsContext);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).glob(
      ["../Data/**/*DataClass.ts"],
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
