import { lazy, Suspense } from "react";
import { provideComponent } from "scrivito";
import { QuestionnaireInputQuestionWidget } from "./InputQuestionWidgetClass";
import "./InputQuestionWidget.scss";

const LazyInputQuestionWidgetContent = lazy(() => import("./InputQuestionWidgetContent"));

provideComponent(QuestionnaireInputQuestionWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazyInputQuestionWidgetContent widget={widget} />
  </Suspense>
));
