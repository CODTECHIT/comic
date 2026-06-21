import { createRoot } from "react-dom/client";
import { AppRoutes } from "./AppRoutes.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<AppRoutes />);