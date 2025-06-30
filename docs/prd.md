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

- **FR1:** Hệ thống phải cung cấp một giao diện trò chuyện (chat) để người dùng có thể tương tác (gửi/nhận tin nhắn) với tác tử AI.
- **FR2:** Tác tử AI phải có khả năng dẫn dắt người dùng thông qua một chuỗi các câu hỏi có cấu trúc để thu thập thông tin **nhằm hoàn thành một loại tài liệu cụ thể (ví dụ: Bản tóm tắt dự án).**
- **FR3:** Hệ thống phải **cập nhật và hiển thị lại** tài liệu (dạng markdown) sau mỗi lần người dùng trả lời một câu hỏi của tác tử.
- **FR4:** Giao diện phải có một khu vực log hoặc chỉ báo trực quan để mô phỏng các thông điệp và hiện vật (artifacts) đang được trao đổi theo giao thức A2A.
- **FR5:** **Khi người dùng nhấp vào avatar hoặc tên của tác tử,** hệ thống phải hiển thị "Thẻ Tác tử" (Agent Card), bao gồm các thông tin chuẩn hóa như khả năng, nhà cung cấp và URL.
- **FR6:** Hệ thống phải cho phép người dùng (hoặc quản trị viên) có khả năng nạp (load) hoặc thay đổi prompt/hướng dẫn lõi cho tác tử AI một cách linh hoạt, cho phép thay đổi hành vi hoặc vai trò của tác tử.

#### **Yêu cầu Phi chức năng (Non-Functional)**

- **NFR1:** Luồng giao tiếp của tác tử phải được triển khai bằng cách sử dụng hoặc mô phỏng một cách trung thực giao thức Agent-to-Agent (A2A) của Google.
- **NFR2:** Ứng dụng web phải đáp ứng (responsive) trên các trình duyệt desktop hiện đại (Chrome, Firefox, Edge) **mà không xuất hiện thanh cuộn ngang và tất cả các yếu tố tương tác (nút bấm, ô nhập liệu) phải đầy đủ chức năng.**

### **Technical Assumptions (Các giả định về Kỹ thuật)**

- **Mô hình Tương tác Tác tử (Agent Interaction Model):** Hệ thống sẽ được xây dựng theo kiến trúc **Tập trung (Phân cấp - Hierarchical)**. Sẽ có một tác tử chính ("lãnh đạo" hoặc "giám sát") chịu trách nhiệm lập kế hoạch, điều phối và giao nhiệm vụ cho các tác tử chuyên biệt khác ("cấp dưới" hoặc "công nhân").

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

#### **Story 1.2: Bắt đầu Tương tác với Tác tử Phân tích (Analyst Agent)**

- **As a** user,
- **I want** to input a high-level request and see it being assigned to the Analyst Agent to start the conversation,
- **so that** I can begin the requirement clarification process.
- **Acceptance Criteria:**
  1.  Khi người dùng nhập yêu cầu và gửi đi, một "Tác vụ" mới sẽ xuất hiện trong khu vực của Tác tử Quản lý Dự án (PM Agent).
  2.  Hệ thống hiển thị trực quan việc Tác vụ này được chuyển từ PM Agent sang Analyst Agent.
  3.  Khu vực chat của Analyst Agent trở nên hoạt động, và tác tử này sẽ gửi tin nhắn đầu tiên để bắt đầu làm rõ yêu cầu với người dùng.

#### **Story 1.3: Trực quan hóa Luồng giao tiếp A2A và Hiện vật (Artifact)**

- **As a** user,
- **I want** to see a visual representation of the Analyst Agent creating and handing off a document artifact to the Design Agent,
- **so that** I can understand the A2A collaboration process.
- **Acceptance Criteria:**
  1.  Sau khi cuộc trò chuyện với người dùng kết thúc, Analyst Agent tạo ra một "Hiện vật" (Artifact) là một tài liệu markdown.
  2.  Hiện vật này xuất hiện trong khu vực của Analyst Agent.
  3.  Hệ thống hiển thị trực quan việc Hiện vật được gửi từ Analyst Agent sang Design Agent.
  4.  Khu vực log chung ghi lại sự kiện: `Analyst_Agent --> SENT_ARTIFACT (requirements.md) --> Design_Agent`.

#### **Story 1.4: Tác tử Tự trị Hoạt động và Tạo Kết quả**

- **As a** user,
- **I want** to see the Design Agent autonomously work on the received artifact and produce its own output,
- **so that** I can witness the power of specialized, independent agents.
- **Acceptance Criteria:**
  1.  Sau khi nhận hiện vật, khu vực của Design Agent hiển thị trạng thái "đang xử lý" (ví dụ: loading spinner).
  2.  Sau một khoảng thời gian ngắn, Design Agent tạo ra một hiện vật mới (ví dụ: một file ảnh sơ đồ kiến trúc).
  3.  Hiện vật mới này xuất hiện trong khu vực của Design Agent.
