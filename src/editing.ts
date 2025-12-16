export function loadQuestionnaireEditingConfigs(): void {
  import.meta.glob(["./Widgets/**/*WidgetEditingConfig.ts"], {
    eager: true
  });
}
