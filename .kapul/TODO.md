
## Railway deployment preparation

- [x] Add `server.mjs` static server using Railway's `$PORT`, `0.0.0.0`, `/health`, root redirect, MIME types, and path traversal protection.
- [x] Add `npm start` and declarative `railway.json` build/deploy configuration.
- [x] Document GitHub/CLI Railway deployment flow in `README.md`.
- [x] Verify server syntax, HTTP smoke tests, `npm test` (177 passing), and `npm run build`.
- [!] Actual Railway deployment/domain generation still requires the user's Railway account and GitHub/CLI authentication.
- [x] Railway ownership đã verify và CNAME public đã đúng; custom domain được Railway phục vụ.
- [x] Chuyển Railway service từ CLI upload sang GitHub Autodeploy repository `longbm64/kaui`, branch `release`.
- [x] Xác minh deployment tự động từ branch `release`, giữ domain `kaui.filekat.com`.
- [x] Railway GitHub App đã truy cập được `longbm64/kaui`; service đã kết nối branch `release` và deployment tự động thành công.

- [x] Tạo Railway project `kaui`, deploy service production và tạo custom domain `kaui.filekat.com`.
- [-] Chờ chủ DNS thêm CNAME/TXT verification để Railway cấp certificate HTTPS cho `kaui.filekat.com`.
- [ ] Chuyển Railway service từ CLI upload sang GitHub Autodeploy repository `longbm64/kaui`, branch `release`.
- [ ] Sau khi kết nối, xác minh deployment tự động từ branch `release` và giữ domain `kaui.filekat.com`.
- [!] Railway GitHub App chưa có quyền truy cập `longbm64/kaui`; cần cấp quyền repository trong GitHub/Railway rồi chạy lại source connect.
- [x] Railway GitHub App đã truy cập được `longbm64/kaui`; service đã kết nối branch `release` và deployment tự động đầu tiên thành công.

- [x] Add `npm run release` / `#release` workflow: merge current committed branch into `release` via temporary worktree, verify, and push for Railway Autodeploy.



- [-] Railway ownership đã verify (`Verified: yes`) và CNAME public đã đúng; certificate TLS vẫn đang `VALIDATING_OWNERSHIP`, nên tiếp tục chờ Railway hoàn tất cấp chứng chỉ trước khi đánh dấu domain HTTPS hoàn tất.



- [x] Chuẩn hóa `demo/templates.html` theo shell canonical của các demo page: sidebar đầy đủ, theme dropdown, mobile drawer, header/body/footer và Resources active state.

- [x] Add canonical `#release` automation: patch bump, build and verification, source push, protected `release` merge/push, then Railway deploy.

- [x] Publish the source-code links in README: official website `https://kaui.filekat.com`, public GitHub repository, and existing GitHub Pages demo.

- [x] Fix README license badge/text so current release `1.1.3` is clearly marked KAUI Personal / Non-Commercial; retain MIT only as historical `1.0.x` information.


- [x] Di chuyển item Templates vào nhóm Resources trên toàn bộ 20 demo pages, giữ active state riêng tại `demo/templates.html` và loại bỏ item trùng ở Getting Started.


- [x] Protect `release`: agent stops immediately on that branch; versioned pre-commit/pre-push hooks block direct local commit/push; `npm install` configures hooks via `prepare`.

- [x] Country modal table: fit all four columns within the dialog without horizontal overflow; timezone values wrap inside the fourth column.


- [x] Tăng độ đậm nền item active trong menu trái theo từng theme preset; thêm semibold text để trạng thái hiện tại rõ hơn.

- [x] Modal trigger focus: khi click button mở Modal/Confirm, loại focus khỏi trigger để sau khi đóng không còn outline/focus trên button mở.


- [x] Tăng độ đậm và tương phản của text demo: dùng `#1e293b` cho text chính, `#475569` cho text phụ, đồng thời làm đậm `--k-color-text-muted` trên các preset Ocean, Forest và Sunset.

- [x] Chuẩn hóa Modal: dialog dùng đúng 3 vùng header/body/footer; chỉ `.k-modal__body` được phép scroll, không scroll ở dialog hoặc overlay. Đã sửa core overlay và demo override.


- [x] Cập nhật trang Overview (`demo/index.html`):
  - Bổ sung hướng dẫn cài đặt 3 nền tảng: Web (NPM), Flutter (pub.dev), và CDN/HTML trực tiếp.
  - Nâng cấp AI Agent Prompt toàn diện: bao gồm cách đọc manifest theo version, nguyên tắc không viết CSS tùy tiện, quy tắc BEM & Token, chi tiết các tính năng mới của Table (Rich cells, Alignment, Sum, Frozen Multi-Pane), Form, Button, Navbar và Modal/Overlay.
  - Đồng bộ `agent-prompt` snippet trong `demo/demo.js` để nút Copy prompt sao chép nội dung mới nhất.

- [x] Tạo page Templates (`demo/templates.html`) hiển thị card item theo grid responsive.
- [x] Cấu hình mỗi card item mở template trong tab mới bằng `target="_blank" rel="noopener noreferrer"`.
- [x] Đặt template demo hiện tại (`demo/index.html`) làm example đầu tiên.
- [x] Phát triển thêm 3 template độc lập bằng KAUI: Blog (`demo/templates/blog.html`), Dashboard (`demo/templates/dashboard.html`), E-commerce (`demo/templates/e-commerce.html`).
- [x] Bổ sung styles catalog và shell preview (`.demo-template-*`) vào `demo/demo.css`.
- [x] Thêm link điều hướng Templates vào sidebar Overview (`demo/index.html`).


- [x] Giảm khoảng cách/padding quanh title section dùng chung cho toàn bộ 19 demo page: section 1.5rem, header 1rem, title margin dưới 0.25rem.

- [x] Thêm modal danh sách 195 quốc gia trong `demo/modal.html`: body cuộn độc lập, header/footer cố định, 4 cột đều nhau (số, mã vùng, tên, múi giờ), dữ liệu tĩnh trong `demo/countries.js`; đã kiểm tra cú pháp và diff.


- [x] Fix lỗi JavaScript sau khi xóa custom scroll: loại bỏ đoạn `sidebarBody` bị chèn ngoài IIFE ở đầu `demo/demo.js`; giữ lại native scroll handler bên trong DOMContentLoaded.

- [x] Xóa custom scroll arrows/overlay khỏi menu trái; khôi phục native scrollbar và giữ lưu/khôi phục vị trí scroll.

- [x] Sửa sidebar active item: đổi trang/hash chỉ cập nhật trạng thái active, không tự động cuộn menu; scroll chỉ xảy ra khi người dùng dùng wheel/touch/keyboard hoặc nút mũi tên.
- [x] Giữ nguyên vị trí scroll sidebar qua reload khi chọn item menu multi-page, không reset về top và không cuộn theo active item.



- [x] Khóa viewport 100vh và chỉ cho phép `.demo-right__body` cuộn; header/footer đứng yên.
- [x] Đồng bộ chiều cao sidebar header và right header bằng `--demo-header-height`, gồm cả breakpoint mobile.

- [x] Chuyển footer khỏi `position: fixed` overlay sang flex item cố định trong right shell.


- [x] Mở rộng theme presets để đổi đồng bộ background, surface, text, muted text, border và border-subtle; không chỉ đổi primary color.

- [x] Thêm đường ngăn cách giữa sidebar header và body bằng `border-bottom` theo token `--k-border`, giữ body scroll độc lập.

- [x] Đổi nhãn preset mặc định từ `KAUI Blue` thành `Blue`, giữ nguyên value `default` và persistence.

- [x] Thay native theme `<select>` bằng KAUI `.k-dropdown-select` chuẩn trong footer; giữ hidden select bridge, ARIA menu item state, keyboard navigation và persistence.

- [x] Fix menu trái fixed: `.demo-sidebar` giữ `position: fixed`, `.demo-right` bù `margin-left: 15.5rem` trên desktop và reset về `0` trên mobile.

- [x] Thay Light/Dark toggle bằng dropdown theme preset trong footer menu: KAUI Blue, Ocean, Forest, Sunset, Dark; lưu lựa chọn qua `kaui-theme`.

- [x] Xóa nút "View on GitHub" khỏi `.demo-sidebar__footer` trên toàn bộ 19 demo pages, dọn CSS `.demo-sidebar__github`.

- [x] Restructure demo content shell into `.demo-header`, `.demo-right__body`, and `.demo-footer` so the left menu remains independent and the right content has explicit header/body/footer regions.

- [x] Build and prepare release `1.1.1`, including versioned CSS/JS/chart/token/icon artifacts and release metadata.
- [x] Verify release `1.1.1` with tests, token verification, license audit, and release artifact checks.

# TODO — KAUI

## Layout restructuring
- [x] Inspect current demo shell and identify sidebar/page/footer dependents.
- [x] Restructure the right content region into header, body, and footer.
- [x] Apply the same right-shell markup to all 19 demo pages and add responsive header/body/footer styles.
- [x] Run `npm test` and `npm run build`; 177 tests pass and production artifacts rebuild successfully.

## Blockers
- [!] None.

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

- [x] Chuẩn hóa live demo URL thành `https://kaui.filekat.com` không có dấu slash cuối.

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








- [x] Đã loại bỏ các liên kết mã nguồn GitHub khỏi giao diện công khai khi chuyển repository sang private.

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

- [x] Chuẩn hóa contract sidebar trái bằng `data-sidebar-region` cho ba vùng semantic header/body/footer trên toàn bộ 19 demo pages; giữ nguyên class, scroll độc lập và active state.
- [x] Sửa trang Cards: chuyển scroll từ danh sách quốc gia sang toàn bộ `.demo-card-countries .k-card__body`, giữ header/footer card cố định và danh sách 4 cột nội tại.
- [x] Thu gọn typography card Countries: title/body/header/footer và các dòng quốc gia dùng size compact, line-height và padding phù hợp để hiển thị rõ trong body scroll.
- [x] Giới hạn chiều cao card Countries ở `30rem`, giới hạn body theo phần header/footer để scrollbar body luôn hiển thị; mobile dùng `max-height: 22rem`.




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


- [x] Trang Cards: xóa card Interactive, thêm card Countries có body cuộn với 4 cột đều nhau (số, mã vùng, tên, múi giờ), và chuẩn hóa chiều cao các card cùng hàng.

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

- [x] Khắc phục triệt để mờ/nhòe font ở các preset: xóa hoàn toàn nền bán trong suốt `color-mix` còn sót ở `.demo-footer`; đổi toàn bộ `demo/demo.css` từ `subpixel-antialiased`/`optimizeLegibility` sang `antialiased`/`grayscale`/`text-rendering: auto` theo đúng chuẩn core SCSS để khử tán sắc subpixel trên macOS/WebKit.

- [x] Cập nhật fix vào core package: đổi `src/scss/base/_reset.scss` từ `text-rendering: optimizeSpeed` sang `auto` để package publish (`dist/kaui.css`/`dist/kaui.min.css`) cũng nhận typography rendering ổn định, không chỉ demo.
- [x] Tăng độ rõ text cho package publish: đổi token core `--k-color-text-muted` từ `#64748b` sang `#475569` trong `src/scss/abstracts/_tokens.scss`; giữ nguyên tên token/API, rebuild expanded/minified CSS để mọi consumer nhận màu muted đậm hơn, giảm cảm giác bóng mờ và mỏi mắt.
- [x] Sửa lỗi Dark theme active menu item bị giãn chiều cao: xóa selector `#cards .demo-card-equal` bị dính nhầm dấu phẩy `,` vào `[data-theme="dark"] .demo-sidebar__link.is-active`, trả lại chiều cao compact chuẩn `.demo-sidebar__link`.
- [x] Đổi màu chữ và icon của active/hover item trong menu sidebar ở Dark theme: chuyển từ màu xanh tối `#1d4ed8` sang màu trắng `#ffffff` trên nền xanh đậm `#1e3a8a`, tăng tương phản tuyệt đối và không còn bị chìm/mất chữ.
- [x] Thêm thông tin liên lạc (`contact@filekat.com`) và copyright (`&copy; 2026 KAUI Contributors`) vào main footer `.demo-footer` trên toàn bộ 20 trang demo.
- [x] Đồng bộ padding của header trang Overview (`.demo-hero`): giảm từ `3rem 1rem` xuống `1.5rem 0` đúng chuẩn `.demo-section` của 19 trang component khác.
- [x] Độc lập hóa vùng cuộn (scroll containment): áp dụng `overscroll-behavior: contain` triệt để cho `.demo-sidebar__body`, `.demo-right__body`, `pre`, `.demo-code`, `.k-dropdown__menu`, `.k-tabs__list`, modal body và table scrollable pane; khi con trỏ chuột ở vùng nào thì cuộn độc lập vùng đó, khi tới mép cuộn (top/bottom/left/right) không bị tràn sự kiện cuộn (scroll chaining) làm trôi các vùng khác.
- [x] Sửa script `scripts/release.mjs` để tự động cập nhật số version trong footer badge `.demo-footer__badge` sang version mới mỗi khi chạy release; đã deploy và đồng bộ `v1.1.5` trên production.

- [x] Đã cấu hình tự động cập nhật `packages/pub/README.md` (đoạn `filekat: ^<version>`) và `packages/pub/CHANGELOG.md` theo version mới mỗi khi release để trên pub.dev trang của version nào thì README hiển thị đúng mã cài đặt của version đó.
- [x] Đã chuẩn hóa tài liệu AI Agent và Core SCSS cho các Preset Themes:
  - Bổ sung `[data-theme="sunset"]`, `[data-theme="ocean"]`, `[data-theme="forest"]` vào `src/scss/base/_root.scss` để bất kỳ dự án nào import filekat/kaui đều sử dụng được trực tiếp các theme này bằng `data-theme="sunset"`.
- [x] Đã làm giàu tài liệu cấu trúc component chi tiết trong `kaui-agent-manifest.json`:
  - Bổ sung HTML code mẫu chính thức (`htmlSnippet`, `modalSnippet`, `toastSnippet`, `tabsSnippet`, `accordionSnippet`) cho Button, Navbar, Card, Badge, Alert, Modal, Toast, Tabs, Accordion.
  - Cập nhật prompt hướng dẫn AI Agent ở `demo/index.html` và nút copy `demo/demo.js`: Agent truy cập `/dist/versions/<version>/kaui-agent-manifest.json` để lấy trọn vẹn HTML snippet và class contract chuẩn thay vì tự đoán hay chế CSS.

  - Cập nhật tài liệu `README.md`, `demo/index.html` (AI Agent Prompt), và `kaui-agent-manifest.json` ghi rõ hướng dẫn thiết lập theme cho các agent AI ở dự án khác.


- [x] Đã tích hợp tự động hóa `#release`: mỗi lần release sẽ đồng bộ version và tự động publish đồng thời lên cả 3 nền tảng:
  1. Web CDN / Static hosting (Railway: `https://kaui.filekat.com`)
  2. NPM package registry (`filekat@1.1.5` trên https://www.npmjs.com/package/filekat)
  3. Dart / Flutter pub.dev (`filekat 1.1.5` trên https://pub.dev/packages/filekat)





- [x] Thay chữ `Overview` (và `Showcase Demo` ở versions.html) ở góc phải footer `.demo-footer` trên toàn bộ 20 trang demo thành text version hiện tại `v1.1.4` (link trỏ tới `versions.html`).




- [x] Rà soát preset theme: loại bỏ `backdrop-filter: blur(10px)` khỏi demo footer gây cảm giác nhòe; đồng bộ font-weight cho Ocean/Forest/Sunset/Dark và giữ nguyên semantic color của từng preset. Đã chạy 177 tests và build thành công.


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
- [x] Chuyển toàn bộ CDN/demo/manifest/version-artifact links sang `https://kaui.filekat.com` và xóa liên kết mã nguồn GitHub của dự án khỏi nội dung công khai/package metadata. Giữ URL npm/pub.dev và attribution bên thứ ba cần thiết.
- [x] Đưa demo overview về root `/`, map toàn bộ trang/asset demo sang route root và redirect tương thích từ `/demo` về URL tương ứng.
- [x] Gắn link trực tiếp tới npm (`npmjs.com/package/filekat`) và Flutter (`pub.dev/packages/filekat`) với `target="_blank" rel="noopener noreferrer"` trong Overview, Platforms và Versions.
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

- [x] Mở rộng Navbar guide: thêm hướng dẫn cấu trúc, ARIA, modifiers, responsive và 3 code mẫu copy được cho basic/nested/overflow.

- [x] Đưa hướng dẫn cài đặt npm và pub.dev vào trực tiếp bên trong từng accordion version trên `demo/versions.html` thông qua `demo/versions.js`, kèm version tag động (`filekat@<version>`).



- [x] Nâng cấp Navbar submenu lồng vô hạn: tự đo viewport và đảo hướng dọc/ngang (`is-dropup`, `is-dropstart`) khi không đủ không gian; giữ mobile accordion/drawer và ARIA.
- [x] Bổ sung demo trực quan `Edge test` với menu 3 cấp, hướng dẫn kiểm tra flip-up/flip-left và responsive mobile.

- [x] Tăng độ đậm text cho theme Blue mặc định: text thường 500, text phụ 500, link sidebar/Navbar 600; giữ nguyên các theme còn lại.
- [x] Sửa demo Navbar để menu con đa cấp hiển thị ngay: mở sẵn Components → Advanced và bỏ clipping overflow trên desktop; mobile vẫn cuộn dọc.
- [x] Sửa lỗi menu mở sẵn che nội dung: đóng toàn bộ submenu khi tải trang, giữ click/hover để xem menu đa cấp.
- [x] Thêm hover bridge tàng hình (`::before`) cho mọi hướng submenu Navbar (trên, dưới, trái, phải) loại bỏ khoảng hở điểm mù khiến menu biến mất khi rê chuột.
- [x] Tăng khoảng cách ngang giữa 2 menu con (flyout) từ 8px lên 12px (`--k-spacing-3`) và padding item link để menu thoáng, đồng bộ hover bridge.
- [x] Đóng đệ quy mọi menu con dưới cấp khi đóng menu cha hoặc root (`closeChildBranches`), reset toàn bộ trạng thái `is-open`, `is-dropup`, `is-dropstart` và `aria-expanded="false"`.
- [x] Xuất bản 2 bộ tài liệu chuẩn theo quy định Kapul: `kapul-docs/TECHNICAL_DOCS.md` (kiến trúc, DOM, modifiers, thuật toán flip, cascade close) và `kapul-docs/USER_GUIDE.md` (hướng dẫn sử dụng & checklist kiểm thử QA).
- [x] Cập nhật hướng dẫn và code mẫu menu đa cấp vô hạn trong `README.md`.

- [x] Áp dụng nguyên tắc mở 1 chiều nhất quán (Single-direction consistency): xác định hướng mở tối ưu dựa trên khoảng cách gần nhất của menu root (ở nửa phải mở trái, nửa trái mở phải), toàn bộ menu con cấp sâu (Level 1, 2, 3, 4) tuân thủ mở thẳng theo 1 chiều duy nhất, không bao giờ gập zig-zag đè lên nhau.

- [x] Khắc phục triệt để outside click cho desktop: kiểm tra cả `.k-navbar__item--has-children.is-open` thay vì chỉ kiểm tra drawer mobile, đảm bảo bấm ra ngoài đóng toàn bộ menu con ngay lập tức.

- [x] Khắc phục triệt để lỗi khi bấm Level 4: sửa specificity CSS của `.is-dropstart` để đảm bảo không bị `.k-navbar--expand-lg` ghi đè, tự động lật chevron và kế thừa hướng mở sang trái cho toàn bộ menu con cấp sâu.

- [x] Chuyển đổi sang cơ chế Click-only thuần túy: xóa bỏ toàn bộ hover mở menu con, muốn mở bắt buộc phải bấm; bấm đóng thì đóng sạch mọi menu con bên dưới; hover chỉ đổi background highlight nhẹ.

- [x] Không in đậm text ở cả trạng thái hover lẫn trạng thái active của Navbar link (giữ độ dày font thanh mảnh, đồng nhất với các item khác).

- [x] Giữ nguyên độ dày font khi hover item Navbar (`font-weight` ổn định, không làm in đậm chữ khi rê chuột) để chống giật nở text layout.

- [x] Khử xung đột triệt để giữa Hover và Click: chuyển quyền mở/đóng hoàn toàn qua JS `.is-open`, hỗ trợ hover có debounce và cho phép click đóng dứt khoát ngay cả khi con trỏ chuột vẫn đang nằm trên nút.

- [x] Thêm background đậm đồng bộ với menu left (`--demo-sidebar-active-bg`) khi hover hoặc mở các item menu Navbar (cả root lẫn submenu), hỗ trợ đầy đủ các theme preset (Blue, Ocean, Forest, Sunset, Dark).


- [x] Tối ưu hóa dynamic flip khi hover: tự động đo bounding rect khi mouseenter/focusin và cascade dropstart cho các menu con cấp sâu (Level 3, Level 4) khi chạm mép phải.




- [x] Chuẩn hóa flyout Navbar desktop: submenu mở ngang trái/phải và luôn căn top bằng item cha; chỉ mobile mới xếp dọc.

- [x] Tách hướng submenu Navbar: menu root mở trên/dưới và tự flip lên; menu con lồng sâu mở trái/phải, căn top theo item cha.
