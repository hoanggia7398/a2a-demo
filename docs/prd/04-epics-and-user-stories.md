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
