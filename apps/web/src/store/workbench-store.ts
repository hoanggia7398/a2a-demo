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

interface WorkbenchState {
  systemLogs: SystemLog[];
  agents: AgentStatus[];
  tasks: Task[];
  messages: Message[];
  currentRequest?: string;

  // Actions
  addSystemLog: (log: SystemLog) => void;
  clearSystemLogs: () => void;
  updateAgentStatus: (agentId: string, status: Partial<AgentStatus>) => void;
  setCurrentRequest: (request: string) => void;
  createTask: (task: Omit<Task, "id" | "createdAt">) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  transferTask: (taskId: string, newAssignee: string) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  getTasksByAgent: (agentId: string) => Task[];
  getMessagesByAgent: (agentId: string) => Message[];
}

export const useWorkbenchStore = create<WorkbenchState>((set, get) => ({
  systemLogs: [],
  tasks: [],
  messages: [],
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
    const { updateTaskStatus, addSystemLog } = get();
    
    set((state) => {
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return state;
      
      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, assignee: newAssignee, status: "in-progress" as TaskStatus } : t
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
    return get().tasks.filter(task => task.assignee === agentId);
  },

  getMessagesByAgent: (agentId: string) => {
    return get().messages.filter(message => message.sender === agentId);
  },
}));
