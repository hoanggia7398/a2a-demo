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

interface WorkbenchState {
  systemLogs: SystemLog[];
  agents: AgentStatus[];
  currentRequest?: string;

  // Actions
  addSystemLog: (log: SystemLog) => void;
  clearSystemLogs: () => void;
  updateAgentStatus: (agentId: string, status: Partial<AgentStatus>) => void;
  setCurrentRequest: (request: string) => void;
}

export const useWorkbenchStore = create<WorkbenchState>((set) => ({
  systemLogs: [],
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
}));
