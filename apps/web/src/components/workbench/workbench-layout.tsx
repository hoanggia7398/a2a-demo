"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  BarChart3,
  Palette,
  Send,
  ScrollText,
  Activity,
  Crown,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useWorkbenchStore, SystemLog } from "@/store/workbench-store";
import { TaskDisplay } from "./task-display";
import { ChatInterface } from "./chat-interface";
import { ArtifactDisplay } from "./artifact-display";
import { OrchestratorDelegation } from "./orchestrator-delegation";
import { ResultSynthesizer } from "./result-synthesizer";
import { OrchestratorChat } from "./orchestrator-chat";

export function WorkbenchLayout() {
  const [userInput, setUserInput] = useState("");
  const {
    addSystemLog,
    processUserRequest,
    isOrchestratorMode,
    updateAgentStatus,
    transferArtifact,
    getArtifactsByAgent,
    startDesignAgentProcessing,
    tasks,
    agents,
    delegationWorkflows,
  } = useWorkbenchStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      if (isOrchestratorMode) {
        // Story 1.5: Use orchestrator delegation
        processUserRequest(userInput);
      } else {
        // Legacy direct assignment (for backward compatibility)
        addSystemLog({
          id: Date.now().toString(),
          timestamp: new Date(),
          message: `User initiated request: ${userInput}`,
          type: "user_input",
          source: "user",
        });

        // Legacy PM Agent task creation would go here
      }

      setUserInput("");
    }
  };

  const handleArtifactTransfer = (artifactId: string) => {
    // Get the artifact that's being transferred
    const allArtifacts = useWorkbenchStore.getState().artifacts;
    const artifact = allArtifacts.find((a) => a.id === artifactId);

    if (!artifact) return;

    // Transfer artifact from Analyst Agent to Design Agent
    transferArtifact(artifactId, "design-agent");

    // Update Analyst Agent status
    updateAgentStatus("analyst-agent", {
      status: "idle",
      currentTask: undefined,
    });

    // Story 1.4: Trigger Design Agent autonomous processing
    startDesignAgentProcessing(artifact);
  };

  const agentAreas = [
    {
      id: "orchestrator-agent",
      name: "Orchestrator Agent",
      icon: Crown,
      description: "👑 Tác tử Điều phối - Coordination & Workflow Management",
      status: "active",
      color: "border-orange-200 bg-orange-50",
    },
    {
      id: "pm-agent",
      name: "PM Agent",
      icon: Users,
      description: "Project Management & Coordination",
      status: "idle",
      color: "border-blue-200 bg-blue-50",
    },
    {
      id: "analyst-agent",
      name: "Analyst Agent",
      icon: BarChart3,
      description: "Data Analysis & Requirements",
      status: "idle",
      color: "border-green-200 bg-green-50",
    },
    {
      id: "design-agent",
      name: "Design Agent",
      icon: Palette,
      description: "UI/UX Design & Prototyping",
      status: "idle",
      color: "border-purple-200 bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Digital Workbench
          </h1>
          <p className="text-gray-600">
            {isOrchestratorMode
              ? "🎭 Orchestrator-Managed Multi-Agent Platform"
              : "Multi-Agent Collaboration Platform"}
          </p>
          {isOrchestratorMode && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              <Crown className="h-4 w-4" />
              Orchestrator Mode Active
            </div>
          )}
        </div>

        {/* User Input Section */}
        <Card className="border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Initiate Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your request or task description..."
                className="flex-1"
              />
              <Button type="submit" disabled={!userInput.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Agent Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentAreas.map((agent) => {
            const IconComponent = agent.icon;
            const currentAgent = agents.find((a) => a.id === agent.id);
            const agentStatus = currentAgent?.status || "idle";

            return (
              <Card
                key={agent.id}
                className={`${agent.color} border-2 transition-all hover:shadow-md`}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                    <IconComponent className="h-6 w-6 text-gray-700" />
                  </div>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Activity
                      className={`h-4 w-4 transition-all duration-300 ${
                        agentStatus === "active"
                          ? "text-green-500 animate-pulse"
                          : agentStatus === "busy"
                          ? "text-orange-500 animate-spin"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm capitalize transition-all duration-300 ${
                        agentStatus === "active"
                          ? "text-green-600 font-medium"
                          : agentStatus === "busy"
                          ? "text-orange-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {agentStatus}
                    </span>
                    {currentAgent?.currentTask && (
                      <span className="text-xs text-gray-500 truncate ml-2">
                        • {currentAgent.currentTask}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="min-h-24 bg-white rounded border border-gray-200 p-2">
                      {agent.id === "orchestrator-agent" ? (
                        // Story 1.5: Orchestrator chat interface
                        <OrchestratorChat />
                      ) : agent.id === "analyst-agent" &&
                        agentStatus === "active" &&
                        !isOrchestratorMode ? (
                        // Legacy chat interface (only if orchestrator mode is disabled)
                        <ChatInterface
                          agentId={agent.id}
                          isActive={agentStatus === "active"}
                          currentTask={currentAgent?.currentTask}
                        />
                      ) : agent.id === "analyst-agent" &&
                        !isOrchestratorMode ? (
                        <div className="text-sm text-gray-500 italic p-2 text-center">
                          <div className="w-6 h-6 mx-auto mb-2 opacity-50">
                            💬
                          </div>
                          Chat will activate when task is assigned
                        </div>
                      ) : agent.id === "design-agent" &&
                        agentStatus === "busy" ? (
                        // Story 1.4: Design Agent Processing State
                        <div className="text-sm text-blue-600 p-2 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="font-medium">Processing...</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {isOrchestratorMode
                              ? "Agent working on delegated task"
                              : "Design Agent is autonomously working on received artifact"}
                          </div>
                        </div>
                      ) : isOrchestratorMode &&
                        agent.id !== "orchestrator-agent" ? (
                        // Story 1.5: Show agent status in orchestrator mode
                        <div className="text-sm p-2 text-center">
                          {agentStatus === "busy" ? (
                            <div className="text-blue-600">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="font-medium">Working...</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Processing delegated task
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 italic">
                              <div className="w-6 h-6 mx-auto mb-2 opacity-50">
                                🤖
                              </div>
                              Waiting for delegation
                            </div>
                          )}
                        </div>
                      ) : (
                        <TaskDisplay tasks={tasks} agentId={agent.id} />
                      )}
                    </div>

                    {/* Artifacts Section */}
                    {(() => {
                      const agentArtifacts = getArtifactsByAgent(agent.id);
                      if (agentArtifacts.length > 0) {
                        return (
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-gray-600">
                              Artifacts
                            </h5>
                            {agentArtifacts.map((artifact) => (
                              <ArtifactDisplay
                                key={artifact.id}
                                artifact={artifact}
                                onTransfer={
                                  agent.id === "analyst-agent"
                                    ? handleArtifactTransfer
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Story 1.5: Orchestrator Delegation Visualization */}
        {isOrchestratorMode && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrchestratorDelegation />
            <ResultSynthesizer />
          </div>
        )}

        {/* System Event Log */}
        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              System Event Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SystemEventLog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SystemEventLog() {
  const { systemLogs } = useWorkbenchStore();

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {systemLogs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ScrollText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No system events yet. Submit a request to begin.</p>
        </div>
      ) : (
        systemLogs.map((log: SystemLog) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded border"
          >
            <div className="text-xs text-gray-500 mt-0.5 font-mono min-w-[60px]">
              {log.timestamp.toLocaleTimeString()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                  {log.source}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    log.type === "user_input"
                      ? "bg-blue-100 text-blue-700"
                      : log.type === "agent_message"
                      ? "bg-green-100 text-green-700"
                      : log.type === "delegation"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {log.type.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-gray-700">{log.message}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
