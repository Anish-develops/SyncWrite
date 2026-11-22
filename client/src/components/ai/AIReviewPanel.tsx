import React from 'react';
import { useAIStore } from '../../store/aiStore';
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

interface AIReviewPanelProps {
  onApplySuggestion: (line: number, suggestion: string) => void;
  onClose: () => void;
}

export const AIReviewPanel: React.FC<AIReviewPanelProps> = ({ onApplySuggestion, onClose }) => {
  const { activeReviewComments, dismissComment } = useAIStore();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-semantic-error shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-semantic-warning shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-semantic-info shrink-0" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface-ground border-l border-border select-none">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-surface-raised">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          AI Code Review ({activeReviewComments.length})
        </span>
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary p-1 rounded hover:bg-surface-sunken"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {activeReviewComments.length === 0 ? (
          <div className="text-center py-10 text-text-tertiary text-xs italic">
            No active review comments. Click "AI Review" in the toolbar to inspect the current file.
          </div>
        ) : (
          activeReviewComments.map((comment, index) => (
            <div
              key={index}
              className="p-3 bg-surface-raised border border-border rounded flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                  {getSeverityIcon(comment.severity)}
                  <span>Line {comment.line}</span>
                </div>
                <button
                  onClick={() => dismissComment(index)}
                  className="text-text-tertiary hover:text-text-primary p-0.5"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-text-secondary leading-relaxed">{comment.message}</p>

              {comment.suggestion && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <pre className="p-2 bg-terminal-bg text-text-inverse font-mono text-[11px] rounded overflow-x-auto">
                    {comment.suggestion}
                  </pre>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-6 py-0 px-2"
                      onClick={() => onApplySuggestion(comment.line, comment.suggestion!)}
                    >
                      <Check className="w-3 h-3 mr-1 text-semantic-success" />
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
