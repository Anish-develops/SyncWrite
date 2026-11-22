import * as monaco from 'monaco-editor';

export function registerMonacoThemes() {
  // Industrial Workshop Light Theme
  monaco.editor.defineTheme('workshop-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '292524', background: 'fafaf9' },
      { token: 'comment', foreground: '78716c', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c85a32', fontStyle: 'bold' }, // terracotta
      { token: 'string', foreground: '15803d' }, // forest green
      { token: 'number', foreground: 'b45309' }, // amber
      { token: 'type', foreground: '86198f' }, // plum
      { token: 'function', foreground: '1d4ed8' }, // slate blue
      { token: 'delimiter', foreground: '57534e' },
    ],
    colors: {
      'editor.background': '#fafaf9',
      'editor.foreground': '#292524',
      'editor.lineHighlightBackground': '#f5f5f4',
      'editorLineNumber.foreground': '#a8a29e',
      'editorLineNumber.activeForeground': '#c85a32',
      'editorGutter.background': '#f5f5f4',
      'editorCursor.foreground': '#c85a32',
      'editor.selectionBackground': '#fed7aa',
      'editor.inactiveSelectionBackground': '#ffedd5',
    },
  });

  // Industrial Workshop Dark Theme
  monaco.editor.defineTheme('workshop-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'e7e5e4', background: '1c1917' },
      { token: 'comment', foreground: '78716c', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ea580c', fontStyle: 'bold' }, // bright terracotta
      { token: 'string', foreground: '22c55e' }, // emerald
      { token: 'number', foreground: 'f59e0b' }, // amber
      { token: 'type', foreground: 'd946ef' }, // plum
      { token: 'function', foreground: '38bdf8' }, // sky blue
      { token: 'delimiter', foreground: 'a8a29e' },
    ],
    colors: {
      'editor.background': '#1c1917',
      'editor.foreground': '#e7e5e4',
      'editor.lineHighlightBackground': '#292524',
      'editorLineNumber.foreground': '#78716c',
      'editorLineNumber.activeForeground': '#ea580c',
      'editorGutter.background': '#201d1b',
      'editorCursor.foreground': '#ea580c',
      'editor.selectionBackground': '#431407',
      'editor.inactiveSelectionBackground': '#2d140b',
    },
  });
}
