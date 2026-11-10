- Confirm Component Callback Contract: Hộp thoại Confirm hỗ trợ 2 mô hình xử lý callback:
  1. Lắng nghe trực tiếp trên button DOM: `btnConfirm.addEventListener('click', ...)` để chạy logic xác nhận và `confirm.classList.remove('is-open')`; `btnCancel.addEventListener('click', ...)` để hủy.
  2. Bọc Promise (`showConfirm(selector)`): Trả về `Promise<boolean>` tương thích `async/await`, giải phóng listener sau khi hoàn thành.
- Release metadata banner contract: Mỗi khi chạy `#release`, `scripts/release.mjs` tự động tiêm comment header chuẩn vào toàn bộ các file trong `dist/` (CSS, JS, Dart, Kotlin, Swift) chứa thông tin version, bản quyền (2026 KAUI Contributors / Non-Commercial), website chính thức (`https://kaui.filekat.com`), và GitHub repository (`https://github.com/longbm64/kaui`).
- JS runtime header comment cleanup contract: Cho đợt #release tới, `src/js/kaui.js` và bản minified `dist/kaui.min.js` phải được dọn dẹp / loại bỏ block comment mô tả cũ `/** * KAUI Core Component Runtime (v1.1.1) ... */` để tránh xuất hiện comment thừa trên CDN preview.
- Template example contract: `demo/templates/dashboard.html` is the catalog's standalone dashboard page template, copied from the demo shell. The existing `demo/index.html` remains the general component showcase but is no longer listed as a template.

/* Theme readability fix: opaque footer and consistent weight prevent low-frequency blur/softness on Ocean, Forest, Sunset, and Dark preset surfaces. */


- `npm run release` is the canonical `#release` flow: from a clean non-`release` branch it bumps the patch version by default, builds/verifies/tests/audits, commits and pushes the source branch, merges it into protected `release`, pushes `release`, then runs `railway up` (override with `KAUI_DEPLOY_COMMAND`).

- Release baseline: version `1.1.1` artifacts are generated under `dist/versions/1.1.1/`, registered in `dist/versions/index.json`, and include `metadata.json` with file sizes and SHA-256 checksums.

- `server.mjs` is the production static HTTP entrypoint. It binds `0.0.0.0:${PORT}` (fallback `3000` locally), redirects `/` to the `/` root route, serves static files safely, and exposes `GET /health`.
- **Public source/documentation contract:** The KAUI source repository is public at `https://github.com/longbm64/kaui`. The official production website is `https://kaui.filekat.com`; the existing GitHub Pages demo remains `https://longbm64.github.io/kaui/demo`.
- License display contract: README badge and current-release text must identify KAUI `1.1.0+` as the Personal / Non-Commercial License; MIT applies only to historical `1.0.x` releases.


- **Root demo route contract:** the production server exposes the demo overview at `https://kaui.filekat.com/` instead of `/demo`; legacy `/demo` URLs redirect to root equivalents.
- `package.json` exports `npm start` as `node server.mjs`; `npm run build` remains the Railway build command.
- `railway.json` is the declarative Railway configuration: build `npm run build`, start `npm start`, healthcheck `/health`.
- `serve:tailscale` remains local-only and must not be used in Railway because it binds a fixed port.

- Templates page shell contract: `demo/templates.html` must use the same canonical `.demo-sidebar`, theme preset dropdown, mobile toggle, `.demo-right` header/body/footer structure as the existing component pages (for example `demo/card.html`). Only the main catalog content may differ.


- Sidebar navigation contract: `Templates` is grouped under `Resources` on all 20 `demo/*.html` pages; the templates page marks this item `.is-active` and does not duplicate it under Getting Started.


- Country modal table layout contract: `.demo-country-table-wrap` never scrolls horizontally; the table uses `table-layout: fixed` and width `100%`, with columns sized 7% / 18% / 35% / 40%. Country and timezone cells may wrap (`overflow-wrap: anywhere`), so all four columns remain inside the modal body.
- Active sidebar surface contract: `.demo-sidebar__link.is-active` uses a stronger preset-specific background (`#dbeafe` Blue, `#a5f3fc` Ocean, `#bbf7d0` Forest, `#fed7aa` Sunset, `#1e3a8a` Dark) and semibold text for clearer navigation state.

- Modal trigger focus contract: `demo/demo.js` calls `blurModalTrigger(trigger)` before opening `#demo-modal`, `#demo-countries-modal`, or any confirm dialog, so closing never returns visible focus to the launch button. Dropdown focus behavior remains unchanged.


- Text contrast contract: demo text uses slightly stronger contrast tokens (`#1e293b` for main text fallback and `#475569` for muted text) and darkens muted shades for `ocean` (`#075985`), `forest` (`#166534`), and `sunset` (`#9a3412`) to prevent dim or washed-out typography across themes.

- Modal scroll contract: `.k-modal` and `.k-modal__dialog` use `overflow: hidden`; `.k-modal__dialog` is a flex column with `max-height: calc(100vh - 2rem)`; only `.k-modal__body` is the flexible scrolling region (`min-height: 0; overflow-y: auto`). Modal markup must keep the order `.k-modal__header`, `.k-modal__body`, `.k-modal__footer` when all three regions are present.


- Templates catalog contract: `demo/templates.html` serves as the card-based template hub; each card links to a standalone page via `target="_blank" rel="noopener noreferrer"`.
- Template example contract: `demo/templates/dashboard.html` is the catalog's standalone dashboard page template, copied from the demo shell. The existing `demo/index.html` remains the general component showcase but is no longer listed as a template.
- Template CSS contract: Template chrome and layouts use scoped `.demo-template-*` selectors in `demo/demo.css` alongside standard `.k-*` tokens/components.
- Template card interaction contract: `.demo-template-card` has no hover lift or shadow animation; keyboard focus remains visible through the browser focus state.
- One-column template contract: `demo/templates/one-column.html` uses a single-column layout with synchronized 60rem width across top navbar container, content body, and footer. Icons are integrated into navbar links (user, play, code), action button (arrow-right), badge (columns), card heading (monitor), and footer version (tag).


- Modal country-list demo contract: `demo/modal.html` loads `demo/countries.js`, opens `#demo-countries-modal` from `#demo-open-countries`, renders `#demo-countries-body`, and uses `.demo-country-modal__body { overflow-y: auto }`; the table has four equal-width columns (No., Calling code, Country, Time zone). `demo/demo.js` owns open/close/Escape behavior.


- Sidebar footer contract: `.demo-sidebar__footer` contains only the `#theme-preset` KAUI dropdown; the redundant GitHub button and Light/Dark toggle have been removed.

- Custom sidebar scroll controls are removed. `.demo-sidebar__body` retains native `overflow-y: auto` scrolling for wheel, touch, trackpad, and keyboard accessibility.

- Preset semantic color contract: `ocean`, `forest`, and `sunset` override surface/background, subtle surface, main/muted text, border/subtle border, primary scale, and semantic aliases (`--k-bg`, `--k-text`, `--k-border`) so borders and backgrounds follow the selected theme.

- Sidebar separator contract: `.demo-sidebar__header` has a `1px` bottom border using `var(--k-border)` to visibly separate the fixed header from the independently scrolling body; footer keeps its top border.

- Theme preset label contract: the default preset keeps value `default` but displays the shorter label `Blue` in the dropdown.

- Theme preset dropdown contract: footer uses `.k-dropdown.k-dropdown-select[data-k-theme-preset]` with the standard KAUI toggle/menu/item anatomy; the hidden `#theme-preset` select remains the value bridge and `kaui-theme` persistence key.

- Sidebar theme contract: `.demo-sidebar__footer` uses `#theme-preset`, a native dropdown with `default`, `ocean`, `forest`, `sunset`, and `dark` presets; no Light/Dark toggle button or system-preference auto-switch remains.

- Sidebar footer contract: `.demo-sidebar__footer` contains only the `#theme-toggle` button; the redundant "View on GitHub" button has been removed from the left sidebar.

- Sidebar region contract: every demo page marks semantic sidebar regions with `data-sidebar-region="header"`, `data-sidebar-region="body"`, and `data-sidebar-region="footer"`; these attributes supplement the existing BEM classes without changing runtime selectors.

Version Archives dùng Accordion Component chuẩn KAUI (`.k-accordion__item.is-open`, `.k-accordion__trigger[aria-expanded]`, `.k-accordion__body`) để hiển thị từng version và artifact.

- Version Registry dùng chung sidebar chuẩn của các demo page (`demo.js`, scroll controls, grouped navigation, KAUI icon registry), không dùng Lucide CDN riêng.

- Demo contract: `demo/versions.html` is a focused archive page; its hero intro (latest badge, registry heading/description, and two hero actions) is omitted, while `#history` remains the primary content section.






# KAUI — Project Context

## Kiến trúc

KAUI là SCSS/CSS kit độc lập. Entry point là `src/scss/kaui.scss`, dùng `@use` theo thứ tự base, layout, components, utilities. Form controls nằm trong `src/scss/components/_form.scss`.

## Tech stack

- Dart Sass CLI qua `npm run build`.
- Node.js native test runner qua `npm test`.
- Không có framework runtime.

## Quy ước code

- Class public giữ prefix `k-` và BEM.
- Demo copy-action contract: `.demo-form-label` đặt nút `.demo-copy-button` ngay cạnh từng `.k-form-label`; mỗi control dùng `data-copy-component` riêng để copy snippet tương ứng, hỗ trợ responsive wrap trên màn hình hẹp.
- Form label/copy-action row contract: `.demo-form-label` is a full-width nowrap flex row on desktop; `.k-form-label` has no bottom margin inside it and `.demo-copy-button` stays non-shrinking. The row may wrap below 580px for narrow screens.
- Form label spacing: `.demo-form-label` adds a subtle 0.25rem gap below the label row before its control for clearer component grouping.


- State class giữ nguyên: `.is-valid`, `.is-invalid`, `.is-disabled`.
- Component dùng CSS custom properties nội bộ, ví dụ `--k-input-border`.
- Không dùng `transition: all` cho form controls.

## Bản đồ hợp đồng code

- `.k-input`, `.k-select`, `.k-textarea`: block control, width 100%, border 1px, focus đổi `border-color`.
- `.k-checkbox`, `.k-radio`: custom control với `:checked` và `:focus-visible`.
- `.k-form-group`, `.k-form-label`, `.k-form-hint`, `.k-form-feedback`: layout và thông báo validation.
- Roadmap completion baseline: token builders generate Web/Dart/Kotlin/Swift outputs; icon builder generates the complete 67-icon KAUI-owned registry and sprite; release verifier checks 18 versioned artifacts; Flutter core widgets and platform package scaffolds exist. Native platform projects still require platform-specific CI/golden tests before production publication.

- Roadmap completion baseline: token builders generate Web/Dart/Kotlin/Swift outputs; icon builder generates the complete 67-icon KAUI-owned registry and sprite; release verifier checks 18 versioned artifacts; Flutter core widgets and platform package scaffolds exist. Native platform projects still require platform-specific CI/golden tests before production publication.
- Full icon registry baseline: `icons/manifest.json` and generated `dist/icons/kaui-icons.json` contain 2,328 registered SVG icons (including legacy KAUI compatibility names); gallery renders the full registry from the inline sprite.

- Table contract: `src/scss/components/_table.scss` xuất `.k-table-wrap`, `.k-table`, `.k-table th/td`, `.k-table--striped`, `.k-table--hover`, `.k-table--bordered`, `.k-table--sm`, `.k-table--responsive`, `.k-table--frozen`, `.k-table__actions`, `.k-table__empty`, `.k-table__toolbar`, `.k-table__search`, và `.k-table__sort`. Partial được forward từ `components/_index.scss`; extended bundle không còn định nghĩa trùng trong `extended/_data_shell.scss`.
- Table options contract: root `[data-k-table]` nhận `data-k-searchable="true"`, `data-k-sortable="true"`, `data-k-sort-columns="0,3"`, và `data-k-freeze="1"`. Search input là `[data-k-table-search]`; thuật toán giống dropdown: chuẩn hóa Unicode/không dấu, tách từ khóa bằng khoảng trắng và chỉ giữ row chứa đủ mọi từ khóa. Sort chỉ gắn button cho các chỉ số cột được chỉ định; giá trị số dùng `data-k-sort-value`. Freeze làm sticky `--k-table-freeze-count` cột đầu tiên.
- Table freeze columns contract: `data-k-freeze-columns` accepts comma-separated indexes or directions (`0,right:3`, `last`), mapping to sticky `.k-table__cell--frozen-left` and `.k-table__cell--frozen-right` with computed pixel offsets.
- Table scrollbar contract: `.k-table-wrap` confines the scrollbar track to the scrollable center columns via `--k-table-scroll-inset-left` and `--k-table-scroll-inset-right`.
- Table scroll stabilization contract: `.k-table-wrap` declares `overscroll-behavior-x: contain` and frozen columns promote to isolated GPU composite layers via `transform: translateZ(0)` to prevent rendering lag.

- Icon renderer class contract: khi chuyển placeholder `<i data-kaui-icon>` thành SVG, phải giữ class nền `kaui-icon` và nối các class chuyên biệt của placeholder (ví dụ `.k-table__sort-icon`).
- Sort icon registry contract: `icons/source/kaui/arrow-up-down.svg` là glyph trung tính chính thức, được build vào `dist/icons/sprite.svg`, `kaui-icons.css` và `kaui-icons.json` cùng `arrow-up`/`arrow-down`.

- Icon priority expansion: `scripts/add-kaui-priority-icons.mjs` creates 31 idempotent KAUI-owned SVG sources; `npm run icons:priority:add` invokes it then `scripts/build-icons.mjs`. The generated manifest, sprite and CSS are consumed by `demo/icons.html` through `dist/icons/kaui-icons.json`.

- Icon Phase 2 expansion: `scripts/add-kaui-phase2-icons.mjs` creates 37 idempotent KAUI-owned SVG sources for data, dashboard, files, user, security and advanced actions; `npm run icons:phase2:add` rebuilds the generated registry.

- Phase 3–5 icon expansion: generators `scripts/add-kaui-phase3-icons.mjs`, `scripts/add-kaui-phase4-icons.mjs`, and `scripts/add-kaui-phase5-icons.mjs` create idempotent KAUI-owned SVG sources for media/communication, commerce/infrastructure, and editing/accessibility/localization. Their npm commands rebuild the shared registry.

- Cards showcase scroll contract: `.demo-card-countries .k-card__body` owns vertical scrolling with header/footer fixed; `.demo-country-list` is not independently scrollable and preserves four equal columns for number, calling code, country, and time zone.


## Button loading contract

- `.k-btn__icon`: icon bình thường, bị ẩn khi loading.
- `.k-btn__loader`: spinner, mặc định ẩn.
- `.k-btn__text`: text gốc luôn được giữ lại.
- `.k-btn--loading` hoặc `.is-loading`: hiển thị spinner, ẩn icon thường và khóa tương tác.

## Bundle

- Bundle duy nhất: `kaui.scss` biên dịch thành `dist/kaui.css` và `dist/kaui.min.css`, bao gồm toàn bộ core và advanced components.
- Cards showcase contract: `demo/card.html` renders three equal-height cards in `#cards .demo-card-grid`; `.demo-card-countries .k-card__body` is the sole vertical scroll region, with fixed card header/footer and an intrinsic `.demo-country-list` containing four equal columns. `demo/demo.css` owns showcase-only sizing/scroll styling; core `.k-card` API remains unchanged.
- Countries card typography contract: title/body/header/footer and country rows use compact scoped sizes (`base`, `sm`, `xs`) with tighter row spacing and preserved four-column alignment; no global `.k-card` typography changes.
- Countries card body height contract: desktop `.demo-card-countries` is fixed at `30rem`; its `.k-card__body` is limited to `calc(30rem - 7rem)` so the body scrollbar is always available while header/footer remain fixed. Mobile uses `max-height: 22rem` and auto card height.
- Không còn entry hoặc artifact `kaui-extended` riêng.

- Cards showcase contract: `demo/card.html` renders three equal-height cards in `#cards .demo-card-grid`; the third `.demo-card-countries` has a scrollable `.demo-country-list` with four equal grid columns (number, calling code, country, time zone). `demo/demo.css` owns showcase-only sizing/scroll styling; core `.k-card` API remains unchanged.

- Mọi component dùng prefix `.k-` và token `--k-*`.
- Tailscale dev serving: `npm run serve:tailscale` runs Python's static server on `0.0.0.0:4173`; access the demo from the tailnet at `http://<tailscale-ip>:4173/`. This is tailnet-only routing and does not configure public exposure.

- Tailscale dev serving: `npm run serve:tailscale` runs Python's static server on `0.0.0.0:8080`; access the demo from the tailnet at `http://<tailscale-ip>:8080/`. This is tailnet-only routing and does not configure public exposure.
- NPM package consumer contract: package root `kaui` resolves to the production stylesheet (`dist/kaui.min.css`) including the generated icon CSS; `kaui/css` resolves to expanded CSS including icons; `kaui/charts` resolves to chart runtime. There is no separate icon import for normal consumers.






## KAUI Extended Package (v2)

- Bundle duy nhất: `kaui.scss` biên dịch thành `dist/kaui.css` và `dist/kaui.min.css`, bao gồm toàn bộ core và advanced components. Không còn entry/bundle `kaui-extended` riêng.

- Bundle duy nhất: `kaui.scss` biên dịch thành `dist/kaui.css` và `dist/kaui.min.css`, đã bao gồm cả core và extended components. `kaui-extended.scss` chỉ giữ lại như source compatibility, không cần load thêm CSS thứ hai.

- Main production bundle budget is < 70KB after including the mandatory KAUI icon CSS; the package root remains the single recommended import.

- Bundle mở rộng: `kaui-extended.scss` tập hợp component nâng cao:
- Color palette demo contract: each `.demo-swatch` displays its hex value and includes `.demo-color-copy[data-copy-color]` to copy the exact color code, with `Copied!` feedback and clipboard fallback.

  - Core & Overlay: Modal, Toast, Tooltip, Popover, Dropdown, Tabs, Accordion, Breadcrumb, Pagination, Spinner, Progress, Skeleton, Avatar, Empty State.
  - Forms: Switch, Range slider, Input Group, File Upload, Floating label.
  - Data: Table, Responsive Table, Data Table, Timeline.
  - App Shell: Sidebar, Stepper, User Menu.
- Mọi component dùng prefix `.k-` và token `--k-*`.



## Demo contract
- `demo/index.html` là trang showcase duy nhất, chứa tokens, layout và các component lõi.

- Sidebar `.demo-sidebar` cố định bên trái trên desktop, mở dạng drawer trên mobile; các link trỏ tới section IDs hiện có.
- `demo/demo.css` chứa style sidebar; `demo/demo.js` quản lý active state và drawer.
- Sidebar layout contract: `.demo-sidebar` is a fixed-height flex column; `.demo-sidebar__header` and `.demo-sidebar__footer` are non-scrolling fixed sections, while `.demo-sidebar__body` owns vertical scrolling with `min-height: 0` and `overflow-y: auto`.
- Sidebar scroll contract: `.demo-sidebar__body` keeps `overflow-y: auto` and independent scrolling, hides native scrollbars across Firefox/WebKit/Edge, and exposes `.demo-sidebar__scroll-controls` overlay arrows on hover/focus. Up/down buttons reflect top/middle/bottom scroll state and scroll by viewport-sized steps.
- Sidebar active-item contract: active state chỉ cập nhật class `.is-active`; đổi trang/hash không tự động thay đổi `scrollTop` của `.demo-sidebar__body`. Người dùng vẫn có thể cuộn sidebar bằng wheel/touch/keyboard hoặc scroll controls.

- Sidebar navigation persistence: multi-page navigation stores the user's `.demo-sidebar__body.scrollTop` in `sessionStorage` and restores it after reload, so changing active pages does not reset the menu to the top or auto-scroll to the active item.


- Scroll control alignment: `.demo-sidebar__scroll-controls` is vertically centered and right-aligned within the sidebar body, with the up button above the down button.

- Scroll button surface tone: `.demo-sidebar__scroll-button` uses a subtle smoky white background (`var(--k-color-surface-subtle, #f8fafc)`) with a slightly softened border to prevent high-glare contrast against light sidebar text.
- GitHub link contract: the demo sidebar and page footer use a KAUI project icon alias for the external-link glyph and open external links in a new tab with `rel="noopener noreferrer"`.




- **Scroll performance update:** `demo/demo.js` batches active-section updates and navbar submenu repositioning through one `requestAnimationFrame` per frame; navbar scroll work is skipped when no submenu is open. Public selectors and behavior remain unchanged.
- **Scroll performance update 2:** removed global capture-phase scroll handling and active-section layout reads during scrolling; default scrolling is native (`scroll-behavior: auto`) to prevent queued smooth-scroll animation jitter.
- **Scroll responsiveness contract:** `.demo-right__body` and `.demo-sidebar__body` use `overscroll-behavior-y: auto`, `touch-action: pan-y`, and `-webkit-overflow-scrolling: touch` for zero-delay native kinetic scrolling.




- Sidebar scroll contract: `.demo-sidebar__body` keeps `overflow-y: auto` and independent scrolling, hides native scrollbars across Firefox/WebKit/Edge, and exposes `.demo-sidebar__scroll-controls` overlay arrows on hover/focus. Up/down buttons reflect top/middle/bottom scroll state and scroll by viewport-sized steps.
- **Scroll contention mitigation:** `src/js/kaui-chart.js` pauses charts outside the viewport and batches pointer crosshair updates; frozen-table height synchronization in `src/js/kaui.js` and `demo/demo.js` batches resize work and avoids redundant height writes. Browser profiling remains required for final attribution.



- Demo icon contract: all showcase and version pages use the project-owned KAUI icon registry via `data-kaui-icon`, inline KAUI SVG paths, and `dist/icons/kaui-icons.css`; no external icon CDN/runtime dependency remains.

- Component demo contract: load only `dist/kaui.css`; showcase sections expose `.k-modal`, `.k-toast`, `.k-tabs__*`, `.k-accordion__*`, `.k-spinner`, `.k-progress`, `.k-skeleton`, Table, and interactive vanilla JS examples.


- Icon contracts: `.k-btn__icon` đặt trước/sau `.k-btn__text`; `.k-input-wrapper` chứa `.k-input__icon--left` hoặc `.k-input__icon--right` cùng input/select/textarea; `.k-card__icon` là icon trái trong card header.
- Extended demo contract: load `dist/kaui-extended.css`; showcase sections expose `.k-modal`, `.k-toast`, `.k-tabs__*`, `.k-accordion__*`, `.k-spinner`, `.k-progress`, `.k-skeleton`, and interactive vanilla JS examples.
- Table demo contract: sidebar links to `#table`; showcase includes `.k-table-wrap`, `.k-table`, `.k-table--striped`, `.k-table--hover`, `.k-table--bordered`, `.k-table--sm`, `.k-table__actions`, and `.k-table__empty`, with copy key `table`.
- Toast positioning contract: `.k-toast-container` hỗ trợ 6 modifier vị trí: `--top-left`, `--top-center`, `--top-right`, `--bottom-left`, `--bottom-center`, `--bottom-right`. Container dùng `pointer-events: none` và các con `pointer-events: auto` để không chặn click xung quanh.
- Mặc định `.k-toast-container` nằm ở `top-right` (`top: var(--k-spacing-4); right: var(--k-spacing-4)`).
- Toast time footer contract: `.k-toast__footer` đặt bên dưới nội dung toast, chứa `.k-toast__time` hiển thị thời gian tương đối (\"bây giờ\", \"1 phút trước\",...) kèm icon đồng hồ/lịch.

- Toast timestamp style: thời gian được hiển thị tinh tế ở bottom-left (không dùng viền phân cách), font size nhỏ gọn (0.6875rem), icon 12x12px đồng bộ với text.
- Modal Dialog Overlay Contract: `.k-modal` đóng vai trò là container toàn màn hình (`position: fixed; inset: 0; z-index: var(--k-z-modal, 1050)`). `.k-modal-backdrop` có `position: fixed; inset: 0; z-index: var(--k-z-modal-backdrop, 1040)`. Phần tử `.k-modal__dialog` được thiết lập `position: relative; z-index: var(--k-z-modal, 1050)` để luôn nổi bật trên lớp backdrop đen mờ, không bao giờ bị overlay che khuất hay làm mờ bóng đen. Hỗ trợ animation mở mượt mà và đóng linh hoạt qua nút Close/Cancel/Confirm, click vào backdrop, click ngoài dialog hoặc phím Escape.
- Confirm Component Contract: `.k-confirm` là một component độc lập riêng biệt với `.k-modal` (không phụ thuộc class `.k-modal`), có anatomy riêng: `.k-confirm`, `.k-confirm__backdrop`, `.k-confirm__dialog`, `.k-confirm__body`, `.k-confirm__icon`, `.k-confirm__title`, `.k-confirm__message`, `.k-confirm__footer`. Hỗ trợ các tone `.k-confirm--warning`, `--danger`, `--success`, `--info`. Mặc định là static (`data-k-backdrop="static"` hoặc không khai báo): click vào backdrop hoặc click ra ngoài dialog không đóng hộp thoại; phím Escape luôn đóng hộp thoại (hoạt động tương đương Cancel). Đặt `data-k-backdrop="true"` nếu muốn cho phép click backdrop/click ngoài để đóng.
- Confirm layout contract: `.k-confirm__icon` nằm trên một dòng riêng phía trên `.k-confirm__title` và `.k-confirm__message`, giúp dialog dễ đọc trên desktop/mobile; footer actions giữ nguyên layout ngang.
- Confirm icon layout contract: `.k-confirm__icon` căn giữa theo chiều ngang (`margin-inline: auto`) và dùng kích thước 4rem với icon bên trong 2rem để tạo điểm nhấn rõ ràng.
- Confirm warning demo contract: demo cung cấp biến thể riêng `.k-confirm.k-confirm--warning` với icon `triangle-alert`, nút action `.k-btn--warning`, backdrop static và hành vi xác nhận độc lập.
- Confirm centered content contract: `.k-confirm__content`, title và message đều `text-align: center`; footer buttons cũng căn giữa để đồng nhất với icon và nội dung cảnh báo.
- Confirm footer layout contract: `.k-confirm__footer` dùng `justify-content: space-between` để Cancel nằm bên trái và Confirm/primary action nằm bên phải; nội dung phía trên vẫn căn giữa.
- Modal close icon contract: nút đóng header của Modal dùng icon KAUI `x` (mapped to the project `close` glyph) thay cho ký tự `&times;`, đảm bảo nét vẽ icon đồng bộ với toàn bộ kit.
- Confirm help icon contract: dùng icon KAUI chuẩn `help` (hỏi đáp/xác nhận), `warning` (cảnh báo) và `delete` (xóa dữ liệu), tránh dependency ngoài và giữ nhận diện cảnh báo nhất quán.
- Confirm dismiss contract: Confirm dùng backdrop static, không đóng khi click ngoài/backdrop, nhưng vẫn cho phép phím Escape đóng và báo trạng thái cancelled.
- Modal header alignment contract: `.k-modal__header .k-alert__close` được override thành flex container (width/height 2rem, `margin: 0`, `align-items: center`) để nút đóng luôn nằm ngang thẳng hàng tuyệt đối với icon và text của tiêu đề.
- Modal title baseline contract: heading trong `.k-modal__header` được reset `margin: 0` và `line-height: 1.25`; nút close dùng cùng flex row `align-items: center` để tâm icon nằm ngang với tâm title/icon header.

- Modal/Confirm footer action icon contract: every demo footer action uses `.k-btn__icon` before `.k-btn__text`; Cancel uses `close`, Confirm/Publish use `check`, and Delete uses `delete`.
- Modal Escape contract: `Escape` always closes the open Modal as a cancel action, including static-by-default Modal; static mode only prevents backdrop/outside click dismissal.

- Modal and Confirm static & Escape contract: Cả Modal và Confirm đều mặc định là static (`data-k-backdrop="static"` hoặc không khai báo), tức là click vào backdrop hoặc click ra ngoài dialog sẽ KHÔNG đóng hộp thoại. Tuy nhiên, phím Escape luôn đóng hộp thoại đang mở (hành vi tiêu chuẩn tương đương Cancel).
- Modal keyboard confirmation contract: while any Modal/Confirm dialog is open, `Enter` triggers its primary action (`Confirm`, `Publish`, or `Delete`) and prevents the default browser action; `Escape` retains the documented static/dismiss behavior.



- Confirm footer icon contract: các nút Cancel/Confirm trong `.k-modal__footer` dùng `.k-btn__icon` với icon KAUI đứng trước `.k-btn__text`.
- Toast icon placement: chuyển icon trạng thái từ cột thụt lề bên trái xuống nằm ngay trước mốc thời gian ở bottom-left (`.k-toast__time`), giúp giải phóng 100% không gian bề ngang cho tiêu đề và nội dung toast.
- Dropdown Select Auto-flip Contract: Component `.k-dropdown-select` đóng vai trò là một custom select box với các modifier `.k-dropdown--dropup`, `.k-dropdown--align-right`. Khi mở menu, script tự động đo tọa độ bounding rect so với viewport: nếu khoảng cách phía dưới không đủ chiều cao menu và phía trên rộng hơn, menu sẽ tự động lật ngược lên trên (`.k-dropdown--dropup`).
- Card Overflow Overlay Contract: `.k-card` giữ `overflow: hidden` mặc định để bo góc và chứa các phần tử con, nhưng khi bên trong có `.k-dropdown.is-open` (hoặc popover / tooltip tương tác), card sẽ tự động chuyển sang `overflow: visible` thông qua selector `:has(...)` để dropdown menu luôn hiển thị nổi lên trên cùng mà không bị mép card cắt xén.
- Language Contract: `demo/index.html` và mã script sử dụng hoàn toàn tiếng Anh (English 100%), không còn chứa song ngữ hay bộ chuyển đổi ngôn ngữ phức tạp.
- Dropdown option configuration: `data-k-searchable="true"` bật search input, `data-k-show-all="true"` bật item `All`; không dùng checkbox để điều khiển runtime. Hai option có thể bật đồng thời và được xử lý độc lập trong `initDropdownSelects(config)`.
- Dropdown search/show-all contract: `.k-dropdown-select` có thể dùng đồng thời `[data-k-dropdown-search]` và `[data-k-dropdown-show-all]`. Search chuẩn hóa Unicode tiếng Việt không dấu, tách nhiều từ khóa theo khoảng trắng, không phụ thuộc vị trí và chỉ hiển thị option chứa đủ toàn bộ từ khóa (`every`). Show all bỏ lọc và khôi phục toàn bộ option.
- Dropdown multi-select contract: bật `data-k-multiple="true"` hoặc dùng `<select multiple>`. Nhiều option có thể được toggle mà không đóng menu; selected values được đồng bộ vào hidden select, `aria-multiselectable="true"`, và hiển thị dạng danh sách phân cách bằng dấu phẩy. Hỗ trợ cùng keyboard navigation/search nếu cấu hình thêm.
- Dropdown demo variants: Country/Region minh họa bật đồng thời `data-k-searchable="true"` + `data-k-show-all="true"`; Region (Show All Only) chỉ bật `data-k-show-all="true"` và không render search input.
- Country/Region dropdown (and any dropdown with search input) starts unselected with no active/selected item. The toggle displays a muted placeholder (configured via `data-k-placeholder="Select country..."` or derived from the search input placeholder). The dropdown menu items contain only genuine selectable options (Vietnam, United States, etc.) and no placeholder option element is rendered in the list.


- Dropdown item hidden rule: `.k-dropdown__item[hidden] { display: none !important; }` để thuộc tính `hidden` của HTML không bị thuộc tính `display: flex` của class selector ghi đè khi lọc kết quả search.
- Dropdown keyboard navigation contract: Khi mở dropdown hoặc đang trong ô search, phím `ArrowDown`/`ArrowUp` sẽ di chuyển highlight (`.is-active`) qua các option đang hiển thị (tự động cuộn theo view), phím `Enter` chọn option đang active (hoặc option đầu tiên nếu chưa chọn), và phím `Escape` đóng dropdown. Phím Arrow/Enter trên nút toggle khi đóng cũng tự động mở menu.
- Dropdown search/show-all styles được xuất ở extended và main bundle để markup demo không tạo orphan classes khi kiểm tra HTML contract.



- Toast auto-dismiss contract: Toast hỗ trợ cấu hình tự động đóng (Auto-dismiss qua timeout với hiệu ứng mờ dần fade-out) hoặc giữ nguyên không tự động đóng (Persistent / Manual close) cho tới khi người dùng bấm nút đóng `&times;`.



- Toast subtle time placement: `.k-toast__footer` và `.k-toast__time` căn lề bottom-left không dùng viền dashed, text size nhỏ gọn 0.6875rem (~11px) và icon đồng hồ 12px tinh tế.

- Toast stacking order: toast mới nhất luôn được thêm vào trên cùng (`prepend`) của `.k-toast-container` để người dùng thấy thông báo mới ngay ở đỉnh ngăn xếp.

- Height alignment contract: `.k-btn`, `.k-input`, `.k-select` có cùng chuẩn `min-height: 2.625rem` (42px) cho kích cỡ mặc định (sm: 2rem/32px, lg: 3rem/48px) để đảm bảo khi đặt cạnh nhau trong cùng hàng (grid, flex) luôn bằng nhau 100%.

- Card header/footer height contract: `.k-card__header` và `.k-card__footer` dùng `height: var(--k-card-header-height)` / `var(--k-card-footer-height)` với giá trị mặc định `3.5rem` (56px), `flex: 0 0` và `box-sizing: border-box`; header giữ `spacing-4`, footer dùng `spacing-3` để gọn hơn; nội dung `.k-card__body` tiếp tục co giãn để các card cùng hàng giữ nhịp đều.




- Warm color token contract: `$colors` defines `amber-50..700` (yellow through orange) and `brown-50..900`; `_root.scss` emits `--k-color-amber-*` / `--k-color-brown-*` plus semantic aliases `--k-amber`, `--k-amber-hover`, `--k-amber-light`, `--k-brown`, `--k-brown-hover`, and `--k-brown-light`.



- Color palette demo contract: `.demo-swatch-meta` and `.demo-color-copy` are grouped in `.demo-swatch-meta-row` on one line to keep swatches compact.
- Prompt quality contract: displayed and copied prompts are synchronized; workflow explicitly resolves latest version, reads the manifest, reuses documented markup, forbids redundant CSS, and requires final accessibility/responsive/theme validation.
- Sidebar brand contract: `.demo-sidebar__brand` keeps `KAUI` and `CSS KIT` on one baseline-aligned row; KAUI is 1.75rem and CSS KIT is .8rem with increased weight/spacing.
- Icon Gallery contract: `#icons` in `demo/index.html` loads `dist/icons/kaui-icons.json` and renders all registered icons using `dist/icons/sprite.svg`; includes direct artifact links and copyable SVG usage.

- Icon Gallery runtime contract: `demo/index.html` loads `dist/icons/kaui-icons.css`; gallery renders from manifest via fetch and falls back to the registered icon names when opened directly with `file://` (where fetch is blocked). Each icon uses the external sprite symbol with `.k-icon` styling.
- Sprite compatibility contract: external icon `<use>` includes both `href` and legacy `xlink:href`; generated `sprite.svg` declares the XLink namespace for browsers with legacy SVG symbol resolution.
- Icon rendering fallback contract: gallery cards inline the registered SVG path data so icons remain visible even when external SVG `<use>` references are blocked by browser security/CORS; manifest and sprite remain linked as artifacts.
- Icon renderer initialization contract: `renderKauiIcons()` may be called by early component setup before icon data is declared; it must guard `iconSvgPaths` and run again after registry initialization.
- Icon color contract: `.kaui-icon` uses `color: inherit` and `stroke: currentColor`; icon color always follows the adjacent text/container state, including hover, active, dark theme, buttons, and headings.
- Icon Gallery card contract: each icon is shown in a compact horizontal card with inline KAUI SVG, icon name, and a dedicated `data-copy-icon` button that copies the standalone SVG snippet with `Copied!` feedback.
- Icon Gallery grouping contract: `renderIconGallery()` groups every manifest icon into functional sections (Actions, Navigation, Files & Content, Feedback, Account & Security, Communication, Commerce, Media, Social, Favorites & Labels, Other); each group has a heading, icon count, responsive grid, and preserves per-icon copy buttons.
- Icon Gallery alignment contract: `.k-card.demo-icon-card` explicitly overrides the card's default column layout to a horizontal row; icon/name group is left-aligned and Copy button is right-aligned.
- Icon Gallery search contract: `#icon-gallery-search` filters the manifest-backed gallery by icon name on input, updates the total badge, preserves category grouping/copy actions, and renders an accessible empty state when there are no matches.

- KAUI Core ownership contract: `scripts/build-kaui-core.mjs` is retained as the Phase 1 historical generator for the 32 original core glyphs; production `npm run icons:build` now builds the complete 67-icon KAUI-owned registry from `icons/source/kaui/` only.

- Icon library contract: `icons/manifest.json` registers only KAUI-owned SVG sources from `icons/source/kaui/`; `npm run icons:build` generates the sole production sprite/CSS/JSON artifacts. No third-party, external icon package, or CDN source is permitted.

- Icon library contract: `icons/manifest.json` registers only KAUI-owned SVG sources from `icons/source/kaui/`; `npm run icons:build` generates the sole production sprite/CSS/JSON artifacts. No external icon source or CDN is permitted.


- Button link hover contract: `.k-btn` explicitly reapplies `color: var(--k-btn-color)` in hover/active states so global typography `a:hover` cannot make button text disappear, including Hero anchor buttons.








- Version Registry time format: build dates render as local `yyyy/MM/dd` with zero-padded month and day; time is intentionally omitted.



- Agent prompt contract: explicitly instructs the agent to access and inspect `https://kaui.filekat.com` before writing code, then copy the closest existing markup pattern instead of inventing a new structure.
- Dark theme sidebar active: `.demo-sidebar__link.is-active` dùng nền primary-900 (`#1e3a8a` fallback) để nổi bật trên nền sidebar tối; light theme giữ nguyên primary-50.
- Dark theme sidebar hover: `.demo-sidebar__link:hover` dùng cùng nền primary-900 như trạng thái active để feedback tương tác nhất quán.
- Dark theme table hover: `.k-table` remap `--k-table-hover-bg` sang primary-900 (`#1e3a8a` fallback), giữ row hover rõ nhưng không bị nền sáng chói.
- Dark theme table hover fix: override trực tiếp `.k-table.k-table--hover tbody tr:hover` và các `td` con bằng primary-900 để thắng specificity của rule component và xử lý cả frozen cell.





- Donut inside-label alignment: label path có span đối xứng quanh midpoint, textPath được căn giữa bằng `startOffset=50%`/`text-anchor=middle`, tương thích href và xlink:href.


## Chart Component (opt-in)
- Bar label contract: renderer `_bar` tạo `.k-chart__bar-label` cho giá trị từng cột và `.k-chart__bar-category` cho từng nhãn trục X; labels dùng màu axis, halo nền chart và giữ nguyên API `KauiChart.create`/dataset.
- Line axis contract: renderer `_line` tạo `.k-chart__line-category` từ `labels[]`, căn đúng theo điểm dữ liệu trên trục X và giữ nguyên API/dataset.

- Line axis angle contract: khi số nhãn Line > 8, renderer tự động áp dụng `transform="rotate(-45 ...)"` và căn lề hai mép (`start`/`end`) để hiển thị toàn bộ giá trị trục X mà không bị cắt hoặc đè nhau.

- Line axis spacing contract: `_line` ước lượng độ rộng nhãn trước khi render; xoay -45° ngay khi nhãn dài hoặc không đủ slot, nhưng luôn dùng `text-anchor="middle"` để tâm nhãn thẳng hàng đều với mốc dữ liệu.

- Line rotated-label anchor contract: khi label được xoay -45°, dùng `text-anchor="end"` để điểm X là điểm đích của nhãn; khi label nằm ngang dùng `middle`.




- Realtime line axis contract: `_line` giới hạn tối đa 8 nhãn trục X, luôn giữ nhãn đầu/cuối; timestamp dạng milliseconds được hiển thị ngắn gọn `HH:mm:ss`, label text thông thường giữ nguyên.





- Chart is isolated from the core bundle: `src/scss/kaui-chart.scss` builds `dist/kaui-chart.css` and `dist/kaui-chart.min.css`; `src/js/kaui-chart.js` builds `dist/kaui-chart.js` and `dist/kaui-chart.min.js`.
- Donut compact label position: textPath dùng bán kính `r` (centerline của stroke donut), label nằm giữa bề dày vùng màu và dùng màu trắng tương phản.

- Native SVG, zero external chart dependencies. Public API starts with `KauiChart.create(target, options)` / `KauiChart.mount(target, options)`.
- Supported types: `line`, `bar`, `donut`. Instance API: `push`, `pushBatch`, `appendData`, `addSeries`, `updateSeries`, `removeSeries`, `updatePoint`, `removeData`, `clear`, `pause`, `resume`, `destroy`.
- Donut adaptive labels v2: ước lượng width từ nội dung label, bố trí dot theo cột trái/phải tương ứng, dùng adaptive vertical gap và leader line radial 3-point; tránh overlap tốt hơn trên chart hẹp.
- Donut compact fallback: khi outer label không đủ vùng, labels render bên trong theo cung bằng SVG `textPath`, canh giữa và dùng màu tương phản với nền Donut.


- Donut label layout: labels được phân loại theo nửa trái/phải, sort theo vị trí cung, phân bổ Y với gap tối thiểu và leader line nối 3 điểm; text luôn nằm trong vùng an toàn SVG.
- Donut visual polish: leader line now uses radial elbow + horizontal segment + dot connector; labels use two-way relaxation with original angular Y preference and a background halo for readability.


- Runtime hardening: Chart dùng fallback `setTimeout` khi không có `requestAnimationFrame`, tự tạo series mặc định nếu dataset rỗng, và gỡ pointer listeners khi `destroy()`.
- Donut labels: renderer dùng `labels[]` theo index dữ liệu, vẽ dot + leader line ra ngoài và hiển thị `label: value (percent%)`; style nằm trong opt-in chart CSS.


- Realtime contract: updates are batched with `requestAnimationFrame`; `maxPoints`, `window`, `maxPending`, and automatic pause on hidden documents are supported.

- Chart demo contract: `#charts` exposes copy buttons with keys `charts`, `chart-line`, `chart-bar`, `chart-donut`, and `chart-realtime`; snippets live in `componentSnippets` in `demo/demo.js` and use the opt-in `kaui-chart` bundle/API.



## Demo multi-page contract
- `demo/index.html` là Overview page, chỉ chứa phần giới thiệu/agent prompt và không còn chứa các component showcase.
- Mỗi component page (`button.html`, `card.html`, `tokens.html`, …) phải load `../dist/kaui.css`, `../dist/icons/kaui-icons.css`, `demo.css`, `demo.js` và có cùng `.demo-sidebar` trái như Overview.
- Sidebar dùng link file trực tiếp, với `index.html` là Overview; trạng thái active được đánh dấu theo page hiện tại.
- `demo/demo.js` là runtime dùng chung, không đổi public component contracts hay API chart.

- Footer demo contract: `.demo-footer` là thanh compact `position: fixed` ở đáy vùng nội dung, bắt đầu sau sidebar desktop (`left: 15.5rem`) và full-width trên mobile; `.demo-page`/`.demo-main` có bottom spacing để nội dung không bị che.
- Component page guide contract: mỗi component showcase page (`tokens`, `navbar`, `layout`, `button`, `forms`, `charts`, `icons`, `card`, `badges`, `alerts`, `modal`, `table`, `toast`, `tabs`, `accordion`, `indicators`) có khối `Usage guide & code sample`, giải thích cách dùng ngắn gọn, code mẫu `<pre class="demo-code">` và nút sao chép `data-copy-component="guide-*"`.
- Button loading demo contract: `demo/button.html` includes a dedicated loading code sample with `.k-btn--loading`, `.k-btn__loader`, `.k-btn__text`, and `aria-busy="true"`; copy mapping is `guide-button-loading`.

- Icon Gallery grouping fix: `#icon-gallery-grid` is a plain group wrapper; each functional icon group owns its own `.k-grid`, preventing grouped sections from being laid out as grid columns. The total badge is populated from the loaded manifest/fallback count instead of a hard-coded number.
- Social X icon contract: `icons/source/kaui/social-x.svg` uses a filled geometric X glyph with `fill="currentColor"`; generated `.k-icon--social-x` overrides the global stroke-only icon defaults.
- Social Zalo icon contract: `icons/source/kaui/social-zalo.svg` uses a chat-bubble outline with a centered Z wordmark gesture, preserving the documented KAUI-authored brand-reference status and Zalo trademark notice.

- Social Zalo wordmark contract: `social-zalo.svg` renders the literal `zalo` text inside the chat bubble using `fill="currentColor"` and no stroke, while the bubble remains a rounded currentColor outline.
- Social Zalo wordmark sizing: `social-zalo.svg` intentionally contains only the centered `zalo` wordmark (no surrounding bubble), sized at 14px with compact letter spacing to fill the 24x24 icon box while remaining legible.
- Social WhatsApp icon contract: `icons/source/kaui/social-whatsapp.svg` uses a clear chat bubble outline with an integrated handset glyph, keeping `currentColor`, 24x24 viewBox, and rounded stroke conventions.
- Icon registry current baseline: production contains 83 KAUI-owned icons, including 16 social-network glyphs; update this line when additional groups are added.
- Sidebar navigation grouping contract: every demo page groups the shared links under accessible `.demo-sidebar__group` sections with `.demo-sidebar__group-title`; groups are Getting Started, Layout, Components, and Resources, while link URLs and active-state behavior remain unchanged.
- Sidebar taxonomy: Components contains Buttons, Forms, Cards, Badges, Alerts, Modal, Table, Toast, Tabs, Accordion, Indicators, and Charts; Resources contains Icons, Versions, and Platforms.
- Sidebar active-state contract: on multi-page demo documents, `demo/demo.js` derives the active `.demo-sidebar__link` from the current pathname/filename; hash-based section activation remains available only when sidebar links target same-page hashes.
- Sidebar navigation grouping contract: every demo page groups the shared links under accessible `.demo-sidebar__group` sections with `.demo-sidebar__group-title`; groups are Getting Started, Layout, Components, and Resources. Components now includes the Sidebar demo link and `demo/sidebar.html` demonstrates the public `.k-sidebar` component.
- Sidebar component demo contract: `demo/sidebar.html` uses a fixed-height `.demo-sidebar-preview`; `.k-sidebar__header` and `.k-sidebar__footer` are non-shrinking fixed regions, while `.k-sidebar__body` is the only scrollable region and contains enough navigation items to demonstrate scrolling.
- Sidebar separator contract: public `.k-sidebar__header` uses `border-bottom: 1px solid var(--k-border)` and public `.k-sidebar__footer` uses `border-top: 1px solid var(--k-border)`; `.k-sidebar__body` remains the only scrollable region between these separators.
- Full-width separator contract: `.k-sidebar` has no outer padding; spacing is owned by `.k-sidebar__header`, `.k-sidebar__body`, and `.k-sidebar__footer`, allowing header bottom and footer top borders to extend from the sidebar's left edge to its right edge.
- Sidebar scrolling and scrollbar parity: `.k-sidebar__body` has `scrollbar-width: thin` and a WebKit scrollbar of `0.35rem` with neutral thumb color and zero track padding, placing the scrollbar flush against the right boundary of the sidebar, identical to the main KAUI left navigation shell.






- Navigation Bar options contract: `.k-navbar--sticky`, `--borderless`, `--shadow`, `--transparent`, `--dark`, `--compact`, `--centered`; optional `.k-navbar__actions`, `.k-navbar__mobile-actions`, `.k-navbar__item--has-children` and `.k-navbar__submenu` preserve the existing base markup and responsive drawer behavior.
- Bootstrap-inspired Navbar contract: `.k-navbar--expand-sm` / `--expand-lg` control collapse breakpoint; `.k-navbar--fixed-top` / `--fixed-bottom` provide placement; `.k-navbar--offcanvas` turns the mobile menu into a left drawer; `.k-navbar__text`, `.k-navbar__nav--scroll` and click-driven `.k-navbar__item--has-children.is-open` support Bootstrap-style content patterns without Bootstrap runtime dependencies. Toggle/dropdown controls use `aria-expanded`, `aria-controls`, `aria-haspopup`, and Escape/outside-click dismissal.
- Visual Navbar contract: demo uses KAUI-owned icon registry for brand/dropdown/actions, `.k-navbar__link.is-active` uses a subtle primary surface, dropdown buttons reset native button chrome, and action buttons use `.k-btn__icon` + `.k-btn__text`; avoid explanatory badges or third-party visual language inside the component showcase.

- Multi-level Navbar contract: nested `.k-navbar__item--has-children` may contain another `.k-navbar__submenu`; desktop nested menus fly out to the right, mobile menus remain in normal flow. Each toggle is a button with `aria-haspopup="true"` and synchronized `aria-expanded`; sibling branches close when another branch opens.
- Modal demo implementation contract: `demo/modal.html` includes `#demo-modal` and `#demo-countries-modal`, while `demo/confirm.html` houses `#demo-confirm`, `#demo-confirm-warning`, and `#demo-confirm-danger` plus each referenced backdrop/action ID, because `demo/demo.js` binds interaction by these IDs.
- Flutter package contract: the pub.dev package is named `filekat`, located at `packages/pub`, with public library import `package:filekat/kaui.dart`.
- Flutter package `filekat` is version `1.1.0+` and uses the KAUI Personal / Non-Commercial License; its package LICENSE, README, and CHANGELOG must remain aligned with `NON_COMMERCIAL_LICENSE.md` and commercial contact `contact@filekat.com`.
- Demo shell scroll contract: `.demo-body` và `.demo-right` giữ `height: 100vh` với `overflow: hidden`; `.demo-header` và `.demo-footer` là flex items cố định không co/không scroll; chỉ `.demo-right__body` có `overflow-y: auto` và `min-height: 0` để cuộn nội dung.

- Header alignment contract: `.demo-sidebar__header` and `.demo-header` share `--demo-header-height` (4.25rem desktop, 3.5rem mobile), with explicit border-box height so their bottom borders align exactly.
- Demo section title spacing contract: shared `.demo-section`/`.demo-section-header` spacing is intentionally compact (1.5rem section padding, 1rem header gap, 0.25rem title bottom margin) across all 19 demo pages.




- Demo right-shell contract: every demo page now uses `.demo-right` beside the fixed sidebar; its ordered children are `.demo-header`, `.demo-right__body` (containing `.demo-main`), and `.demo-footer`. The header is a compact page-context bar; body owns page content; footer remains fixed to the content viewport.

- Platform package layout: `packages/npm` contains the npm/Web package and `packages/pub` contains the pub.dev/Flutter package. Android and iOS native packages are currently paused and are not included in the repository package layout.


- Navbar submenu contract: `.k-navbar__item--has-children` hỗ trợ lồng vô hạn; trên desktop submenu tự động lật lên (`.is-dropup`) khi thiếu khoảng trống phía dưới và mở ngược sang trái (`.is-dropstart`) khi thiếu khoảng trống bên phải. Runtime `demo/demo.js` đo `getBoundingClientRect()` sau khi mở và khi resize/scroll; mobile giữ submenu xếp dọc trong flow.

- Blue theme readability contract: when the preset is `default` (no `data-theme` attribute), demo body text uses weight 500, muted/supporting text uses weight 500, and sidebar/Navbar links use weight 600; other theme presets retain their existing weights.

- Navbar flyout demo contract: desktop `.k-navbar__nav--scroll` must use `overflow: visible` so nested flyouts are not clipped; mobile restores vertical scrolling. `demo/navbar.html` keeps Components → Advanced open on initial load so the multi-level example is immediately visible.

- Navbar desktop flyout contract: submenu opens horizontally to the right by default or left with `.is-dropstart`, with `top: 0` so its top edge aligns with the parent item; mobile remains stacked in normal flow.

- Navbar hover bridge contract: `.k-navbar__submenu::before` acts as an invisible continuous hit zone bridging the gap between parent and submenu across all orientations (down, dropup, flyout right, flyout left) preventing mouse hover loss during traversal.
- Navbar submenu spacing contract: nested desktop flyout horizontal gap is `var(--k-spacing-3)` (12px) with internal submenu link padding `var(--k-spacing-2) var(--k-spacing-3)` and matching hover bridge width.
- Navbar dynamic hover-flip contract: `demo/demo.js` binds live `mouseenter`/`focusin` measurement so deeply nested submenus (Level 3, Level 4) automatically flip left (`.is-dropstart`) whenever they reach the right viewport boundary or inherit from a dropstart parent.
- Navbar documentation contract: project maintains `kapul-docs/TECHNICAL_DOCS.md` for developer architecture and `kapul-docs/USER_GUIDE.md` for end-user interaction/QA testing, plus multi-level examples in `README.md`.

- Navbar single-direction cascade contract: once a branch orientation is determined based on nearest viewport side (right side defaults to leftward `.is-dropstart`), all descendant submenus strictly open in that same direction in a clean monotonic staircase, preventing zig-zag overlapping.

- **Public URL/source privacy contract:** Public CDN/demo/release links are canonicalized to `https://kaui.filekat.com`; project-owned GitHub repository links are removed from demo footers and package metadata because the source repository is private. Third-party attribution and package registry URLs remain unchanged.
- Navbar outside-click contract: clicking outside the navbar dismisses all open submenus across both desktop (`.k-navbar__item--has-children.is-open`) and mobile drawer modes (`closeNavbarMenus`).

- Navbar dropstart specificity contract: `.is-dropstart` selector explicitly takes precedence over breakpoint modifiers (`.k-navbar--expand-lg`) with `right: calc(...) !important; left: auto !important;`, flipping chevron icons and cascading dropstart to deeply nested levels (Level 4+).
- Navbar demo runtime breakpoint contract: `demo/navbar.html` uses `.k-navbar--expand-lg`, so `demo/demo.js` must treat widths below `1024px` as drawer/mobile mode and only run desktop submenu geometry at `>=1024px`.
- Navbar demo container contract: all sections, cards, and interactive labs on `demo/navbar.html` must remain inside `.k-container` to maintain max-width and responsive margin/padding consistent with other component showcases.
- Code block scroll containment contract: `pre` elements must isolate only the horizontal axis (`overscroll-behavior-x: contain`) while keeping vertical overscroll natural (`overscroll-behavior-y: auto`) to avoid trapping vertical scrolling when the cursor is positioned over non-vertical-scrolling code blocks.




- Navbar cascade close contract: closing any parent or root menu item (`!isOpen`, sibling switch, mobile drawer close, Escape, or outside click) recursively resets all child submenus (`is-open`, `is-dropup`, `is-dropstart`, `aria-expanded="false"`).
- Navbar click-only interaction contract: opening any submenu requires an explicit user click (`BUTTON` trigger); hover purely provides visual highlight without opening submenus, eliminating all hover/click conflicts and ensuring deterministic cascade closing.

- Navbar hover/click reconciliation contract: submenu visibility is strictly driven by `.is-open` class; hover seamlessly applies `.is-open` with debounced leave, while explicit click to close closes the branch immediately (`manuallyClosedMap`) without CSS `:hover` overriding user intent.
- Navbar active typography contract: `.k-navbar__link.is-active` retains normal/medium font weight without forcing bold/semibold, distinguishing active state cleanly via color and surface tint.

- Navbar hover weight contract: `.k-navbar__link:hover` does not increase `font-weight` preventing layout shift while applying `--demo-sidebar-active-bg` and primary tone.


- Navbar item hover background contract: `.k-navbar__link:hover` and active/open parent links consume `--demo-sidebar-active-bg` matching the left sidebar active tone across Blue (`#dbeafe`), Ocean (`#a5f3fc`), Forest (`#bbf7d0`), Sunset (`#fed7aa`), and Dark (`#1e3a8a`).





- Navbar guide contract: `demo/navbar.html` provides three independent copy actions (`guide-navbar-basic`, `guide-navbar-nested`, `guide-navbar-overflow`) covering base structure, ARIA nested menus, modifiers, responsive drawer, and viewport-aware flip behavior; payloads live in `demo/demo.js`.
- Demo typography rendering contract: `demo/demo.css` must use `antialiased`/`grayscale`/`text-rendering: auto` and opaque theme surfaces; do not reintroduce `subpixel-antialiased`, `optimizeLegibility`, or transparent `color-mix` on fixed chrome because they can cause visible blur on macOS/WebKit.
- Core package typography contract: `src/scss/base/_reset.scss` and generated package CSS use `text-rendering: auto` with antialiased/grayscale smoothing; consumers importing `filekat/kaui` receive the same rendering fix as the demo.
- Core text contrast contract: `--k-color-text-muted` source value is `#475569` (not the lighter `#64748b`) so secondary text remains crisp on light surfaces in both demo and published package artifacts.
- Demo footer version contract: the right-aligned link in `.demo-footer` displays the current release version (`v1.1.4`) and links to `versions.html` across all 20 demo pages, instead of linking to Overview.
- Dark sidebar active contrast contract: in Dark mode (`[data-theme="dark"]`), `.demo-sidebar__link.is-active` and `.demo-sidebar__link:hover` (including their icons) strictly enforce text color `#ffffff` over the dark blue background `--demo-sidebar-active-bg` (`#1e3a8a`) for crystal-clear readability.
- Main footer copyright & contact contract: the left side of `.demo-footer` provides `<span class="k-fw-bold k-text-primary">KAUI CSS Kit</span> &copy; 2026 KAUI Contributors. Contact: <a href="mailto:contact@filekat.com" class="k-navbar__link">contact@filekat.com</a>` across all 20 demo pages.
- Overview hero rhythm contract: `.demo-hero` uses `padding: 1.5rem 0` to match the exact vertical padding and container gutter alignment of `.demo-section` on all other component pages.
- Scroll containment contract: all scrollable containers (`.demo-sidebar__body`, `.demo-right__body`, `pre`, `.demo-code`, `.k-dropdown__menu`, `.k-tabs__list`, `.k-modal__body`, `.k-table-viewport--scrollable`) strictly declare `overscroll-behavior: contain` to prevent scroll chaining across adjacent viewports.
- Triple-platform release contract: `scripts/release-flow.mjs` and `scripts/release.mjs` automatically synchronize `packages/npm/package.json` and `packages/pub/pubspec.yaml`, copy latest dist artifacts into `packages/npm/dist`, deploy to Railway, and publish live to NPM (`filekat`) and Pub.dev (`filekat`).









- Navbar direction contract: root submenu (`.k-navbar__nav > li > .k-navbar__submenu`) opens vertically below/above its root item; nested submenus open horizontally left/right with top edge aligned to their parent item. Runtime only applies `.is-dropstart` to nested items.

- Sidebar component contract: `src/scss/components/_sidebar.scss` provides reusable `.k-sidebar` anatomy (header/body/footer/nav/group/link), keyboard focus and active states, and responsive mobile behavior. The `.k-app-shell` layout remains in `src/scss/extended/_data_shell.scss` without duplicate sidebar rules.
