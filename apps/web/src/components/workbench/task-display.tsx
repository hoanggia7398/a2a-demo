"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Task, TaskStatus } from "@/store/workbench-store";

interface TaskDisplayProps {
  tasks: Task[];
  agentId: string;
}

const statusConfig: Record<
  TaskStatus,
  {
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    animate?: boolean;
  }
> = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
    label: "Pending",
    animate: true,
  },
  "in-progress": {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: AlertCircle,
    label: "In Progress",
    animate: true,
  },
  completed: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
    label: "Completed",
  },
  failed: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
    label: "Failed",
  },
};

export function TaskDisplay({ tasks, agentId }: TaskDisplayProps) {
  const agentTasks = tasks.filter((task) => task.assignee === agentId);

  if (agentTasks.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-2 text-center">
        No tasks assigned
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Tasks ({agentTasks.length})
      </h4>
      {agentTasks.map((task) => {
        const config = statusConfig[task.status];
        const StatusIcon = config.icon;

        return (
          <Card
            key={task.id}
            className={`border border-gray-200 transition-all duration-300 ${
              config.animate
                ? "hover:shadow-md transform hover:scale-[1.02]"
                : ""
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium truncate flex-1">
                  {task.title}
                </CardTitle>
                <Badge
                  className={`text-xs border ${config.color} flex items-center gap-1`}
                >
                  <StatusIcon
                    className={`w-3 h-3 ${
                      config.animate ? "animate-pulse" : ""
                    }`}
                  />
                  {config.label}
                  {task.status === "pending" && agentId === "pm-agent" && (
                    <ArrowRight className="w-3 h-3 animate-bounce ml-1" />
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-gray-500 space-y-1">
                <div>
                  From: <span className="font-medium">{task.assigner}</span>
                </div>
                <div>Created: {task.createdAt.toLocaleTimeString()}</div>
                {task.status === "pending" && agentId === "pm-agent" && (
                  <div className="text-blue-600 font-medium animate-pulse">
                    ⏳ Preparing for handoff...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
