import "./AnswerOptionWidget.scss";
import { lazy, Suspense } from "react";
import { QuestionnaireAnswerOptionWidget } from "./AnswerOptionWidgetClass";
import { provideComponent } from "scrivito";

const LazyAnswerOptionWidgetContent = lazy(() => import("./AnswerOptionWidgetContent"));

provideComponent(QuestionnaireAnswerOptionWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazyAnswerOptionWidgetContent widget={widget} />
  </Suspense>
));
