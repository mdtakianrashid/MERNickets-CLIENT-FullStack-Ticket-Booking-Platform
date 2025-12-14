// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./pages/context/AuthProvider";
// import ThemeProvider from "./pages/context/ThemeProvider";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <ThemeProvider> */}
        <AuthProvider>
          <App />
        </AuthProvider>
      {/* </ThemeProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);