import { bootstrapGProntoFrameworkApplication } from "@gpronto.framework";

bootstrapGProntoFrameworkApplication({
  styling: import.meta.env.GPRONTO_STYLING,
  supabase: {
    SupabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    SupabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  },
  webpageModules: import.meta.glob("./webpages/**/webpage.tsx", {
    eager: true,
  }),
});
