### **Epics và User Stories**

#### **Epic 1: Xây dựng Nền tảng Demo "Digital Workbench"**

**Mục tiêu Epic:** Phát triển một ứng dụng web MVP mô phỏng "Bàn làm việc Kỹ thuật số", cho phép người dùng khởi tạo một quy trình và theo dõi trực quan cách một đội ngũ tác tử AI (PM, Analyst, Design) tự trị cộng tác, trao đổi tác vụ (Tasks) và hiện vật (Artifacts) qua A2A để tạo ra nhiều kết quả đầu ra.

#### **Story 1.1: Thiết lập Giao diện "Bàn làm việc Kỹ thuật số" (Workbench)**

* **As a** user,
* **I want** to see a main interface that visually represents a "workbench" with clearly defined areas for different AI agents (e.g., PM Agent, Analyst Agent, Design Agent),
* **so that** I can understand the layout of the multi-agent system.
* **Acceptance Criteria:**
  1. Giao diện chính được chia thành các "khu vực" hoặc "thẻ" riêng biệt, mỗi khu vực có tên và biểu tượng của một tác tử (PM, Analyst, Design).
  2. Có một khu vực chung để hiển thị log hoặc dòng chảy sự kiện của toàn hệ thống.
  3. Giao diện có một nút hoặc ô nhập liệu ban đầu để người dùng khởi tạo một yêu cầu.

#### **Story 1.2: Bắt đầu Tương tác với Tác tử Phân tích (Analyst Agent)**

* **As a** user,
* **I want** to input a high-level request and see it being assigned to the Analyst Agent to start the conversation,
* **so that** I can begin the requirement clarification process.
* **Acceptance Criteria:**
  1. Khi người dùng nhập yêu cầu và gửi đi, một "Tác vụ" mới sẽ xuất hiện trong khu vực của Tác tử Quản lý Dự án (PM Agent).
  2. Hệ thống hiển thị trực quan việc Tác vụ này được chuyển từ PM Agent sang Analyst Agent.
  3. Khu vực chat của Analyst Agent trở nên hoạt động, và tác tử này sẽ gửi tin nhắn đầu tiên để bắt đầu làm rõ yêu cầu với người dùng.

#### **Story 1.3: Trực quan hóa Luồng giao tiếp A2A và Hiện vật (Artifact)**

* **As a** user,
* **I want** to see a visual representation of the Analyst Agent creating and handing off a document artifact to the Design Agent,
* **so that** I can understand the A2A collaboration process.
* **Acceptance Criteria:**
  1. Sau khi cuộc trò chuyện với người dùng kết thúc, Analyst Agent tạo ra một "Hiện vật" (Artifact) là một tài liệu markdown.
  2. Hiện vật này xuất hiện trong khu vực của Analyst Agent.
  3. Hệ thống hiển thị trực quan việc Hiện vật được gửi từ Analyst Agent sang Design Agent.
  4. Khu vực log chung ghi lại sự kiện: `Analyst_Agent --> SENT_ARTIFACT (requirements.md) --> Design_Agent`.

#### **Story 1.4: Tác tử Tự trị Hoạt động và Tạo Kết quả**

* **As a** user,
* **I want** to see the Design Agent autonomously work on the received artifact and produce its own output,
* **so that** I can witness the power of specialized, independent agents.
* **Acceptance Criteria:**
  1. Sau khi nhận hiện vật, khu vực của Design Agent hiển thị trạng thái "đang xử lý" (ví dụ: loading spinner).
  2. Sau một khoảng thời gian ngắn, Design Agent tạo ra một hiện vật mới (ví dụ: một file ảnh sơ đồ kiến trúc).
  3. Hiện vật mới này xuất hiện trong khu vực của Design Agent.

#### **Story 1.5: Mô hình Tương tác chỉ qua Orchestrator**

* **As a** user,
* **I want** to interact only with the Orchestrator Agent instead of individual specialist agents,
* **so that** I can experience seamless A2A workflow without managing multiple conversations.
* **Acceptance Criteria:**
  1. **Single Point of Interaction**: User can only chat with Orchestrator Agent - all other agent chat interfaces are disabled/hidden.
  2. **Automated Task Delegation**: Orchestrator automatically analyzes user requests and delegates appropriate tasks to PM, Analyst, and Design agents.
  3. **Transparent A2A Workflow**: User can visually see the A2A communication between Orchestrator and specialist agents.
  4. **Unified Results Presentation**: Orchestrator collects and presents consolidated results from all specialist agents.
  5. **Enhanced System Logging**: All A2A interactions between Orchestrator and specialist agents are logged with specific patterns.

---

## **Epic 2: Backend API Foundation & Real A2A Implementation**

**Epic Goal:** Transform the current frontend-only simulation into a production-ready system with a proper backend API, real agent processing logic, data persistence, and authentic A2A communication protocols as specified in the architecture.

**Business Justification:**
- **Current Gap**: Frontend simulation with mock data and timers vs. planned Express.js + JSON-RPC 2.0 architecture
- **Value Delivered**: Production-ready foundation, authentic A2A capabilities, scalable architecture
- **Technical Debt Resolution**: Align implementation with documented architecture (Express.js, SQLite, JSON-RPC 2.0)

**Epic Success Criteria:**
- ✅ Express.js API server running with JSON-RPC 2.0 endpoints
- ✅ Real agent processing logic replacing frontend simulations
- ✅ SQLite database for persistent data storage
- ✅ WebSocket/SSE for real-time A2A communication
- ✅ Frontend migrated to use real API calls instead of Zustand simulations
- ✅ Authentication and session management
- ✅ Production deployment configuration

### **Story 2.1: Backend API Server Foundation**

* **As a** developer,
* **I want** to have a working Express.js server with basic JSON-RPC 2.0 endpoint structure,
* **so that** I can build real agent processing capabilities on a solid foundation.
* **Acceptance Criteria:**
  1. Express.js server starts successfully on configured port with proper middleware (CORS, JSON parsing, error handling).
  2. JSON-RPC 2.0 endpoint structure implemented with request validation and error responses.
  3. Basic health check and status endpoints available for monitoring.
  4. TypeScript configuration matching frontend for consistency.
  5. Database connection to SQLite established with proper error handling.

### **Story 2.2: Database Schema & Data Models**

* **As a** system,
* **I want** to have a properly designed database schema that supports all A2A workflows,
* **so that** I can persistently store and retrieve agents, tasks, artifacts, and system logs.
* **Acceptance Criteria:**
  1. SQLite database schema created with tables for: Users, Agents, Tasks, Artifacts, SystemLogs, Sessions.
  2. TypeScript models/interfaces matching database schema and existing frontend types.
  3. Database migration and seeding scripts for development and testing.
  4. CRUD operations implemented for all main entities with proper validation.
  5. Indexes and constraints optimized for A2A workflow queries.

### **Story 2.3: Real Agent Processing Logic**

* **As a** PM/Analyst/Design Agent,
* **I want** to have real backend processing logic instead of frontend simulations,
* **so that** I can perform authentic agent work and A2A communication.
* **Acceptance Criteria:**
  1. **PM Agent API**: Task creation, assignment, and workflow orchestration logic.
  2. **Analyst Agent API**: Real requirements gathering, analysis, and artifact generation capabilities.
  3. **Design Agent API**: Autonomous design specification generation based on received artifacts.
  4. **A2A Communication**: Proper JSON-RPC method calls between agents with logging.
  5. **Status Management**: Real agent status tracking (idle, active, busy, error) in database.

### **Story 2.4: Real-time Communication & WebSocket Integration**

* **As a** user,
* **I want** to receive real-time updates about A2A agent activities,
* **so that** I can see live progress without refreshing the page.
* **Acceptance Criteria:**
  1. WebSocket server integrated with Express.js for real-time communication.
  2. Frontend WebSocket client connecting and handling real-time events.
  3. Agent status changes, task progress, and artifact creation broadcasted live.
  4. System logs streamed to frontend in real-time for transparency.
  5. Connection management with reconnection logic and error handling.

### **Story 2.5: Frontend API Integration & Migration**

* **As a** frontend application,
* **I want** to use real API calls instead of Zustand simulations,
* **so that** I can interact with authentic backend agent processing.
* **Acceptance Criteria:**
  1. API client service layer created with proper error handling and retry logic.
  2. Zustand store updated to call real API endpoints instead of mock data.
  3. Loading states and error handling implemented for all API operations.
  4. Authentication and session management integrated with API calls.
  5. All existing frontend functionality working with real backend data.

### **Story 2.6: Authentication & Security**

* **As a** system administrator,
* **I want** to have proper authentication and security measures,
* **so that** the application is secure and ready for production deployment.
* **Acceptance Criteria:**
  1. User authentication system with session management.
  2. API endpoint security with proper authorization checks.
  3. Input validation and sanitization for all API endpoints.
  4. Rate limiting and basic DDoS protection measures.
  5. Security headers and HTTPS configuration for production.

### **Story 2.7: Production Deployment & Configuration**

* **As a** DevOps engineer,
* **I want** to have production-ready deployment configuration,
* **so that** the application can be deployed and maintained in production.
* **Acceptance Criteria:**
  1. Docker containerization for both API and web applications.
  2. Environment configuration management for different environments.
  3. Production database setup and migration procedures.
  4. Logging and monitoring configuration for production operations.
  5. CI/CD pipeline configuration for automated deployment.

---

**Epic 2 Dependencies:**
- Epic 1 must be completed (Stories 1.1-1.5)
- Architecture documentation must be current and accurate
- Development team must be familiar with Express.js, SQLite, and WebSocket technologies

**Epic 2 Risks:**
- **High**: Significant refactoring required for frontend integration
- **Medium**: Database design complexity for A2A workflows  
- **Low**: Performance considerations for real-time communication

**Epic 2 Estimated Timeline:**
- **Story 2.1-2.2**: 2-3 weeks (Foundation)
- **Story 2.3**: 3-4 weeks (Agent Logic - most complex)
- **Story 2.4-2.5**: 2-3 weeks (Integration)
- **Story 2.6-2.7**: 1-2 weeks (Production Readiness)
- **Total Epic 2**: 8-12 weeks
