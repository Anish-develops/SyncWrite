import React, { useEffect, useRef } from 'react';
import { Terminal as Xterm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { Socket } from 'socket.io-client';
import { WS_EVENTS } from '@syncwrite/shared';

interface TerminalProps {
  terminalId: string;
  socket: Socket | null;
}

export const Terminal: React.FC<TerminalProps> = ({ terminalId, socket }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Xterm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Xterm({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      lineHeight: 1.4,
      theme: {
        background: '#1c1917', // warm charcoal
        foreground: '#f5f5f4',
        cursor: '#c85a32', // terracotta
        selectionBackground: 'rgba(200, 90, 50, 0.3)',
      },
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(containerRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.onData((data) => {
      socket?.emit(WS_EVENTS.TERMINAL.INPUT, { terminalId, data });
    });

    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        fitAddonRef.current.fit();
        socket?.emit(WS_EVENTS.TERMINAL.RESIZE, {
          terminalId,
          cols: xtermRef.current.cols,
          rows: xtermRef.current.rows,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [terminalId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleOutput = ({ terminalId: id, data }: { terminalId: string; data: string }) => {
      if (id === terminalId && xtermRef.current) {
        xtermRef.current.write(data);
      }
    };

    socket.on(WS_EVENTS.TERMINAL.OUTPUT, handleOutput);

    return () => {
      socket.off(WS_EVENTS.TERMINAL.OUTPUT, handleOutput);
    };
  }, [socket, terminalId]);

  return <div ref={containerRef} className="w-full h-full bg-[#1c1917] p-2" />;
};
