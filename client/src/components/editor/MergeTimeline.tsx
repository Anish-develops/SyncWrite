import React, { useEffect, useState } from 'react';
import { EditEvent } from '@syncwrite/shared';

interface MergeTimelineProps {
  events: EditEvent[];
  onSelectEvent: (event: EditEvent) => void;
  onClose: () => void;
}

export const MergeTimeline: React.FC<MergeTimelineProps> = ({ events, onSelectEvent, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-surface-ground border-l border-border select-none">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-surface-raised">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Merge History ({events.length})
        </span>
        <button onClick={onClose} className="text-text-tertiary hover:text-text-primary text-xs">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-text-tertiary italic">
            No edits recorded yet.
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="p-2 bg-surface-raised border border-border rounded cursor-pointer hover:border-accent transition-colors flex flex-col gap-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-primary" style={{ color: evt.user?.avatarColor }}>
                  {evt.user?.username || 'Collaborator'}
                </span>
                <span className="text-[10px] text-text-tertiary">
                  {new Date(evt.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-text-secondary">
                <span className="font-mono">
                  Line {evt.line}:{evt.column}
                </span>
                <span className="capitalize font-medium text-accent">{evt.eventType}</span>
              </div>
              {evt.content && (
                <div className="p-1 bg-surface-sunken font-mono text-[10px] truncate rounded">
                  {evt.content}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
