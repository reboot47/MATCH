import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import { ResponseTemplate } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { TEMPLATE_CATEGORIES } from './constants';
import { detectTemplateVariables } from './utils';
import VariableSelector from './VariableSelector';
import TemplatePreview from './TemplatePreview';
import { toast } from 'react-hot-toast';

const templateSchema = z.object({
  name: z.string().min(1, { message: 'タイトルは必須です' }),
  message: z.string().min(1, { message: 'テンプレート内容は必須です' }),
  category: z.string(),
});

interface TemplateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ResponseTemplate | null;
  onSave: (template: ResponseTemplate) => void;
}

export default function TemplateEditModal({ 
  isOpen, 
  onClose, 
  template, 
  onSave 
}: TemplateEditModalProps) {
  const [activeTab, setActiveTab] = useState('editor');
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});
  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<ResponseTemplate>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      message: '',
      category: 'greeting',
    }
  });

  // テンプレート内容を監視して変数を自動検出
  const templateContent = watch('message');
  
  useEffect(() => {
    if (templateContent) {
      const variables = detectTemplateVariables(templateContent);
      setDetectedVariables(variables);
    } else {
      setDetectedVariables([]);
    }
  }, [templateContent]);

  useEffect(() => {
    if (template) {
      reset({
        id: template.id,
        name: template.name,
        message: template.message,
        category: template.category || 'greeting',
      });
      
      if (template.message) {
        const variables = detectTemplateVariables(template.message);
        setDetectedVariables(variables);
      }
    } else {
      reset({
        name: '',
        message: '',
        category: 'greeting',
      });
      setDetectedVariables([]);
    }
  }, [template, reset]);

  const onSubmit = async (data: ResponseTemplate) => {
    try {
      console.log('送信データ:', data);
      
      // templateがnullの場合は新規作成、そうでなければ既存のテンプレートを更新
      const templateToSave: ResponseTemplate = {
        ...data,
        id: template?.id,
      };
      
      console.log('保存するテンプレート:', templateToSave);
      
      onSave(templateToSave);
      toast.success('テンプレートを保存しました');
      onClose();
    } catch (error) {
      console.error('テンプレート保存エラー:', error);
      toast.error('テンプレートの保存に失敗しました');
    }
  };

  const handleInsertVariable = (variable: string) => {
    const textArea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
    
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      
      const currentContent = templateContent || '';
      const newContent = 
        currentContent.substring(0, start) + 
        variable + 
        currentContent.substring(end);
      
      setValue('message', newContent);
      
      // カーソル位置を変数の後ろに移動
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
      // テキストエリアが見つからない場合は末尾に追加
      const currentContent = templateContent || '';
      setValue('message', currentContent + variable);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {template ? 'テンプレートを編集' : '新規テンプレート作成'}
          </DialogTitle>
          <DialogDescription>
            ユーザーへの自動応答用テンプレートを{template ? '編集' : '作成'}します
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">テンプレート名</Label>
            <Input
              id="name"
              placeholder="テンプレート名を入力"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select 
              defaultValue={watch('category')} 
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="flex justify-between">
                <Label htmlFor="message">テンプレート内容</Label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded ${activeTab === 'editor' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('editor')}
                  >
                    エディタ
                  </button>
                  <button
                    type="button"
                    className={`text-xs px-2 py-1 rounded ${activeTab === 'preview' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setActiveTab('preview')}
                  >
                    プレビュー
                  </button>
                </div>
              </div>
              
              {activeTab === 'editor' ? (
                <>
                  <Textarea
                    id="message"
                    {...register('message')}
                    rows={8}
                    placeholder="こんにちは、{{user_name}}さん！マッチしてくれてありがとう！"
                    className="mt-1 font-mono"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                  
                  {detectedVariables.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>検出された変数:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {detectedVariables.map(variable => (
                          <span key={variable} className="bg-gray-100 rounded px-2 py-1 font-mono">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <TemplatePreview 
                  message={templateContent} 
                  variables={detectedVariables} 
                  previewVariables={previewVariables} 
                  setPreviewVariables={setPreviewVariables} 
                />
              )}
            </div>
            
            <div>
              <VariableSelector onInsert={handleInsertVariable} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : (template ? '更新' : '作成')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
