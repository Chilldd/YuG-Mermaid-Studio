
import { Example } from './types';

export const INITIAL_CODE = `graph TD
    A["开始"] --> B{"是否使用 Mermaid?"}
    B -- "是" --> C["编写 DSL 代码"]
    C --> D["实时预览效果"]
    D --> E["导出精美图片"]
    B -- "否" --> F["手动绘图 (耗时)"]
    F --> G["效率降低"]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#00ff00,stroke:#333,stroke-width:4px`;

export const EXAMPLES: Example[] = [
  {
    id: 'flow-basic',
    name: '基础流程图',
    type: 'flowchart',
    code: `graph LR
    A["用户输入"] --> B("处理数据")
    B --> C{"结果"}
    C -->|成功| D["显示成功"]
    C -->|失败| E["显示错误"]`
  },
  {
    id: 'seq-auth',
    name: '身份验证时序图',
    type: 'sequence',
    code: `sequenceDiagram
    participant User
    participant App
    participant Server
    
    User->>App: 输入凭据
    App->>Server: POST /login
    Server-->>App: 200 OK (Token)
    App-->>User: 登录成功`
  },
  {
    id: 'er-database',
    name: 'ER 实体关系图',
    type: 'er',
    code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`
  },
  {
    id: 'mindmap-dev',
    name: '技术栈脑图',
    type: 'mindmap',
    code: `mindmap
  root(("React 生态"))
    UI 组件
      Tailwind
      Framer Motion
      Lucide Icons
    状态管理
      Zustand
      Redux
    绘图
      Mermaid
      D3.js`
  }
];
