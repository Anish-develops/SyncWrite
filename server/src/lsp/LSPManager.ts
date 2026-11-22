import { spawn, ChildProcess } from 'child_process';
import { getProjectDir } from '../utils/fileSystem';
import { LSPProtocolParser } from './protocol';

export class LSPManager {
  // projectId -> ChildProcess
  private servers = new Map<string, ChildProcess>();
  private parsers = new Map<string, LSPProtocolParser>();

  public getOrCreateServer(
    projectId: string,
    language: string,
    onMessage: (msg: any) => void
  ): ChildProcess | null {
    if (this.servers.has(projectId)) {
      return this.servers.get(projectId)!;
    }

    const cwd = getProjectDir(projectId);
    let proc: ChildProcess | null = null;
    const isWin = process.platform === 'win32';

    try {
      if (language === 'python') {
        const cmd = isWin ? 'pyright-langserver.cmd' : 'pyright-langserver';
        proc = spawn(cmd, ['--stdio'], { cwd, shell: true });
      } else if (language === 'javascript' || language === 'typescript') {
        const cmd = isWin ? 'typescript-language-server.cmd' : 'typescript-language-server';
        proc = spawn(cmd, ['--stdio'], { cwd, shell: true });
      }
    } catch (err) {
      console.warn(`LSP server not available for language ${language}:`, err);
    }

    if (!proc || !proc.stdout || !proc.stdin) {
      return null;
    }

    const parser = new LSPProtocolParser();
    this.parsers.set(projectId, parser);

    proc.stdout.on('data', (data: Buffer) => {
      parser.parse(data.toString('utf-8'), onMessage);
    });

    proc.on('exit', () => {
      this.servers.delete(projectId);
      this.parsers.delete(projectId);
    });

    this.servers.set(projectId, proc);
    return proc;
  }

  public sendMessage(projectId: string, message: any): void {
    const server = this.servers.get(projectId);
    if (server && server.stdin) {
      const formatted = LSPProtocolParser.formatMessage(message);
      server.stdin.write(formatted);
    }
  }

  public killServer(projectId: string): void {
    const server = this.servers.get(projectId);
    if (server) {
      server.kill();
      this.servers.delete(projectId);
      this.parsers.delete(projectId);
    }
  }
}

export const lspManager = new LSPManager();
