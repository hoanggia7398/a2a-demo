### **Technology Stack Table (Bảng Công nghệ)**

| Hạng mục               | Công nghệ    | Phiên bản (Đề xuất) | Mục đích                                  | Lý do Lựa chọn                                  |
| :--------------------- | :----------- | :------------------ | :---------------------------------------- | :---------------------------------------------- |
| **Monorepo Tool**      | Turborepo    | ~1.13              | Quản lý kho code chung (monorepo)         | Tối ưu cho các dự án JavaScript/TypeScript.     |
| **Frontend Language**  | TypeScript   | ~5.4               | Ngôn ngữ phát triển chính cho frontend    | Tích hợp sẵn với Next.js, an toàn kiểu dữ liệu. |
| **Frontend Framework** | Next.js      | ~15.3.4              | Khung sườn chính để xây dựng giao diện    | Lựa chọn của bạn, hệ sinh thái mạnh mẽ.         |
| **UI Library**         | Tailwind CSS | ~3.4               | Cung cấp các lớp CSS tiện ích để tạo kiểu | Xây dựng giao diện nhanh, nhất quán.            |
| **UI Components**      | shadcn/ui    | ~0.8               | Bộ sưu tập các component giao diện        | Dễ cài đặt, tùy chỉnh, chuẩn truy cập.          |
| **State Management**   | Zustand      | ~4.5               | Quản lý trạng thái giao diện người dùng   | Nhẹ, đơn giản và hiệu quả cho demo.             |
| **Backend Language**   | TypeScript   | ~5.4               | Ngôn ngữ phát triển chính cho backend     | Đồng bộ ngôn ngữ với frontend.                  |
| **Backend Framework**  | Express.js   | ~4.19              | Tạo và quản lý các API endpoint           | Nhẹ, phổ biến, đủ mạnh mẽ cho backend.          |
| **API Style**          | JSON-RPC 2.0 | 2.0                 | Giao thức giao tiếp cho A2A               | Tuân thủ theo đặc tả của A2A.                   |
| **Database**           | SQLite       | ~5.1               | Lưu trữ dữ liệu đơn giản ở local          | Không cần cài đặt server, tiện cho demo.        |
| **Testing Framework**  | Jest & RTL   | ~29.7              | Viết và chạy unit test, component test    | Tiêu chuẩn trong hệ sinh thái React/Next.js.    |
| **Runtime**            | Node.js      | ~20.11 (LTS)       | Môi trường để chạy backend TypeScript     | Phiên bản ổn định (LTS).                        |
