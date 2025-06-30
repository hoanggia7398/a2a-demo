# Orchestrator Delegation Algorithm Specification

## Overview

This document defines the algorithm specification for the Orchestrator Agent's delegation system in Story 1.5, addressing the critical gap identified in the PO validation checklist.

## Purpose

Enable the Orchestrator Agent to automatically analyze user requests and delegate appropriate tasks to specialist agents (PM, Analyst, Design) through a defined A2A protocol, fulfilling PRD requirements FR1-FR2.

## Algorithm Specification

### 1. Request Analysis Engine

#### 1.1 Input Processing
```typescript
interface UserRequest {
  message: string;
  timestamp: Date;
  context?: RequestContext;
}

interface RequestContext {
  previousTasks: Task[];
  activeWorkflows: Workflow[];
  availableAgents: Agent[];
}
```

#### 1.2 Request Classification Algorithm
```typescript
enum RequestType {
  PROJECT_INITIATION = "project_initiation",
  REQUIREMENTS_GATHERING = "requirements_gathering", 
  DESIGN_REQUEST = "design_request",
  GENERAL_INQUIRY = "general_inquiry"
}

function classifyRequest(request: UserRequest): RequestType {
  const keywords = extractKeywords(request.message.toLowerCase());
  
  // Priority-based classification
  if (hasProjectInitiationKeywords(keywords)) {
    return RequestType.PROJECT_INITIATION;
  }
  
  if (hasRequirementsKeywords(keywords)) {
    return RequestType.REQUIREMENTS_GATHERING;
  }
  
  if (hasDesignKeywords(keywords)) {
    return RequestType.DESIGN_REQUEST;
  }
  
  return RequestType.GENERAL_INQUIRY;
}
```

#### 1.3 Keyword Classification Rules
- **Project Initiation**: ["new project", "start", "begin", "create", "build", "develop"]
- **Requirements**: ["requirements", "specs", "specifications", "analysis", "clarify", "understand"]
- **Design**: ["design", "architecture", "wireframe", "mockup", "ui", "interface"]

### 2. Delegation Decision Matrix

#### 2.1 Workflow Mapping
```typescript
interface DelegationWorkflow {
  requestType: RequestType;
  agentSequence: AgentRole[];
  triggerConditions: TriggerCondition[];
}

const DELEGATION_WORKFLOWS: DelegationWorkflow[] = [
  {
    requestType: RequestType.PROJECT_INITIATION,
    agentSequence: [AgentRole.PM, AgentRole.ANALYST, AgentRole.DESIGN],
    triggerConditions: [
      { agent: AgentRole.PM, trigger: "immediate" },
      { agent: AgentRole.ANALYST, trigger: "pm_task_complete" },
      { agent: AgentRole.DESIGN, trigger: "analyst_artifact_ready" }
    ]
  },
  {
    requestType: RequestType.REQUIREMENTS_GATHERING,
    agentSequence: [AgentRole.ANALYST, AgentRole.DESIGN],
    triggerConditions: [
      { agent: AgentRole.ANALYST, trigger: "immediate" },
      { agent: AgentRole.DESIGN, trigger: "analyst_artifact_ready" }
    ]
  },
  {
    requestType: RequestType.DESIGN_REQUEST,
    agentSequence: [AgentRole.DESIGN],
    triggerConditions: [
      { agent: AgentRole.DESIGN, trigger: "immediate" }
    ]
  }
];
```

### 3. Agent Communication Protocol

#### 3.1 Task Delegation Structure
```typescript
interface DelegatedTask {
  id: string;
  fromAgent: AgentRole.ORCHESTRATOR;
  toAgent: AgentRole;
  taskType: TaskType;
  payload: TaskPayload;
  timestamp: Date;
  status: TaskStatus;
}

interface TaskPayload {
  userRequest: string;
  context: any;
  expectedOutput: ArtifactType;
  priority: Priority;
}

enum TaskStatus {
  DELEGATED = "delegated",
  IN_PROGRESS = "in_progress", 
  COMPLETED = "completed",
  FAILED = "failed"
}
```

#### 3.2 Agent Response Protocol
```typescript
interface AgentResponse {
  taskId: string;
  fromAgent: AgentRole;
  toAgent: AgentRole.ORCHESTRATOR;
  status: TaskStatus;
  artifacts?: Artifact[];
  message?: string;
  timestamp: Date;
}
```

### 4. Autonomous Agent Behavior

#### 4.1 Specialist Agent Activation
When a specialist agent receives a delegated task:

1. **Automatic Activation**: Agent status changes to "processing"
2. **Simulated Work**: Display processing indicators for realistic timing
3. **Artifact Generation**: Create appropriate output based on task type
4. **Response Delivery**: Return results to Orchestrator with completion status

#### 4.2 Processing Time Simulation
```typescript
const PROCESSING_TIMES = {
  [AgentRole.PM]: { min: 2000, max: 4000 }, // 2-4 seconds
  [AgentRole.ANALYST]: { min: 3000, max: 6000 }, // 3-6 seconds  
  [AgentRole.DESIGN]: { min: 4000, max: 7000 } // 4-7 seconds
};
```

### 5. Result Synthesis Algorithm

#### 5.1 Result Collection
```typescript
interface SynthesisResult {
  workflow: string;
  completedTasks: DelegatedTask[];
  artifacts: Artifact[];
  summary: string;
  nextSteps?: string[];
}

function synthesizeResults(completedTasks: DelegatedTask[]): SynthesisResult {
  const artifacts = extractArtifacts(completedTasks);
  const summary = generateWorkflowSummary(completedTasks);
  
  return {
    workflow: determineWorkflowType(completedTasks),
    completedTasks,
    artifacts,
    summary,
    nextSteps: suggestNextSteps(artifacts)
  };
}
```

#### 5.2 Presentation Format
The Orchestrator presents results in a structured format:

```
## Workflow Complete: [Workflow Type]

### Specialist Agents Involved:
- PM Agent: [Task completed] ✅
- Analyst Agent: [Task completed] ✅  
- Design Agent: [Task completed] ✅

### Generated Artifacts:
1. [Artifact Name] - [Description]
2. [Artifact Name] - [Description]

### Summary:
[Consolidated workflow summary]

### Recommended Next Steps:
- [Action 1]
- [Action 2]
```

## Implementation Requirements

### 6.1 State Management Integration
- Extend Zustand store with delegation state
- Add delegation history tracking
- Implement agent status management

### 6.2 UI Components Required
- Orchestrator delegation interface
- Agent status indicators
- Delegation visualization
- Result synthesis display

### 6.3 A2A Logging Requirements
```typescript
interface A2ALogEvent {
  type: "DELEGATE_TASK" | "TASK_PROGRESS" | "TASK_COMPLETE" | "ARTIFACT_TRANSFER";
  from: AgentRole;
  to: AgentRole;
  payload: any;
  timestamp: Date;
}
```

Log patterns:
- `Orchestrator --> DELEGATE_TASK --> [Agent]`
- `[Agent] --> TASK_PROGRESS --> Orchestrator`
- `[Agent] --> TASK_COMPLETE --> Orchestrator`
- `[Agent] --> ARTIFACT_TRANSFER --> Orchestrator`

## Integration with Previous Stories

### 7.1 Story 1.1 Integration
- ✅ **Reuse**: Existing workbench layout
- 🔄 **Modify**: Disable specialist agent chat interfaces
- ➕ **Add**: Orchestrator delegation indicators

### 7.2 Story 1.3-1.4 Integration  
- ✅ **Reuse**: Existing artifact system
- 🔄 **Modify**: Artifacts now created via delegation
- ➕ **Add**: Automatic artifact handoff between agents

### 7.3 Migration Strategy
1. **Phase 1**: Implement delegation engine
2. **Phase 2**: Update UI to hide specialist chats
3. **Phase 3**: Enable automatic workflows
4. **Phase 4**: Add result synthesis

## Validation Criteria

### 8.1 Algorithm Validation
- [ ] Request correctly classified (>90% accuracy)
- [ ] Appropriate agents selected for each request type
- [ ] Delegation sequence follows defined workflows
- [ ] Results properly synthesized and presented

### 8.2 Integration Validation
- [ ] Previous stories continue working
- [ ] No regression in existing functionality
- [ ] A2A logging captures all delegation events
- [ ] Error handling for delegation failures

## Error Handling

### 9.1 Delegation Failures
```typescript
enum DelegationError {
  AGENT_UNAVAILABLE = "agent_unavailable",
  INVALID_REQUEST = "invalid_request", 
  TIMEOUT = "timeout",
  SYNTHESIS_FAILED = "synthesis_failed"
}

function handleDelegationError(error: DelegationError, context: any) {
  // Log error
  logA2AEvent({
    type: "DELEGATION_ERROR",
    error,
    context,
    timestamp: new Date()
  });
  
  // Provide user feedback
  return {
    message: getErrorMessage(error),
    suggestedActions: getSuggestedActions(error)
  };
}
```

## Success Metrics

- **Delegation Accuracy**: >90% correct agent selection
- **Response Time**: <10 seconds end-to-end workflow
- **User Satisfaction**: Single point of interaction achieved
- **System Reliability**: <5% delegation failures

---

This specification addresses all critical gaps identified in the PO validation checklist and provides a complete implementation roadmap for Story 1.5.
