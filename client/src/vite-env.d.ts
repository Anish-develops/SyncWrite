/// <reference types="vite/client" />

declare module '*.css' {
  const content: any;
  export default content;
}

declare module 'xterm/css/xterm.css' {
  const content: any;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_WS_URL?: string;
  readonly PROD?: boolean;
  readonly DEV?: boolean;
  readonly MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
