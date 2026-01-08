
export type DiagramType = 'flowchart' | 'sequence' | 'gantt' | 'class' | 'state' | 'er' | 'mindmap' | 'pie';

export interface Example {
  id: string;
  name: string;
  type: DiagramType;
  code: string;
}

export interface AppState {
  code: string;
  theme: 'light' | 'dark';
  isAutoRender: boolean;
  isSidebarOpen: boolean;
}
