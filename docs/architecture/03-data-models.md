### **Data Models (Mô hình Dữ liệu - Cập nhật theo A2A-JS SDK)**

#### **Agent & AgentCard**

```typescript
interface AgentCard {
  name: string;
  description: string;
  url: string;
  provider: {
    organization: string;
    url: string;
  };
  version: string;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
    stateTransitionHistory: boolean;
  };
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  description: string;
}
```

#### **Message (Tin nhắn)**

```typescript
interface Message {
  id: string;
  sender: "user" | string; // user hoặc agent_id
  content: string;
  timestamp: Date;
}
```

#### **Task (Tác vụ)**

```typescript
type TaskStatus = "pending" | "in-progress" | "completed" | "failed";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assigner: string; // agent_id
  assignee: string; // agent_id
  createdAt: Date;
}
```

#### **Artifact (Hiện vật)**

```typescript
type ArtifactType = "markdown" | "image/png" | "json";

interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  contentUrl: string;
  creator: string; // agent_id
  createdAt: Date;
}
```

#### **DemoSession (Phiên làm việc)**

```typescript
interface DemoSession {
  id: string;
  status: "active" | "completed";
  messages: Message[];
  tasks: Task[];
  artifacts: Artifact[];
  log: string[];
}
```
