export const WS_EVENTS = {
  COLLAB: {
    SYNC: 'yjs:sync',
    AWARENESS: 'awareness:update',
    FILE_OPEN: 'file:open',
    FILE_CLOSE: 'file:close',
    PRESENCE_USERS: 'presence:users',
    PRESENCE_JOIN: 'presence:join',
    PRESENCE_LEAVE: 'presence:leave',
    MERGE_EVENT: 'merge:event',
  },
  TERMINAL: {
    CREATE: 'terminal:create',
    CREATED: 'terminal:created',
    INPUT: 'terminal:input',
    OUTPUT: 'terminal:output',
    RESIZE: 'terminal:resize',
    EXIT: 'terminal:exit',
    KILL: 'terminal:kill',
  },
  CHAT: {
    MESSAGE: 'chat:message',
    TYPING: 'chat:typing',
    TYPING_STOP: 'chat:typing:stop',
  },
  LSP: {
    REQUEST: 'lsp:request',
    RESPONSE: 'lsp:response',
    NOTIFICATION: 'lsp:notification',
  },
} as const;
