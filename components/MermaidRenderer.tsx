
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import { AlertCircle } from 'lucide-react';

interface MermaidRendererProps {
  code: string;
  theme: 'light' | 'dark';
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'neutral',
      fontFamily: 'Inter, system-ui, sans-serif',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: { useMaxWidth: false },
      gantt: { useMaxWidth: false },
      class: { useMaxWidth: false },
      state: { useMaxWidth: false },
      er: { useMaxWidth: false },
      pie: { useMaxWidth: false },
      suppressErrorIndicators: true
    });
  }, [theme]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !code.trim()) {
        setError(null);
        if (containerRef.current) containerRef.current.innerHTML = '';
        return;
      }

      try {
        setError(null);
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        
        try {
           await mermaid.parse(code);
        } catch (parseError: any) {
           throw parseError;
        }

        const { svg } = await mermaid.render(id, code);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            // 移除高度和宽度的硬性百分比，允许其以天然属性渲染
            svgElement.style.display = 'block';
            svgElement.style.opacity = '0';
            // 使用重绘触发渐入动画
            requestAnimationFrame(() => {
              svgElement.style.transition = 'opacity 0.6s ease-out';
              svgElement.style.opacity = '1';
            });
          }
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        setError(err.message || '渲染失败，请检查语法');
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div className="flex items-center justify-center min-w-max min-h-max">
      {error ? (
        <div className="max-w-md p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">语法错误</h3>
          <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all line-clamp-6">
            {error}
          </p>
        </div>
      ) : (
        <div 
          ref={containerRef} 
          className="flex justify-center items-center"
        />
      )}
      
      {!code.trim() && !error && (
        <div className="flex flex-col items-center gap-4 text-zinc-300 dark:text-zinc-700 select-none">
           <div className="w-20 h-20 border-2 border-dashed border-current rounded-3xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 opacity-20" />
           </div>
           <p className="text-sm font-medium">在左侧输入代码开始绘图</p>
        </div>
      )}
    </div>
  );
};

export default MermaidRenderer;
