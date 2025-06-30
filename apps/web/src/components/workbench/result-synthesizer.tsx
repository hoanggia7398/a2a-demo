"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Crown,
  Users,
  BarChart3,
  Palette,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  useWorkbenchStore,
  DelegationWorkflow,
  AgentRole,
  Artifact,
} from "@/store/workbench-store";

interface ResultSynthesizerProps {
  workflowId?: string;
  className?: string;
}

export function ResultSynthesizer({
  workflowId,
  className,
}: ResultSynthesizerProps) {
  const { delegationWorkflows, delegatedTasks, artifacts } =
    useWorkbenchStore();

  // Find completed workflows
  const completedWorkflows = delegationWorkflows.filter(
    (w) => w.status === "completed"
  );

  // Use specific workflow or most recent completed workflow
  const targetWorkflow = workflowId
    ? delegationWorkflows.find((w) => w.id === workflowId)
    : completedWorkflows[completedWorkflows.length - 1];

  if (!targetWorkflow || targetWorkflow.status !== "completed") {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Completed Workflows</h3>
          <p className="text-sm">
            Results will appear here once a workflow is completed
          </p>
        </CardContent>
      </Card>
    );
  }

  const workflowTasks = delegatedTasks.filter(
    (task) => task.originalUserRequest === targetWorkflow.userRequest
  );

  const completedTasks = workflowTasks.filter(
    (task) => task.status === "completed"
  );

  const workflowArtifacts = artifacts.filter((artifact) =>
    completedTasks.some((task) => task.toAgent === artifact.creator)
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

  const getAgentName = (agentRole: AgentRole) => {
    switch (agentRole) {
      case AgentRole.ORCHESTRATOR:
        return "Orchestrator Agent";
      case AgentRole.PM:
        return "PM Agent";
      case AgentRole.ANALYST:
        return "Analyst Agent";
      case AgentRole.DESIGN:
        return "Design Agent";
      default:
        return String(agentRole)
          .replace("-", " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
  };

  const workflowDuration =
    targetWorkflow.endTime && targetWorkflow.startTime
      ? Math.round(
          (targetWorkflow.endTime.getTime() -
            targetWorkflow.startTime.getTime()) /
            1000
        )
      : 0;

  const generateWorkflowSummary = () => {
    const requestType = targetWorkflow.requestType;
    const agentCount = completedTasks.length;
    const artifactCount = workflowArtifacts.length;

    switch (requestType) {
      case "project_initiation":
        return `Successfully initiated project through ${agentCount}-agent collaboration, producing ${artifactCount} comprehensive artifacts including project planning, requirements analysis, and design specifications.`;
      case "requirements_gathering":
        return `Completed requirements analysis through ${agentCount}-agent coordination, generating ${artifactCount} detailed artifacts with functional and technical specifications.`;
      case "design_request":
        return `Delivered design solution through specialized agent processing, creating ${artifactCount} design artifacts with detailed specifications.`;
      default:
        return `Completed ${requestType.replace(
          "_",
          " "
        )} workflow with ${agentCount} agents, producing ${artifactCount} artifacts.`;
    }
  };

  const suggestNextSteps = () => {
    const requestType = targetWorkflow.requestType;

    switch (requestType) {
      case "project_initiation":
        return [
          "Review and validate generated project plan",
          "Proceed with technical implementation planning",
          "Set up development environment and tools",
          "Begin development sprints based on requirements",
        ];
      case "requirements_gathering":
        return [
          "Validate requirements with stakeholders",
          "Prioritize feature development order",
          "Create detailed user stories and acceptance criteria",
          "Begin technical architecture design",
        ];
      case "design_request":
        return [
          "Review and iterate on design specifications",
          "Create interactive prototypes",
          "Conduct user testing and feedback sessions",
          "Prepare for development handoff",
        ];
      default:
        return [
          "Review generated artifacts",
          "Plan implementation approach",
          "Coordinate with team members",
          "Begin next phase of development",
        ];
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Workflow Results Synthesis
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
            {targetWorkflow.requestType.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
            COMPLETED
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Original Request */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Original Request:
          </div>
          <div className="text-sm text-gray-600 italic">
            "{targetWorkflow.userRequest}"
          </div>
        </div>

        {/* Specialist Agents Involved */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Specialist Agents Involved
          </h3>
          <div className="grid gap-3">
            {completedTasks.map((task, index) => {
              const IconComponent = getAgentIcon(task.toAgent);
              const agentArtifacts = workflowArtifacts.filter(
                (a) => a.creator === task.toAgent
              );

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {getAgentName(task.toAgent)}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {task.taskType.replace("_", " ")} •{" "}
                      {agentArtifacts.length} artifact(s) generated
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Step {index + 1}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generated Artifacts */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Generated Artifacts
          </h3>
          {workflowArtifacts.length > 0 ? (
            <div className="grid gap-3">
              {workflowArtifacts.map((artifact, index) => (
                <div
                  key={artifact.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border"
                >
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{artifact.name}</div>
                    <div className="text-xs text-gray-600">
                      Created by {getAgentName(artifact.creator as AgentRole)} •{" "}
                      {artifact.type}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-7 px-2 border border-gray-300"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No artifacts generated</p>
            </div>
          )}
        </div>

        {/* Workflow Summary */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">{generateWorkflowSummary()}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {workflowDuration}s
              </div>
              <div className="text-xs text-gray-600">Total Duration</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {completedTasks.length}
              </div>
              <div className="text-xs text-gray-600">Agents Involved</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {workflowArtifacts.length}
              </div>
              <div className="text-xs text-gray-600">Artifacts Created</div>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Recommended Next Steps
          </h3>
          <div className="space-y-2">
            {suggestNextSteps().map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-medium text-orange-600 mt-0.5">
                  {index + 1}
                </div>
                <div className="text-sm text-gray-700">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Started: {targetWorkflow.startTime.toLocaleString()}</span>
            </div>
            {targetWorkflow.endTime && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>
                  Completed: {targetWorkflow.endTime.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
