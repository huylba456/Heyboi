# 🧪 Đồ án môn Kiểm thử phần mềm (KTPM)

Repository này được sử dụng để quản lý mã nguồn, tài liệu và tiến độ làm **Đồ án môn Kiểm thử phần mềm** của nhóm gồm **4 thành viên**.  
Mục tiêu là thực hành các kỹ thuật kiểm thử, xây dựng test case và rèn luyện kỹ năng làm việc nhóm.

---

## 👥 Thành viên nhóm & Vai trò

| Họ và tên              | MSSV       | Vai trò chính       | Vai trò phụ             | Nhiệm vụ |
|------------------------|------------|---------------------|-------------------------|---------------------------------------------------|
| **Lý Kim Thúy**        | 3122411199 | Backend Developer   | Leader / Tester         | Quản lý nhóm, thiết kế kiến trúc, phát triển API, hỗ trợ viết test API |
| **Tô Thảo Nhi**        | 3122411139 | Tester              | Frontend Developer      | Viết & chạy test case, kiểm thử giao diện, hỗ trợ phát triển UI |
| **Đỗ Gia Huy**         | 3122411062 | Tester              | BA / Document Writer    | Thiết kế test scenario, test plan, viết báo cáo kiểm thử, phân tích yêu cầu |
| **Nguyễn Võ Minh Hiếu**| 3122411057 | Frontend Developer  | Tester                  | Phát triển giao diện, kiểm thử chức năng, hỗ trợ viết test case |

---


## 🎯 Mục tiêu môn học
- Hiểu và áp dụng **các mức kiểm thử**: Unit test, Integration test, System test, Acceptance test.  
- Thực hành **kiểm thử hộp đen, hộp trắng**.  
- Thiết kế **test case, test scenario, test plan**.  
- Sử dụng công cụ hỗ trợ kiểm thử (JUnit, Selenium, Postman, …).  
- Báo cáo kết quả kiểm thử và đánh giá chất lượng phần mềm.  

---

## 🛠 Công nghệ & Công cụ dự kiến
- **Ngôn ngữ lập trình**: JavaScript
- **Backend**: Node.js
- **Frontend**: ReactJS
- **Cơ sở dữ liệu**: MySQL
- **Công cụ kiểm thử**: Postman

---

## 📄 Tài liệu workflow
- **workflow/apple_store/**: thư mục chứa toàn bộ nội dung OpenXML của file workflow (thay vì commit nhị phân `AppleStore Workflow.xlsx`). Các chuỗi và data được map trong `xl/sharedStrings.xml` và `xl/worksheets/sheet1.xml`.
  - **Flow 1 – Guest browses catalog và checkout**: hành trình mua hàng từ trang chủ, tìm kiếm/sort, xem chi tiết, thêm vào giỏ, đăng nhập/đăng ký, nhập giao hàng/thanh toán và nhận xác nhận đơn.
  - **Flow 2 – Admin manages catalog**: đăng nhập admin, tạo/chỉnh sửa sản phẩm, upload media, publish và xác nhận storefront đã cập nhật.
  - **Flow 3 – Order fulfillment and inventory sync**: nhận đơn, giữ hàng, xác nhận thanh toán, đóng gói, cập nhật tracking và chuyển trạng thái giao hàng.

### Cách đóng gói lại file Excel
Bạn có thể build lại file `.xlsx` ngay trong VS Code hoặc bất kỳ terminal nào:

1. **Dùng Python (mọi hệ điều hành):**
   ```bash
   python workflow/build_apple_store_workflow.py
   ```
   Thao tác này không cần quyền thực thi `.sh`, phù hợp cho VS Code trên Windows/máy không cài bash.

2. **Dùng script bash (Linux/macOS hoặc WSL/Git Bash trên Windows):**
   ```bash
   ./workflow/build_apple_store_workflow.sh
   ```

3. Nếu cần sửa nội dung bước, cập nhật text trong `xl/sharedStrings.xml` và ô tham chiếu tại `xl/worksheets/sheet1.xml` rồi chạy lại một trong hai lệnh ở trên.

> Lý do: GitHub hạn chế xem diff với file nhị phân nên nội dung được lưu dạng OpenXML để dễ review, còn script sẽ tạo lại file `.xlsx` hoàn chỉnh khi cần. Để tránh cảnh báo binary khi mở PR, gói này không nhúng hình ảnh; nếu cần tham khảo mock hoặc wireframe, hãy lưu riêng bên ngoài file workflow.
