- [x] Chuyển Version Archives sang tree view theo version và artifact, có expand/collapse, Latest badge và link metadata.

- [x] Prompt Overview tự đọc `dist/versions/index.json` để luôn dùng manifest version mới nhất.

- [x] Tạo trang `demo/versions.html` và gắn link từ sidebar/hero của `demo/index.html`.

- [x] Versioning: define release commands and immutable versioned build archives under `dist/versions/<version>/`.

- [x] Thu gọn agent documentation còn một manifest canonical theo version tại `dist/versions/<version>/kaui-agent-manifest.json`; release tự copy và cập nhật URL manifest.

- [x] Thêm prompt copyable trong Overview để AI agent sử dụng đúng KAUI CSS kit khi thiết kế frontend.
- [x] Thêm link live demo GitHub Pages vào Overview và Agent Prompt để tham khảo code mẫu trực tiếp.


- [x] Đồng bộ active sidebar button với URL hash khi load, click, hashchange và scroll.
- [x] Dark theme: làm đậm nền button menu sidebar active để tăng độ tương phản.
- [x] Dark theme: đồng bộ nền hover menu sidebar với nền active để trạng thái tương tác rõ ràng.
- [x] Dark theme: đổi nền row table khi hover sang primary-900 để tránh nền sáng chói và tăng tương phản.
- [x] Fix Dark theme table hover: override trực tiếp `tr:hover` và cell hover để loại bỏ nền primary-50 trắng chói, kể cả frozen cell.








- [x] Thêm link GitHub thật (`https://github.com/longbm64/kaui`) vào sidebar footer và cập nhật link GitHub cuối trang, mở tab mới an toàn.

- [x] Đổi nền nút mũi tên scroll từ trắng tinh sang trắng khói để giảm độ chói.

- [x] Căn cụm mũi tên scroll ở center-right, sắp xếp theo chiều dọc trên-dưới.

- [x] Ẩn hoàn toàn scrollbar native của sidebar nhưng giữ wheel/touch/keyboard scrolling.
- [x] Thêm overlay mũi tên lên/xuống khi hover/focus, tự ẩn mũi tên theo vị trí scroll và hỗ trợ click để cuộn theo bước.
- [x] Căn 2 mũi tên scroll vào chính giữa khung sidebar, giữ nguyên hướng cuộn lên/xuống.



- [x] Căn nút Copy code nằm ngang và thẳng hàng với label trong `.demo-form-label` (desktop giữ một hàng, mobile cho phép wrap).
- [x] Tăng nhẹ khoảng cách giữa label và control trong các component form của demo.
- [x] Xóa item `Select a country...` khỏi dropdown Country / Region và đặt Vietnam làm lựa chọn mặc định.
- [x] Quy định Dropdown có input search: không chọn mặc định bất kỳ item nào, toggle tự động hiển thị placeholder (`data-k-placeholder` hoặc suy ra từ input search), menu chỉ chứa các option thực sự và không chứa item placeholder.




- [x] Đưa nút Copy code từ tiêu đề section xuống cạnh label của từng form component trong `demo/index.html`.
- [x] Thêm snippet copy riêng cho từng form component và style responsive.
- [x] Chạy test suite và kiểm tra lại markup/CSS demo.

## Cập nhật đang thực hiện

- [x] Đưa nút Copy code từ tiêu đề section xuống cạnh label của từng form component trong `demo/index.html`.
- [x] Thêm snippet copy riêng cho từng form component và style responsive.
- [x] Chạy test suite và kiểm tra lại markup/CSS demo.


- [x] Chia sidebar thành 3 phần header/body/footer; header và footer cố định, body scroll độc lập.

# TODO — KAUI

## Phân tích

- Input, select và textarea bị giật khi nhận focus vì rule dùng `transition: all`.
- Thuộc tính layout và transform cũng bị animate khi trạng thái focus thay đổi.

## Giải pháp

- Giới hạn transition của các form control ở các thuộc tính màu sắc.
- Giữ focus ring, validation states và chữ ký class hiện có.

## Lộ trình

- [x] Xác định rule gây giật trong `src/scss/components/_form.scss`.
- [x] Thay `transition: all` bằng transition theo thuộc tính màu.
- [x] Xóa hiệu ứng transform khi bấm button và cập nhật test theo hành vi mới.

- [x] Build lại CSS và chạy test.

## Tồn đọng

- [!] Không có blocker.

## Button loading

- [x] Thêm `.k-btn__loader`, `.k-btn__icon`, `.k-btn__text`.
- [x] Thêm modifier `.k-btn--loading` và state alias `.is-loading`.
- [x] Build lại CSS và chạy 284 tests.

## Tài liệu hóa dự án (Kapul Docs)

## Single-page Component Showcase
- [x] Gộp toàn bộ showcase vào `demo/index.html` duy nhất và loại bỏ liên kết Extended bị hỏng.
- [x] Thêm sidebar dọc cố định bên trái để điều hướng component, responsive trên mobile.
- [x] Thêm trạng thái active, theme/language controls trong sidebar.
- [x] Chuẩn hóa icon giao diện bằng Lucide Icons từ `lucide.dev`.
- [x] Tăng độ tương phản text của demo/sidebar: dùng neutral-600 trên nền sáng và neutral-300 trên dark mode.
- [x] Override `.k-text-muted` trong demo bằng màu tương phản cao và tối ưu font rendering để chữ không bị mờ.
- [x] Vô hiệu hóa hiệu ứng lift/shadow khi hover card demo `Hover Me`, không thay đổi contract `.k-card--interactive` của core.
- [x] Thêm hỗ trợ icon chuẩn: Button (left/right qua `.k-btn__icon`), Input (left/right qua `.k-input-wrapper` và `.k-input__icon--left/--right`), Card (left icon qua `.k-card__icon`).
- [x] Tích hợp toàn diện các Extended Components vào showcase duy nhất (`demo/index.html`): Modal, Toast Notifications, Tabs, Accordion, và Feedback Indicators (Spinners, Progress, Skeleton, Avatar).
- [x] Thêm option vị trí cho Toast Notifications: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` (mặc định).
- [x] Đặt vị trí mặc định cho Toast Notifications là `top-right` (`.k-toast-container`).
- [x] Đồng bộ chuẩn hóa chiều cao (height/min-height) giữa các component điều khiển: `.k-btn`, `.k-input`, `.k-select` đạt chuẩn 42px (2.625rem) ở default, 32px (2rem) ở sm, 48px (3rem) ở lg.
- [x] Thêm `.k-toast__footer` và `.k-toast__time` vào SCSS cho Toast component.
- [x] Cập nhật markup Toast trong `demo/index.html` và script tạo toast trong `demo/demo.js` với footer thời gian tương đối ("bây giờ", "1 phút trước",...).
- [x] Build lại CSS (`npm run build && npm run build:extended`) và chạy toàn bộ test suite.
- [x] Thiết kế lại khu vực thời gian của Toast: loại bỏ đường phân cách dashed để hiển thị liền mạch ở bottom-left dưới body, giảm text size xuống nhỏ gọn (0.6875rem ~11px, opacity 0.85) và chuẩn hóa kích cỡ icon clock (12px).

- [x] Đảm bảo Toast mới nhất luôn được hiển thị ở trên cùng (top) của danh sách thông báo (`toastContainer.prepend(toast)`).
- [x] Thêm option tự động đóng (Auto-dismiss) và không tự động đóng (Persistent/Manual dismiss) cho Toast Notifications trong demo.
- [x] Chuyển đổi toàn bộ `<select>` nguyên bản thành giao diện Dropdown tùy chỉnh (`.k-dropdown.k-dropdown-select`), hỗ trợ tính toán lật hướng thông minh (auto-flip sang dropup nếu hẹp phía dưới, align-right nếu hẹp phía phải), đồng bộ giá trị với hidden select cho form validation.
- [x] Sửa lỗi che khuất dropdown menu bởi card (`overflow: hidden`): Thêm CSS rule `.k-card:has(.k-dropdown.is-open), .k-card:has(.k-popover.is-open), .k-card:has(.k-tooltip:hover) { overflow: visible; }` để card tự động mở overflow khi có dropdown mở bên trong.
- [x] Loại bỏ toàn bộ tiếng Việt và bộ chuyển ngôn ngữ (language switcher): Chuyển showcase sang 100% tiếng Anh chuẩn quốc tế, xóa translations và data-i18n, cập nhật các nhãn copy và toast time ("just now", "1 minute ago", "Copied!").



- [x] Thêm điều khiển UI (select auto-close: 3s, 5s, 10s hoặc đóng thủ công) và xử lý fade out + transform mượt mà khi đóng.
- [x] Cập nhật tài liệu `.kapul/PROJECT_CONTEXT.md` và kiểm tra toàn bộ test suite.


- [x] Tinh chỉnh bố cục Toast Notification: loại bỏ icon chiếm không gian lớn bên trái và thụt lề, chuyển icon trạng thái (check-circle-2) xuống nằm trước mốc thời gian ở bottom-left (`.k-toast__time`).


- [x] Thiết kế lại footer của Toast: xóa viền dashed, hiển thị thời gian ở bottom-left dưới dạng text nhỏ gọn (0.6875rem), icon đồng hồ nhỏ 12px tinh tế.
- [x] Khắc phục lỗi Modal Dialog bị overlay che mờ bóng đen: Thêm `position: relative` và `z-index: var(--k-z-modal, 1050)` cho `.k-modal__dialog`, giúp hộp thoại luôn nổi lên trên backdrop mờ (`.k-modal-backdrop` z-index 1040). Bổ sung animation mở mượt mà và đóng linh hoạt qua click outside và phím Escape.












## Nâng cấp tương tác Demo
- [x] Xóa hoàn toàn trang hướng dẫn riêng.
- [x] Thêm nút Copy nhỏ tại các header component (Buttons, Forms, Cards, Badges, Alerts, Layout) để sao chép code mẫu trực tiếp.

## KAUI Extended Package (v2)

- [x] Tạo bundle `kaui-extended.scss` cho component nâng cao, không làm phình bundle lõi.
- [x] Thêm script build cho `dist/kaui-extended.css` và `.min.css`.
[-] Thêm demo và kiểm tra contract cho component mở rộng (SCSS contract đã hoàn tất; demo đang chờ).
- [x] Xóa entry `src/scss/kaui-extended.scss`, các artifact `dist/kaui-extended*` và script build extended dư thừa; giữ partial source `src/scss/extended/` để bundle chính tiếp tục biên dịch component nâng cao.
- [x] Xóa entry `src/scss/kaui-extended.scss`, artifact `dist/kaui-extended*` và script build extended; giữ `src/scss/extended/` làm partial nội bộ cho bundle chính.


- [x] Thêm script `npm run serve:tailscale` bind `0.0.0.0:8080` để truy cập demo trong tailnet.

- [x] Hợp nhất core và extended components trong bundle duy nhất `dist/kaui.css` / `dist/kaui.min.css`; demo chỉ load một stylesheet.

- [x] Thêm component Confirm dựa trên Modal: style compact, icon/tone warning-danger-success-info, action Cancel/Confirm và demo tương tác click ngoài/Escape.
- [x] Thêm Lucide icons cho các nút Cancel/Publish/Delete ở footer của demo Confirm, dùng đúng `.k-btn__icon` và `.k-btn__text`.
- [x] Confirm mặc định dùng backdrop static: click ngoài và Escape không đóng; chỉ đóng bằng nút Cancel hoặc Confirm. Opt-in dismiss bằng `data-k-backdrop="true"`.
- [x] Thêm demo Dropdown Multi-select Notification Types với Email/SMS/Push/Webhook, toggle nhiều lựa chọn và đồng bộ hidden `<select multiple>`.
- [x] Đưa icon Confirm lên dòng riêng phía trên tiêu đề và nội dung, giữ nguyên footer actions.
- [x] Search dropdown không còn option mặc định được chọn: hiển thị placeholder `Select a country...` và chỉ chọn khi người dùng tìm/chọn kết quả; Show All Only vẫn giữ `All regions` làm default.
- [x] Thêm demo dropdown Show All Only không có input search, cấu hình bằng `data-k-show-all="true"`.
- [x] Xóa option `All` và option placeholder `Select country...` khỏi demo Search Country/Region; giữ demo Show All riêng với `All regions` làm lựa chọn mặc định.
- [x] Khắc phục lỗi CSS: Thêm rule `.k-dropdown__item[hidden] { display: none !important; }` để việc ẩn/hiện kết quả tìm kiếm hoạt động ngay lập tức trong browser.
- [x] Thêm điều hướng bàn phím cho Dropdown: `ArrowDown`/`ArrowUp` để di chuyển highlight qua danh sách lọc, `Enter` để chọn và `Escape` để đóng.
- [x] Căn giữa icon Confirm và tăng kích thước vòng icon lên 4rem, SVG lên 2rem.
- [x] Thêm demo Confirm Warning riêng với icon cảnh báo, action warning và xử lý mở/đóng độc lập.
- [x] Căn giữa toàn bộ nội dung Confirm (icon, title, message) và căn giữa các action buttons ở footer.
- [x] Đổi cấu hình Show all sang option code (`data-k-show-all="true"` hoặc `{ showAll: true }`), bỏ checkbox giao diện runtime và hỗ trợ bật đồng thời với Search.
- [x] Căn footer Confirm theo `space-between`: Cancel bên trái, action chính bên phải.
- [x] Thay ký tự `&times;` của nút đóng Modal header bằng Lucide icon `x`.
- [x] Sửa icon dấu hỏi của Confirm từ `help-circle` sang Lucide canonical `circle-help`.
- [x] Giữ Confirm static nhưng cho phép nhấn Escape để đóng và hiển thị trạng thái cancelled.
- [x] Căn thẳng hàng hoàn hảo nút đóng modal với tiêu đề và icon trong `.k-modal__header`.
- [x] Reset margin/line-height của title modal để nút close căn giữa đúng theo dòng title và icon header.
- [x] Thêm search input và option Show all cho dropdown Country/Region; hỗ trợ tiếng Việt không dấu, tìm kiếm nhiều từ khóa không theo thứ tự và match đủ toàn bộ từ khóa.

## Warm Color Palettes
- [x] Thêm palette amber (vàng → cam) và brown vào Sass color tokens, semantic aliases và CSS bundles.
- [x] Thêm swatches amber/brown vào demo Design Tokens và test contract cho token/alias mới.
- [x] Cập nhật README và PROJECT_CONTEXT; build main/extended bundles và chạy test suite.


## Table Component
- [x] Thêm component Table chuẩn hóa cho bundle lõi và extended.
- [x] Giữ contract class hiện có và loại bỏ định nghĩa table trùng trong extended.
- [x] Build CSS và chạy toàn bộ test suite.

## Table Demo
- [x] Thêm mục Table vào sidebar và showcase demo.
- [x] Thêm ví dụ default, striped/hover/bordered/compact, actions và empty state.
- [x] Thêm copy snippet cho Table và kiểm tra demo contract.

## Table Options
- [x] Thêm sort theo danh sách cột chỉ định.
- [x] Thêm freeze số cột đầu tiên.
- [x] Thêm search theo contract Unicode/multi-keyword của dropdown.
- [x] Cập nhật demo, CSS và chạy test suite.
- [x] Đưa button copy màu và mã hex về chung 1 dòng bằng `.demo-swatch-meta-row`, tiết kiệm chiều cao từng swatch.
- [x] Đồng bộ visual của button copy màu với `.demo-copy-button`: cùng font, padding, border, màu hover/copied, dark mode và icon sizing.




- [x] Hiển thị icon sort `arrow-up-down` trên header cột chỉ định, click để toggle `arrow-up`/`arrow-down` và sắp xếp dữ liệu.
- [x] Thêm button copy mã hex cho từng color swatch trong Color Palette, có feedback `Copied!` và fallback clipboard.

- [x] Sửa lỗi sort: không còn coi cell thiếu `data-k-sort-value` là số 0; hỗ trợ sort text đúng và giữ row no-results ở cuối.
- [x] Rà soát lại toàn bộ handler sort, sửa lỗi `ReferenceError` do event chưa truyền vào callback; dùng `table.tHead/tBodies` và event guard ổn định.
- [x] Đã sửa triệt để toggle đảo chiều sort 2 chiều (ascending <-> descending): click lần 1 sort tăng dần (icon `arrow-up`), click lần 2 đảo chiều giảm dần (icon `arrow-down`), click tiếp tục lặp lại chu kỳ đảo chiều mượt mà.






- [x] Khắc phục click Copy trên color swatch: bind `[data-copy-color]` vào clipboard helper, hiển thị `Copied!` và khôi phục label sau timeout.
- [x] Xóa hiệu ứng hover của color swatch và nút Copy mã màu, giữ trạng thái copied/focus cần thiết.


## Chart Component

## Chart demo copy actions
- [x] Thêm `Copy code` riêng cho Chart section, Line, Bar, Donut và Realtime demo.
- [x] Thêm snippet tương ứng vào `componentSnippets` và kiểm tra clipboard contract.

- [x] Thiết kế chart hybrid không dùng thư viện ngoài: native SVG + opt-in CSS/JS bundle.
- [x] Implement line, bar, donut renderer và API add/update/delete series/data.
- [x] Implement realtime `push`/`pushBatch`, RAF batching, sliding window, backpressure và pause/resume.
- [x] Thêm demo Charts với realtime traffic, bar chart, donut chart và controls.
- [x] Build chart artifacts, cập nhật test contract và chạy test suite.

