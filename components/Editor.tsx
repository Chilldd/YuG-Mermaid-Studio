
import React, { useRef, useEffect } from 'react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  theme: 'light' | 'dark';
}

const Editor: React.FC<EditorProps> = ({ value, onChange, theme }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // 同步滚动
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const lineCount = value.split('\n').length;

  return (
    <div className="flex h-full w-full bg-white dark:bg-zinc-950 font-mono text-sm">
      {/* 行号 */}
      <div 
        ref={lineNumbersRef}
        className="w-12 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 flex flex-col items-center py-4 select-none border-r border-zinc-100 dark:border-zinc-800 overflow-hidden"
      >
        {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
          <div key={i} className="h-6 leading-6 text-[11px]">
            {i + 1}
          </div>
        ))}
      </div>

      {/* 文本域 */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        className={`flex-1 p-4 bg-transparent outline-none resize-none code-font leading-6 h-full w-full transition-colors ${
          theme === 'dark' ? 'text-zinc-300 caret-indigo-500' : 'text-zinc-800 caret-indigo-600'
        }`}
        placeholder="在这里输入 Mermaid 代码..."
      />
    </div>
  );
};

export default Editor;
