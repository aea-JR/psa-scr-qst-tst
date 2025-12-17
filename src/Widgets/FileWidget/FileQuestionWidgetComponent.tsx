import { lazy, Suspense } from "react";
import { provideComponent } from "scrivito";
import { QuestionnaireFileQuestionWidget } from "./FileQuestionWidgetClass";
import "./FileQuestionWidget.scss";

const LazyFileQuestionWidgetContent = lazy(() => import("./FileQuestionWidgetContent"));

provideComponent(QuestionnaireFileQuestionWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazyFileQuestionWidgetContent widget={widget} />
  </Suspense>
));
