import React, { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import { AIProvider } from '@syncwrite/shared';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Sparkles, Key, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const AISettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { provider, setProvider, getApiKey, setApiKey } = useAIStore();
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(provider);
  const [key, setKey] = useState(getApiKey(provider));
  const [showKey, setShowKey] = useState(false);

  const handleProviderChange = (p: AIProvider) => {
    setSelectedProvider(p);
    setKey(getApiKey(p));
  };

  const handleSave = () => {
    setProvider(selectedProvider);
    setApiKey(selectedProvider, key.trim());
    toast.success(`${selectedProvider.toUpperCase()} API key saved`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Intelligence Settings">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
            Select Provider
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['openai', 'gemini', 'anthropic'] as AIProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => handleProviderChange(p)}
                className={`py-2 px-3 text-xs font-medium rounded capitalize border transition-colors ${
                  selectedProvider === p
                    ? 'border-accent bg-accent/10 text-accent font-semibold'
                    : 'border-border bg-surface-raised text-text-secondary hover:text-text-primary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Input
            label={`${selectedProvider.toUpperCase()} API Key`}
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={`Enter your ${selectedProvider} API key...`}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-8 text-text-tertiary hover:text-text-primary"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-[11px] text-text-tertiary leading-normal">
          <Key className="w-3.5 h-3.5 inline mr-1 text-accent" />
          Keys are stored <strong>strictly on your local device</strong> via localStorage. Requests to OpenAI and Gemini are sent directly from your browser.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Key
          </Button>
        </div>
      </div>
    </Modal>
  );
};
