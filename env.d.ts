/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_ENABLE_PAYMENTS: string
  readonly VITE_FORCE_DISABLE_PAYMENTS: string
  readonly VITE_GOOGLE_PLAY_LICENSE_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_COMPANY_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 