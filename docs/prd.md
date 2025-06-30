# Product Requirements Document: Agent Flow

### **Mục tiêu và Bối cảnh**

#### **Mục tiêu (Goals)**

- Trình diễn thành công cho ban lãnh đạo về năng lực xây dựng hệ thống AI agentic của công ty.
- Cung cấp một công cụ demo trực quan, cho phép người dùng trải nghiệm quá trình phân tích yêu cầu tự động.
- Tạo ra một tài liệu dự án có cấu trúc tốt và hoàn chỉnh ngay trong phiên demo.

#### **Bối cảnh (Background Context)**

Dự án "Agent Flow" ra đời nhằm giải quyết những thách thức trong giai đoạn đầu của phát triển phần mềm: tốn thời gian và thiếu nhất quán trong việc tạo tài liệu yêu cầu. Bằng cách mô phỏng một quy trình làm việc do tác tử AI điều khiển và áp dụng các khái niệm từ giao thức A2A của Google, ứng dụng này sẽ cho thấy một phương pháp tiếp cận hiện đại, hiệu quả và tự động. Nó không chỉ là một sản phẩm demo, mà còn là một tuyên bố về định hướng chiến lược và năng lực công nghệ của chúng ta trong nền kinh tế agentic đang phát triển.

### **Yêu cầu (Requirements)**

#### **Yêu cầu Chức năng (Functional)**

- **FR1:** Hệ thống phải cung cấp một giao diện trò chuyện (chat) tập trung để người dùng **chỉ tương tác với Tác tử Điều phối (Orchestrator Agent)**, không trực tiếp giao tiếp với các tác tử chuyên biệt khác.
- **FR2:** Tác tử Điều phối phải có khả năng **tự động phân tích yêu cầu của người dùng** và **giao nhiệm vụ** (delegate tasks) cho các tác tử chuyên biệt phù hợp (PM, Analyst, Design) thông qua giao thức A2A.
- **FR3:** Hệ thống phải hiển thị **trực quan quá trình A2A** giữa Orchestrator và các tác tử chuyên biệt, bao gồm việc giao task, trao đổi artifacts, và báo cáo kết quả.
- **FR4:** Giao diện phải có một khu vực log hoặc chỉ báo trực quan để hiển thị **toàn bộ luốn A2A communication** giữa Orchestrator và các tác tử chuyên biệt.
- **FR5:** **Khi người dùng nhấp vào avatar hoặc tên của tác tử,** hệ thống phải hiển thị "Thẻ Tác tử" (Agent Card), bao gồm các thông tin chuẩn hóa như khả năng, nhà cung cấp và URL.
- **FR6:** Orchestrator Agent phải có khả năng **tổng hợp kết quả** từ các tác tử chuyên biệt và **trình bày lại cho người dùng** dưới dạng thống nhất và dễ hiểu.

#### **Yêu cầu Phi chức năng (Non-Functional)**

- **NFR1:** Luồng giao tiếp của tác tử phải được triển khai bằng cách sử dụng hoặc mô phỏng một cách trung thực giao thức Agent-to-Agent (A2A) của Google.
- **NFR2:** Ứng dụng web phải đáp ứng (responsive) trên các trình duyệt desktop hiện đại (Chrome, Firefox, Edge) **mà không xuất hiện thanh cuộn ngang và tất cả các yếu tố tương tác (nút bấm, ô nhập liệu) phải đầy đủ chức năng.**

### **Technical Assumptions (Các giả định về Kỹ thuật)**

- **Mô hình Tương tác Tác tử (Agent Interaction Model):** Hệ thống sẽ được xây dựng theo kiến trúc **Tập trung với Orchestrator** (Centralized Orchestration). Sẽ có **một điểm tương tác duy nhất** với người dùng thông qua Orchestrator Agent, sau đó Orchestrator sẽ tự động điều phối và giao nhiệm vụ cho các tác tử chuyên biệt khác (PM, Analyst, Design) thông qua **True A2A Communication**.
- **Transparency Model:** Người dùng sẽ có thể **quan sát** quá trình A2A diễn ra nhưng **không can thiệp trực tiếp** vào giao tiếp giữa các tác tử chuyên biệt.
- **Orchestrator Intelligence:** Orchestrator Agent phải có khả năng **phân tích ngữ cảnh** yêu cầu của người dùng và **tự động quyết định** workflow phù hợp cũng như thứ tự giao nhiệm vụ cho các tác tử.

### **Epics và User Stories**

#### **Epic 1: Xây dựng Nền tảng Demo "Digital Workbench"**

**Mục tiêu Epic:** Phát triển một ứng dụng web MVP mô phỏng "Bàn làm việc Kỹ thuật số", cho phép người dùng khởi tạo một quy trình và theo dõi trực quan cách một đội ngũ tác tử AI (PM, Analyst, Design) tự trị cộng tác, trao đổi tác vụ (Tasks) và hiện vật (Artifacts) qua A2A để tạo ra nhiều kết quả đầu ra.

#### **Story 1.1: Thiết lập Giao diện "Bàn làm việc Kỹ thuật số" (Workbench)**

- **As a** user,
- **I want** to see a main interface that visually represents a "workbench" with clearly defined areas for different AI agents (e.g., PM Agent, Analyst Agent, Design Agent),
- **so that** I can understand the layout of the multi-agent system.
- **Acceptance Criteria:**
  1.  Giao diện chính được chia thành các "khu vực" hoặc "thẻ" riêng biệt, mỗi khu vực có tên và biểu tượng của một tác tử (PM, Analyst, Design).
  2.  Có một khu vực chung để hiển thị log hoặc dòng chảy sự kiện của toàn hệ thống.
  3.  Giao diện có một nút hoặc ô nhập liệu ban đầu để người dùng khởi tạo một yêu cầu.

#### **Story 1.2: Tương tác Tập trung với Orchestrator Agent**

- **As a** user,
- **I want** to input requests directly to the Orchestrator Agent and see it automatically delegate tasks to specialist agents,
- **so that** I can experience seamless A2A workflow coordination without managing multiple conversations.
- **Acceptance Criteria:**
  1.  Người dùng chỉ tương tác với Orchestrator Agent thông qua một giao diện chat duy nhất.
  2.  Orchestrator tự động phân tích yêu cầu và giao nhiệm vụ cho PM Agent, sau đó chuyển đến Analyst Agent.
  3.  Hệ thống hiển thị trực quan quá trình A2A delegation và task transfer giữa các agent.
  4.  Orchestrator cung cấp feedback cho người dùng về tiến trình và kết quả của các tác tử chuyên biệt.

#### **Story 1.3: Trực quan hóa Luồng A2A Tự động và Artifact Generation**

- **As a** user,
- **I want** to see the Orchestrator Agent automatically coordinate with Analyst Agent to gather requirements and generate artifacts without my direct intervention,
- **so that** I can witness true autonomous A2A collaboration.
- **Acceptance Criteria:**
  1.  Orchestrator tự động giao nhiệm vụ requirements gathering cho Analyst Agent.
  2.  Analyst Agent tự động thực hiện phân tích và tạo ra artifacts (requirements.md) mà không cần tương tác trực tiếp với người dùng.
  3.  Hệ thống hiển thị trực quan việc artifact được tự động transfer từ Analyst sang Design Agent.
  4.  Khu vực log ghi lại đầy đủ quá trình A2A: `Orchestrator --> DELEGATE_TASK --> Analyst_Agent --> SENT_ARTIFACT (requirements.md) --> Design_Agent`.

#### **Story 1.4: Orchestrator Synthesis và Final Results**

- **As a** user,
- **I want** to see the Orchestrator Agent collect results from all specialist agents and present a unified final output,
- **so that** I receive a comprehensive solution without needing to understand the internal A2A processes.
- **Acceptance Criteria:**
  1.  Orchestrator tự động thu thập tất cả artifacts từ Analyst và Design Agents.
  2.  Orchestrator tổng hợp và trình bày kết quả cuối cùng cho người dùng trong chat interface.
  3.  Người dùng có thể download hoặc view tất cả artifacts được tạo ra trong quá trình A2A.
  4.  Orchestrator cung cấp summary về toàn bộ workflow đã thực hiện.
