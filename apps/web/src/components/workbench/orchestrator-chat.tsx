"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  BarChart3,
  Palette,
  Loader2,
} from "lucide-react";
import { useEffect, useRef } from "react";
import {
  useWorkbenchStore,
  DelegationWorkflow,
  AgentRole,
} from "@/store/workbench-store";

interface OrchestratorChatProps {
  className?: string;
}

export function OrchestratorChat({ className }: OrchestratorChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    delegationWorkflows,
    delegatedTasks,
    artifacts,
    systemLogs,
    getMessagesByAgent,
  } = useWorkbenchStore();

  const orchestratorMessages = getMessagesByAgent("orchestrator-agent");

  // Auto-scroll to bottom when new activities occur
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [delegationWorkflows, delegatedTasks, systemLogs]);

  const getAgentIcon = (agentRole: AgentRole) => {
    switch (agentRole) {
      case AgentRole.ORCHESTRATOR:
        return Crown;
      case AgentRole.PM:
        return Users;
      case AgentRole.ANALYST:
        return BarChart3;
      case AgentRole.DESIGN:
        return Palette;
      default:
        return Users;
    }
  };

  const getAgentName = (agentRole: AgentRole) => {
    return (
      agentRole.replace("-agent", "").replace(/\b\w/g, (l) => l.toUpperCase()) +
      " Agent"
    );
  };

  // Get orchestrator-related system logs
  const orchestratorLogs = systemLogs
    .filter(
      (log) =>
        log.source === "orchestrator-agent" ||
        log.type === "delegation" ||
        log.type === "user_input"
    )
    .slice(-10); // Show last 10 orchestrator activities

  const activeWorkflow = delegationWorkflows.find((w) => w.status === "active");
  const completedWorkflows = delegationWorkflows.filter(
    (w) => w.status === "completed"
  );
  const latestCompleted = completedWorkflows[completedWorkflows.length - 1];

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Crown className="w-4 h-4 text-orange-500" />
        Orchestrator Activity
      </h4>

      <Card className="border border-orange-200 bg-orange-50">
        <CardContent className="p-3">
          <ScrollArea className="h-48 w-full">
            <div className="space-y-3">
              {/* Show active workflow status */}
              {activeWorkflow && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-800">
                      Active Workflow
                    </span>
                    <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                      {activeWorkflow.requestType
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-blue-700 mb-2">
                    "{activeWorkflow.userRequest}"
                  </div>
                  <div className="text-xs text-blue-600">
                    Progress: Step {activeWorkflow.currentStep} of{" "}
                    {activeWorkflow.agentSequence.length}
                  </div>

                  {/* Show current delegation */}
                  {activeWorkflow.currentStep > 0 &&
                    activeWorkflow.currentStep <=
                      activeWorkflow.agentSequence.length && (
                      <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                        <div className="flex items-center gap-2 text-xs">
                          <ArrowRight className="h-3 w-3 text-blue-500" />
                          <span className="text-blue-700">
                            Currently delegated to:
                          </span>
                          <span className="font-medium text-blue-800">
                            {getAgentName(
                              activeWorkflow.agentSequence[
                                activeWorkflow.currentStep - 1
                              ]
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Show completed workflow summary */}
              {latestCompleted && !activeWorkflow && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Workflow Completed
                    </span>
                    <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                      {latestCompleted.requestType
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-green-700 mb-2">
                    "{latestCompleted.userRequest}"
                  </div>

                  {/* Show results summary */}
                  <div className="space-y-1">
                    <div className="text-xs text-green-600">
                      ✅ {latestCompleted.agentSequence.length} agents completed
                      tasks
                    </div>
                    <div className="text-xs text-green-600">
                      ✅{" "}
                      {
                        artifacts.filter((a) =>
                          delegatedTasks
                            .filter(
                              (t) =>
                                t.originalUserRequest ===
                                latestCompleted.userRequest
                            )
                            .some((t) => t.toAgent === a.creator)
                        ).length
                      }{" "}
                      artifacts generated
                    </div>
                    {latestCompleted.endTime && latestCompleted.startTime && (
                      <div className="text-xs text-green-600">
                        ✅ Completed in{" "}
                        {Math.round(
                          (latestCompleted.endTime.getTime() -
                            latestCompleted.startTime.getTime()) /
                            1000
                        )}
                        s
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show latest orchestrator synthesis message */}
              {orchestratorMessages.length > 0 && (
                <div className="bg-white border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Latest Synthesis
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line">
                    {orchestratorMessages[
                      orchestratorMessages.length - 1
                    ].content.substring(0, 200)}
                    {orchestratorMessages[orchestratorMessages.length - 1]
                      .content.length > 200 && "..."}
                  </div>
                </div>
              )}

              {/* Show orchestrator activity log */}
              <div className="space-y-2">
                {orchestratorLogs.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <MessageCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No orchestration activity yet</p>
                  </div>
                ) : (
                  orchestratorLogs.map((log) => (
                    <div
                      key={log.id}
                      className="text-xs bg-white rounded border border-orange-200 p-2"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <Badge
                          className={`text-xs ml-auto ${
                            log.type === "user_input"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : log.type === "delegation"
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {log.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="text-gray-700">{log.message}</div>
                    </div>
                  ))
                )}
              </div>

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Status Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-white rounded border border-orange-200">
          <div className="text-lg font-bold text-orange-600">
            {delegationWorkflows.length}
          </div>
          <div className="text-xs text-gray-600">Total Workflows</div>
        </div>
        <div className="text-center p-2 bg-white rounded border border-blue-200">
          <div className="text-lg font-bold text-blue-600">
            {activeWorkflow ? 1 : 0}
          </div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div className="text-center p-2 bg-white rounded border border-green-200">
          <div className="text-lg font-bold text-green-600">
            {completedWorkflows.length}
          </div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  );
}
