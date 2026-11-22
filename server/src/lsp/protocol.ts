export class LSPProtocolParser {
  private buffer = '';

  public parse(chunk: string, onMessage: (msg: any) => void): void {
    this.buffer += chunk;

    while (true) {
      const headerEnd = this.buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) break;

      const header = this.buffer.slice(0, headerEnd);
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) {
        // Discard malformed header
        this.buffer = this.buffer.slice(headerEnd + 4);
        continue;
      }

      const contentLength = parseInt(match[1], 10);
      const bodyStart = headerEnd + 4;

      if (this.buffer.length < bodyStart + contentLength) {
        // Incomplete body, wait for next chunk
        break;
      }

      const body = this.buffer.slice(bodyStart, bodyStart + contentLength);
      this.buffer = this.buffer.slice(bodyStart + contentLength);

      try {
        const json = JSON.parse(body);
        onMessage(json);
      } catch (err) {
        console.error('Failed to parse LSP JSON-RPC body:', err);
      }
    }
  }

  public static formatMessage(payload: any): string {
    const json = JSON.stringify(payload);
    const byteLength = Buffer.byteLength(json, 'utf-8');
    return `Content-Length: ${byteLength}\r\n\r\n${json}`;
  }
}
