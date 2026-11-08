- [x] Chuẩn bị package Flutter public với tên `kaui`: thêm metadata GitHub, LICENSE MIT, CHANGELOG và README cài đặt; giữ `publish_to: none` cho tới khi chủ động publish.

- [x] Bar Chart: gắn label giá trị trên từng cột (`.k-chart__bar-label`) và label danh mục (`.k-chart__bar-category`), tương tự label của Donut Chart.
- [x] Line Chart: thêm nhãn trục X theo `labels[]`, căn theo vị trí các điểm và dùng style axis chung.
- [x] Fix realtime Line Chart trục X: giới hạn tối đa 8 nhãn, giữ nhãn đầu/cuối và format timestamp thành `HH:mm:ss` để không chồng chữ.
- [x] Line Chart trục X: khi > 8 điểm (như realtime), tự động xoay nghiêng nhãn -45° và căn anchor để hiển thị đầy đủ mọi giá trị mà không đè lên nhau.
- [x] Tối ưu Line Chart X-axis: quyết định xoay ngay từ lần render đầu dựa trên độ dài nhãn và khoảng cách mốc; giữ mọi nhãn căn giữa đúng vị trí để trục hiển thị đều.
- [x] Điều chỉnh Line X-axis label xoay: khi xoay -45°, dùng `text-anchor="end"` để mốc dữ liệu nằm tại điểm đích/cuối của label; label ngang vẫn căn giữa.












- [x] Chuyển danh sách Version Archives sang Accordion Component chuẩn KAUI (`.k-accordion`, `.k-accordion__item`, `.k-accordion__trigger`, `.k-accordion__body`) với toggle và ARIA state.


- [x] Đồng bộ sidebar trang Version Registry với sidebar dùng chung của các demo page, dùng `demo.js` và icon registry KAUI thay cho Lucide CDN.


- [x] Dọn hero trang Version Registry: xóa badge Latest, tiêu đề, mô tả và hai nút hành động; giữ lại khu vực Version Archives.




- [x] Thêm menu đa cấp cho Navigation Bar: submenu lồng nhau, flyout desktop, xếp dọc mobile, click toggle sibling và ARIA state.

- [x] Làm lại visual Navigation Bar theo component KAUI: brand icon, active pill, dropdown icon, button anatomy và mobile offcanvas gọn hơn.

- [x] Chuẩn hóa chiều cao cố định cho `.k-card__header` và `.k-card__footer` bằng token nội bộ, ngăn nội dung/badge/button làm các card trong cùng hàng bị lệch chiều cao.
- [x] Thu gọn chiều cao card header/footer xuống `3.5rem` và giảm padding còn `spacing-3`, vẫn đủ chỗ cho title, badge và nút sm.



- [x] Nâng cấp Navigation Bar theo pattern Bootstrap 5: expand breakpoint, fixed placement, offcanvas mobile, navbar text/scroll và dropdown click + ARIA.

- [x] Nâng cấp Navigation Bar: thêm modifier sticky/borderless/shadow/transparent/dark/compact/centered, nhóm actions và submenu responsive.

- [x] Bổ sung hướng dẫn sử dụng và code mẫu trực tiếp cho toàn bộ 16 component pages (`tokens`, `navbar`, `layout`, `button`, `forms`, `charts`, `icons`, `card`, `badges`, `alerts`, `modal`, `table`, `toast`, `tabs`, `accordion`, `indicators`); mỗi page có nút copy snippet riêng và mapping `guide-*` trong `demo/demo.js`.

- [x] Fix Icon Gallery rendering on `demo/index.html`: load generated icon CSS and render a local fallback when JSON fetch is blocked by `file://` browsing.
- [x] Thêm nhóm Social KAUI gồm 16 icon original: Zalo, Facebook, Threads, Telegram, Instagram, YouTube, TikTok, LinkedIn, X, WhatsApp, Discord, GitHub, Reddit, WeChat, Share và Community.

- [x] Tạo Phase 1 KAUI Core registry gồm 32 glyph mới dưới `icons/source/kaui/`, metadata ownership KAUI, core sprite/CSS/JSON và build command riêng.
- [x] Xóa hoàn toàn third-party icon source/license/artifacts khỏi workspace; registry chính chỉ build từ `icons/source/kaui/` và không chứa dependency bên thứ ba.


- [x] Mở rộng bộ icon KAUI bằng 35 glyph mới thuộc các nhóm Media, Layout, Device, Commerce, Navigation và Security; production registry đạt 67 icon KAUI-owned.
- [x] Xóa các TODO lịch sử mô tả third-party-derived registry sau khi chuyển production registry sang 67 icon KAUI-owned.


- [x] Chuẩn hóa hover Hero buttons theo Button component KAUI: dùng `.k-btn__text`, `.k-btn__icon`, `k-btn--primary` và `k-btn--outline-primary`, không override hover riêng.
- [x] Fix Hero `.k-btn` link hover text disappearing: Button component now explicitly preserves `--k-btn-color` on hover/active, overriding global anchor color rules safely.
- [x] Sửa Icon Gallery card theo hàng ngang: icon + tên canh trái, nút Copy canh phải; override `.k-card` column layout bằng selector `.k-card.demo-icon-card`.

- [x] Hiển thị Icon Gallery theo nhóm chức năng, có tiêu đề và số lượng icon mỗi nhóm, giữ nguyên copy SVG từng icon.



- [x] Thu gọn Icon Gallery thành card ngang (icon + tên + Copy) và thêm nút copy snippet SVG riêng cho từng icon.

- [x] Đồng bộ màu icon KAUI theo màu chữ của phần tử chứa bằng `color: inherit`; loại bỏ màu primary ép riêng cho sidebar/section title.

- [x] Fix runtime initialization order: `renderKauiIcons()` now safely no-ops before the KAUI icon registry is initialized, preventing `Cannot read properties of undefined` during early table setup.

- [x] Fix external SVG sprite `<use>` visibility by rendering registered icon paths inline in gallery cards, with sprite fetch retained for live-server compatibility.


- [x] Thêm Icon Gallery vào demo, render icon từ manifest/sprite và link trực tiếp artifact icon.

- [x] Hiển thị roadmap/platform packages, token/icon commands và commercial compliance trực tiếp trong `demo/index.html` với nút copy.

- [x] Triển khai toàn diện M1–M12: Audit license (`THIRD_PARTY_NOTICES.md`, `npm run audit:license`), Release verification (`npm run verify:release`), Tokens multi-output (`npm run tokens:build`), KAUI icons (`npm run icons:build`), Package contracts (`packages/npm`, `packages/pub`); Android/iOS native packages are paused.

- [x] License/dependency audit: thêm `THIRD_PARTY_NOTICES.md`, script `npm run audit:license`, và kiểm tra artifact/license contract theo version.

- [x] Tạo token registry `tokens/kaui.tokens.json` và lệnh `npm run tokens:verify` để kiểm tra token với CSS output, chuẩn bị export đa nền tảng.

- [x] Đặt email liên hệ cấp phép thương mại là `contact@filekat.com` trong `COMMERCIAL_LICENSE.md`, manifest và release automation.

- [x] Tạo `NON_COMMERCIAL_LICENSE.md`, `COMMERCIAL_LICENSE.md` và release automation chuyển license từ MIT ở `1.0.x` sang Non-Commercial từ `1.1.0+`.

- [x] Chốt license chuyển tiếp: `1.0.x` giữ MIT; từ `1.1.0+` chuyển Non-Commercial, cho phép học tập/nghiên cứu/dự án cá nhân và cấm commercial use nếu chưa được cấp phép bằng văn bản.

- [x] Gộp icon CSS vào bundle chính: `import 'kaui'` tự có component CSS và icon CSS, không cần entrypoint icon riêng.

- [x] Tăng size header brand sidebar: KAUI lên 1.75rem, CSS KIT lên 0.8rem và đưa lên nằm cùng dòng (inline-flex baseline).

- [x] Chuẩn hóa live demo URL thành `https://longbm64.github.io/kaui/demo` không có dấu slash cuối.

- [x] Sửa prompt: sau khi đọc latest từ index.json, truy cập trực tiếp file `kaui-agent-manifest.json` của phiên bản mới nhất đó (không còn URL cứng).

- [x] Mỗi file trong `dist/versions/index.json` được chuyển thành URL hoàn chỉnh có thể truy cập trực tiếp nội dung; xóa section nhắc lại manifest dư thừa bên dưới.

- [x] Xóa dòng mô tả dư phía trên Agent Prompt để giao diện Overview gọn hơn.

- [x] Version Registry chỉ hiển thị ngày theo `yyyy/MM/dd`, không hiển thị giờ.

- [x] Chuẩn hóa thời gian Version Registry về `yyyy/MM/dd` (không hiển thị giờ).

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

- [x] Sidebar tự cuộn menu trái để item đang active luôn nằm trong vùng nhìn thấy khi load trang, đổi hash hoặc scroll section.

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
- [x] Căn giữa text Donut compact: path label đối xứng quanh tâm cung, `textPath` dùng `startOffset=50%`, `text-anchor=middle` và hỗ trợ `xlink:href`.

- [x] Sửa Chart opt-in runtime: fallback animation frame khi môi trường thiếu `requestAnimationFrame`, tạo series mặc định khi không truyền dataset, và cleanup đầy đủ listener khi destroy.
- [x] Đưa Donut compact label vào centerline của vùng màu: textPath chạy ở bán kính `r` thay vì sát mép ngoài, giữ căn giữa từng lát.

- [x] Donut Chart: thêm dot marker, leader line và label giá trị/phần trăm bên ngoài từng cung.
- [x] Donut label layout v2: tính chiều rộng label, dot đặt theo từng cột riêng, khoảng cách Y adaptive và leader line 3 điểm theo radial anchor để tránh dính/chồng chữ.
- [x] Donut fallback khi chart hẹp: chuyển label vào trong vùng Donut, canh giữa theo cung và bám theo cạnh vòng bằng SVG textPath.


- [x] Donut labels thông minh theo vùng: phân loại trái/phải, dàn đều trục Y, tự né chồng lấn và giữ text trong biên SVG bằng leader line gấp khúc.
- [x] Tối ưu Donut layout: bổ sung điểm nối elbow radial (4-point leader), thuật toán relax trục Y hai chiều tránh dính chùm, và thêm halo stroke cho label tránh bị đường vẽ cắt qua.






- [x] Sửa demo Modal không mở được: bổ sung đầy đủ markup cho interactive modal và ba confirm dialog đúng các ID mà `demo/demo.js` bind listener.

## Button loading

- [x] Thêm `.k-btn__loader`, `.k-btn__icon`, `.k-btn__text`.
- [x] Thêm modifier `.k-btn--loading` và state alias `.is-loading`.
- [x] Build lại CSS và chạy 284 tests.
- [x] Bổ sung code mẫu loading button vào guide Buttons, kèm nút copy snippet và cập nhật mô tả markup đúng contract.


## Tài liệu hóa dự án (Kapul Docs)

## Single-page Component Showcase
- [x] Gộp toàn bộ showcase vào `demo/index.html` duy nhất và loại bỏ liên kết Extended bị hỏng.
- [x] Thêm sidebar dọc cố định bên trái để điều hướng component, responsive trên mobile.
- [x] Thêm trạng thái active, theme/language controls trong sidebar.
- [x] Thay toàn bộ icon demo/version bằng icon nội bộ KAUI, không dùng thư viện hoặc CDN bên ngoài.

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
- [x] Thêm icon KAUI cho các nút Cancel/Publish/Delete ở footer của demo Confirm, dùng đúng `.k-btn__icon` và `.k-btn__text`.
- [x] Confirm mặc định dùng backdrop static: click ngoài và Escape không đóng; chỉ đóng bằng nút Cancel hoặc Confirm. Opt-in dismiss bằng `data-k-backdrop="true"`.
- [x] Thêm demo Dropdown Multi-select Notification Types với Email/SMS/Push/Webhook, toggle nhiều lựa chọn và đồng bộ hidden `<select multiple>`.
- [x] Đưa icon Confirm lên dòng riêng phía trên tiêu đề và nội dung, giữ nguyên footer actions.
- [x] Search dropdown không còn option mặc định được chọn: hiển thị placeholder `Select a country...` và chỉ chọn khi người dùng tìm/chọn kết quả; Show All Only vẫn giữ `All regions` làm default.
- [x] Thêm demo dropdown Show All Only không có input search, cấu hình bằng `data-k-show-all="true"`.
- [x] Xóa option `All` và option placeholder `Select country...` khỏi demo Search Country/Region; giữ demo Show All riêng với `All regions` làm lựa chọn mặc định.
- [x] Khắc phục lỗi CSS: Thêm rule `.k-dropdown__item[hidden] { display: none !important; }` để việc ẩn/hiện kết quả tìm kiếm hoạt động ngay lập tức trong browser.
- [x] Thêm điều hướng bàn phím cho Dropdown: `ArrowDown`/`ArrowUp` để di chuyển highlight qua danh sách lọc, `Enter` để chọn và `Escape` để đóng.
- [x] Căn giữa icon Confirm và tăng kích thước vòng icon lên 4rem, SVG lên 2rem.

- [x] Phân loại sidebar menu theo nhóm Getting Started, Layout, Components và Resources trên toàn bộ demo pages; giữ nguyên link và active state.
- [x] Điều chỉnh taxonomy sidebar: đưa Cards, Badges, Alerts, Modal, Table, Toast, Tabs, Accordion, Indicators và Charts vào nhóm Components; Resources chỉ còn Icons, Versions và Platforms.
- [x] Khắc phục active menu sidebar trên multi-page demo: runtime xác định trang hiện tại bằng `window.location.pathname`, không để xử lý hash xóa trạng thái active của link file.



- [x] Thêm demo Confirm Warning riêng với icon cảnh báo, action warning và xử lý mở/đóng độc lập.
- [x] Căn giữa toàn bộ nội dung Confirm (icon, title, message) và căn giữa các action buttons ở footer.
- [x] Đổi cấu hình Show all sang option code (`data-k-show-all="true"` hoặc `{ showAll: true }`), bỏ checkbox giao diện runtime và hỗ trợ bật đồng thời với Search.
- [x] Căn footer Confirm theo `space-between`: Cancel bên trái, action chính bên phải.
- [x] Thay glyph đóng Modal bằng icon KAUI `x` mapped tới `close`.
- [x] Sửa icon trợ giúp của Confirm sang icon KAUI `circle-help` mapped tới `info`.
- [x] Giữ Confirm static nhưng cho phép nhấn Escape để đóng và hiển thị trạng thái cancelled.
- [x] Căn thẳng hàng hoàn hảo nút đóng modal với tiêu đề và icon trong `.k-modal__header`.
- [x] Reset margin/line-height của title modal để nút close căn giữa đúng theo dòng title và icon header.
- [x] Thêm search input và option Show all cho dropdown Country/Region; hỗ trợ tiếng Việt không dấu, tìm kiếm nhiều từ khóa không theo thứ tự và match đủ toàn bộ từ khóa.

- [x] Bổ sung icon KAUI cho toàn bộ action button ở footer của Modal/Confirm demo (`Cancel`, `Confirm`, `Publish`, `Delete`) theo anatomy `.k-btn__icon` + `.k-btn__text`.

- [x] Đặt Modal mặc định static: click backdrop/click ngoài và Escape không đóng; chỉ `data-k-backdrop="true"` mới bật dismiss ngoài.
- [x] Thêm event Escape cho Modal chính: đóng Modal và hoạt động như Cancel, trong khi click backdrop/click ngoài vẫn static mặc định.

- [x] Đặt Enter trên Modal/Confirm đang mở tương đương action xác nhận: Modal chính gọi Confirm, Confirm variants gọi Confirm/Publish/Delete tương ứng.


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

- [x] Fix Table sort icon: bổ sung path inline KAUI cho `arrow-up-down`, `arrow-up`, `arrow-down`; trạng thái icon không còn fallback sai sang `settings` khi khởi tạo hoặc click toggle.
- [x] Đăng ký icon trung tính `arrow-up-down` vào KAUI icon registry để sort có đủ glyph lên/xuống và trạng thái chờ dùng độc lập ngoài demo.

- [x] Fix render icon ban đầu: giữ class nền `kaui-icon` khi copy class chuyên biệt như `k-table__sort-icon`, tránh SVG sort mất kích thước/stroke sau khi chuyển từ `<i>` sang `<svg>`.

- [x] Sửa lỗi sort: không còn coi cell thiếu `data-k-sort-value` là số 0; hỗ trợ sort text đúng và giữ row no-results ở cuối.
- [x] Rà soát lại toàn bộ handler sort, sửa lỗi `ReferenceError` do event chưa truyền vào callback; dùng `table.tHead/tBodies` và event guard ổn định.
- [x] Đã sửa triệt để toggle đảo chiều sort 2 chiều (ascending <-> descending): click lần 1 sort tăng dần (icon `arrow-up`), click lần 2 đảo chiều giảm dần (icon `arrow-down`), click tiếp tục lặp lại chu kỳ đảo chiều mượt mà.
- [x] Căn lại glyph `arrow-up-down`: hai mũi tên sort dùng chung một trục dọc ở giữa icon, không còn lệch thành hai cột.







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




## Component pages tách từ Overview
- [x] Tách showcase component khỏi `demo/index.html`; index hiện là Overview.
- [x] Tạo page riêng cho Design Tokens, Navbar, Layout & Grid, Button, Forms, Card, Badge, Alert, Modal, Table, Toast, Tabs, Accordion, Indicators, Icons, Platforms và Charts.
- [x] Đồng bộ sidebar trái, theme toggle, icon registry và footer trên toàn bộ component pages; sidebar liên kết trực tiếp tới từng page.
- [x] Giữ `demo.js` dùng chung để các demo tương tác/copy/icon/chart tiếp tục hoạt động.
- [x] Rà soát lại các test legacy đang giả định toàn bộ showcase nằm trong `demo/index.html`; test suite hiện vẫn pass với Overview rút gọn.

## Compact fixed demo footer
- [x] Thu gọn `.demo-footer` thành thanh footer fixed ở đáy vùng nội dung, không che sidebar.
- [x] Rà soát và sửa lỗi Icon Gallery phân nhóm: sửa wrapper grid gây vỡ layout, đồng bộ tổng số icon theo manifest runtime và kiểm tra fallback.

- [x] Vẽ lại icon `social-x` thành glyph X dạng khối filled, bổ sung CSS override `fill: currentColor; stroke: none` và rebuild toàn bộ icon artifacts.
- [x] Vẽ lại icon `social-whatsapp` thành bong bóng chat với handset rõ ràng, rebuild toàn bộ icon artifacts và kiểm tra test suite.
- [x] Vẽ lại icon `social-zalo` thành bong bóng chat với chữ Z rõ ràng, cập nhật generator social icons, rebuild artifacts và kiểm tra test suite.
- [x] Cập nhật `social-zalo` để hiển thị trực tiếp text `zalo` trong bong bóng chat, đồng bộ generator và rebuild icon artifacts.
- [x] Bỏ bong bóng bao ngoài `social-zalo`, căn giữa và điều chỉnh text `zalo` lên size 7 để dễ đọc trong khung 24x24; đồng bộ generator và rebuild artifacts.
- [x] Tăng text `zalo` lên size 8 và cân lại baseline để cải thiện độ đọc trong icon 24x24.
- [x] Tăng text `zalo` lên size 12 theo yêu cầu, cân lại baseline và letter spacing trong icon 24x24.



- [x] Tăng text `zalo` lên size 18 theo yêu cầu, cân lại baseline và letter spacing trong icon 24x24.

- [x] Giảm text `zalo` xuống size 16 theo yêu cầu, cân lại baseline và letter spacing trong icon 24x24.

- [x] Thêm khoảng đệm cuối trang cho main/page và responsive footer trên mobile.
- [x] Đồng bộ tên package Flutter public thành `kaui` trên pub.dev và cập nhật card Platform Packages.

- [x] Đổi thư mục package Flutter từ `packages/flutter/kaui_flutter` thành `packages/flutter` để đồng bộ tên package public.

- [x] Đồng bộ license mới cho Flutter package `kaui` bản `1.1.0`: thay MIT bằng Personal / Non-Commercial License, cập nhật README và CHANGELOG; `dart pub publish --dry-run` đạt 0 warnings.

- [x] Rút gọn đường dẫn package Flutter thành `packages/flutter` rồi chuẩn hóa theo package manager thành `packages/pub`.

- [x] Chuẩn hóa thư mục package theo package manager: `packages/web` → `packages/npm`, `packages/flutter` → `packages/pub`; các package native Android/iOS đã tạm xóa.

- [x] Tạm xóa package native Android Compose và iOS SwiftUI; chỉ giữ package phát hành hiện tại ở `packages/npm` và `packages/pub`.

- [x] Rà soát publish lần cuối: package npm `kaui@1.1.0` có dist artifacts/exports/license metadata; package pub `kaui@1.1.0` đạt `dart pub publish --dry-run` 0 warnings.

- [x] Bổ sung `COMMERCIAL_LICENSE.md` vào npm tarball để điều khoản thương mại được phân phối cùng package và LICENSE không còn tham chiếu tới file ngoài package.
- [x] Publish npm thành công dưới tên scoped `@longbm64/kaui@1.1.0` sau khi npm từ chối tên unscoped `kaui` vì quá giống `ka-ui`; cập nhật README/Overview/Agent Prompt sang scoped install/import.


- [x] Đổi package Flutter trước khi publish thành `filekat`, đổi public library thành `filekat.dart`, cập nhật import và `dart pub publish --dry-run` đạt 0 warnings.

- [x] Đồng bộ public API hai nền tảng theo product package `filekat`: npm dùng `filekat/kaui`, pub.dev dùng `package:filekat/kaui.dart`; thêm npm subpath export `./kaui` và cập nhật hướng dẫn/Agent Prompt.

- [x] Mở rộng Overview để dùng cùng nhịp container/chiều rộng với các component page; bỏ giới hạn 680px/780px của hero cards, giữ hướng dẫn cài đặt và Agent Prompt full-width responsive.

- [x] Xóa hai nút Explore Components và Version Registry khỏi hero Overview theo yêu cầu; dọn CSS hero actions không còn sử dụng.

- [x] Chuẩn hóa sidebar toggle trên toàn bộ 19 demo page để dùng glyph `menu` từ KAUI icon registry (`data-kaui-icon="menu"`, class `k-icon`), không dùng hamburger/SVG ngoài hệ thống.

- [x] Tạo release snapshot versioned `1.1.0` dưới `dist/versions/1.1.0/`, cập nhật `dist/versions/index.json` trỏ latest `1.1.0` và đồng bộ fallback trong `demo/versions.js`.

- [x] Thêm khối Install KAUI Packages vào `demo/versions.html`, bao gồm hướng dẫn `npm install filekat` và `flutter pub add filekat` cùng link trực tiếp tới npm và pub.dev.

- [x] Đưa hướng dẫn cài đặt npm và pub.dev vào trực tiếp bên trong từng accordion version trên `demo/versions.html` thông qua `demo/versions.js`, kèm version tag động (`filekat@<version>`).

