# KAUI — User Guide & QA Testing (Tài liệu Người dùng cuối)

Tài liệu hướng dẫn sử dụng và kiểm thử tính năng Navigation Bar đa cấp thông minh trong KAUI CSS Kit.

---

## 1. Giới thiệu Tính năng

## Phát hành phiên bản bằng `#release`

Maintainer chạy `#release` hoặc `npm run release` từ `main`/feature branch sạch. Hệ thống sẽ tự tăng version, build, kiểm thử, merge sang `release` và deploy sau cùng. Không tự ý chạy khi còn thay đổi chưa commit; xem quy trình copy đầy đủ tại [`.kapul/RELEASE_PROTOCOL.md`](../.kapul/RELEASE_PROTOCOL.md).


Navigation Bar (`.k-navbar`) là thanh điều hướng tiêu chuẩn nằm ở đầu trang web hoặc ứng dụng. Component hỗ trợ:
- Điều hướng đa cấp không giới hạn (menu cha, con, cháu,...).
- Tự động đổi hướng mở thông minh khi menu chạm mép màn hình.
- Tự động tương thích hoàn hảo trên cả máy tính (Desktop) và điện thoại (Mobile).

---

## 2. Cách Sử dụng trên Giao diện

### 2.1 Mở và Đóng Menu Con
- **Mở menu con:** Nhấp chuột vào nút menu có biểu tượng mũi tên (ví dụ: `Components` hoặc `Edge test`). Menu con sẽ mở ra ngay lập tức và đứng yên cố định để bạn dễ dàng lựa chọn.
- **Mở menu con cấp sâu hơn:** Nhấp chuột tiếp vào mục con (ví dụ: `Advanced` hoặc `Level 3`). Menu con cấp tiếp theo sẽ mở ra ngang hàng.
- **Đóng menu:**
  - Nhấp chuột lại vào nút cha đang mở để đóng menu đó và toàn bộ menu con bên trong.
  - Hoặc nhấp chuột vào bất kỳ khoảng trống nào bên ngoài (Outside click).
  - Hoặc nhấn phím `Escape` trên bàn phím.

### 2.2 Hiển thị Thông minh Chống Tràn Màn hình
- Nếu menu nằm ở nửa bên phải màn hình (như mục `Edge test`): Menu con sẽ tự động mở lật về phía **bên trái** để không bị che khuất hoặc tràn khỏi màn hình.
- Mũi tên chỉ hướng sẽ tự động quay theo hướng mở của menu.
- Tất cả các cấp con bên trong sẽ tiếp tục mở đều về một chiều duy nhất, không bị gập chéo đè lên nhau.

### 2.3 Sử dụng trên Thiết bị Di động (Mobile)
- Bấm vào nút 3 gạch (Hamburger icon) ở góc trên để mở ngăn kéo menu.
- Các menu con sẽ xếp theo dạng dọc (Accordion). Bấm vào mục nào thì danh sách con bên dưới sẽ trượt mở ra.

---

## 3. Checklist Kiểm thử Dành cho QA / Tester

| STT | Kịch bản kiểm thử | Thao tác thực hiện | Kết quả mong đợi |
| :--- | :--- | :--- | :--- |
| 1 | Mở menu cấp 1 | Click vào nút `Components` trên Navbar | Menu `Buttons` và `Advanced` mở xuống dưới, nút cha đổi màu nền nhẹ |
| 2 | Mở menu cấp 2 | Click tiếp vào `Advanced` | Menu `Tables` và `Charts` mở sang phải, top bằng với `Advanced` |
| 3 | Đóng menu cha | Click lại vào nút `Components` | Toàn bộ menu `Components`, `Advanced`, `Tables` đều đóng sạch |
| 4 | Kiểm thử lật trái | Click vào `Edge test` ở góc phải, mở tiếp `More levels` -> `Level 3` -> `Level 4` | Toàn bộ các cấp menu tự động mở lật sang bên trái, không bị tràn màn hình |
| 5 | Outside click | Mở menu bất kỳ, sau đó click chuột ra vùng trắng giữa màn hình | Toàn bộ menu đang mở lập tức đóng lại |
| 6 | Phím Escape | Mở menu bất kỳ, nhấn phím `Esc` trên bàn phím | Menu lập tức đóng lại |
| 7 | Kiểm tra Mobile | Thu nhỏ trình duyệt dưới 768px, bấm nút 3 gạch | Ngăn kéo mở ra từ cạnh trái, menu con mở theo chiều dọc mượt mà |
