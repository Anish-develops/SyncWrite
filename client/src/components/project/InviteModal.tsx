import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, inviteCode }) => {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/join/${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Collaborators">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          Share this link with your team members to invite them directly to this project workspace.
        </p>

        <div className="flex items-center gap-2 bg-surface-sunken p-2 border border-border rounded">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="w-full bg-transparent text-xs font-mono text-text-primary focus:outline-none select-all"
          />
          <Button size="sm" variant={copied ? 'secondary' : 'primary'} onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-semantic-success" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
