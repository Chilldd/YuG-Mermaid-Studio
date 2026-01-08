
import React from 'react';
import { motion } from 'framer-motion';
import { EXAMPLES } from '../constants';
import { LayoutGrid, BookOpen, Star, Info, ExternalLink } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onSelectExample: (code: string) => void;
  theme: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onSelectExample, theme }) => {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      className="bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full overflow-hidden"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8 px-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h2 className="font-semibold text-sm tracking-tight text-zinc-500 uppercase">库与模版</h2>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
          {/* 模版区块 */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-medium text-zinc-400">官方示例</span>
              <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
                {EXAMPLES.length}
              </span>
            </div>
            <div className="space-y-1">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelectExample(ex.code)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                     <LayoutGrid className="w-4 h-4 text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">{ex.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{ex.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 快速入门 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
             <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                <Star className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">小技巧</span>
             </div>
             <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                你可以使用 CSS 样式直接在 Mermaid 中定制颜色。试试点击 AI 优化让它帮你自动美化！
             </p>
             <a 
               href="https://mermaid.js.org/intro/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors"
             >
                查看完整文档
                <ExternalLink className="w-3 h-3" />
             </a>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 px-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer transition-colors">
             <Info className="w-4 h-4" />
             <span className="text-xs font-medium">关于 Mermaid Studio</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
