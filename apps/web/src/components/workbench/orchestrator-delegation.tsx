"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Crown,
  Users,
  BarChart3,
  Palette,
} from "lucide-react";
import {
  useWorkbenchStore,
  DelegationWorkflow,
  DelegatedTask,
  AgentRole,
} from "@/store/workbench-store";

interface OrchestratorDelegationProps {
  workflow?: DelegationWorkflow;
  className?: string;
}

export function OrchestratorDelegation({
  workflow,
  className,
}: OrchestratorDelegationProps) {
  const { delegationWorkflows, delegatedTasks } = useWorkbenchStore();

  // Use the active workflow if none is passed in
  const activeWorkflow =
    workflow || delegationWorkflows.find((w) => w.status === "active");

  if (!activeWorkflow) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Active Workflow</h3>
          <p className="text-sm">
            Submit a request to see delegation in action
          </p>
        </CardContent>
      </Card>
    );
  }

  const workflowTasks = delegatedTasks.filter(
    (task) => task.originalUserRequest === activeWorkflow.userRequest
  );

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

  const getAgentColor = (agentRole: AgentRole) => {
    switch (agentRole) {
      case AgentRole.ORCHESTRATOR:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case AgentRole.PM:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case AgentRole.ANALYST:
        return "bg-green-100 text-green-800 border-green-200";
      case AgentRole.DESIGN:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "delegated":
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-orange-600" />
          Orchestrator Delegation Flow
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
            {activeWorkflow.requestType.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge
            className={`text-xs ${
              activeWorkflow.status === "active"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }`}
          >
            {activeWorkflow.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Request */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <div className="text-sm font-medium text-gray-700 mb-1">
            User Request:
          </div>
          <div className="text-sm text-gray-600">
            "{activeWorkflow.userRequest}"
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            Delegation Sequence:
          </div>

          <div className="space-y-2">
            {activeWorkflow.agentSequence.map((agentRole, index) => {
              const IconComponent = getAgentIcon(agentRole);
              const task = workflowTasks.find((t) => t.toAgent === agentRole);
              const isCurrentStep = index === activeWorkflow.currentStep - 1;
              const isCompleted =
                index < activeWorkflow.currentStep - 1 ||
                task?.status === "completed";
              const isActive = isCurrentStep && task?.status === "delegated";

              return (
                <div
                  key={`${agentRole}-${index}`}
                  className="flex items-center gap-3"
                >
                  {/* Step indicator */}
                  <div
                    className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium
                    ${
                      isCompleted
                        ? "bg-green-100 border-green-500 text-green-700"
                        : isActive
                        ? "bg-blue-100 border-blue-500 text-blue-700 animate-pulse"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }
                  `}
                  >
                    {index + 1}
                  </div>

                  {/* Agent card */}
                  <div
                    className={`
                    flex-1 p-3 rounded-lg border-2 transition-all duration-200
                    ${getAgentColor(agentRole)}
                    ${isActive ? "ring-2 ring-blue-300 ring-offset-1" : ""}
                  `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          {agentRole
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task && getStatusIcon(task.status)}
                        {task && (
                          <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-200">
                            {task.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {task && (
                      <div className="mt-2 text-xs text-gray-600">
                        Task: {task.taskType.replace("_", " ")}
                      </div>
                    )}
                  </div>

                  {/* Arrow connector */}
                  {index < activeWorkflow.agentSequence.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow Summary */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {activeWorkflow.currentStep}
              </div>
              <div className="text-xs text-gray-600">Current Step</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {workflowTasks.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">
                {activeWorkflow.agentSequence.length}
              </div>
              <div className="text-xs text-gray-600">Total Agents</div>
            </div>
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Timeline:
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>
              Started: {activeWorkflow.startTime.toLocaleTimeString()}
            </span>
            {activeWorkflow.endTime && (
              <>
                <span>•</span>
                <span>
                  Completed: {activeWorkflow.endTime.toLocaleTimeString()}
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
