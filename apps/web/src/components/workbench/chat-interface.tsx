"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, User, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Message, useWorkbenchStore } from "@/store/workbench-store";

interface ChatInterfaceProps {
  agentId: string;
  isActive: boolean;
  currentTask?: string;
}

export function ChatInterface({ agentId, isActive, currentTask }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    addMessage, 
    getMessagesByAgent, 
    addSystemLog,
    messages 
  } = useWorkbenchStore();

  const agentMessages = getMessagesByAgent(agentId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentMessages]);

  // Initialize with welcome message when agent becomes active
  useEffect(() => {
    if (isActive && currentTask && !hasInitialized) {
      setTimeout(() => {
        const welcomeMessage = `Hello! I'm the Analyst Agent. I've received your request: "${currentTask}". Let me help clarify the requirements. Can you provide more details about what you're trying to achieve?`;
        
        addMessage({
          sender: agentId,
          content: welcomeMessage,
        });

        addSystemLog({
          id: `chat-init-${Date.now()}`,
          timestamp: new Date(),
          message: `Analyst Agent initiated conversation for task: "${currentTask}"`,
          type: "agent_message",
          source: agentId,
        });

        setHasInitialized(true);
      }, 500);
    }
  }, [isActive, currentTask, hasInitialized, agentId, addMessage, addSystemLog]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isActive) {
      // Add user message
      addMessage({
        sender: "user",
        content: inputMessage,
      });

      // Add system log
      addSystemLog({
        id: `user-msg-${Date.now()}`,
        timestamp: new Date(),
        message: `User sent message to ${agentId}: "${inputMessage}"`,
        type: "user_input",
        source: "user",
      });

      // Simulate analyst response after a short delay
      setTimeout(() => {
        const responses = [
          "I understand. Can you elaborate on that aspect?",
          "That's helpful information. What would be the priority for this feature?",
          "Good point. Are there any constraints I should be aware of?",
          "Thank you for the clarification. Let me analyze this requirement...",
          "Interesting. How do you envision users interacting with this?",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addMessage({
          sender: agentId,
          content: randomResponse,
        });

        addSystemLog({
          id: `agent-response-${Date.now()}`,
          timestamp: new Date(),
          message: `Analyst Agent responded to user inquiry`,
          type: "agent_message",
          source: agentId,
        });
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds

      setInputMessage("");
    }
  };

  if (!isActive) {
    return (
      <div className="text-sm text-gray-500 italic p-2 text-center">
        <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
        Chat will activate when task is assigned
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-blue-500" />
        Active Conversation
      </h4>
      
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-3">
          <ScrollArea className="h-32 w-full">
            <div className="space-y-2">
              {agentMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-2 text-xs ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center gap-1 mb-1">
                      {message.sender === 'user' ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                      <span className="font-medium">
                        {message.sender === 'user' ? 'You' : 'Analyst'}
                      </span>
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response..."
              className="text-xs"
              disabled={!isActive}
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!inputMessage.trim() || !isActive}
              className="px-2"
            >
              <Send className="w-3 h-3" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
