import React from "react";
import { createRoot } from "react-dom/client";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles/tailwind.css";
import "./styles/app.scss";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
