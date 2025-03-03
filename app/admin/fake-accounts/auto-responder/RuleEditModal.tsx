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
import { Label } from '../../../../components/ui/label';
import { ResponseRule, ResponseTemplate } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { RULE_CONDITION_TYPES, RULE_OPERATORS } from './constants';
import { toast } from 'react-hot-toast';

const ruleSchema = z.object({
  name: z.string().min(1, { message: 'ルール名は必須です' }),
  conditionType: z.string(),
  operator: z.string().optional(),
  value: z.string().optional(),
  field: z.string().optional(),
  templateId: z.string().min(1, { message: 'テンプレートは必須です' }),
  isActive: z.boolean().default(true),
  priority: z.number().min(1).default(10),
});

interface RuleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: ResponseRule | null;
  onSave: (rule: ResponseRule) => void;
  templates: ResponseTemplate[];
}

export default function RuleEditModal({ 
  isOpen, 
  onClose, 
  rule, 
  onSave,
  templates
}: RuleEditModalProps) {
  const [needsOperator, setNeedsOperator] = useState(false);
  const [needsField, setNeedsField] = useState(false);
  const [filteredOperators, setFilteredOperators] = useState(RULE_OPERATORS);
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<ResponseRule>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: '',
      conditionType: 'match_new',
      operator: undefined,
      value: undefined,
      field: undefined,
      templateId: '',
      isActive: true,
      priority: 10,
    }
  });

  const conditionType = watch('conditionType');
  const templateId = watch('templateId');
  
  // 条件タイプに基づいて、オペレーターと値フィールドの表示・非表示を切り替える
  useEffect(() => {
    switch (conditionType) {
      case 'match_new':
      case 'no_response':
        setNeedsOperator(false);
        setNeedsField(false);
        break;
      case 'message_received':
        setNeedsOperator(true);
        setNeedsField(false);
        break;
      case 'time_elapsed':
        setNeedsOperator(true);
        setNeedsField(false);
        break;
      case 'user_profile':
        setNeedsOperator(true);
        setNeedsField(true);
        break;
      default:
        setNeedsOperator(false);
        setNeedsField(false);
    }
    
    // 条件タイプに適用可能なオペレーターを絞り込む
    const operators = RULE_OPERATORS.filter(op => 
      op.applicableTypes.includes(conditionType)
    );
    setFilteredOperators(operators);
    
    // 条件タイプに適用可能なオペレーターが存在しない場合はオペレーターをリセット
    if (operators.length > 0 && needsOperator) {
      setValue('operator', operators[0].id);
    } else if (!needsOperator) {
      setValue('operator', undefined);
      setValue('value', undefined);
    }
  }, [conditionType, needsOperator, setValue]);

  // テンプレートIDが変更されたら、選択されたテンプレートを更新
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [templateId, templates]);

  useEffect(() => {
    if (rule) {
      reset({
        id: rule.id,
        name: rule.name,
        conditionType: rule.conditionType || 'match_new',
        operator: rule.operator,
        value: rule.value,
        field: rule.field,
        templateId: rule.templateId || '',
        isActive: rule.isActive !== false,
        priority: rule.priority || 10,
      });
      
      if (rule.templateId) {
        const template = templates.find(t => t.id === rule.templateId);
        setSelectedTemplate(template || null);
      }
    } else {
      reset({
        name: '',
        conditionType: 'match_new',
        operator: undefined,
        value: undefined,
        field: undefined,
        templateId: templates.length > 0 ? templates[0].id : '',
        isActive: true,
        priority: 10,
      });
      
      if (templates.length > 0) {
        setSelectedTemplate(templates[0]);
      }
    }
  }, [rule, reset, templates]);

  const onSubmit = async (data: ResponseRule) => {
    try {
      // ruleがnullの場合は新規作成、そうでなければ既存のルールを更新
      const updatedRule: ResponseRule = {
        ...data,
        id: rule?.id || new Date().getTime().toString(),
        createdAt: rule?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // テンプレートを追加
      if (selectedTemplate) {
        updatedRule.templates = [selectedTemplate];
      }
      
      onSave(updatedRule);
      toast.success(rule ? 'ルールを更新しました' : 'ルールを作成しました');
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('ルールの保存中にエラーが発生しました');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'ルールを編集' : '新規ルール作成'}
          </DialogTitle>
          <DialogDescription>
            自動応答のための条件とテンプレートを{rule ? '編集' : '作成'}します
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2 pb-4">
            <div>
              <Label htmlFor="name">ルール名</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="例: 新規マッチ時の挨拶"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="isActive">ステータス</Label>
              <div className="mt-1">
                <RadioGroup defaultValue={rule?.isActive !== false ? 'true' : 'false'} onValueChange={(value) => setValue('isActive', value === 'true')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="status-active" />
                    <Label htmlFor="status-active" className="font-normal">有効</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="status-inactive" />
                    <Label htmlFor="status-inactive" className="font-normal">無効</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="priority">優先度 (1-100)</Label>
              <Input
                id="priority"
                type="number"
                min={1}
                max={100}
                {...register('priority', { valueAsNumber: true })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">数値が大きいほど優先度が高くなります</p>
            </div>

            <div>
              <Label htmlFor="conditionType">条件タイプ</Label>
              <Select 
                onValueChange={(value) => setValue('conditionType', value)} 
                defaultValue={rule?.conditionType || 'match_new'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="条件タイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  {RULE_CONDITION_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {RULE_CONDITION_TYPES.find(t => t.id === conditionType)?.description || ''}
              </p>
            </div>

            {needsField && (
              <div>
                <Label htmlFor="field">フィールド名</Label>
                <Input
                  id="field"
                  {...register('field')}
                  placeholder="例: age, location, bio"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  評価するユーザープロフィールのフィールド名を入力してください
                </p>
              </div>
            )}

            {needsOperator && (
              <div>
                <Label htmlFor="operator">条件演算子</Label>
                <Select 
                  onValueChange={(value) => setValue('operator', value)} 
                  defaultValue={rule?.operator || (filteredOperators.length > 0 ? filteredOperators[0].id : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="演算子を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOperators.map(op => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {needsOperator && (
              <div>
                <Label htmlFor="value">条件値</Label>
                <Input
                  id="value"
                  {...register('value')}
                  placeholder={
                    conditionType === 'time_elapsed' 
                      ? '時間（分）' 
                      : conditionType === 'message_received'
                        ? 'メッセージ内容'
                        : '値'
                  }
                  className="mt-1"
                />
                {conditionType === 'time_elapsed' && (
                  <p className="text-xs text-gray-500 mt-1">
                    単位は分です (例: 60 = 1時間)
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="templateId">送信テンプレート</Label>
              <Select 
                onValueChange={(value) => setValue('templateId', value)} 
                defaultValue={rule?.templateId || (templates.length > 0 ? templates[0].id : '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="テンプレートを選択" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.templateId && (
                <p className="text-red-500 text-xs mt-1">{errors.templateId.message}</p>
              )}
              
              {selectedTemplate && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border text-sm">
                  <p className="font-medium text-xs text-gray-500 mb-1">テンプレートプレビュー:</p>
                  <p className="whitespace-pre-line">{selectedTemplate.content}</p>
                </div>
              )}
              
              {templates.length === 0 && (
                <p className="text-amber-500 text-xs mt-1">
                  テンプレートがありません。先にテンプレートを作成してください。
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || templates.length === 0}
            >
              {isSubmitting ? '保存中...' : (rule ? '更新' : '作成')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
