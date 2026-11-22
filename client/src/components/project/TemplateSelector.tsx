import React, { useEffect, useState } from 'react';
import { ProjectTemplate, SupportedLanguage } from '@syncwrite/shared';
import { TemplateAPI } from '../../api/templates';
import { Check, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onSelect: (templateId: string | null, language: SupportedLanguage) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TemplateAPI.getAll()
      .then((res) => {
        setTemplates(res.templates);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
        Choose a Starter Template
      </label>

      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
        {/* Blank option */}
        <div
          onClick={() => onSelect(null, 'javascript')}
          className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors text-left ${
            selectedTemplate === null
              ? 'border-accent bg-accent/10'
              : 'border-border bg-surface-raised hover:bg-surface-sunken'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">📄</span>
            <div>
              <div className="text-xs font-semibold text-text-primary">Blank Workspace</div>
              <div className="text-[11px] text-text-tertiary">Start from scratch with an empty directory</div>
            </div>
          </div>
          {selectedTemplate === null && <Check className="w-4 h-4 text-accent" />}
        </div>

        {/* 9 Boilerplate Templates */}
        {templates.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelect(tpl.id, tpl.language)}
              className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-colors text-left ${
                isSelected
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface-raised hover:bg-surface-sunken'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{tpl.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-text-primary flex items-center gap-2">
                    <span>{tpl.name}</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-surface-sunken rounded text-text-tertiary">
                      {tpl.language}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-tertiary">{tpl.description}</div>
                </div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-accent" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
