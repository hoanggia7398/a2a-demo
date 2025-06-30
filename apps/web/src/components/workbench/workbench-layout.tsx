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
} from "lucide-react";
import { useState } from "react";
import { useWorkbenchStore, SystemLog } from "@/store/workbench-store";

export function WorkbenchLayout() {
  const [userInput, setUserInput] = useState("");
  const { addSystemLog } = useWorkbenchStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      addSystemLog({
        id: Date.now().toString(),
        timestamp: new Date(),
        message: `User initiated request: ${userInput}`,
        type: "user_input",
        source: "user",
      });
      setUserInput("");
    }
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
          <p className="text-gray-600">Multi-Agent Collaboration Platform</p>
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
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 capitalize">
                      {agent.status}
                    </span>
                  </div>
                  <div className="h-24 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">
                      Activity area - Ready for tasks
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {log.type}
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
