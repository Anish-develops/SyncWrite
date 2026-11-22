import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { getProjectDir } from '../utils/fileSystem';
import { generateId } from '../utils/uuid';

export interface TerminalInstance {
  id: string;
  projectId: string;
  userId: string;
  process: any;
  lastActive: number;
  onData: (data: string) => void;
  onExit: (code: number) => void;
}

export class TerminalManager {
  private terminals = new Map<string, TerminalInstance>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Run cleanup check every 5 minutes
    this.cleanupTimer = setInterval(() => {
      this.cleanupIdleSessions();
    }, 5 * 60 * 1000);
  }

  public createTerminal(
    projectId: string,
    userId: string,
    cols = 80,
    rows = 24,
    onData: (data: string) => void,
    onExit: (code: number) => void
  ): string {
    const terminalId = generateId();
    const cwd = getProjectDir(projectId);
    const isWin = process.platform === 'win32';

    let proc: any;

    try {
      // Attempt to load node-pty if available
      const pty = require('node-pty');
      const shell = isWin ? 'powershell.exe' : (process.env.SHELL || 'bash');
      proc = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols,
        rows,
        cwd,
        env: process.env as Record<string, string>,
      });

      proc.onData((data: string) => {
        const inst = this.terminals.get(terminalId);
        if (inst) inst.lastActive = Date.now();
        onData(data);
      });

      proc.onExit(({ exitCode }: { exitCode: number }) => {
        this.terminals.delete(terminalId);
        onExit(exitCode);
      });
    } catch {
      // Robust child_process fallback for systems where node-pty isn't natively compiled
      const shell = isWin ? 'powershell.exe' : 'bash';
      const args = isWin ? ['-NoLogo'] : ['-i'];

      const child = spawn(shell, args, {
        cwd,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          FORCE_COLOR: '1',
        },
      });

      child.stdout.on('data', (buf: Buffer) => {
        const inst = this.terminals.get(terminalId);
        if (inst) inst.lastActive = Date.now();
        onData(buf.toString('utf-8'));
      });

      child.stderr.on('data', (buf: Buffer) => {
        const inst = this.terminals.get(terminalId);
        if (inst) inst.lastActive = Date.now();
        onData(buf.toString('utf-8'));
      });

      child.on('exit', (code: number | null) => {
        this.terminals.delete(terminalId);
        onExit(code ?? 0);
      });

      proc = {
        write: (data: string) => child.stdin.write(data),
        resize: () => {},
        kill: () => child.kill(),
      };
    }

    const instance: TerminalInstance = {
      id: terminalId,
      projectId,
      userId,
      process: proc,
      lastActive: Date.now(),
      onData,
      onExit,
    };

    this.terminals.set(terminalId, instance);
    return terminalId;
  }

  public write(terminalId: string, data: string): void {
    const inst = this.terminals.get(terminalId);
    if (inst) {
      inst.lastActive = Date.now();
      inst.process.write(data);
    }
  }

  public resize(terminalId: string, cols: number, rows: number): void {
    const inst = this.terminals.get(terminalId);
    if (inst && typeof inst.process.resize === 'function') {
      try {
        inst.process.resize(cols, rows);
      } catch (err) {
        // Ignored
      }
    }
  }

  public kill(terminalId: string): void {
    const inst = this.terminals.get(terminalId);
    if (inst) {
      try {
        inst.process.kill();
      } catch {}
      this.terminals.delete(terminalId);
    }
  }

  private cleanupIdleSessions(): void {
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutes
    for (const [id, inst] of this.terminals.entries()) {
      if (now - inst.lastActive > timeout) {
        this.kill(id);
      }
    }
  }
}

export const terminalManager = new TerminalManager();
