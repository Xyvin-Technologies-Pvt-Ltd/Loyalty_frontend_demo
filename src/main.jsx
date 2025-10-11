import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  // Temporarily disabled StrictMode to prevent DOM reconciliation errors in development
  // <StrictMode>
  <App />
  // </StrictMode>
);
