
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
- Version contract: canonical version is `package.json`; `npm run release:patch|minor|major` bumps version and archives immutable artifacts under `dist/versions/<version>/`. `dist/versions/index.json` tracks latest/version history; unversioned `dist/*` remains the compatibility alias.
- Table contract: `src/scss/components/_table.scss` xuất `.k-table-wrap`, `.k-table`, `.k-table th/td`, `.k-table--striped`, `.k-table--hover`, `.k-table--bordered`, `.k-table--sm`, `.k-table--responsive`, `.k-table--frozen`, `.k-table__actions`, `.k-table__empty`, `.k-table__toolbar`, `.k-table__search`, và `.k-table__sort`. Partial được forward từ `components/_index.scss`; extended bundle không còn định nghĩa trùng trong `extended/_data_shell.scss`.
- Table options contract: root `[data-k-table]` nhận `data-k-searchable="true"`, `data-k-sortable="true"`, `data-k-sort-columns="0,3"`, và `data-k-freeze="1"`. Search input là `[data-k-table-search]`; thuật toán giống dropdown: chuẩn hóa Unicode/không dấu, tách từ khóa bằng khoảng trắng và chỉ giữ row chứa đủ mọi từ khóa. Sort chỉ gắn button cho các chỉ số cột được chỉ định; giá trị số dùng `data-k-sort-value`. Freeze làm sticky `--k-table-freeze-count` cột đầu tiên.

## Button loading contract

- `.k-btn__icon`: icon bình thường, bị ẩn khi loading.
- `.k-btn__loader`: spinner, mặc định ẩn.
- `.k-btn__text`: text gốc luôn được giữ lại.
- `.k-btn--loading` hoặc `.is-loading`: hiển thị spinner, ẩn icon thường và khóa tương tác.

## Bundle

- Bundle duy nhất: `kaui.scss` biên dịch thành `dist/kaui.css` và `dist/kaui.min.css`, bao gồm toàn bộ core và advanced components.
- Không còn entry hoặc artifact `kaui-extended` riêng.
- Mọi component dùng prefix `.k-` và token `--k-*`.
- Tailscale dev serving: `npm run serve:tailscale` runs Python's static server on `0.0.0.0:4173`; access the demo from the tailnet at `http://<tailscale-ip>:4173/demo/`. This is tailnet-only routing and does not configure public exposure.

- Tailscale dev serving: `npm run serve:tailscale` runs Python's static server on `0.0.0.0:8080`; access the demo from the tailnet at `http://<tailscale-ip>:8080/demo/`. This is tailnet-only routing and does not configure public exposure.





## KAUI Extended Package (v2)

- Bundle duy nhất: `kaui.scss` biên dịch thành `dist/kaui.css` và `dist/kaui.min.css`, bao gồm toàn bộ core và advanced components. Không còn entry/bundle `kaui-extended` riêng.

- Bundle duy nhất: `kaui.scss` biên dịch thành `dist/kaui.css` và `dist/kaui.min.css`, đã bao gồm cả core và extended components. `kaui-extended.scss` chỉ giữ lại như source compatibility, không cần load thêm CSS thứ hai.

- Bundle chính: `kaui.scss` giữ các thành phần cơ bản để tuân thủ ngân sách < 64KB cho kiểm thử tự động.

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
- Scroll control alignment: `.demo-sidebar__scroll-controls` is vertically centered and right-aligned within the sidebar body, with the up button above the down button.

- Scroll button surface tone: `.demo-sidebar__scroll-button` uses a subtle smoky white background (`var(--k-color-surface-subtle, #f8fafc)`) with a slightly softened border to prevent high-glare contrast against light sidebar text.
- GitHub link contract: the demo sidebar footer and page footer link to `https://github.com/longbm64/kaui`, use the Lucide GitHub icon in the sidebar, and open external links in a new tab with `rel="noopener noreferrer"`.





- Sidebar scroll contract: `.demo-sidebar__body` keeps `overflow-y: auto` and independent scrolling, hides native scrollbars across Firefox/WebKit/Edge, and exposes `.demo-sidebar__scroll-controls` overlay arrows on hover/focus. Up/down buttons reflect top/middle/bottom scroll state and scroll by viewport-sized steps.


- Demo icon contract: dùng Lucide Icons qua CDN `https://unpkg.com/lucide@latest`; markup icon dùng `data-lucide` và khởi tạo trong `demo/demo.js`.
- Component demo contract: load only `dist/kaui.css`; showcase sections expose `.k-modal`, `.k-toast`, `.k-tabs__*`, `.k-accordion__*`, `.k-spinner`, `.k-progress`, `.k-skeleton`, Table, and interactive vanilla JS examples.


- Icon contracts: `.k-btn__icon` đặt trước/sau `.k-btn__text`; `.k-input-wrapper` chứa `.k-input__icon--left` hoặc `.k-input__icon--right` cùng input/select/textarea; `.k-card__icon` là icon trái trong card header.
- Extended demo contract: load `dist/kaui-extended.css`; showcase sections expose `.k-modal`, `.k-toast`, `.k-tabs__*`, `.k-accordion__*`, `.k-spinner`, `.k-progress`, `.k-skeleton`, and interactive vanilla JS examples.
- Table demo contract: sidebar links to `#table`; showcase includes `.k-table-wrap`, `.k-table`, `.k-table--striped`, `.k-table--hover`, `.k-table--bordered`, `.k-table--sm`, `.k-table__actions`, and `.k-table__empty`, with copy key `table`.
- Toast positioning contract: `.k-toast-container` hỗ trợ 6 modifier vị trí: `--top-left`, `--top-center`, `--top-right`, `--bottom-left`, `--bottom-center`, `--bottom-right`. Container dùng `pointer-events: none` và các con `pointer-events: auto` để không chặn click xung quanh.
- Mặc định `.k-toast-container` nằm ở `top-right` (`top: var(--k-spacing-4); right: var(--k-spacing-4)`).
- Toast time footer contract: `.k-toast__footer` đặt bên dưới nội dung toast, chứa `.k-toast__time` hiển thị thời gian tương đối (\"bây giờ\", \"1 phút trước\",...) kèm icon đồng hồ/lịch.

- Toast timestamp style: thời gian được hiển thị tinh tế ở bottom-left (không dùng viền phân cách), font size nhỏ gọn (0.6875rem), icon 12x12px đồng bộ với text.
- Modal Dialog Overlay Contract: `.k-modal` đóng vai trò là container toàn màn hình (`position: fixed; inset: 0; z-index: var(--k-z-modal, 1050)`). `.k-modal-backdrop` có `position: fixed; inset: 0; z-index: var(--k-z-modal-backdrop, 1040)`. Phần tử `.k-modal__dialog` được thiết lập `position: relative; z-index: var(--k-z-modal, 1050)` để luôn nổi bật trên lớp backdrop đen mờ, không bao giờ bị overlay che khuất hay làm mờ bóng đen. Hỗ trợ animation mở mượt mà và đóng linh hoạt qua nút Close/Cancel/Confirm, click vào backdrop, click ngoài dialog hoặc phím Escape.
- Confirm Component Contract: `.k-confirm` mở rộng `.k-modal` cho các luồng xác nhận compact, dùng `.k-confirm__content`, `.k-confirm__icon`, `.k-confirm__title`, `.k-confirm__message` và hỗ trợ tone `.k-confirm--warning`, `--danger`, `--success`, `--info`. Backdrop mặc định là static (`data-k-backdrop="static"`): click ngoài và Escape không đóng hộp thoại; chỉ đóng bằng nút Cancel hoặc Confirm. Đặt `data-k-backdrop="true"` nếu muốn cho phép click ngoài. Có thể dùng chung `.k-modal__footer` cho hai action Cancel/Confirm và giữ nguyên backdrop/z-index của Modal.
- Confirm layout contract: `.k-confirm__icon` nằm trên một dòng riêng phía trên `.k-confirm__title` và `.k-confirm__message`, giúp dialog dễ đọc trên desktop/mobile; footer actions giữ nguyên layout ngang.
- Confirm icon layout contract: `.k-confirm__icon` căn giữa theo chiều ngang (`margin-inline: auto`) và dùng kích thước 4rem với icon bên trong 2rem để tạo điểm nhấn rõ ràng.
- Confirm warning demo contract: demo cung cấp biến thể riêng `.k-confirm.k-confirm--warning` với icon `triangle-alert`, nút action `.k-btn--warning`, backdrop static và hành vi xác nhận độc lập.
- Confirm centered content contract: `.k-confirm__content`, title và message đều `text-align: center`; footer buttons cũng căn giữa để đồng nhất với icon và nội dung cảnh báo.
- Confirm footer layout contract: `.k-confirm .k-modal__footer` dùng `justify-content: space-between` để Cancel nằm bên trái và Confirm/primary action nằm bên phải; nội dung phía trên vẫn căn giữa.
- Modal close icon contract: nút đóng header của Modal dùng icon Lucide `x` (`data-lucide="x"`) thay cho ký tự `&times;`, đảm bảo nét vẽ icon đồng bộ với toàn bộ kit.
- Confirm help icon contract: dùng tên Lucide canonical `circle-help` thay cho alias `help-circle` để tránh icon bị render sai hướng khi dùng CDN Lucide latest.
- Confirm dismiss contract: Confirm dùng backdrop static, không đóng khi click ngoài/backdrop, nhưng vẫn cho phép phím Escape đóng và báo trạng thái cancelled.
- Modal header alignment contract: `.k-modal__header .k-alert__close` được override thành flex container (width/height 2rem, `margin: 0`, `align-items: center`) để nút đóng luôn nằm ngang thẳng hàng tuyệt đối với icon và text của tiêu đề.
- Modal title baseline contract: heading trong `.k-modal__header` được reset `margin: 0` và `line-height: 1.25`; nút close dùng cùng flex row `align-items: center` để tâm icon nằm ngang với tâm title/icon header.

- Confirm footer icon contract: các nút Cancel/Confirm trong `.k-modal__footer` dùng `.k-btn__icon` với Lucide icon đứng trước `.k-btn__text`, giúp nhận diện hành động nhanh và giữ đúng Button contract.
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




- Warm color token contract: `$colors` defines `amber-50..700` (yellow through orange) and `brown-50..900`; `_root.scss` emits `--k-color-amber-*` / `--k-color-brown-*` plus semantic aliases `--k-amber`, `--k-amber-hover`, `--k-amber-light`, `--k-brown`, `--k-brown-hover`, and `--k-brown-light`.



- Color palette demo contract: `.demo-swatch-meta` and `.demo-color-copy` are grouped in `.demo-swatch-meta-row` on one line to keep swatches compact.
- Prompt UI contract: Overview keeps the prompt container compact by rendering the title, copy button, and code block directly without redundant intro paragraphs.
- Version registry URLs: `dist/versions/index.json` stores each version's `files` as objects with `name`, absolute public `url`, and checksum metadata; Version Registry renders those URLs directly.
- Version Registry time format: build dates render as local `yyyy/MM/dd` with zero-padded month and day; time is intentionally omitted.



- Agent prompt contract: explicitly instructs the agent to access and inspect `https://longbm64.github.io/kaui/demo/` before writing code, then copy the closest existing markup pattern instead of inventing a new structure.
- Dark theme sidebar active: `.demo-sidebar__link.is-active` dùng nền primary-900 (`#1e3a8a` fallback) để nổi bật trên nền sidebar tối; light theme giữ nguyên primary-50.
- Dark theme sidebar hover: `.demo-sidebar__link:hover` dùng cùng nền primary-900 như trạng thái active để feedback tương tác nhất quán.
- Dark theme table hover: `.k-table` remap `--k-table-hover-bg` sang primary-900 (`#1e3a8a` fallback), giữ row hover rõ nhưng không bị nền sáng chói.
- Dark theme table hover fix: override trực tiếp `.k-table.k-table--hover tbody tr:hover` và các `td` con bằng primary-900 để thắng specificity của rule component và xử lý cả frozen cell.






## Chart Component (opt-in)
- Chart is isolated from the core bundle: `src/scss/kaui-chart.scss` builds `dist/kaui-chart.css` and `dist/kaui-chart.min.css`; `src/js/kaui-chart.js` builds `dist/kaui-chart.js` and `dist/kaui-chart.min.js`.
- Native SVG, zero external chart dependencies. Public API starts with `KauiChart.create(target, options)` / `KauiChart.mount(target, options)`.
- Supported types: `line`, `bar`, `donut`. Instance API: `push`, `pushBatch`, `appendData`, `addSeries`, `updateSeries`, `removeSeries`, `updatePoint`, `removeData`, `clear`, `pause`, `resume`, `destroy`.
- Realtime contract: updates are batched with `requestAnimationFrame`; `maxPoints`, `window`, `maxPending`, and automatic pause on hidden documents are supported.

- Chart demo contract: `#charts` exposes copy buttons with keys `charts`, `chart-line`, `chart-bar`, `chart-donut`, and `chart-realtime`; snippets live in `componentSnippets` in `demo/demo.js` and use the opt-in `kaui-chart` bundle/API.
