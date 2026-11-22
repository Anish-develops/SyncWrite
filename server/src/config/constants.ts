export const SERVER_CONSTANTS = {
  AUTH_RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 20, // ample for dev & test
  },
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  TERMINAL_IDLE_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  YJS_PERSIST_INTERVAL_MS: 30 * 1000, // 30 seconds
};
