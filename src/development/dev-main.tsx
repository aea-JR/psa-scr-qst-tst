import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const DevApp = () => (
  <StrictMode>
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section style={{ maxWidth: 480, padding: "1.5rem", textAlign: "center" }}>
        <h1>PisaSales Questionnaire Widgets</h1>
        <p>
          This package is meant to be consumed inside the Scrivito Portal App. Use <code>vite dev</code> to iterate on
          widgets locally and <code>vite build</code> to produce the published bundle.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          The runtime requires Scrivito’s APIs which are provided by the host application. This dev
          harness only renders this placeholder.
        </p>
      </section>
    </main>
  </StrictMode>
);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<DevApp />);
}
