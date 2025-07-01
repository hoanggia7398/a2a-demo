# Frontend Migration Strategy - Epic 2.0

## Overview

This document provides a detailed strategy for migrating the current Zustand-based frontend simulation to use real backend API calls while maintaining full feature parity and zero regression during the transition.

**Migration Goal**: Replace frontend simulations with real API integration  
**Strategy**: Incremental, component-by-component migration  
**Success Criteria**: 100% feature parity, no user-visible regression

---

## 🎯 **Migration Principles**

### 1. **Zero Regression Policy**

- **Maintain Working Demo**: Epic 1.0 functionality must remain accessible during migration
- **Parallel Implementation**: New API-integrated components alongside existing simulations
- **Feature Toggle**: Ability to switch between simulation and real API modes
- **Rollback Ready**: Quick rollback to simulation mode if issues arise

### 2. **Incremental Approach**

- **Component-by-Component**: Migrate individual UI components sequentially
- **Service Layer First**: Implement API client layer before component migration
- **Progressive Enhancement**: Start with simple read operations, add complex workflows
- **Validation at Each Step**: Test each component migration before proceeding

### 3. **Compatibility Preservation**

- **Interface Consistency**: Maintain existing component props and state interfaces
- **TypeScript Compliance**: Ensure strong typing throughout migration
- **Error Boundary**: Graceful fallback to simulation mode on API failures
- **Performance Monitoring**: No degradation in user experience

---

## 📋 **Current State Analysis**

### Frontend Architecture (Epic 1.0)

```typescript
// Current Zustand Store Structure
interface WorkbenchState {
  // Data
  systemLogs: SystemLog[];
  agents: AgentStatus[];
  tasks: Task[];
  messages: Message[];
  artifacts: Artifact[];

  // Simulation Actions
  addSystemLog: (log: SystemLog) => void;
  createTask: (task) => Task;
  updateAgentStatus: (agentId, status) => void;
  transferArtifact: (artifactId, targetAgent) => void;
  startDesignAgentProcessing: (artifact) => void; // Story 1.4
  generateDesignArtifact: (artifact) => Artifact; // Story 1.4
}
```

### Components Requiring Migration

1. **WorkbenchLayout**: Main orchestration and user input handling
2. **ChatInterface**: Real-time conversation with Analyst Agent
3. **TaskDisplay**: Task creation, assignment, and status tracking
4. **ArtifactDisplay**: Artifact creation, transfer, and visualization
5. **System Logging**: Real-time event streaming and A2A communication logs

### Current Simulation Mechanisms

- **setTimeout delays**: Simulating agent processing time
- **Mock data generation**: Artificial content creation
- **State-only persistence**: No backend data storage
- **Client-side A2A**: Simulated agent communication

---

## 🔧 **Migration Architecture**

### New Architecture Pattern

```typescript
// Service Layer (New)
interface ApiService {
  agents: AgentApiService;
  tasks: TaskApiService;
  artifacts: ArtifactApiService;
  logs: LogApiService;
  realtime: WebSocketService;
}

// Updated Store (Migration Target)
interface WorkbenchState {
  // Data (unchanged)
  systemLogs: SystemLog[];
  agents: AgentStatus[];
  tasks: Task[];
  artifacts: Artifact[];

  // API Actions (replacing simulations)
  apiService: ApiService;
  createTask: (task) => Promise<Task>;
  updateAgentStatus: (agentId, status) => Promise<void>;
  transferArtifact: (artifactId, targetAgent) => Promise<void>;

  // Migration Control
  useSimulation: boolean;
  toggleSimulationMode: () => void;
}
```

---

## 📅 **Migration Timeline & Phases**

### **Phase 1: API Service Foundation (Week 1)**

**Goal**: Establish API client infrastructure  
**Duration**: 3-5 days  
**Dependencies**: Story 2.1 (Backend foundation) complete

#### Phase 1 Tasks:

- [ ] **Create API client service layer**
- [ ] **Implement authentication handling**
- [ ] **Set up error handling and retry logic**
- [ ] **Create WebSocket connection management**
- [ ] **Add migration feature toggle**

#### Phase 1 Deliverables:

```typescript
// apps/web/src/services/api-client.ts
export class ApiClient {
  constructor(baseURL: string, authToken?: string);

  // Agent operations
  async getAgentStatus(agentId: string): Promise<AgentStatus>;
  async updateAgentStatus(
    agentId: string,
    status: Partial<AgentStatus>
  ): Promise<void>;

  // Task operations
  async createTask(task: CreateTaskRequest): Promise<Task>;
  async delegateTask(taskId: string, targetAgent: string): Promise<void>;

  // Artifact operations
  async createArtifact(artifact: CreateArtifactRequest): Promise<Artifact>;
  async transferArtifact(
    artifactId: string,
    targetAgent: string
  ): Promise<void>;

  // System logs
  async getSystemLogs(options?: LogQueryOptions): Promise<SystemLog[]>;
}
```

### **Phase 2: Basic Data Operations (Week 2)**

**Goal**: Migrate read operations and basic state management  
**Duration**: 5-7 days  
**Dependencies**: Phase 1 complete + Story 2.2 (Database schema) complete

#### Phase 2 Tasks:

- [ ] **Migrate agent status display to API calls**
- [ ] **Replace task list with API-driven data**
- [ ] **Implement real-time agent status updates**
- [ ] **Add system logs API integration**
- [ ] **Create loading states for API operations**

#### Phase 2 Component Changes:

```typescript
// Before: Simulation-based
const { agents, tasks } = useWorkbenchStore();

// After: API-integrated with fallback
const { agents, tasks, loading, error, useSimulation } = useWorkbenchStore();

useEffect(() => {
  if (!useSimulation) {
    // Load real data from API
    apiService.agents.getAll().then(setAgents);
    apiService.tasks.getAll().then(setTasks);
  }
}, [useSimulation]);
```

### **Phase 3: Task Workflow Migration (Week 3)**

**Goal**: Replace task creation and delegation with real API calls  
**Duration**: 5-7 days  
**Dependencies**: Phase 2 complete + Story 2.3a (PM Agent) complete

#### Phase 3 Tasks:

- [ ] **Migrate user input → task creation flow**
- [ ] **Replace setTimeout task delegation with real PM Agent API**
- [ ] **Implement real task status tracking**
- [ ] **Add task assignment workflow API integration**
- [ ] **Create error handling for task operations**

#### Phase 3 Flow Changes:

```typescript
// Before: Simulation
const handleSubmit = (userInput: string) => {
  const task = createTask({ title: userInput, assignee: "pm-agent" });
  setTimeout(() => {
    transferTask(task.id, "analyst-agent");
  }, 2000);
};

// After: Real API
const handleSubmit = async (userInput: string) => {
  try {
    setLoading(true);
    const task = await apiService.tasks.create({
      title: userInput,
      userId: currentUser.id,
    });

    // PM Agent automatically handles delegation
    await apiService.pm.processTask(task.id);
  } catch (error) {
    handleTaskError(error);
  } finally {
    setLoading(false);
  }
};
```

### **Phase 4: Conversation & Analysis Migration (Week 4)**

**Goal**: Replace Analyst Agent simulation with real conversation API  
**Duration**: 7-10 days  
**Dependencies**: Phase 3 complete + Story 2.3b (Analyst Agent) complete

#### Phase 4 Tasks:

- [ ] **Migrate ChatInterface to real conversation API**
- [ ] **Replace artifact generation simulation with real processing**
- [ ] **Implement conversation state management**
- [ ] **Add real-time conversation updates**
- [ ] **Create conversation error handling and recovery**

#### Phase 4 Component Migration:

```typescript
// ChatInterface component changes
const ChatInterface = ({ agentId, isActive }: Props) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { useSimulation } = useWorkbenchStore();

  const sendMessage = async (message: string) => {
    if (useSimulation) {
      // Fall back to simulation
      handleSimulatedConversation(message);
    } else {
      // Use real API
      const response = await apiService.analyst.processMessage({
        conversationId: conversation.id,
        userMessage: message,
      });
      updateConversation(response);
    }
  };
};
```

### **Phase 5: Design Agent & Artifacts Migration (Week 5)**

**Goal**: Replace Design Agent autonomous processing with real API  
**Duration**: 5-7 days  
**Dependencies**: Phase 4 complete + Story 2.3c (Design Agent) complete

#### Phase 5 Tasks:

- [ ] **Migrate artifact transfer mechanism to API**
- [ ] **Replace Design Agent setTimeout with real processing API**
- [ ] **Implement real artifact generation and storage**
- [ ] **Add artifact content management**
- [ ] **Create design processing status updates**

#### Phase 5 Processing Changes:

```typescript
// Before: Frontend simulation
const startDesignAgentProcessing = (sourceArtifact: Artifact) => {
  updateAgentStatus("design-agent", { status: "busy" });

  setTimeout(() => {
    const designArtifact = generateDesignArtifact(sourceArtifact);
    updateAgentStatus("design-agent", { status: "idle" });
  }, 3500);
};

// After: Real API processing
const startDesignAgentProcessing = async (sourceArtifact: Artifact) => {
  try {
    // Design Agent receives artifact and starts processing
    const processingResponse = await apiService.design.receiveArtifact({
      artifactId: sourceArtifact.id,
      sourceAgent: "analyst-agent",
    });

    // Real-time updates via WebSocket will handle status changes
    // and artifact generation automatically
  } catch (error) {
    handleDesignProcessingError(error);
  }
};
```

### **Phase 6: Real-time Integration & WebSocket (Week 6)**

**Goal**: Complete real-time communication migration  
**Duration**: 5-7 days  
**Dependencies**: Phase 5 complete + Story 2.4 (WebSocket) complete

#### Phase 6 Tasks:

- [ ] **Replace polling with WebSocket event streaming**
- [ ] **Implement real-time A2A communication updates**
- [ ] **Add connection management and reconnection logic**
- [ ] **Create real-time error handling**
- [ ] **Optimize performance for live updates**

#### Phase 6 Real-time Architecture:

```typescript
// WebSocket event handling
const useRealTimeUpdates = () => {
  const { wsService } = useApiService();

  useEffect(() => {
    if (!useSimulation) {
      wsService.connect();

      wsService.on("agent_status_changed", handleAgentStatusUpdate);
      wsService.on("task_updated", handleTaskUpdate);
      wsService.on("artifact_created", handleArtifactCreated);
      wsService.on("a2a_communication", handleA2ACommunication);

      return () => wsService.disconnect();
    }
  }, [useSimulation]);
};
```

---

## 🔄 **Migration Control & Feature Toggle**

### Environment-Based Configuration

```typescript
// apps/web/src/config/migration.ts
export const migrationConfig = {
  // Development: Allow toggling between modes
  enableSimulationToggle: process.env.NODE_ENV === "development",

  // Default mode based on environment
  defaultMode: process.env.NEXT_PUBLIC_API_URL ? "api" : "simulation",

  // API endpoint configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws",

  // Feature flags for gradual rollout
  enableFeatures: {
    taskAPI: process.env.NEXT_PUBLIC_ENABLE_TASK_API === "true",
    conversationAPI: process.env.NEXT_PUBLIC_ENABLE_CONVERSATION_API === "true",
    designAPI: process.env.NEXT_PUBLIC_ENABLE_DESIGN_API === "true",
    realTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true",
  },
};
```

### Runtime Toggle UI (Development Only)

```typescript
// Development mode toggle interface
const MigrationControls = () => {
  const { useSimulation, toggleSimulationMode } = useWorkbenchStore();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 p-4 rounded shadow">
      <h3>Migration Controls (Dev Only)</h3>
      <label>
        <input
          type="checkbox"
          checked={!useSimulation}
          onChange={toggleSimulationMode}
        />
        Use Real API (unchecked = simulation mode)
      </label>
      <div className="text-xs mt-2">
        Current: {useSimulation ? "Simulation" : "Real API"}
      </div>
    </div>
  );
};
```

---

## 🛡️ **Error Handling & Fallback Strategy**

### Graceful Degradation Pattern

```typescript
// Service layer with automatic fallback
class WorkbenchService {
  private fallbackToSimulation = false;

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    if (this.fallbackToSimulation || useSimulation) {
      return this.simulationService.createTask(taskData);
    }

    try {
      return await this.apiService.tasks.create(taskData);
    } catch (error) {
      console.warn("API call failed, falling back to simulation:", error);
      this.fallbackToSimulation = true;
      return this.simulationService.createTask(taskData);
    }
  }

  // Reset fallback after successful API call
  resetFallback() {
    this.fallbackToSimulation = false;
  }
}
```

### Error Boundary Integration

```typescript
// Error boundary for API failures
class ApiErrorBoundary extends Component {
  state = { hasError: false, useSimulation: false };

  static getDerivedStateFromError(error: Error) {
    if (error.message.includes("API")) {
      return { hasError: true, useSimulation: true };
    }
    return { hasError: true };
  }

  render() {
    if (this.state.hasError && this.state.useSimulation) {
      return (
        <div className="bg-yellow-50 p-4 rounded">
          <p>API unavailable. Running in simulation mode.</p>
          <button onClick={this.retry}>Retry API Connection</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 📊 **Testing Strategy During Migration**

### Parallel Testing Approach

```typescript
// Test both simulation and API modes
describe("Task Creation", () => {
  beforeEach(() => {
    // Setup test environment
  });

  describe("Simulation Mode", () => {
    beforeEach(() => {
      setSimulationMode(true);
    });

    test("creates task with simulation", async () => {
      // Test simulation logic
    });
  });

  describe("API Mode", () => {
    beforeEach(() => {
      setSimulationMode(false);
      mockApiServer.start();
    });

    test("creates task with real API", async () => {
      // Test API integration
    });
  });
});
```

### Manual Testing Checklist

For each migration phase:

- [ ] **Simulation mode**: All Epic 1.0 functionality working
- [ ] **API mode**: New functionality working with backend
- [ ] **Toggle functionality**: Switch between modes without errors
- [ ] **Error scenarios**: Graceful handling of API failures
- [ ] **Performance**: No noticeable degradation in user experience

---

## 🎯 **Success Criteria & Completion Gates**

### Phase Completion Criteria

Each phase must meet these criteria before proceeding:

1. **✅ Feature Parity**: 100% of existing functionality preserved
2. **✅ Performance**: No degradation in response times or user experience
3. **✅ Error Handling**: Graceful fallback and recovery mechanisms working
4. **✅ Testing**: Both automated and manual tests passing
5. **✅ Documentation**: Migration changes documented and reviewed

### Final Migration Success Criteria

- **✅ Zero Regression**: All Epic 1.0 stories working identically
- **✅ API Integration**: All components using real backend APIs
- **✅ Real-time Updates**: WebSocket communication replacing polling/simulation
- **✅ Production Ready**: Error handling, security, and performance optimized
- **✅ Simulation Removal**: Cleanup of old simulation code (optional)

### Rollback Criteria

Immediate rollback to previous phase if:

- **❌ User Experience Regression**: Any degradation in demo quality
- **❌ Critical Bugs**: Blocking issues that prevent normal operation
- **❌ Performance Issues**: Response times >2x slower than simulation
- **❌ Data Loss**: Any loss of user input or demo progress

---

## 📋 **Implementation Checklist**

### Pre-Migration Setup

- [ ] **Epic 2.0 Stories 2.1-2.3 complete**: Backend APIs available and tested
- [ ] **Development environment**: Both frontend and backend running
- [ ] **Feature toggle**: Migration control implemented
- [ ] **Error boundaries**: Fallback mechanisms in place
- [ ] **Testing framework**: Parallel testing setup ready

### Migration Execution

- [ ] **Phase 1**: API service layer implemented
- [ ] **Phase 2**: Basic data operations migrated
- [ ] **Phase 3**: Task workflow API integration complete
- [ ] **Phase 4**: Conversation API integration complete
- [ ] **Phase 5**: Design Agent API integration complete
- [ ] **Phase 6**: Real-time WebSocket integration complete

### Post-Migration Validation

- [ ] **Complete feature parity**: All Epic 1.0 functionality working
- [ ] **Performance optimization**: Response times acceptable
- [ ] **Error handling**: Robust error recovery implemented
- [ ] **Documentation**: Migration completed and documented
- [ ] **Team handoff**: Knowledge transfer complete

---

**Document Owner**: Product Owner Sarah  
**Migration Timeline**: 6 weeks parallel with Stories 2.3-2.5  
**Risk Level**: High (significant refactoring)  
**Mitigation**: Incremental approach with fallback mechanisms  
**Last Updated**: July 1, 2025
