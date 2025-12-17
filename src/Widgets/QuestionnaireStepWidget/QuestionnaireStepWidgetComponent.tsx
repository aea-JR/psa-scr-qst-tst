import { lazy, Suspense } from "react";
import { provideComponent } from "scrivito";
import { QuestionnaireStepWidget } from "./QuestionnaireStepWidgetClass";
import "./QuestionnaireStepWidget.scss";

const LazyQuestionnaireStepWidgetContent = lazy(() => import("./QuestionnaireStepWidgetContent"));

provideComponent(QuestionnaireStepWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazyQuestionnaireStepWidgetContent widget={widget} />
  </Suspense>
));
