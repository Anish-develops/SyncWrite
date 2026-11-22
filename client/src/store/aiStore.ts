import { create } from 'zustand';
import { AIProvider, ReviewComment } from '@syncwrite/shared';

interface AIState {
  provider: AIProvider;
  isReviewing: boolean;
  activeReviewComments: ReviewComment[];
  setProvider: (provider: AIProvider) => void;
  getApiKey: (provider?: AIProvider) => string;
  setApiKey: (provider: AIProvider, key: string) => void;
  setReviewing: (reviewing: boolean) => void;
  setReviewComments: (comments: ReviewComment[]) => void;
  dismissComment: (index: number) => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  provider: (localStorage.getItem('syncwrite_ai_provider') as AIProvider) || 'openai',
  isReviewing: false,
  activeReviewComments: [],

  setProvider: (provider) => {
    localStorage.setItem('syncwrite_ai_provider', provider);
    set({ provider });
  },

  getApiKey: (prov) => {
    const target = prov || get().provider;
    return localStorage.getItem(`syncwrite_ai_key_${target}`) || '';
  },

  setApiKey: (prov, key) => {
    localStorage.setItem(`syncwrite_ai_key_${prov}`, key);
  },

  setReviewing: (isReviewing) => set({ isReviewing }),
  setReviewComments: (activeReviewComments) => set({ activeReviewComments }),

  dismissComment: (index) => {
    const current = [...get().activeReviewComments];
    current.splice(index, 1);
    set({ activeReviewComments: current });
  },
}));
