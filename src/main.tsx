import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Mask all text/inputs in session replays — important for B2B PII
      maskAllText: true,
      blockAllMedia: false,
    }),
  ],
  // 10% of transactions sampled for performance monitoring
  tracesSampleRate: 0.1,
  // 10% of sessions captured for replay — increase if debugging a specific issue
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // Always capture replay on errors
  environment: import.meta.env.MODE,
});

createRoot(document.getElementById("root")!).render(<App />);

