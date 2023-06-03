/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_VERSION: string;
    REACT_APP_WP_HOST: string;
    REACT_APP_DRIVE_ROOT_DIR: string;
  }
}
