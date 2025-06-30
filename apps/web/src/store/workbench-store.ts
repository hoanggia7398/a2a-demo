import { create } from "zustand";

// Story 1.5: Orchestrator Delegation Types
export enum RequestType {
  PROJECT_INITIATION = "project_initiation",
  REQUIREMENTS_GATHERING = "requirements_gathering",
  DESIGN_REQUEST = "design_request",
  GENERAL_INQUIRY = "general_inquiry",
}

export enum AgentRole {
  ORCHESTRATOR = "orchestrator-agent",
  PM = "pm-agent",
  ANALYST = "analyst-agent",
  DESIGN = "design-agent",
}

export enum TaskType {
  PROJECT_SETUP = "project_setup",
  REQUIREMENTS_ANALYSIS = "requirements_analysis",
  DESIGN_CREATION = "design_creation",
  GENERAL_TASK = "general_task",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface SystemLog {
  id: string;
  timestamp: Date;
  message: string;
  type:
    | "user_input"
    | "agent_message"
    | "system_event"
    | "error"
    | "delegation";
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

export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed"
  | "delegated";

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

export interface DelegatedTask {
  id: string;
  fromAgent: AgentRole;
  toAgent: AgentRole;
  taskType: TaskType;
  payload: TaskPayload;
  timestamp: Date;
  status: TaskStatus;
  originalUserRequest: string;
}

export interface TaskPayload {
  userRequest: string;
  context?: unknown;
  expectedOutput: ArtifactType;
  priority: Priority;
}

export interface AgentResponse {
  taskId: string;
  fromAgent: AgentRole;
  toAgent: AgentRole;
  status: TaskStatus;
  artifacts?: Artifact[];
  message?: string;
  timestamp: Date;
}

export interface DelegationWorkflow {
  id: string;
  requestType: RequestType;
  agentSequence: AgentRole[];
  currentStep: number;
  status: "active" | "completed" | "failed";
  delegatedTasks: DelegatedTask[];
  userRequest: string;
  startTime: Date;
  endTime?: Date;
}

interface WorkbenchState {
  systemLogs: SystemLog[];
  agents: AgentStatus[];
  tasks: Task[];
  messages: Message[];
  artifacts: Artifact[];
  currentRequest?: string;

  // Story 1.5: Orchestrator Delegation State
  delegationWorkflows: DelegationWorkflow[];
  delegatedTasks: DelegatedTask[];
  isOrchestratorMode: boolean;

  // Actions
  addSystemLog: (log: SystemLog) => void;
  clearSystemLogs: () => void;
  updateAgentStatus: (agentId: string, status: Partial<AgentStatus>) => void;
  setCurrentRequest: (request: string) => void;
  createTask: (task: Omit<Task, "id" | "createdAt">) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
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

  // Story 1.5: Orchestrator Delegation Actions
  processUserRequest: (userRequest: string) => void;
  classifyRequest: (request: string) => RequestType;
  delegateToAgent: (
    taskData: Omit<DelegatedTask, "id" | "timestamp">
  ) => DelegatedTask;
  processAgentResponse: (response: AgentResponse) => void;
  synthesizeWorkflowResults: (workflowId: string) => void;
  enableOrchestratorMode: () => void;
  disableOrchestratorMode: () => void;

  // Helper methods
  getAgentSequenceForRequest: (requestType: RequestType) => AgentRole[];
  startWorkflowDelegation: (workflowId: string) => void;
  continueWorkflow: (taskId: string) => void;
  getTaskTypeForAgent: (agent: AgentRole) => TaskType;
  simulateAgentProcessing: (task: DelegatedTask) => void;
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

  // Story 1.5: Orchestrator Delegation State
  delegationWorkflows: [],
  delegatedTasks: [],
  isOrchestratorMode: true, // Enable by default for Story 1.5

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

  // Story 1.5: Orchestrator Delegation Actions
  processUserRequest: (userRequest: string) => {
    const { addSystemLog, classifyRequest, updateAgentStatus } = get();

    // Log user request
    addSystemLog({
      id: `user-request-${Date.now()}`,
      timestamp: new Date(),
      message: `User Request: "${userRequest}"`,
      type: "user_input",
      source: "user",
      metadata: { userRequest },
    });

    // Update orchestrator status
    updateAgentStatus("orchestrator-agent", {
      status: "active",
      currentTask: "Analyzing user request",
    });

    // Classify the request
    const requestType = classifyRequest(userRequest);

    // Log classification
    addSystemLog({
      id: `request-classified-${Date.now()}`,
      timestamp: new Date(),
      message: `Orchestrator classified request as: ${requestType}`,
      type: "delegation",
      source: "orchestrator-agent",
      metadata: { requestType, userRequest },
    });

    // Create workflow based on request type
    const workflowId = `workflow-${Date.now()}`;
    const agentSequence = get().getAgentSequenceForRequest(requestType);

    const workflow: DelegationWorkflow = {
      id: workflowId,
      requestType,
      agentSequence,
      currentStep: 0,
      status: "active",
      delegatedTasks: [],
      userRequest,
      startTime: new Date(),
    };

    // Add workflow to state
    set((state) => ({
      delegationWorkflows: [...state.delegationWorkflows, workflow],
    }));

    // Start delegation to first agent in sequence
    setTimeout(() => {
      get().startWorkflowDelegation(workflowId);
    }, 1000);
  },

  classifyRequest: (request: string): RequestType => {
    const lowerRequest = request.toLowerCase();

    // Project initiation keywords
    if (
      lowerRequest.includes("new project") ||
      lowerRequest.includes("start") ||
      lowerRequest.includes("begin") ||
      lowerRequest.includes("create") ||
      lowerRequest.includes("build")
    ) {
      return RequestType.PROJECT_INITIATION;
    }

    // Requirements gathering keywords
    if (
      lowerRequest.includes("requirements") ||
      lowerRequest.includes("specs") ||
      lowerRequest.includes("analysis") ||
      lowerRequest.includes("clarify")
    ) {
      return RequestType.REQUIREMENTS_GATHERING;
    }

    // Design request keywords
    if (
      lowerRequest.includes("design") ||
      lowerRequest.includes("ui") ||
      lowerRequest.includes("interface") ||
      lowerRequest.includes("wireframe")
    ) {
      return RequestType.DESIGN_REQUEST;
    }

    return RequestType.GENERAL_INQUIRY;
  },

  delegateToAgent: (taskData: Omit<DelegatedTask, "id" | "timestamp">) => {
    const { addSystemLog, updateAgentStatus } = get();

    const delegatedTask: DelegatedTask = {
      ...taskData,
      id: `delegated-task-${Date.now()}`,
      timestamp: new Date(),
    };

    // Add to delegated tasks
    set((state) => ({
      delegatedTasks: [...state.delegatedTasks, delegatedTask],
    }));

    // Update target agent status
    updateAgentStatus(delegatedTask.toAgent, {
      status: "busy",
      currentTask: delegatedTask.payload.userRequest,
    });

    // Log delegation
    addSystemLog({
      id: `delegation-${Date.now()}`,
      timestamp: new Date(),
      message: `Orchestrator --> DELEGATED_TASK (${delegatedTask.taskType}) --> ${delegatedTask.toAgent}`,
      type: "delegation",
      source: "orchestrator-agent",
      metadata: {
        taskId: delegatedTask.id,
        toAgent: delegatedTask.toAgent,
        taskType: delegatedTask.taskType,
      },
    });

    // Simulate agent processing
    get().simulateAgentProcessing(delegatedTask);

    return delegatedTask;
  },

  processAgentResponse: (response: AgentResponse) => {
    const { addSystemLog, updateAgentStatus } = get();

    // Update delegated task status
    set((state) => ({
      delegatedTasks: state.delegatedTasks.map((task) =>
        task.id === response.taskId
          ? { ...task, status: response.status }
          : task
      ),
    }));

    // Update agent status
    updateAgentStatus(response.fromAgent, {
      status: "idle",
      currentTask: undefined,
    });

    // Log response
    addSystemLog({
      id: `agent-response-${Date.now()}`,
      timestamp: new Date(),
      message: `${response.fromAgent} --> COMPLETED_TASK --> Orchestrator`,
      type: "delegation",
      source: response.fromAgent,
      metadata: {
        taskId: response.taskId,
        status: response.status,
        artifacts: response.artifacts?.map((a) => a.id),
      },
    });

    // Continue workflow if needed
    get().continueWorkflow(response.taskId);
  },

  synthesizeWorkflowResults: (workflowId: string) => {
    const { addSystemLog, updateAgentStatus, addMessage } = get();
    const state = get();

    const workflow = state.delegationWorkflows.find((w) => w.id === workflowId);
    if (!workflow) return;

    // Mark workflow as completed
    set((state) => ({
      delegationWorkflows: state.delegationWorkflows.map((w) =>
        w.id === workflowId
          ? { ...w, status: "completed" as const, endTime: new Date() }
          : w
      ),
    }));

    // Update orchestrator status
    updateAgentStatus("orchestrator-agent", {
      status: "active",
      currentTask: "Synthesizing results",
    });

    const completedTasks = workflow.delegatedTasks.filter(
      (t) => t.status === "completed"
    );
    const artifacts = state.artifacts.filter((a) =>
      completedTasks.some((t) => t.toAgent === a.creator)
    );

    // Create synthesis message from orchestrator
    const workflowDuration =
      workflow.endTime && workflow.startTime
        ? Math.round(
            (workflow.endTime.getTime() - workflow.startTime.getTime()) / 1000
          )
        : 0;

    const synthesisMessage = `## Workflow Complete: ${workflow.requestType
      .replace("_", " ")
      .toUpperCase()}

### Specialist Agents Involved:
${completedTasks
  .map(
    (task) =>
      `- ${task.toAgent
        .replace("-agent", "")
        .replace(/\b\w/g, (l) => l.toUpperCase())} Agent: Task completed ✅`
  )
  .join("\n")}

### Generated Artifacts:
${artifacts
  .map(
    (artifact) =>
      `- **${artifact.name}** - ${artifact.type} created by ${artifact.creator
        .replace("-agent", "")
        .replace(/\b\w/g, (l) => l.toUpperCase())} Agent`
  )
  .join("\n")}

### Summary:
Successfully completed ${workflow.requestType.replace(
      "_",
      " "
    )} workflow through ${
      completedTasks.length
    }-agent collaboration, producing ${
      artifacts.length
    } comprehensive artifacts in ${workflowDuration} seconds.

### Recommended Next Steps:
- Review and validate generated artifacts
- Plan implementation approach based on deliverables
- Coordinate with team members for next phase
- Begin development based on specifications

*Workflow orchestrated and synthesized by Orchestrator Agent*`;

    // Add orchestrator synthesis message
    addMessage({
      sender: "orchestrator-agent",
      content: synthesisMessage,
    });

    // Log synthesis
    addSystemLog({
      id: `synthesis-${Date.now()}`,
      timestamp: new Date(),
      message: `Orchestrator synthesized workflow results: ${completedTasks.length} tasks completed, ${artifacts.length} artifacts generated`,
      type: "delegation",
      source: "orchestrator-agent",
      metadata: {
        workflowId,
        completedTasks: completedTasks.length,
        artifacts: artifacts.length,
        workflow: workflow.requestType,
      },
    });

    // Reset orchestrator status
    setTimeout(() => {
      updateAgentStatus("orchestrator-agent", {
        status: "active",
        currentTask: undefined,
      });
    }, 2000);
  },

  enableOrchestratorMode: () => {
    set({ isOrchestratorMode: true });
  },

  disableOrchestratorMode: () => {
    set({ isOrchestratorMode: false });
  },

  // Helper methods for orchestrator delegation
  getAgentSequenceForRequest: (requestType: RequestType): AgentRole[] => {
    switch (requestType) {
      case RequestType.PROJECT_INITIATION:
        return [AgentRole.PM, AgentRole.ANALYST, AgentRole.DESIGN];
      case RequestType.REQUIREMENTS_GATHERING:
        return [AgentRole.ANALYST, AgentRole.DESIGN];
      case RequestType.DESIGN_REQUEST:
        return [AgentRole.DESIGN];
      default:
        return [AgentRole.PM];
    }
  },

  startWorkflowDelegation: (workflowId: string) => {
    const state = get();
    const workflow = state.delegationWorkflows.find((w) => w.id === workflowId);
    if (!workflow || workflow.currentStep >= workflow.agentSequence.length)
      return;

    const targetAgent = workflow.agentSequence[workflow.currentStep];
    const taskType = get().getTaskTypeForAgent(targetAgent);

    get().delegateToAgent({
      fromAgent: AgentRole.ORCHESTRATOR,
      toAgent: targetAgent,
      taskType,
      payload: {
        userRequest: workflow.userRequest,
        expectedOutput: "markdown",
        priority: Priority.MEDIUM,
      },
      status: "delegated",
      originalUserRequest: workflow.userRequest,
    });

    // Update workflow step
    set((state) => ({
      delegationWorkflows: state.delegationWorkflows.map((w) =>
        w.id === workflowId ? { ...w, currentStep: w.currentStep + 1 } : w
      ),
    }));
  },

  continueWorkflow: (taskId: string) => {
    const state = get();
    const task = state.delegatedTasks.find((t) => t.id === taskId);
    if (!task) return;

    const workflow = state.delegationWorkflows.find(
      (w) => w.userRequest === task.originalUserRequest && w.status === "active"
    );
    if (!workflow) return;

    // If there are more agents in the sequence
    if (workflow.currentStep < workflow.agentSequence.length) {
      setTimeout(() => {
        get().startWorkflowDelegation(workflow.id);
      }, 1000);
    } else {
      // Workflow complete, synthesize results
      setTimeout(() => {
        get().synthesizeWorkflowResults(workflow.id);
      }, 1000);
    }
  },

  getTaskTypeForAgent: (agent: AgentRole): TaskType => {
    switch (agent) {
      case AgentRole.PM:
        return TaskType.PROJECT_SETUP;
      case AgentRole.ANALYST:
        return TaskType.REQUIREMENTS_ANALYSIS;
      case AgentRole.DESIGN:
        return TaskType.DESIGN_CREATION;
      default:
        return TaskType.GENERAL_TASK;
    }
  },

  simulateAgentProcessing: (task: DelegatedTask) => {
    const { processAgentResponse, createArtifact } = get();

    // Processing times based on agent type
    const processingTimes = {
      [AgentRole.PM]: 3000, // 3 seconds
      [AgentRole.ANALYST]: 4500, // 4.5 seconds
      [AgentRole.DESIGN]: 6000, // 6 seconds
    };

    const processingTime =
      processingTimes[task.toAgent as keyof typeof processingTimes] || 3000;

    setTimeout(() => {
      // Create artifacts based on agent type
      let artifacts: Artifact[] = [];

      if (task.toAgent === AgentRole.PM) {
        artifacts = [
          createArtifact({
            name: "project-plan.md",
            type: "markdown",
            contentUrl: "/artifacts/project-plan.md",
            creator: task.toAgent,
            content: `# Project Plan\n\nGenerated for: ${task.payload.userRequest}\n\n## Project Scope\n- Define project requirements\n- Coordinate with team members\n- Establish timeline and milestones\n\n## Next Steps\n- Hand off to Analyst Agent for requirements gathering`,
          }),
        ];
      } else if (task.toAgent === AgentRole.ANALYST) {
        artifacts = [
          createArtifact({
            name: "requirements-analysis.md",
            type: "markdown",
            contentUrl: "/artifacts/requirements-analysis.md",
            creator: task.toAgent,
            content: `# Requirements Analysis\n\nBased on: ${task.payload.userRequest}\n\n## Functional Requirements\n- User interface components\n- Data management\n- Business logic\n\n## Technical Requirements\n- Performance specifications\n- Security considerations\n- Integration points\n\n## Recommendations\n- Use modern frameworks\n- Implement responsive design\n- Ensure accessibility compliance`,
          }),
        ];
      } else if (task.toAgent === AgentRole.DESIGN) {
        artifacts = [
          createArtifact({
            name: "design-specification.md",
            type: "markdown",
            contentUrl: "/artifacts/design-specification.md",
            creator: task.toAgent,
            content: get().createDesignContent({} as Artifact),
          }),
        ];
      }

      // Process the response
      processAgentResponse({
        taskId: task.id,
        fromAgent: task.toAgent,
        toAgent: AgentRole.ORCHESTRATOR,
        status: "completed",
        artifacts,
        message: `Task completed successfully`,
        timestamp: new Date(),
      });
    }, processingTime);
  },
}));
