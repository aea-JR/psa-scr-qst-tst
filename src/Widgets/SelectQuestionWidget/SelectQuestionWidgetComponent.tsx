import { lazy, Suspense } from "react";
import { provideComponent } from "scrivito";
import { QuestionnaireSelectQuestionWidget } from "./SelectQuestionWidgetClass";
import "./SelectQuestionWidget.scss";

const LazySelectQuestionWidgetContent = lazy(() => import("./SelectQuestionWidgetContent"));

provideComponent(QuestionnaireSelectQuestionWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazySelectQuestionWidgetContent widget={widget} />
  </Suspense>
));
