// Add this declaration to fix TS error for import.meta.env
// Types are now handled in src/vite-env.d.ts

export const config = {
  api: {
    n8nWebhookUrl:
      import.meta.env.VITE_N8N_WEBHOOK_URL || "YOUR_N8N_WEBHOOK_URL",
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  },
  features: {
    useMocks: import.meta.env.VITE_USE_MOCKS !== "false", // Default to true for development
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  },
  ui: {
    theme: "dark" as const,
    animations: true,
  },
} as const;

export type Config = typeof config;
