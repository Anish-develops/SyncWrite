import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Code2, Users, Terminal, Sparkles, GitMerge, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-ground text-text-primary flex flex-col justify-between select-none overflow-y-auto">
      {/* Top Bar */}
      <header className="h-16 border-b border-border px-8 flex items-center justify-between bg-surface-raised/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-white font-bold font-mono text-sm shadow-sm">
            SW
          </div>
          <span className="font-bold text-lg tracking-tight">SyncWrite</span>
          <span className="text-xs px-2 py-0.5 bg-surface-sunken border border-border rounded text-text-tertiary">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-8 py-20 flex flex-col items-start text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          The Self-Hosted Collaborative IDE
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-3xl">
          Write, edit, and run code <br />
          <span className="text-accent underline decoration-accent/30 decoration-4">together in real time.</span>
        </h1>

        <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
          SyncWrite combines Monaco Editor, Conflict-Free Replicated Data Types (CRDT), private tmux-backed terminals, and local AI intelligence into a warm, craftsman workshop designed for teams.
        </p>

        <div className="flex items-center gap-4 mb-16">
          <Link to="/register">
            <Button variant="primary" size="lg" className="gap-2">
              <span>Start Coding Free</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Explore Dashboard
            </Button>
          </Link>
        </div>

        {/* Feature Grid: Industrial Workshop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full border-t border-border pt-12">
          <div className="p-5 bg-surface-raised border border-border rounded flex flex-col gap-2">
            <div className="w-8 h-8 rounded bg-surface-sunken flex items-center justify-center text-accent mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Conflict-Free CRDT Collaboration</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Powered by Yjs and Monaco Editor. Multiple developers type concurrently on the same lines with zero edit conflicts and real-time cursor awareness.
            </p>
          </div>

          <div className="p-5 bg-surface-raised border border-border rounded flex flex-col gap-2">
            <div className="w-8 h-8 rounded bg-surface-sunken flex items-center justify-center text-accent mb-2">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Private Interactive Terminals</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Run Python, Node, Go, Rust, Java, C, and C++ code in isolated per-user sessions with full xterm.js emulation and auto-resize.
            </p>
          </div>

          <div className="p-5 bg-surface-raised border border-border rounded flex flex-col gap-2">
            <div className="w-8 h-8 rounded bg-surface-sunken flex items-center justify-center text-accent mb-2">
              <GitMerge className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Merge Attribution & Local AI</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Track who edited what with live line attribution overlays. Connect your own OpenAI, Gemini, or Claude keys safely from your browser.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-8 text-xs text-text-tertiary flex items-center justify-between bg-surface-raised/30">
        <span>© 2026 SyncWrite. Open-source self-hosted collaborative workspace.</span>
        <span>Crafted with Monaco, Yjs, Express, & React</span>
      </footer>
    </div>
  );
};
