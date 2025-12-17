import { lazy, Suspense } from "react";
import { provideComponent } from "scrivito";
import { QuestionnaireCheckboxQuestionWidget } from "./CheckboxWidgetClass";
import "./CheckboxWidget.scss";

const LazyCheckboxWidgetContent = lazy(() => import("./CheckboxWidgetContent"));

provideComponent(QuestionnaireCheckboxQuestionWidget, ({ widget }) => (
  <Suspense fallback={null}>
    <LazyCheckboxWidgetContent widget={widget} />
  </Suspense>
));
