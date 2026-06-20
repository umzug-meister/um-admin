/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
interface ImportMetaEnv {
  readonly VITE_MAIL_PROXY_URL: string;
  readonly VITE_MAIL_PROXY_API_KEY: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_MAIL_ENABLED: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_TARGET: 'umzugruckzuck' | 'umzugruckzuck24';
}
