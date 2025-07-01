"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJsonRpcServer = void 0;
const jayson_1 = __importDefault(require("jayson"));
const connection_1 = require("./database/connection");
// JSON-RPC method handlers
const methods = {
    // System health check
    "system.health": async () => {
        const db = (0, connection_1.getDatabase)();
        const agents = db
            .prepare("SELECT id, name, status FROM agents")
            .all();
        return {
            status: "healthy",
            timestamp: new Date().toISOString(),
            version: "2.0.0",
            database: "connected",
            agents: agents.map((agent) => agent.id),
        };
    },
    // Agent status methods
    "agent.getStatus": async ({ agentId }) => {
        const db = (0, connection_1.getDatabase)();
        const agent = db
            .prepare("SELECT * FROM agents WHERE id = ?")
            .get(agentId);
        if (!agent) {
            throw new Error("Agent not found");
        }
        return {
            id: agent.id,
            name: agent.name,
            status: agent.status,
            lastActivity: agent.last_activity,
            currentTask: agent.current_task,
        };
    },
    "agent.updateStatus": async ({ agentId, status, currentTask, }) => {
        const db = (0, connection_1.getDatabase)();
        const updateAgent = db.prepare(`
      UPDATE agents 
      SET status = ?, current_task = ?, last_activity = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
        const result = updateAgent.run(status, currentTask || null, agentId);
        if (result.changes === 0) {
            throw new Error("Agent not found");
        }
        return { success: true, agentId, status };
    },
    // PM Agent methods
    "pm.createTask": async ({ title, description, userId, priority = "medium", }) => {
        const db = (0, connection_1.getDatabase)();
        const taskId = `task-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const insertTask = db.prepare(`
      INSERT INTO tasks (id, title, description, priority, assigner_id, assignee_id)
      VALUES (?, ?, ?, ?, ?, 'pm-agent')
    `);
        insertTask.run(taskId, title, description, priority, userId);
        // Log task creation
        const insertLog = db.prepare(`
      INSERT INTO system_logs (level, message, event_type, agent_id, task_id, data)
      VALUES ('info', ?, 'TASK_CREATED', 'pm-agent', ?, ?)
    `);
        insertLog.run(`Task created: ${title}`, taskId, JSON.stringify({ title, priority }));
        return {
            task: {
                id: taskId,
                title,
                status: "pending",
                assigner: userId,
                assignee: "pm-agent",
                createdAt: new Date().toISOString(),
            },
            nextAction: "delegate_to_analyst",
        };
    },
    "pm.delegateTask": async ({ taskId, targetAgent, delegationReason, }) => {
        const db = (0, connection_1.getDatabase)();
        // Update task status
        const updateTask = db.prepare(`
      UPDATE tasks 
      SET status = 'delegated', assignee_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
        updateTask.run(targetAgent, taskId);
        // Log delegation
        const insertLog = db.prepare(`
      INSERT INTO system_logs (level, message, event_type, agent_id, task_id, data)
      VALUES ('info', ?, 'TASK_DELEGATED', 'pm-agent', ?, ?)
    `);
        insertLog.run(`Task delegated to ${targetAgent}: ${delegationReason}`, taskId, JSON.stringify({ targetAgent, delegationReason }));
        return {
            success: true,
            taskId,
            targetAgent,
            delegationReason,
        };
    },
    // Placeholder methods for analyst and design agents (to be implemented in Story 2.3)
    "analyst.startAnalysis": async () => {
        throw new Error("Method not implemented yet - will be added in Story 2.3");
    },
    "design.generateSpecification": async () => {
        throw new Error("Method not implemented yet - will be added in Story 2.3");
    },
};
const createJsonRpcServer = () => {
    return jayson_1.default.Server(methods, {
        router: (method) => {
            console.log(`🔌 JSON-RPC call: ${method}`);
            return methods[method];
        },
    });
};
exports.createJsonRpcServer = createJsonRpcServer;
//# sourceMappingURL=jsonrpc-server.js.map