"use client";

import React, { useMemo } from 'react';
import { Input } from '../../../../components/ui/input';

interface TemplatePreviewProps {
  message: string;
  variables: string[];
  previewVariables: Record<string, string>;
  setPreviewVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

// メモ化されたテンプレートプレビューコンポーネント
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  message, 
  variables, 
  previewVariables, 
  setPreviewVariables 
}) => {
  // プレビューコンテンツをメモ化
  const previewContent = useMemo(() => {
    if (!message) return [];
    
    return message.split('\n').map((line) => {
      let previewLine = line;
      variables.forEach(variable => {
        const varName = variable.replace(/[{}]/g, '');
        const previewValue = previewVariables[varName] || variable;
        previewLine = previewLine.replace(
          new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
          previewValue
        );
      });
      return previewLine;
    });
  }, [message, variables, previewVariables]);

  return (
    <div className="mt-1 border rounded-md p-4 h-[202px] overflow-y-auto bg-gray-50">
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">変数プレビュー設定</h4>
        <div className="grid grid-cols-2 gap-2">
          {variables.map(variable => (
            <div key={variable} className="flex items-center space-x-2">
              <span className="text-xs font-mono">{variable}:</span>
              <Input
                size="sm"
                className="text-xs h-6"
                value={previewVariables[variable.replace(/[{}]/g, '')] || ''}
                onChange={(e) => setPreviewVariables({
                  ...previewVariables,
                  [variable.replace(/[{}]/g, '')]: e.target.value
                })}
                placeholder="プレビュー値"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">プレビュー:</h4>
        <div className="p-3 bg-white rounded border">
          {previewContent.map((line, i) => (
            <p key={i}>{line || <br />}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

// パフォーマンス最適化のためコンポーネントをメモ化
export default React.memo(TemplatePreview);
