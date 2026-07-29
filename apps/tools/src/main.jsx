import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ThemeProvider } from "./components/theme-provider.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <App />
      </TooltipProvider>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  </StrictMode>,
);
