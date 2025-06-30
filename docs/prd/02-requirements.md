### **Yêu cầu (Requirements)**

#### **Yêu cầu Chức năng (Functional)**

* **FR1:** Hệ thống phải cung cấp một giao diện trò chuyện (chat) để người dùng có thể tương tác (gửi/nhận tin nhắn) với tác tử AI.
* **FR2:** Tác tử AI phải có khả năng dẫn dắt người dùng thông qua một chuỗi các câu hỏi có cấu trúc để thu thập thông tin **nhằm hoàn thành một loại tài liệu cụ thể (ví dụ: Bản tóm tắt dự án).**
* **FR3:** Hệ thống phải **cập nhật và hiển thị lại** tài liệu (dạng markdown) sau mỗi lần người dùng trả lời một câu hỏi của tác tử.
* **FR4:** Giao diện phải có một khu vực log hoặc chỉ báo trực quan để mô phỏng các thông điệp và hiện vật (artifacts) đang được trao đổi theo giao thức A2A.
* **FR5:** **Khi người dùng nhấp vào avatar hoặc tên của tác tử,** hệ thống phải hiển thị "Thẻ Tác tử" (Agent Card), bao gồm các thông tin chuẩn hóa như khả năng, nhà cung cấp và URL.
* **FR6:** Hệ thống phải cho phép người dùng (hoặc quản trị viên) có khả năng nạp (load) hoặc thay đổi prompt/hướng dẫn lõi cho tác tử AI một cách linh hoạt, cho phép thay đổi hành vi hoặc vai trò của tác tử.

#### **Yêu cầu Phi chức năng (Non-Functional)**

* **NFR1:** Luồng giao tiếp của tác tử phải được triển khai bằng cách sử dụng hoặc mô phỏng một cách trung thực giao thức Agent-to-Agent (A2A) của Google.
* **NFR2:** Ứng dụng web phải đáp ứng (responsive) trên các trình duyệt desktop hiện đại (Chrome, Firefox, Edge) **mà không xuất hiện thanh cuộn ngang và tất cả các yếu tố tương tác (nút bấm, ô nhập liệu) phải đầy đủ chức năng.**
