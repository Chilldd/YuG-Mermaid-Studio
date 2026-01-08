
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Download, 
  Copy, 
  Trash2, 
  Sparkles, 
  PanelLeft, 
  Sun, 
  Moon, 
  Check, 
  Share2,
  Image as ImageIcon,
  FileCode,
  LayoutTemplate
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { GoogleGenAI } from "@google/genai";
import MermaidRenderer from './components/MermaidRenderer';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import { INITIAL_CODE } from './constants';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    code: INITIAL_CODE,
    theme: 'light',
    isAutoRender: true,
    isSidebarOpen: true
  });
  
  const [renderedCode, setRenderedCode] = useState(INITIAL_CODE);
  const [isExporting, setIsExporting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // 初始化主题
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#18181b'; // zinc-900
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fafafa'; // zinc-50
    }
  }, [state.theme]);

  // 处理渲染
  useEffect(() => {
    if (state.isAutoRender) {
      const timer = setTimeout(() => {
        setRenderedCode(state.code);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.code, state.isAutoRender]);

  const handleManualRender = () => {
    setRenderedCode(state.code);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(state.code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!exportRef.current) return;
    setIsExporting(true);
    
    const filter = (node: Node) => {
      if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') {
        return node.href.includes(window.location.host);
      }
      return true;
    };

    // 动态获取内容的真实滚动尺寸
    const width = exportRef.current.scrollWidth;
    const height = exportRef.current.scrollHeight;

    const options = {
      backgroundColor: state.theme === 'dark' ? '#18181b' : '#ffffff',
      filter,
      pixelRatio: 2,
      skipFonts: false,
      width: width + 120, // 增加左右边距
      height: height + 120, // 增加上下边距
      style: {
        transform: 'none',
        margin: '0',
        padding: '60px',
      }
    };

    try {
      let dataUrl = '';
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(exportRef.current, options);
      } else {
        dataUrl = await htmlToImage.toSvg(exportRef.current, options);
      }

      const link = document.createElement('a');
      link.download = `mermaid-diagram-${Date.now()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出图片时发生错误，请尝试减少图表复杂度或重试。');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAISuggestion = async () => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `帮我优化以下 Mermaid 代码，使其布局更合理、配色更专业。只需返回代码本身，不要任何解释性文字。\n\n${state.code}`,
        config: {
          temperature: 0.7,
        }
      });
      const optimizedCode = response.text?.replace(/```mermaid/g, '').replace(/```/g, '').trim();
      if (optimizedCode) {
        setState(prev => ({ ...prev, code: optimizedCode }));
      }
    } catch (err) {
      console.error('AI Suggestion failed', err);
    } finally {
      setAiLoading(false);
    }
  };

  const clearCode = () => {
    if (confirm('确定要清空编辑器吗？')) {
      setState(prev => ({ ...prev, code: '' }));
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${state.theme === 'dark' ? 'dark text-white' : 'text-zinc-900'}`}>
      <Sidebar 
        isOpen={state.isSidebarOpen} 
        onSelectExample={(code) => setState(prev => ({ ...prev, code }))}
        theme={state.theme}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 flex-shrink-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                M
              </div>
              <h1 className="font-semibold tracking-tight hidden sm:block">Mermaid Studio Pro</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleAISuggestion}
              disabled={aiLoading}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all font-medium text-sm border border-indigo-200/50 dark:border-indigo-700/30 shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-pulse' : ''}`} />
              {aiLoading ? 'AI 优化中...' : 'AI 优化'}
            </button>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
            <button 
              onClick={() => setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="切换主题"
            >
              {state.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="relative group">
              <button 
                className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition-all font-medium text-sm shadow-md"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                  <button onClick={() => handleDownload('png')} className="w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> 导出 PNG
                  </button>
                  <button onClick={() => handleDownload('svg')} className="w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-700">
                    <FileCode className="w-4 h-4" /> 导出 SVG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* 编辑器区域 */}
          <div className="w-1/2 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div className="h-10 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">DSL Editor</span>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-3 h-3 rounded-full transition-colors ${state.isAutoRender ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={state.isAutoRender} 
                    onChange={e => setState(prev => ({ ...prev, isAutoRender: e.target.checked }))} 
                  />
                  <span className="text-[11px] text-zinc-400 group-hover:text-zinc-600 transition-colors">自动渲染</span>
                </label>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleManualRender} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500" title="手动渲染"><Play className="w-3.5 h-3.5" /></button>
                <button onClick={handleCopyCode} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 relative" title="复制代码">{copyFeedback ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}</button>
                <button onClick={clearCode} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-zinc-500 hover:text-red-500" title="清空"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <Editor value={state.code} onChange={(code) => setState(prev => ({ ...prev, code }))} theme={state.theme} />
            </div>
          </div>

          {/* 预览区域 */}
          <div className="w-1/2 bg-white dark:bg-zinc-900 relative group overflow-hidden">
             {/* 装饰性背景网格 */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
             
             <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-[11px] font-medium text-zinc-500">
                  <LayoutTemplate className="w-3 h-3" />
                  实时预览模式
               </div>
             </div>
             
             {/* 
                预览滚动容器：
                使用 overflow-auto 并移除 no-scrollbar，让用户可以看到滚动条。
             */}
             <div className="h-full w-full overflow-auto relative">
                {/* 
                   Grid 包装层：
                   1. min-w-full/min-h-full 保证至少撑满父容器。
                   2. grid + place-items-center 是处理溢出滚动的最佳实践。
                */}
                <div className="min-w-full min-h-full grid place-items-center p-12 sm:p-20">
                   {/* 
                      导出/内容目标：
                      使用 margin: auto 可以确保：
                      - 当内容小于视口，它会水平垂直居中。
                      - 当内容大于视口，它会从 (0,0) 开始排列，从而支持完整的横向和纵向滚动。
                   */}
                   <div 
                    ref={exportRef}
                    className="m-auto inline-block"
                  >
                    <MermaidRenderer 
                      code={renderedCode} 
                      theme={state.theme} 
                    />
                  </div>
                </div>
             </div>

             {isExporting && (
               <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-zinc-900 dark:text-zinc-100">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium animate-pulse">正在生成高分辨率图像...</span>
                  </div>
               </div>
             )}
          </div>
        </div>

        <footer className="h-7 border-t border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between text-[11px] text-zinc-500 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              系统就绪
            </span>
            <span>字符数: {state.code.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:text-zinc-800 dark:hover:text-zinc-200 cursor-help transition-colors">Powered by Mermaid.js</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="flex items-center gap-1 hover:text-indigo-500 transition-colors cursor-pointer"><Share2 className="w-3 h-3" />分享代码</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
