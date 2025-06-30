import { create } from "zustand";

export interface SystemLog {
  id: string;
  timestamp: Date;
  message: string;
  type: "user_input" | "agent_message" | "system_event" | "error";
  source: string;
  metadata?: Record<string, unknown>;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: "idle" | "active" | "busy" | "error";
  lastActivity?: Date;
  currentTask?: string;
}

export type TaskStatus = "pending" | "in-progress" | "completed" | "failed";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assigner: string; // agent_id
  assignee: string; // agent_id
  createdAt: Date;
}

export interface Message {
  id: string;
  sender: "user" | string; // user or agent_id
  content: string;
  timestamp: Date;
}

export type ArtifactType = "markdown" | "image/png" | "json";

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  contentUrl: string;
  creator: string; // agent_id
  createdAt: Date;
  content?: string; // For display purposes, optional inline content
  transferredTo?: string; // Track which agent it was transferred to
}

interface WorkbenchState {
  systemLogs: SystemLog[];
  agents: AgentStatus[];
  tasks: Task[];
  messages: Message[];
  artifacts: Artifact[];
  currentRequest?: string;

  // Actions
  addSystemLog: (log: SystemLog) => void;
  clearSystemLogs: () => void;
  updateAgentStatus: (agentId: string, status: Partial<AgentStatus>) => void;
  setCurrentRequest: (request: string) => void;
  createTask: (task: Omit<Task, "id" | "createdAt">) => Task;
  transferTask: (taskId: string, newAssignee: string) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  createArtifact: (artifact: Omit<Artifact, "id" | "createdAt">) => Artifact;
  transferArtifact: (artifactId: string, targetAgent: string) => void;
  getArtifactsByAgent: (agentId: string) => Artifact[];
  getTasksByAgent: (agentId: string) => Task[];
  getMessagesByAgent: (agentId: string) => Message[];

  // Story 1.4: Design Agent Autonomous Processing
  startDesignAgentProcessing: (sourceArtifact: Artifact) => void;
  generateDesignArtifact: (sourceArtifact: Artifact) => Artifact;
  createDesignContent: (sourceArtifact: Artifact) => string;
}

export const useWorkbenchStore = create<WorkbenchState>((set, get) => ({
  systemLogs: [],
  tasks: [],
  messages: [],
  artifacts: [],
  agents: [
    {
      id: "orchestrator-agent",
      name: "Orchestrator Agent",
      status: "active",
    },
    {
      id: "pm-agent",
      name: "PM Agent",
      status: "idle",
    },
    {
      id: "analyst-agent",
      name: "Analyst Agent",
      status: "idle",
    },
    {
      id: "design-agent",
      name: "Design Agent",
      status: "idle",
    },
  ],
  currentRequest: undefined,

  addSystemLog: (log: SystemLog) => {
    set((state) => ({
      systemLogs: [...state.systemLogs, log].slice(-50), // Keep only last 50 logs
    }));
  },

  clearSystemLogs: () => {
    set({ systemLogs: [] });
  },

  updateAgentStatus: (agentId: string, updates: Partial<AgentStatus>) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId
          ? { ...agent, ...updates, lastActivity: new Date() }
          : agent
      ),
    }));
  },

  setCurrentRequest: (request: string) => {
    set({ currentRequest: request });
  },

  createTask: (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    return newTask;
  },

  updateTaskStatus: (taskId: string, status: TaskStatus) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    }));
  },

  transferTask: (taskId: string, newAssignee: string) => {
    const { addSystemLog } = get();

    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, assignee: newAssignee, status: "in-progress" as TaskStatus }
          : t
      );

      // Log the transfer
      addSystemLog({
        id: `transfer-${Date.now()}`,
        timestamp: new Date(),
        message: `Task "${task.title}" transferred from ${task.assignee} to ${newAssignee}`,
        type: "system_event",
        source: "system",
        metadata: { taskId, oldAssignee: task.assignee, newAssignee },
      });

      return { tasks: updatedTasks };
    });
  },

  addMessage: (messageData: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  getTasksByAgent: (agentId: string) => {
    return get().tasks.filter((task) => task.assignee === agentId);
  },

  getMessagesByAgent: (agentId: string) => {
    return get().messages.filter((message) => message.sender === agentId);
  },

  createArtifact: (artifactData: Omit<Artifact, "id" | "createdAt">) => {
    const newArtifact: Artifact = {
      ...artifactData,
      id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    set((state) => ({
      artifacts: [...state.artifacts, newArtifact],
    }));

    return newArtifact;
  },

  transferArtifact: (artifactId: string, targetAgent: string) => {
    const { addSystemLog } = get();
    const state = get();
    const artifact = state.artifacts.find((a) => a.id === artifactId);

    if (artifact) {
      // Update the artifact to track transfer
      set((state) => ({
        artifacts: state.artifacts.map((a) =>
          a.id === artifactId ? { ...a, transferredTo: targetAgent } : a
        ),
      }));

      // Log the transfer in the required format
      addSystemLog({
        id: `artifact-transfer-${Date.now()}`,
        timestamp: new Date(),
        message: `${artifact.creator} --> SENT_ARTIFACT (${artifact.name}) --> ${targetAgent}`,
        type: "system_event",
        source: "system",
        metadata: {
          artifactId,
          creator: artifact.creator,
          targetAgent,
          artifactName: artifact.name,
        },
      });
    }
  },

  getArtifactsByAgent: (agentId: string) => {
    const state = get();
    return state.artifacts.filter(
      (artifact) =>
        artifact.creator === agentId || artifact.transferredTo === agentId
    );
  },
  // Story 1.4: Design Agent Autonomous Processing
  startDesignAgentProcessing: (sourceArtifact: Artifact) => {
    const { addSystemLog, updateAgentStatus, generateDesignArtifact } = get();

    // Set Design Agent to busy processing state
    updateAgentStatus("design-agent", {
      status: "busy",
      currentTask: `Processing ${sourceArtifact.name}`,
    });

    // Log the start of autonomous processing
    addSystemLog({
      id: `design-processing-${Date.now()}`,
      timestamp: new Date(),
      message: `Design Agent started autonomous processing of ${sourceArtifact.name}`,
      type: "system_event",
      source: "design-agent",
      metadata: {
        sourceArtifactId: sourceArtifact.id,
        sourceArtifactName: sourceArtifact.name,
      },
    });

    // Simulate processing time (3-5 seconds), then generate design artifact
    setTimeout(() => {
      generateDesignArtifact(sourceArtifact);
    }, 3500); // 3.5 seconds processing time
  },

  generateDesignArtifact: (sourceArtifact: Artifact) => {
    const {
      createArtifact,
      addSystemLog,
      updateAgentStatus,
      createDesignContent,
    } = get();

    // Generate design content based on source artifact
    const designContent = createDesignContent(sourceArtifact);

    // Create the design artifact
    const designArtifact = createArtifact({
      name: "design-specification.md",
      type: "markdown",
      contentUrl: "/artifacts/design-specification.md",
      creator: "design-agent",
      content: designContent,
    });

    // Update Design Agent status to idle
    updateAgentStatus("design-agent", {
      status: "idle",
      currentTask: undefined,
    });

    // Log the artifact creation in A2A format
    addSystemLog({
      id: `design-artifact-${Date.now()}`,
      timestamp: new Date(),
      message: `design-agent --> CREATED_ARTIFACT (${designArtifact.name})`,
      type: "system_event",
      source: "design-agent",
      metadata: {
        artifactId: designArtifact.id,
        artifactName: designArtifact.name,
        sourceArtifactId: sourceArtifact.id,
      },
    });

    // Log completion of autonomous work
    addSystemLog({
      id: `design-complete-${Date.now()}`,
      timestamp: new Date(),
      message: `Design Agent completed autonomous processing and generated design specification`,
      type: "system_event",
      source: "design-agent",
      metadata: {
        outputArtifactId: designArtifact.id,
        inputArtifactId: sourceArtifact.id,
      },
    });

    return designArtifact;
  },

  createDesignContent: (sourceArtifact: Artifact) => {
    // Generate meaningful design content based on received requirements
    const baseContent = sourceArtifact.content || "No content available";

    return `# Design Specification

## Generated by Design Agent
**Source**: ${sourceArtifact.name}  
**Generated**: ${new Date().toLocaleString()}

## Project Overview
Based on the requirements analysis, this design specification outlines the technical architecture and user interface approach for the project.

## Requirements Analysis
${baseContent}

## Design Approach

### Architecture Decisions
- **Frontend Framework**: Next.js 14.2 with TypeScript
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Zustand for client-side state

### User Interface Design
- **Layout**: Clean, modern interface with card-based component organization
- **Color Scheme**: Professional color palette with accent colors for different agent types
- **Typography**: Clear hierarchy with consistent spacing
- **Responsive**: Mobile-first approach with desktop enhancements

### Component Structure
\`\`\`
WorkbenchLayout
├── AgentArea (PM Agent)
├── AgentArea (Analyst Agent) 
├── AgentArea (Design Agent)
├── ChatInterface
├── TaskDisplay
└── ArtifactDisplay
\`\`\`

### Key Features
1. **Real-time Agent Status**: Visual indicators for agent activity states
2. **Artifact Management**: Create, transfer, and display artifacts between agents
3. **System Logging**: Comprehensive event tracking for A2A interactions
4. **Task Orchestration**: Automated workflow progression between agents

## Implementation Notes
- Follow established patterns from existing codebase
- Maintain consistency with current component architecture
- Ensure proper TypeScript typing throughout
- Implement proper error handling and loading states

## Next Steps
1. Review design specification with stakeholders
2. Validate technical approach against requirements
3. Begin implementation of identified components
4. Iterate based on user feedback

---
*This specification was autonomously generated by the Design Agent based on received requirements.*`;
  },
}));
