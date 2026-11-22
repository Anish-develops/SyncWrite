import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useAIStore } from '../../store/aiStore';

interface AIReviewTriggerProps {
  onTrigger: () => void;
  isLoading?: boolean;
}

export const AIReviewTrigger: React.FC<AIReviewTriggerProps> = ({ onTrigger, isLoading = false }) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className="text-xs h-7 px-2.5 gap-1.5 border-accent/40 text-accent hover:bg-accent/10"
      onClick={onTrigger}
      isLoading={isLoading}
      title="Analyze current file with AI"
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>AI Review</span>
    </Button>
  );
};
