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
  ChevronDown,
  ChevronUp,
  Eye,
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
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());
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
  } = useWorkbenchStore();

  const toggleAgentExpanded = (agentId: string) => {
    setExpandedAgents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(agentId)) {
        newSet.delete(agentId);
      } else {
        newSet.add(agentId);
      }
      return newSet;
    });
  };

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

        {/* CEO View Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setIsExpandedView(!isExpandedView)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {isExpandedView ? "CEO Overview" : "Detailed View"}
            {isExpandedView ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* CEO Simple Overview */}
        {!isExpandedView ? (
          <div className="space-y-6">
            {/* Organizational Chart */}
            <Card className="border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-blue-50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-800">
                  Organizational Structure
                </CardTitle>
                <p className="text-gray-600">Multi-Agent System Overview</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Orchestrator at Top */}
                  <div className="flex justify-center">
                    <div
                      className={`bg-orange-100 border-2 border-orange-300 rounded-lg p-4 text-center min-w-48 cursor-pointer hover:shadow-md transition-all ${
                        expandedAgents.has("orchestrator-agent")
                          ? "rounded-b-none"
                          : ""
                      }`}
                      onClick={() => toggleAgentExpanded("orchestrator-agent")}
                    >
                      <div className="mx-auto w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center mb-2">
                        <Crown className="h-6 w-6 text-orange-700" />
                      </div>
                      <h3 className="font-semibold text-orange-800">
                        Orchestrator Agent
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Activity
                          className={`h-3 w-3 ${
                            agents.find((a) => a.id === "orchestrator-agent")
                              ?.status === "active"
                              ? "text-green-500 animate-pulse"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="text-xs capitalize">
                          {agents.find((a) => a.id === "orchestrator-agent")
                            ?.status || "idle"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        {expandedAgents.has("orchestrator-agent") ? (
                          <ChevronUp className="h-3 w-3 text-orange-600" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-orange-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Orchestrator Expanded Details */}
                  {expandedAgents.has("orchestrator-agent") && (
                    <div className="flex justify-center">
                      <div className="bg-orange-100 border-2 border-orange-300 border-t-0 rounded-b-lg p-4 min-w-48 max-w-2xl">
                        <div className="space-y-3 text-sm text-left">
                          <div>
                            <strong className="text-orange-800">
                              Description:
                            </strong>
                            <p className="mt-1">
                              👑 Tác tử Điều phối - Coordination & Workflow
                              Management
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong className="text-orange-800">
                                Status:
                              </strong>
                              <p className="capitalize">
                                {agents.find(
                                  (a) => a.id === "orchestrator-agent"
                                )?.status || "idle"}
                              </p>
                            </div>
                            <div>
                              <strong className="text-orange-800">Mode:</strong>
                              <p>{isOrchestratorMode ? "Active" : "Legacy"}</p>
                            </div>
                          </div>

                          <div>
                            <strong className="text-orange-800">
                              Current Activity:
                            </strong>
                            <p>
                              {agents.find((a) => a.id === "orchestrator-agent")
                                ?.currentTask || "Managing system coordination"}
                            </p>
                          </div>

                          <div>
                            <strong className="text-orange-800">
                              Orchestrator Chat:
                            </strong>
                            <div className="mt-2 min-h-24 bg-white rounded border border-orange-200 p-2">
                              <OrchestratorChat />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Connecting Line */}
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gray-300"></div>
                  </div>

                  {/* Sub Agents */}
                  <div className="grid grid-cols-3 gap-4">
                    {agentAreas
                      .filter((agent) => agent.id !== "orchestrator-agent")
                      .map((agent) => {
                        const IconComponent = agent.icon;
                        const currentAgent = agents.find(
                          (a) => a.id === agent.id
                        );
                        const agentStatus = currentAgent?.status || "idle";
                        const isExpanded = expandedAgents.has(agent.id);
                        const agentArtifacts = getArtifactsByAgent(agent.id);

                        return (
                          <div key={agent.id} className="text-center">
                            <div
                              className={`${
                                agent.color
                              } border-2 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all ${
                                isExpanded ? "rounded-b-none" : ""
                              }`}
                              onClick={() => toggleAgentExpanded(agent.id)}
                            >
                              <div className="mx-auto w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2">
                                <IconComponent className="h-5 w-5 text-gray-700" />
                              </div>
                              <h4 className="font-medium text-sm">
                                {agent.name}
                              </h4>
                              <div className="flex items-center justify-center gap-1 mt-1">
                                <Activity
                                  className={`h-3 w-3 ${
                                    agentStatus === "active"
                                      ? "text-green-500 animate-pulse"
                                      : agentStatus === "busy"
                                      ? "text-orange-500 animate-spin"
                                      : "text-gray-400"
                                  }`}
                                />
                                <span className="text-xs capitalize">
                                  {agentStatus}
                                </span>
                              </div>
                              <div className="flex items-center justify-center mt-2">
                                {isExpanded ? (
                                  <ChevronUp className="h-3 w-3 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-3 w-3 text-gray-500" />
                                )}
                              </div>
                            </div>

                            {/* Expanded Details - UI giống Detailed View */}
                            {isExpanded && (
                              <div
                                className={`${agent.color} border-2 border-t-0 rounded-b-lg p-4 space-y-3`}
                              >
                                {/* Description like in detailed view */}
                                <p className="text-sm text-gray-600 text-center">
                                  {agent.description}
                                </p>

                                {/* Status bar giống detailed view */}
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

                                {/* Content area giống detailed view */}
                                <div className="min-h-24 bg-white rounded border border-gray-200 p-2">
                                  {agent.id === "analyst-agent" &&
                                  agentStatus === "active" &&
                                  !isOrchestratorMode ? (
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
                                    <div className="text-sm text-blue-600 p-2 text-center">
                                      <div className="flex items-center justify-center space-x-2 mb-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="font-medium">
                                          Processing...
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {isOrchestratorMode
                                          ? "Agent working on delegated task"
                                          : "Design Agent is autonomously working on received artifact"}
                                      </div>
                                    </div>
                                  ) : isOrchestratorMode ? (
                                    <div className="text-sm p-2 text-center">
                                      {agentStatus === "busy" ? (
                                        <div className="text-blue-600">
                                          <div className="flex items-center justify-center space-x-2 mb-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="font-medium">
                                              Working...
                                            </span>
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
                                    <TaskDisplay
                                      tasks={tasks}
                                      agentId={agent.id}
                                    />
                                  )}
                                </div>

                                {/* Artifacts Section giống detailed view */}
                                {agentArtifacts.length > 0 && (
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
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {agents.filter((a) => a.status === "active").length}
                  </div>
                  <div className="text-sm text-gray-600">Active Agents</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {agents.filter((a) => a.status === "busy").length}
                  </div>
                  <div className="text-sm text-gray-600">Working Agents</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Detailed View
          <div className="space-y-6">
            {/* Orchestrator Agent - Top Section */}
            {(() => {
              const orchestratorAgent = agentAreas.find(
                (agent) => agent.id === "orchestrator-agent"
              );
              if (!orchestratorAgent) return null;

              const IconComponent = orchestratorAgent.icon;
              const currentAgent = agents.find(
                (a) => a.id === orchestratorAgent.id
              );
              const agentStatus = currentAgent?.status || "idle";

              return (
                <Card
                  className={`${orchestratorAgent.color} border-2 transition-all hover:shadow-md max-w-2xl mx-auto`}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-2">
                      <IconComponent className="h-8 w-8 text-gray-700" />
                    </div>
                    <CardTitle className="text-xl">
                      {orchestratorAgent.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                      {orchestratorAgent.description}
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
                      <div className="min-h-32 bg-white rounded border border-gray-200 p-2">
                        <OrchestratorChat />
                      </div>

                      {/* Artifacts Section */}
                      {(() => {
                        const agentArtifacts = getArtifactsByAgent(
                          orchestratorAgent.id
                        );
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
            })()}

            {/* Other Agent Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentAreas
                .filter((agent) => agent.id !== "orchestrator-agent")
                .map((agent) => {
                  const IconComponent = agent.icon;
                  const currentAgent = agents.find((a) => a.id === agent.id);
                  const agentStatus = currentAgent?.status || "idle";
                  const isExpanded = expandedAgents.has(agent.id);

                  return (
                    <Card
                      key={agent.id}
                      className={`${agent.color} border-2 transition-all hover:shadow-md`}
                    >
                      <CardHeader
                        className="text-center cursor-pointer"
                        onClick={() => toggleAgentExpanded(agent.id)}
                      >
                        <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <CardTitle className="text-lg flex items-center justify-center gap-2">
                          {agent.name}
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </CardTitle>
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
                          <div
                            className={`${
                              isExpanded ? "min-h-32" : "min-h-24"
                            } bg-white rounded border border-gray-200 p-2`}
                          >
                            {agent.id === "analyst-agent" &&
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
                                  <span className="font-medium">
                                    Processing...
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {isOrchestratorMode
                                    ? "Agent working on delegated task"
                                    : "Design Agent is autonomously working on received artifact"}
                                </div>
                              </div>
                            ) : isOrchestratorMode ? (
                              // Story 1.5: Show agent status in orchestrator mode
                              <div className="text-sm p-2 text-center">
                                {agentStatus === "busy" ? (
                                  <div className="text-blue-600">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span className="font-medium">
                                        Working...
                                      </span>
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
                            const agentArtifacts = getArtifactsByAgent(
                              agent.id
                            );
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

                          {/* Expanded Details - Show agent detail like in detailed view */}
                          {isExpanded && (
                            <div className="mt-4 p-4 bg-gray-50 rounded border-t border-gray-200">
                              <h6 className="text-sm font-medium text-gray-700 mb-3">
                                Agent Details
                              </h6>

                              <div className="space-y-3 text-sm">
                                <div>
                                  <strong className="text-gray-600">
                                    Description:
                                  </strong>
                                  <p className="mt-1">{agent.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong className="text-gray-600">
                                      Status:
                                    </strong>
                                    <p className="capitalize">{agentStatus}</p>
                                  </div>
                                  <div>
                                    <strong className="text-gray-600">
                                      Tasks:
                                    </strong>
                                    <p>
                                      {
                                        tasks.filter(
                                          (t) => t.assignee === agent.id
                                        ).length
                                      }{" "}
                                      total
                                    </p>
                                  </div>
                                </div>

                                {currentAgent?.currentTask && (
                                  <div>
                                    <strong className="text-gray-600">
                                      Current Task:
                                    </strong>
                                    <p className="mt-1">
                                      {currentAgent.currentTask}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <strong className="text-gray-600">
                                    Last Activity:
                                  </strong>
                                  <p>
                                    {currentAgent?.lastActivity?.toLocaleTimeString() ||
                                      "No recent activity"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* Story 1.5: Orchestrator Delegation Visualization */}
        {isOrchestratorMode && isExpandedView && (
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
