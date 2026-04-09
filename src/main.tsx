import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { LandingPage } from "./components/LandingPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/free-disc-test"
          element={<LandingPage framework="disc" />}
        />
        <Route
          path="/free-enneagram-test"
          element={<LandingPage framework="enneagram" />}
        />
        <Route
          path="/free-personality-test"
          element={<LandingPage framework="personality" />}
        />
        <Route
          path="/free-strengths-test"
          element={<LandingPage framework="strengths" />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
