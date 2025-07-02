/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SUPABASE_URL: string;
  readonly VITE_PUBLIC_SUPABASE_ANON_KEY: string;
  // add other VITE_ keys here…
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
