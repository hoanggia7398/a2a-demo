### **Bản tóm tắt dự án (Project Brief): Agent Flow**

#### **Tóm tắt Nhanh**
"Agent Flow" là một ứng dụng web demo được thiết kế để trình diễn sức mạnh của các quy trình làm việc do tác tử AI điều khiển (agentic workflows). Người dùng sẽ tương tác với một Tác tử Phân tích AI chuyên biệt để cùng phân tích các yêu cầu và tự động tạo ra tài liệu dự án có cấu trúc. Giá trị cốt lõi của ứng dụng là mô phỏng cách Google A2A (Agent-to-Agent) có thể được ứng dụng để hợp lý hóa và tự động hóa các giai đoạn lập kế hoạch ban đầu trong phát triển phần mềm.

#### **Báo cáo Vấn đề**
Trong các dự án phần mềm, việc tạo ra các tài liệu yêu cầu (như PRD) một cách nhất quán, đầy đủ và rõ ràng tốn rất nhiều thời gian và đòi hỏi kỹ năng chuyên môn. Các đội nhóm thường gặp khó khăn trong việc chuyển đổi ý tưởng cấp cao thành các thông số kỹ thuật có thể hành động một cách hiệu quả. Các công cụ hiện tại chủ yếu là các trình soạn thảo văn bản thụ động, thiếu đi quá trình "tư duy" tương tác, có hướng dẫn mà một tác tử AI có thể cung cấp.

#### **Giải pháp Đề xuất (Cập nhật)**
Xây dựng một ứng dụng web mô phỏng "Bàn làm việc Kỹ thuật số" (Digital Workbench). Giao diện sẽ trực quan hóa một **hệ thống đa tác tử (Multi-Agent System - MAS)**, nơi người dùng có thể khởi tạo một yêu cầu và theo dõi nó được các tác tử AI chuyên biệt (ví dụ: Quản lý Dự án, Phân tích, Thiết kế) tự động xử lý và chuyển giao cho nhau thông qua giao thức A2A. Trọng tâm của demo là làm nổi bật **sự cộng tác tự trị** và **luồng công việc thông minh**, với các tài liệu và hiện vật được tạo ra là kết quả của quá trình đó.

#### **Đối tượng Người dùng**
* **Người dùng Chính (trong demo):** Các nhà quản lý dự án, chuyên viên phân tích nghiệp vụ, trưởng nhóm cần một công cụ để nhanh chóng tạo ra các tài liệu dự án được tiêu chuẩn hóa.
* **Đối tượng Xem Demo:** Ban lãnh đạo để trình diễn năng lực đổi mới của công ty về AI và các quy trình làm việc agentic.

#### **Mục tiêu & Thước đo Thành công**
* **Mục tiêu Kinh doanh:** Trình diễn thành công năng lực của công ty trong việc xây dựng hệ thống AI agentic cho ban lãnh đạo.
* **Thước đo Thành công của Người dùng:** Người dùng có thể tạo ra một tài liệu hoàn chỉnh, có cấu trúc tốt trong một phiên làm việc duy nhất (dưới 15 phút).

#### **Phạm vi MVP (Cập nhật)**
* **Tính năng 1 (Bàn làm việc Trực quan):** Thiết kế giao diện chính hiển thị các khu vực riêng biệt cho nhiều tác tử AI (PM, Analyst, Design Agent).
* **Tính năng 2 (Tương tác có Hướng dẫn):** Người dùng vẫn sẽ tương tác chính với "Tác tử Phân tích" qua chat để làm rõ các yêu cầu chi tiết.
* **Tính năng 3 (Trực quan hóa Luồng A2A):** Hệ thống phải hiển thị một cách rõ ràng (qua log, sơ đồ động) quá trình một tác tử gửi **Tác vụ (Task)** hoặc **Hiện vật (Artifact)** cho một tác tử khác.
* **Tính năng 4 (Tạo đa Hiện vật):** Các tác tử khác nhau có khả năng tự động tạo ra các loại hiện vật khác nhau để thể hiện sự chuyên môn hóa (ví dụ: Tác tử Phân tích tạo file `.md`, Tác tử Thiết kế có thể tạo ra một file ảnh `.png` sơ đồ).

#### **Ngoài Phạm vi MVP**
* Tương tác với nhiều tác tử khác nhau trong cùng một lúc.
* Lưu trữ và tải lại các phiên trò chuyện.
* Hệ thống tài khoản người dùng và xác thực.

#### **Cân nhắc Kỹ thuật**
* **Bắt buộc:** Phải sử dụng hoặc mô phỏng một cách rõ ràng giao thức A2A của Google để làm nổi bật mục tiêu của bản demo.
* **Frontend:** Giao diện web đơn giản, sạch sẽ (công nghệ cụ thể sẽ do Architect quyết định).