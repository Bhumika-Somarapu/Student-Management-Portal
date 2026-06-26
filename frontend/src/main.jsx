import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: "8px", fontFamily: "Inter, sans-serif" },
        success: { style: { background: "#22c55e", color: "#fff" } },
        error: { style: { background: "#ef4444", color: "#fff" } },
      }}
    />
  </React.StrictMode>
);
