# House Price Prediction Demo

Ứng dụng web Flask cho phép nhập các thuộc tính nhà ở (Ames Housing) và dự đoán giá bằng mô hình Random Forest.

## Yêu cầu môi trường
- Python 3.9+
- Dataset `data/AmesHousing.csv` (đã có sẵn trong repo)
- Thư viện: `pip install -r requirements.txt`

## Cách chạy demo
1. Cài đặt phụ thuộc:
   ```bash
   pip install -r requirements.txt
   ```
2. Khởi động ứng dụng (tự động huấn luyện hoặc tải model đã lưu):
   ```bash
   python app.py
   ```
3. Mở trình duyệt tới `http://localhost:5000` và nhập các trường:
   - Gr_Liv_Area (diện tích sử dụng)
   - Overall_Qual (chất lượng tổng thể)
   - Garage_Cars (số chỗ để xe)
   - Total_Bsmt_SF (diện tích tầng hầm)
   - 1st_Flr_SF (diện tích tầng 1)
4. Nhấn **Dự đoán** để xem giá ước tính.

Model và scaler được lưu tại thư mục `models/` sau lần chạy đầu để sử dụng lại.
