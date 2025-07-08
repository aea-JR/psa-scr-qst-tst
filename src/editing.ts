import { isEmpty } from "./utils/lodashPolyfills";

export function loadQuestionnaireEditingConfigs(): void {
  if (isEmpty(import.meta)) {
    const widgetImportsContext = require.context(
      "./Widgets",
      true,
      /WidgetEditingConfig\.tsx?$/
    );
    widgetImportsContext.keys().forEach(widgetImportsContext);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any).glob(["./Widgets/**/*WidgetEditingConfig.ts"], {
      eager: true
    });
  }
}
