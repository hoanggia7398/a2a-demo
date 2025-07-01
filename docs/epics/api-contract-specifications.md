# API Contract Specifications - Epic 2.0

## Overview

This document defines the complete API contract for Epic 2.0 Backend Implementation, specifying all JSON-RPC 2.0 methods, request/response schemas, error handling, and authentication patterns for A2A agent communication.

**Version**: 1.0  
**Created**: July 1, 2025  
**Protocol**: JSON-RPC 2.0  
**Transport**: HTTP POST + WebSocket

## JSON-RPC 2.0 Foundation

### Base Request Format

```json
{
  "jsonrpc": "2.0",
  "method": "agent.methodName",
  "params": {
    // Method-specific parameters
  },
  "id": "unique-request-id"
}
```

### Base Response Format

```json
{
  "jsonrpc": "2.0",
  "result": {
    // Method-specific result
  },
  "id": "unique-request-id"
}
```

### Error Response Format

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Application specific error",
    "data": {
      "details": "Additional error information"
    }
  },
  "id": "unique-request-id"
}
```

## Agent API Methods

### 🔧 **System & Status Methods**

#### `system.health`

**Purpose**: Health check for API server  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "system.health",
  "params": {},
  "id": "health-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "healthy",
    "timestamp": "2025-07-01T10:00:00Z",
    "version": "2.0.0",
    "database": "connected",
    "agents": ["pm-agent", "analyst-agent", "design-agent"]
  },
  "id": "health-1"
}
```

#### `agent.getStatus`

**Purpose**: Get current status of specific agent  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "agent.getStatus",
  "params": {
    "agentId": "pm-agent"
  },
  "id": "status-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": "pm-agent",
    "name": "PM Agent",
    "status": "idle",
    "lastActivity": "2025-07-01T09:55:00Z",
    "currentTask": null
  },
  "id": "status-1"
}
```

#### `agent.updateStatus`

**Purpose**: Update agent status (internal A2A use)  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "agent.updateStatus",
  "params": {
    "agentId": "analyst-agent",
    "status": "busy",
    "currentTask": "Analyzing user requirements"
  },
  "id": "status-update-1"
}
```

### 👥 **PM Agent API Methods**

#### `pm.createTask`

**Purpose**: Create new task from user input  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "pm.createTask",
  "params": {
    "title": "Build A2A demo application",
    "description": "User wants to see agents working together",
    "userId": "user-123",
    "priority": "high"
  },
  "id": "create-task-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "task": {
      "id": "task-456",
      "title": "Build A2A demo application",
      "status": "pending",
      "assigner": "user-123",
      "assignee": "pm-agent",
      "createdAt": "2025-07-01T10:00:00Z"
    },
    "nextAction": "delegate_to_analyst"
  },
  "id": "create-task-1"
}
```

#### `pm.delegateTask`

**Purpose**: Delegate task to appropriate agent  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "pm.delegateTask",
  "params": {
    "taskId": "task-456",
    "targetAgent": "analyst-agent",
    "delegationReason": "Requirements analysis needed"
  },
  "id": "delegate-1"
}
```

### 📊 **Analyst Agent API Methods**

#### `analyst.startAnalysis`

**Purpose**: Begin requirements analysis conversation  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "analyst.startAnalysis",
  "params": {
    "taskId": "task-456",
    "userInput": "Build A2A demo application",
    "context": {
      "userId": "user-123",
      "sessionId": "session-789"
    }
  },
  "id": "analysis-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "conversationId": "conv-101",
    "initialMessage": "I'll help you clarify the requirements for your A2A demo application. What specific features would you like to see?",
    "status": "awaiting_user_response",
    "suggestedQuestions": [
      "What type of agents should be involved?",
      "What workflows do you want to demonstrate?",
      "Who is the target audience?"
    ]
  },
  "id": "analysis-1"
}
```

#### `analyst.processMessage`

**Purpose**: Process user response in conversation  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "analyst.processMessage",
  "params": {
    "conversationId": "conv-101",
    "userMessage": "I want to show PM, Analyst, and Design agents working together",
    "context": {
      "taskId": "task-456"
    }
  },
  "id": "process-msg-1"
}
```

#### `analyst.generateArtifact`

**Purpose**: Generate requirements artifact from conversation  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "analyst.generateArtifact",
  "params": {
    "conversationId": "conv-101",
    "taskId": "task-456",
    "artifactType": "requirements"
  },
  "id": "generate-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "artifact": {
      "id": "artifact-789",
      "name": "requirements-document.md",
      "type": "markdown",
      "content": "# Project Requirements\\n\\n## Overview\\n...",
      "creator": "analyst-agent",
      "createdAt": "2025-07-01T10:15:00Z"
    },
    "nextStep": "transfer_to_design_agent"
  },
  "id": "generate-1"
}
```

### 🎨 **Design Agent API Methods**

#### `design.receiveArtifact`

**Purpose**: Receive artifact and start autonomous processing  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "design.receiveArtifact",
  "params": {
    "artifactId": "artifact-789",
    "sourceAgent": "analyst-agent",
    "processingInstructions": {
      "outputType": "design_specification",
      "priority": "high"
    }
  },
  "id": "receive-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "processing_started",
    "estimatedDuration": 3500,
    "processingId": "proc-456",
    "message": "Design Agent started autonomous processing"
  },
  "id": "receive-1"
}
```

#### `design.generateDesign`

**Purpose**: Generate design artifact (internal processing)  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "design.generateDesign",
  "params": {
    "processingId": "proc-456",
    "sourceArtifactId": "artifact-789",
    "designType": "specification"
  },
  "id": "design-gen-1"
}
```

**Response**:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "artifact": {
      "id": "artifact-890",
      "name": "design-specification.md",
      "type": "markdown",
      "content": "# Design Specification\\n\\n## Architecture Decisions\\n...",
      "creator": "design-agent",
      "createdAt": "2025-07-01T10:18:30Z"
    },
    "status": "completed",
    "processingTime": 3500
  },
  "id": "design-gen-1"
}
```

### 📁 **Artifact Management API**

#### `artifact.create`

**Purpose**: Create new artifact in system  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "artifact.create",
  "params": {
    "name": "user-requirements.md",
    "type": "markdown",
    "content": "# User Requirements\\n\\nThe user wants...",
    "creator": "analyst-agent",
    "metadata": {
      "taskId": "task-456",
      "conversationId": "conv-101"
    }
  },
  "id": "create-artifact-1"
}
```

#### `artifact.transfer`

**Purpose**: Transfer artifact between agents  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "artifact.transfer",
  "params": {
    "artifactId": "artifact-789",
    "sourceAgent": "analyst-agent",
    "targetAgent": "design-agent",
    "transferNote": "Ready for design processing"
  },
  "id": "transfer-1"
}
```

#### `artifact.getByAgent`

**Purpose**: Get all artifacts for specific agent  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "artifact.getByAgent",
  "params": {
    "agentId": "design-agent",
    "includeTransferred": true
  },
  "id": "get-artifacts-1"
}
```

### 📝 **System Logging API**

#### `log.addEvent`

**Purpose**: Add system event log (A2A communication)  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "log.addEvent",
  "params": {
    "message": "analyst-agent --> CREATED_ARTIFACT (requirements.md)",
    "type": "system_event",
    "source": "analyst-agent",
    "metadata": {
      "artifactId": "artifact-789",
      "taskId": "task-456"
    }
  },
  "id": "log-1"
}
```

#### `log.getEvents`

**Purpose**: Retrieve system event logs  
**Request**:

```json
{
  "jsonrpc": "2.0",
  "method": "log.getEvents",
  "params": {
    "limit": 50,
    "type": "system_event",
    "since": "2025-07-01T10:00:00Z"
  },
  "id": "get-logs-1"
}
```

## WebSocket Real-time Events

### Connection

```javascript
// Connect to WebSocket endpoint
const ws = new WebSocket("ws://localhost:3001/ws");

// Authentication after connection
ws.send(
  JSON.stringify({
    type: "auth",
    token: "user-session-token",
  })
);
```

### Event Types

#### Agent Status Change

```json
{
  "type": "agent_status_changed",
  "data": {
    "agentId": "analyst-agent",
    "oldStatus": "idle",
    "newStatus": "busy",
    "timestamp": "2025-07-01T10:05:00Z"
  }
}
```

#### Task Update

```json
{
  "type": "task_updated",
  "data": {
    "taskId": "task-456",
    "status": "in-progress",
    "assignee": "analyst-agent",
    "timestamp": "2025-07-01T10:05:00Z"
  }
}
```

#### Artifact Created

```json
{
  "type": "artifact_created",
  "data": {
    "artifactId": "artifact-789",
    "name": "requirements.md",
    "creator": "analyst-agent",
    "timestamp": "2025-07-01T10:15:00Z"
  }
}
```

#### A2A Communication

```json
{
  "type": "a2a_communication",
  "data": {
    "message": "analyst-agent --> SENT_ARTIFACT (requirements.md) --> design-agent",
    "source": "analyst-agent",
    "target": "design-agent",
    "timestamp": "2025-07-01T10:16:00Z"
  }
}
```

## Error Codes & Handling

### Standard JSON-RPC Errors

- `-32700`: Parse error
- `-32600`: Invalid Request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

### Application-Specific Errors

- `-32000`: Agent not found
- `-32001`: Agent busy (cannot process request)
- `-32002`: Task not found
- `-32003`: Artifact not found
- `-32004`: Invalid agent state transition
- `-32005`: Conversation not found
- `-32006`: Authentication required
- `-32007`: Permission denied
- `-32008`: Rate limit exceeded

### Error Response Example

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32001,
    "message": "Agent busy",
    "data": {
      "agentId": "analyst-agent",
      "currentTask": "Processing previous request",
      "estimatedWaitTime": 2000
    }
  },
  "id": "req-123"
}
```

## Authentication & Security

### Session-Based Authentication

```json
{
  "jsonrpc": "2.0",
  "method": "auth.login",
  "params": {
    "username": "user@example.com",
    "password": "secure-password"
  },
  "id": "auth-1"
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "sessionToken": "jwt-session-token",
    "expiresAt": "2025-07-01T18:00:00Z",
    "user": {
      "id": "user-123",
      "name": "Demo User"
    }
  },
  "id": "auth-1"
}
```

### Request Authentication

All requests must include session token in headers:

```
Authorization: Bearer jwt-session-token
```

## Performance Requirements

### Response Time Targets

- **Agent status operations**: <50ms
- **Task operations**: <100ms
- **Artifact operations**: <100ms
- **Real-time events**: <200ms
- **Conversation processing**: <500ms

### Rate Limiting

- **Per session**: 100 requests/minute
- **Per method**: Varies by complexity
- **WebSocket events**: 1000 events/minute

---

**Document Owner**: Product Owner Sarah  
**Technical Review**: Required before Story 2.3 implementation  
**Last Updated**: July 1, 2025  
**Implementation Target**: Stories 2.1-2.3
