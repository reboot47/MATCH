import { useState } from 'react';
import { motion } from 'framer-motion';
import { TEMPLATE_VARIABLES } from './constants';

interface VariableSelectorProps {
  onInsert: (variable: string) => void;
}

export function VariableSelector({ onInsert }: VariableSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // カテゴリごとに変数をグループ化
  const categories = ['all', ...Array.from(new Set(TEMPLATE_VARIABLES.map(v => v.category)))];
  
  const filteredVariables = activeCategory === 'all' 
    ? TEMPLATE_VARIABLES 
    : TEMPLATE_VARIABLES.filter(v => v.category === activeCategory);

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div className="bg-gray-50 border-b p-3">
        <h3 className="font-medium text-gray-700">利用可能な変数</h3>
        <p className="text-sm text-gray-500">メッセージにこれらの変数を挿入できます</p>
      </div>
      
      {/* カテゴリのタブ */}
      <div className="flex border-b overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              activeCategory === category 
                ? 'border-b-2 border-primary-600 text-primary-600 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'すべて' : category === 'user' ? 'ユーザー' : category === 'match' ? 'マッチ' : 'その他'}
          </button>
        ))}
      </div>
      
      {/* 変数リスト */}
      <div className="p-2 max-h-64 overflow-y-auto">
        {filteredVariables.map((variable, index) => (
          <motion.div
            key={variable.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={() => onInsert(variable.name)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono text-sm text-primary-600">{variable.name}</p>
                <p className="text-xs text-gray-500">{variable.description}</p>
              </div>
              <button 
                className="text-xs text-white bg-primary-600 hover:bg-primary-700 rounded px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onInsert(variable.name);
                }}
              >
                挿入
              </button>
            </div>
            <div className="mt-1">
              <p className="text-xs text-gray-400">
                例: {variable.examples.join(', ')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default VariableSelector;
