# KAUI — Technical Documentation (Tài liệu Kỹ thuật)

Tài liệu kỹ thuật chi tiết dành cho Developer và DevOps về kiến trúc, hợp đồng code và cách triển khai các component trong KAUI CSS Kit.

---

## 1. Tổng quan Kiến trúc

## Quy trình `#release`

Quy trình phát hành chuẩn được lưu tại [`.kapul/RELEASE_PROTOCOL.md`](../.kapul/RELEASE_PROTOCOL.md). Flow gồm bump version, build, test/verify, commit và push branch nguồn, merge/push branch `release`, rồi mới deploy. Không chạy trên `release`, không force-push và phải dừng khi có conflict.


KAUI là thư viện CSS/SCSS Kit hiện đại xây dựng trên Dart Sass, sử dụng kiến trúc phân tầng chuẩn:
1. **Base Layer:** `:root` biến CSS Custom Properties, reset, chuẩn hóa typography.
2. **Layout Layer:** Container, 12-column Grid, Flexbox helpers.
3. **Components Layer:** Buttons, Forms, Cards, Badges, Alerts, Navigation Bar.
4. **Utilities Layer:** Spacing, Display, Alignment, Text helpers.
5. **Extended UI Layer:** Modal, Toast, Tooltip, Tabs, Accordion, Table.

---

## 2. Navigation Bar (`.k-navbar`) & Multi-level Submenu

Component Navigation Bar cung cấp thanh điều hướng header responsive với khả năng mở rộng menu con đa cấp vô hạn (unlimited depth) và cơ chế hiển thị thông minh chống tràn mép màn hình.

### 2.1 Cấu trúc DOM chuẩn

```html
<header class="k-navbar k-navbar--expand-lg k-navbar--sticky k-navbar--shadow">
  <div class="k-navbar__container">
    <a href="#" class="k-navbar__brand">
      <span class="k-navbar__brand-mark"><i data-kaui-icon="layers"></i></span>
      <span>App Brand</span>
    </a>

    <!-- Nút Toggle Mobile -->
    <button type="button" class="k-navbar__toggle" aria-label="Toggle navigation" aria-controls="primary-nav" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <!-- Khung Menu chính -->
    <nav class="k-navbar__menu" id="primary-nav" aria-label="Primary navigation">
      <ul class="k-navbar__nav k-navbar__nav--scroll">
        <li><a href="#home" class="k-navbar__link is-active">Home</a></li>

        <!-- Menu con Level 1 -->
        <li class="k-navbar__item--has-children">
          <button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">
            Services <i data-kaui-icon="chevron-down"></i>
          </button>
          
          <ul class="k-navbar__submenu">
            <li><a href="#web" class="k-navbar__link">Web Dev</a></li>
            
            <!-- Menu con lồng tiếp Level 2 -->
            <li class="k-navbar__item--has-children">
              <button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">
                Mobile <i data-kaui-icon="chevron-right"></i>
              </button>
              
              <ul class="k-navbar__submenu">
                <li><a href="#ios" class="k-navbar__link">iOS</a></li>
                <li><a href="#android" class="k-navbar__link">Android</a></li>
                
                <!-- Menu con lồng tiếp Level 3 (vô hạn) -->
                <li class="k-navbar__item--has-children">
                  <button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">
                    Cross-Platform <i data-kaui-icon="chevron-right"></i>
                  </button>
                  <ul class="k-navbar__submenu">
                    <li><a href="#flutter" class="k-navbar__link">Flutter</a></li>
                    <li><a href="#rn" class="k-navbar__link">React Native</a></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <div class="k-navbar__actions">
        <button type="button" class="k-btn k-btn--sm k-btn--primary">Get Started</button>
      </div>
    </nav>
  </div>
</header>

### 2.2 Bảng phân loại Class & Modifier

| Class / Modifier | Vai trò kỹ thuật |
| :--- | :--- |
| `.k-navbar` | Container chính flexbox định vị thanh header |
| `.k-navbar__container` | Khung căn giữa với padding và dàn đều phần tử |
| `.k-navbar__brand` | Vùng thương hiệu, logo và tiêu đề ứng dụng |
| `.k-navbar__toggle` | Nút hamburger hiển thị trên mobile |
| `.k-navbar__menu` | Khung chứa danh sách liên kết và actions |
| `.k-navbar__nav` | Thẻ `<ul>` chứa danh sách liên kết |
| `.k-navbar__link` | Thẻ `<a>` hoặc `<button>` đại diện cho 1 liên kết |
| `.k-navbar__item--has-children` | Thẻ `<li>` chứa menu con |
| `.k-navbar__submenu` | Thẻ `<ul>` đại diện cho menu con đa cấp |
| `.k-navbar--sticky` | Dính cố định ở đầu trang (`position: sticky; top: 0`) |
| `.k-navbar--shadow` | Đổ bóng bề mặt (`box-shadow: var(--k-shadow-sm)`) |
| `.k-navbar--dark` | Giao diện tối (`--k-navbar-surface: #0f172a`) |
| `.k-navbar--compact` | Giảm chiều cao thanh điều hướng |
| `.k-navbar--expand-lg` | Chỉ mở rộng dạng desktop ở breakpoint `>= 1024px` |
| `.is-open` | Trạng thái mở của menu cha hoặc mobile drawer |
| `.is-dropup` | Tự động lật hướng mở lên trên khi thiếu chỗ bên dưới |
| `.is-dropstart` | Tự động lật hướng mở sang bên trái khi thiếu chỗ bên phải |

### 2.3 Nguyên lý hoạt động của Submenu thông minh

1. **Menu gốc (Root level):**
   - Mở theo hướng **trên - dưới**: Mặc định mở xuống dưới (`top: calc(100% + 8px)`).
   - Nếu gần đáy viewport: Tự gán `.is-dropup` để mở lên trên (`bottom: calc(100% + 8px)`).
2. **Menu lồng sâu (Nested levels 2, 3, 4,...):**
   - Mở theo hướng **ngang**: Mép trên `top: 0` luôn căn bằng phẳng với item cha.
   - Mặc định mở sang phải (`left: calc(100% + 12px)`).
   - Khi phát hiện mép phải màn hình không đủ chỗ: Tự động gán `.is-dropstart` (`right: calc(100% + 12px) !important; left: auto !important;`) để mở sang bên trái.
   - Mũi tên chevron tự động quay ngược 180 độ chỉ sang trái.
3. **Nguyên tắc mở 1 chiều nhất quán (Single-Direction Consistency):**
   - Nếu item cha đã xác định mở sang trái thì mọi menu con cháu bên trong bắt buộc kế thừa mở tiếp sang trái, loại bỏ hoàn toàn hiện tượng gập ngược zig-zag đè lên cha.
4. **Cơ chế Click-only & Cascade Close:**
   - Tránh hoàn toàn xung đột hover: Bấm vào nút cha thì menu con mới mở và đứng yên.
   - Bấm đóng ở cha hoặc root: Toàn bộ cây con cháu bên dưới được đóng đệ quy sạch sẽ (`closeChildBranches`).
   - Bấm ra ngoài (Outside click) hoặc phím `Escape`: Đóng toàn bộ menu ngay lập tức.

```
