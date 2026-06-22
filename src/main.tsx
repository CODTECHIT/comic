import { createRoot } from "react-dom/client";
import { AppRoutes } from "./AppRoutes.tsx";
import "./styles/index.css";

import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AppRoutes />
  </ErrorBoundary>
);