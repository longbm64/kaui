/**
 * KAUI Demo Interactive Showcase Scripts
 * Zero-dependency vanilla JavaScript for theme switching, mobile drawer navigation, and alert dismissal.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons if available
    function renderLucideIcons() {
      if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
    renderLucideIcons();

    // -------------------------------------------------------------------------
    // Custom Dropdown-Select Controller with search, all-option, multi-select and keyboard navigation
    function initDropdownSelects(config) {
      var options = config || {};
      var dropdowns = document.querySelectorAll('[data-k-dropdown-select]');
      dropdowns.forEach(function (container) {
        var toggle = container.querySelector('.k-dropdown__toggle');
        var menu = container.querySelector('.k-dropdown__menu');
        var hiddenSelect = container.querySelector('select');
        var valueDisplay = container.querySelector('.k-dropdown__value');
        var searchInput = container.querySelector('[data-k-dropdown-search]');
        var items = container.querySelectorAll('.k-dropdown__item');
        var searchable = typeof options.searchable === 'boolean' ? options.searchable : container.getAttribute('data-k-searchable') === 'true';
        var showAll = typeof options.showAll === 'boolean' ? options.showAll : container.getAttribute('data-k-show-all') === 'true';
        var multiple = typeof options.multiple === 'boolean' ? options.multiple : (container.getAttribute('data-k-multiple') === 'true' || Boolean(hiddenSelect && hiddenSelect.multiple));
        var placeholder = container.getAttribute('data-k-placeholder') || (valueDisplay ? valueDisplay.textContent : 'Select options...');
        var searchBox = container.querySelector('.k-dropdown__search');
        var explicitPlaceholder = container.getAttribute('data-k-placeholder');
        var defaultPlaceholder = explicitPlaceholder;
        if (!defaultPlaceholder && searchable && searchInput) {
          var searchPlaceholder = searchInput.getAttribute('placeholder') || '';
          defaultPlaceholder = searchPlaceholder.replace(/^Search\s*/i, 'Select ') || 'Select option...';
        }
        if (!defaultPlaceholder) defaultPlaceholder = 'Select option...';

        // Searchable dropdowns start unselected; the placeholder is display-only.
        if (searchable && !multiple) {
          if (valueDisplay) {
            valueDisplay.textContent = defaultPlaceholder;
            valueDisplay.classList.add('is-placeholder');
          }
          if (hiddenSelect) hiddenSelect.value = '';
          items.forEach(function (item) {
            item.classList.remove('is-selected', 'is-active');
            item.removeAttribute('aria-selected');
          });
        }

        var allOption = container.querySelector('.k-dropdown__item[data-value="all"]');
        var activeIndex = -1;

        if (searchBox) searchBox.hidden = !searchable;
        if (allOption) allOption.hidden = !showAll;
        if (hiddenSelect) {
          var allSelectOption = hiddenSelect.querySelector('option[value="all"]');
          if (allSelectOption) allSelectOption.disabled = !showAll;
        }

        function visibleItems() {
          return Array.prototype.filter.call(items, function (item) { return !item.hidden; });
        }
        function setActive(index) {
          var visible = visibleItems();
          if (!visible.length) return;
          activeIndex = (index + visible.length) % visible.length;
          visible.forEach(function (item, i) {
            item.classList.toggle('is-active', i === activeIndex);
            if (i === activeIndex) item.scrollIntoView({ block: 'nearest' });
          });
        }
        function clearActive() {
          activeIndex = -1;
          items.forEach(function (item) { item.classList.remove('is-active'); });
        }

        function updateDisplay() {
          if (!valueDisplay) return;
          if (!multiple) return;
          var selectedItems = container.querySelectorAll('.k-dropdown__item.is-selected');
          var labels = [];
          selectedItems.forEach(function (i) {
            var val = i.getAttribute('data-value');
            if (val) labels.push(i.textContent.replace('✓', '').trim());
          });
          valueDisplay.textContent = labels.length ? labels.join(', ') : placeholder;
        }

        function selectItem(item) {
          if (!item) return;
          var val = item.getAttribute('data-value') || '';
          var text = item.textContent.replace('✓', '').trim();

          if (multiple) {
            var isSel = item.classList.contains('is-selected');
            item.classList.toggle('is-selected', !isSel);
            item.setAttribute('aria-selected', !isSel ? 'true' : 'false');
            if (hiddenSelect) {
              Array.prototype.forEach.call(hiddenSelect.options, function (opt) {
                if (opt.value === val) opt.selected = !isSel;
              });
              hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            updateDisplay();
            return;
          }

          if (valueDisplay) {
            valueDisplay.textContent = text;
            valueDisplay.classList.remove('is-placeholder');
          }
          items.forEach(function (i) { i.classList.remove('is-selected', 'is-active'); i.removeAttribute('aria-selected'); });
          item.classList.add('is-selected');
          item.setAttribute('aria-selected', 'true');
          if (hiddenSelect) {
            hiddenSelect.value = val;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
          closeDropdown();
        }

        function normalize(text) {
          return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
        }
        function filterItems() {
          if (!searchable || !searchInput) return;
          var words = normalize(searchInput.value).trim().split(/\s+/).filter(Boolean);
          items.forEach(function (item) {
            if (item.getAttribute('data-value') === 'all' && !showAll) { item.hidden = true; return; }
            var label = normalize(item.textContent.replace('✓', '').trim());
            item.hidden = words.length > 0 && !words.every(function (word) { return label.indexOf(word) !== -1; });
          });
          clearActive();
        }

        function handleKeyNavigation(e) {
          if (!container.classList.contains('is-open')) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
              e.preventDefault();
              openDropdown();
            }
            return;
          }
          var visible = visibleItems();
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopPropagation();
            if (visible.length) setActive(activeIndex + 1);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopPropagation();
            if (visible.length) setActive(activeIndex - 1);
          } else if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (visible.length) {
              selectItem(visible[activeIndex >= 0 ? activeIndex : 0]);
            }
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closeDropdown();
          }
        }

        if (searchInput && searchable) {
          searchInput.addEventListener('input', filterItems);
          searchInput.addEventListener('click', function (e) { e.stopPropagation(); });
          searchInput.addEventListener('keydown', handleKeyNavigation);
        }
        if (toggle) {
          toggle.addEventListener('keydown', handleKeyNavigation);
        }

        function adjustDropdownPlacement() {
          if (!menu) return;
          container.classList.remove('k-dropdown--dropup', 'k-dropdown--align-right');
          var rect = container.getBoundingClientRect();
          var menuHeight = menu.offsetHeight || 220;
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          if (viewportHeight - rect.bottom < menuHeight + 10 && rect.top > viewportHeight - rect.bottom) container.classList.add('k-dropdown--dropup');
          if (viewportWidth - rect.left < menu.offsetWidth && rect.right >= menu.offsetWidth) container.classList.add('k-dropdown--align-right');
        }

        function openDropdown() {
          document.querySelectorAll('.k-dropdown.is-open').forEach(function (d) {
            if (d !== container) {
              d.classList.remove('is-open');
              var b = d.querySelector('.k-dropdown__toggle');
              if (b) b.setAttribute('aria-expanded', 'false');
            }
          });
          container.classList.add('is-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
          adjustDropdownPlacement();
          clearActive();
          if (searchInput && searchable) {
            filterItems();
            setTimeout(function () { searchInput.focus(); }, 0);
          }
        }

        function closeDropdown() {
          container.classList.remove('is-open');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
          }
          clearActive();
        }

        if (toggle) {
          toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            container.classList.contains('is-open') ? closeDropdown() : openDropdown();
          });
        }

        items.forEach(function (item) {
          item.addEventListener('click', function (e) {
            e.stopPropagation();
            selectItem(item);
          });
        });
      });

      document.addEventListener('click', function (e) {
        document.querySelectorAll('.k-dropdown.is-open').forEach(function (d) {
          if (!d.contains(e.target)) {
            d.classList.remove('is-open');
            var b = d.querySelector('.k-dropdown__toggle');
            if (b) b.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
    initDropdownSelects();

    // -------------------------------------------------------------------------
    // 5. Extended UI Interactions: Modal, Tabs, Accordion
    // -------------------------------------------------------------------------
    var modal = document.getElementById('demo-modal');
    var openModalBtn = document.getElementById('demo-open-modal');
    var closeModalBtn = document.getElementById('demo-close-modal');
    var cancelModalBtn = document.getElementById('demo-cancel-modal');
    var confirmModalBtn = document.getElementById('demo-confirm-modal');
    var backdrop = document.getElementById('demo-modal-backdrop');

    function openModal() { if (modal) modal.classList.add('is-open'); renderLucideIcons(); }
    function closeModal() { if (modal) modal.classList.remove('is-open'); }

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (confirmModalBtn) confirmModalBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    var confirmDialog = document.getElementById('demo-confirm');
    var confirmDanger = document.getElementById('demo-confirm-danger');
    var confirmWarning = document.getElementById('demo-confirm-warning');
    var confirmResult = document.getElementById('demo-confirm-result');

    function bindConfirm(dialog, openId, cancelIds, acceptId, acceptedText) {
      if (!dialog) return;
      var openBtn = document.getElementById(openId);
      var acceptBtn = document.getElementById(acceptId);
      function isStatic() {
        return dialog.getAttribute('data-k-backdrop') !== 'true';
      }
      function open() {
        dialog.classList.add('is-open');
        renderLucideIcons();
      }
      function close() { dialog.classList.remove('is-open'); }
      function showResult(text) {
        if (!confirmResult) return;
        confirmResult.hidden = false;
        confirmResult.textContent = text;
      }
      if (openBtn) openBtn.addEventListener('click', open);
      cancelIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('click', function() {
          if (el.classList.contains('k-modal-backdrop') && isStatic()) return;
          close();
          showResult('Confirmation cancelled.');
        });
      });
      dialog.addEventListener('click', function(e) {
        if (e.target === dialog && !isStatic()) {
          close();
          showResult('Confirmation cancelled.');
        }
      });
      if (acceptBtn) acceptBtn.addEventListener('click', function() {
        close();
        showResult(acceptedText);
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dialog.classList.contains('is-open')) {
          close();
          showResult('Confirmation cancelled.');
        }
      });
    }

    bindConfirm(confirmDialog, 'demo-open-confirm', ['demo-confirm-cancel', 'demo-confirm-backdrop'], 'demo-confirm-accept', 'Changes saved.');
    bindConfirm(confirmWarning, 'demo-open-confirm-warning', ['demo-confirm-warning-cancel', 'demo-confirm-warning-backdrop'], 'demo-confirm-warning-accept', 'Changes published.');
    bindConfirm(confirmDanger, 'demo-open-confirm-danger', ['demo-confirm-danger-cancel', 'demo-confirm-danger-backdrop'], 'demo-confirm-danger-accept', 'Record deleted.');

    // Toast trigger demo with position & auto-close control
    var toastTrigger = document.getElementById('demo-trigger-toast');
    var toastContainer = document.getElementById('demo-toast-container');
    var toastPosSelect = document.getElementById('demo-toast-position');
    var toastAutoCloseSelect = document.getElementById('demo-toast-autoclose');

    function updateToastPosition(pos) {
      if (!toastContainer) return;
      var positions = [
        'k-toast-container--top-left',
        'k-toast-container--top-center',
        'k-toast-container--top-right',
        'k-toast-container--bottom-left',
        'k-toast-container--bottom-center',
        'k-toast-container--bottom-right'
      ];
      positions.forEach(function (cls) { toastContainer.classList.remove(cls); });
      if (pos) toastContainer.classList.add('k-toast-container--' + pos);
    }

    if (toastPosSelect) {
      toastPosSelect.addEventListener('change', function () {
        updateToastPosition(toastPosSelect.value);
      });
    }

    if (toastTrigger && toastContainer) {
      function formatRelativeTime(secondsAgo) {
        if (secondsAgo < 10) return 'just now';
        if (secondsAgo < 60) return secondsAgo + 's ago';
        var minutes = Math.floor(secondsAgo / 60);
        if (minutes < 60) return minutes === 1 ? '1 minute ago' : minutes + ' minutes ago';
        var hours = Math.floor(minutes / 60);
        return hours === 1 ? '1 hour ago' : hours + ' hours ago';
      }

      function updateAllToastTimes() {
        if (!toastContainer) return;
        var timeElements = toastContainer.querySelectorAll('.k-toast__time[data-toast-created]');
        var now = Date.now();
        timeElements.forEach(function (el) {
          var created = parseInt(el.getAttribute('data-toast-created'), 10);
          if (!created) return;
          var elapsedSec = Math.max(0, Math.floor((now - created) / 1000));
          var labelEl = el.querySelector('span');
          if (labelEl) {
            labelEl.textContent = formatRelativeTime(elapsedSec);
          }
        });
      }

      var initialToastTimeEl = toastContainer.querySelector('.k-toast__time[data-toast-created]');
      if (!initialToastTimeEl) {
        var staticTime = toastContainer.querySelector('.k-toast__time');
        if (staticTime) staticTime.setAttribute('data-toast-created', Date.now());
      }
      if (typeof setInterval === 'function') {
        setInterval(updateAllToastTimes, 5000);
      }


      toastTrigger.addEventListener('click', function () {
        if (toastPosSelect) updateToastPosition(toastPosSelect.value || 'top-right');
        var toast = document.createElement('div');
        toast.className = 'k-toast k-toast--success';
        var now = Date.now();
        var title = 'Action Completed';
        var body = 'Item processed and saved to cloud.';
        var timeLabel = 'just now';

        toast.innerHTML = '<div class="k-toast__content">' +
            '<div class="k-toast__title">' + title + '</div>' +
            '<div class="k-toast__body">' + body + '</div>' +
            '<div class="k-toast__footer">' +
              '<span class="k-toast__time" data-toast-created="' + now + '">' +
                '<i data-lucide="check-circle-2" class="k-text-success"></i>' +
                '<span>' + timeLabel + '</span>' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="k-alert__close">&times;</button>';

        if (typeof toastContainer.prepend === 'function') {
          toastContainer.prepend(toast);
        } else {
          toastContainer.insertBefore(toast, toastContainer.firstChild);
        }
        renderLucideIcons();

        // Auto-dismiss or Persistent handling
        var autoCloseMode = toastAutoCloseSelect ? toastAutoCloseSelect.value : 'auto-5s';
        var timeoutMs = 0;
        if (autoCloseMode === 'auto-3s') timeoutMs = 3000;
        else if (autoCloseMode === 'auto-5s') timeoutMs = 5000;
        else if (autoCloseMode === 'auto-10s') timeoutMs = 10000;
        // If 'persistent', timeoutMs remains 0 -> never auto-closes, user closes via close button

        if (timeoutMs > 0) {
          setTimeout(function () {
            if (toast.parentNode) {
              toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
              toast.style.opacity = '0';
              toast.style.transform = 'translateY(-6px)';
              setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
              }, 250);
            }
          }, timeoutMs);
        }
      });
    }

    // Tabs logic
    var tabs = typeof document.querySelectorAll === 'function' ? document.querySelectorAll('.k-tabs__tab') : [];
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetSel = tab.getAttribute('data-tab-target');
        var parentCard = tab.closest('.k-card');
        if (!parentCard) return;
        parentCard.querySelectorAll('.k-tabs__tab').forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        parentCard.querySelectorAll('.k-tabs__panel').forEach(function (p) {
          p.classList.remove('is-active');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        var targetPanel = parentCard.querySelector(targetSel);
        if (targetPanel) targetPanel.classList.add('is-active');
      });
    });

    // Accordion logic
    var accordionTriggers = typeof document.querySelectorAll === 'function' ? document.querySelectorAll('.k-accordion__trigger') : [];
    accordionTriggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.k-accordion__item');
        if (item) item.classList.toggle('is-open');
      });
    });

    // -------------------------------------------------------------------------
    // 6. Language Contract (English by default)
    // -------------------------------------------------------------------------
    if (document.documentElement) {
      document.documentElement.lang = 'en';
    }


    // -------------------------------------------------------------------------
    // 1. Dark Mode Switcher Contract
    // -------------------------------------------------------------------------
    var themeToggleBtn = document.getElementById('theme-toggle');
    var htmlElement = document.documentElement;

    function applyTheme(theme) {
      if (theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) {
          themeToggleBtn.innerHTML = '☀️ Light Mode';
          themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        }
      } else {
        htmlElement.removeAttribute('data-theme');
        if (themeToggleBtn) {
          themeToggleBtn.innerHTML = '🌙 Dark Mode';
          themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
      }
    }

    // Initialize theme from localStorage or system preference
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem('kaui-theme');
    } catch (e) {
      // localStorage may be disabled in private browsing or iframe
    }

    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function () {
        var isDark = htmlElement.getAttribute('data-theme') === 'dark';
        var nextTheme = isDark ? 'light' : 'dark';
        applyTheme(nextTheme);
        try {
          localStorage.setItem('kaui-theme', nextTheme);
        } catch (e) {}
      });
    }

    // -------------------------------------------------------------------------
    // 2. Responsive Mobile Navbar Drawer
    // -------------------------------------------------------------------------
    var navToggle = document.querySelector('.k-navbar__toggle');
    var navMenu = document.querySelector('.k-navbar__menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close mobile menu when clicking any nav link
      var navLinks = navMenu.querySelectorAll('.k-navbar__link');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });

      // Close mobile menu when clicking outside toggle and menu
      document.addEventListener('click', function (event) {
        if (!navMenu.classList.contains('is-open')) return;
        var target = event.target;
        if (!target) return;
        var clickedInsideToggle = navToggle === target || (typeof navToggle.contains === 'function' && navToggle.contains(target));
        var clickedInsideMenu = navMenu === target || (typeof navMenu.contains === 'function' && navMenu.contains(target));
        if (!clickedInsideToggle && !clickedInsideMenu) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Fixed sidebar navigation (with mobile drawer fallback)
    var sidebar = document.querySelector('.demo-sidebar');
    var sidebarToggle = document.querySelector('.demo-sidebar-toggle');
    var sidebarLinks = typeof document.querySelectorAll === 'function' ? document.querySelectorAll('.demo-sidebar__link') : [];
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function () {
        var open = sidebar.classList.toggle('is-open');
        sidebarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          sidebarLinks.forEach(function (item) { item.classList.remove('is-active'); });
          link.classList.add('is-active');
          sidebar.classList.remove('is-open');
          sidebarToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // -------------------------------------------------------------------------
    // 3. Dismissible Alert Component Flow
    // -------------------------------------------------------------------------
    document.addEventListener('click', function (event) {
      if (!event.target || typeof event.target.closest !== 'function') return;
      var closeBtn = event.target.closest('.k-alert__close');
      if (!closeBtn) return;

      var alertBox = closeBtn.closest('.k-alert');
      if (!alertBox) return;

      alertBox.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      alertBox.style.opacity = '0';
      alertBox.style.transform = 'scale(0.96)';

      setTimeout(function () {
        if (alertBox.parentNode) {
          alertBox.parentNode.removeChild(alertBox);
        }
      }, 200);
    });

    // -------------------------------------------------------------------------
    // 4. Interactive Loading Button Demo
    // -------------------------------------------------------------------------
    var loadingBtn = document.getElementById('demo-loading-button');
    if (loadingBtn) {
      loadingBtn.addEventListener('click', function () {
        if (loadingBtn.classList.contains('k-btn--loading')) return;

        var textSpan = loadingBtn.querySelector('.k-btn__text');
        var originalText = textSpan ? textSpan.textContent : '';

        loadingBtn.classList.add('k-btn--loading');
        if (textSpan) textSpan.textContent = 'Saving...';

        setTimeout(function () {
          loadingBtn.classList.remove('k-btn--loading');
          if (textSpan) textSpan.textContent = originalText || 'Save Changes';
        }, 1800);
      });
    }

    function initDataTables() {
      function normalize(text) {
        return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
      }
      function cellValue(row, index) {
        var cell = row.children[index];
        return cell ? (cell.getAttribute('data-k-sort-value') || cell.textContent || '').trim() : '';
      }
      document.querySelectorAll('[data-k-table]').forEach(function (root) {
        var table = root.matches('table') ? root : root.querySelector('table');
        var tbody = table && table.tBodies && table.tBodies[0];
        if (!table || !tbody) return;
        var rows = Array.prototype.filter.call(tbody.rows, function (row) {
          return !row.hasAttribute('data-k-table-no-results');
        });
        var empty = tbody.querySelector('[data-k-table-no-results]');
        var search = root.querySelector('[data-k-table-search]');
        var freeze = Number(root.getAttribute('data-k-freeze'));
        if (Number.isInteger(freeze) && freeze > 0) table.classList.add('k-table--frozen-1');

        if (root.getAttribute('data-k-searchable') === 'true' && search) {
          search.addEventListener('input', function () {
            var words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
            var visible = 0;
            rows.forEach(function (row) {
              var text = normalize(row.textContent || '');
              row.hidden = words.length > 0 && !words.every(function (word) { return text.indexOf(word) !== -1; });
              if (!row.hidden) visible += 1;
            });
            if (empty) empty.hidden = visible !== 0;
          });
        }

        if (root.getAttribute('data-k-sortable') !== 'true') return;
        var columns = (root.getAttribute('data-k-sort-columns') || '').split(',').map(Number).filter(function (index) {
          return Number.isInteger(index) && index >= 0;
        });
        columns.forEach(function (index) {
          var header = table.tHead && table.tHead.rows[0] && table.tHead.rows[0].cells[index];
          if (!header) return;
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'k-table__sort';
          button.setAttribute('aria-sort', 'none');
          button.innerHTML = '<span></span><i data-lucide="arrow-up-down" class="k-table__sort-icon" aria-hidden="true"></i>';
          button.firstChild.textContent = header.textContent.trim();
          header.replaceChildren(button);
          button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var nextDescending = button.getAttribute('aria-sort') === 'ascending';

            root.querySelectorAll('.k-table__sort').forEach(function (item) {
              item.setAttribute('aria-sort', 'none');
              var icon = item.querySelector('[data-lucide]');
              if (icon) icon.setAttribute('data-lucide', 'arrow-up-down');
            });
            button.setAttribute('aria-sort', nextDescending ? 'descending' : 'ascending');
            var activeIcon = button.querySelector('[data-lucide]');
            if (activeIcon) activeIcon.setAttribute('data-lucide', nextDescending ? 'arrow-down' : 'arrow-up');
            rows.slice().sort(function (a, b) {
              var leftCell = a.cells[index];
              var rightCell = b.cells[index];
              var leftRaw = leftCell ? leftCell.getAttribute('data-k-sort-value') : null;
              var rightRaw = rightCell ? rightCell.getAttribute('data-k-sort-value') : null;
              var result = leftRaw !== null && rightRaw !== null && leftRaw !== '' && rightRaw !== '' && Number.isFinite(Number(leftRaw)) && Number.isFinite(Number(rightRaw))
                ? Number(leftRaw) - Number(rightRaw)
                : normalize(cellValue(a, index)).localeCompare(normalize(cellValue(b, index)), undefined, { numeric: true, sensitivity: 'base' });
              return nextDescending ? -result : result;
            }).forEach(function (row) { tbody.appendChild(row); });
            if (empty) tbody.appendChild(empty);
            renderLucideIcons();
          });
        });
        renderLucideIcons();
      });
    }
    initDataTables();



    // Component HTML copy actions
    var componentSnippets = {
      layout: '<div class="k-container">\n  <div class="k-grid k-gap-4">\n    <div class="k-col-12 k-col-md-6 k-col-lg-4">Content</div>\n  </div>\n</div>',
      buttons: '<button class="k-btn k-btn--primary"><span class="k-btn__icon"><i data-lucide="plus"></i></span><span class="k-btn__text">Primary Action</span></button>',
      forms: '<div class="k-input-wrapper">\n  <i data-lucide="mail" class="k-input__icon k-input__icon--left"></i>\n  <input class="k-input" type="email">\n</div>',
      'full-name': '<div class="k-form-group">\n  <label for="demo-name" class="k-form-label">Full Name</label>\n  <div class="k-input-wrapper">\n    <i data-lucide="user" class="k-input__icon k-input__icon--left" aria-hidden="true"></i>\n    <input type="text" id="demo-name" class="k-input" placeholder="e.g. Dang Long">\n  </div>\n  <span class="k-form-hint">Enter your legal full name as shown on official ID.</span>\n</div>',
      country: '<div class="k-form-group">\n  <label for="demo-country" class="k-form-label">Country / Region</label>\n  <div class="k-dropdown k-dropdown-select" data-k-dropdown-select data-k-searchable="true" data-k-placeholder="Select country...">\n    <select id="demo-country" class="k-select k-d-none" tabindex="-1" aria-hidden="true">\n      <option value="" disabled selected hidden>Select country...</option>\n      <option value="vn">Vietnam</option>\n      <option value="us">United States</option>\n    </select>\n    <button type="button" class="k-input k-dropdown__toggle" aria-haspopup="listbox" aria-expanded="false">\n      <span class="k-dropdown__value is-placeholder">Select country...</span>\n      <span class="k-dropdown__chevron" aria-hidden="true"><i data-lucide="chevron-down"></i></span>\n    </button>\n  </div>\n</div>',
      notes: '<div class="k-form-group">\n  <label for="demo-notes" class="k-form-label">Project Bio / Notes</label>\n  <textarea id="demo-notes" class="k-textarea" rows="3" placeholder="Tell us about your project..."></textarea>\n</div>',
      'valid-email': '<div class="k-form-group">\n  <label for="demo-valid-email" class="k-form-label">Valid Username / Email</label>\n  <div class="k-input-wrapper">\n    <input type="text" id="demo-valid-email" class="k-input is-valid" value="danglong@example.com">\n    <i data-lucide="check-circle-2" class="k-input__icon k-input__icon--right" aria-hidden="true"></i>\n  </div>\n  <div class="k-form-feedback k-form-feedback--valid">Username is available and looks great!</div>\n</div>',
      password: '<div class="k-form-group">\n  <label for="demo-invalid-password" class="k-form-label">Account Password</label>\n  <input type="password" id="demo-invalid-password" class="k-input is-invalid" value="123">\n  <div class="k-form-feedback k-form-feedback--invalid">Password must contain at least 8 characters with numbers and symbols.</div>\n</div>',
      'invalid-mod': '<div class="k-form-group">\n  <label for="demo-invalid-mod" class="k-form-label">Explicit Modifier State</label>\n  <input type="text" id="demo-invalid-mod" class="k-input k-input--invalid" value="invalid_token_syntax">\n  <div class="k-form-feedback k-form-feedback--invalid">Syntax error detected in token definition.</div>\n</div>',
      disabled: '<div class="k-form-group">\n  <label for="demo-disabled" class="k-form-label">Disabled Control</label>\n  <input type="text" id="demo-disabled" class="k-input is-disabled" value="Read-only system value" disabled>\n  <span class="k-form-hint">This setting is locked by administrator policy.</span>\n</div>',
      cards: '<div class="k-card">\n  <div class="k-card__header"><span class="k-card__icon"><i data-lucide="layers"></i></span>Card Header</div>\n  <div class="k-card__body">Card content</div>\n</div>',
      badges: '<span class="k-badge k-badge--success k-badge--pill">Completed</span>',
      alerts: '<div class="k-alert k-alert--success">\n  <strong class="k-alert__title">Success</strong>\n  <div class="k-alert__body">Operation completed.</div>\n</div>',
      table: '<div class="k-table-wrap">\n  <table class="k-table k-table--striped k-table--hover">\n    <thead><tr><th scope="col">Project</th><th scope="col">Status</th></tr></thead>\n    <tbody><tr><th scope="row">KAUI Dashboard</th><td><span class="k-badge k-badge--success">Active</span></td></tr></tbody>\n  </table>\n</div>'

    };

    function copyText(text, done) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
        return;
      }
      fallbackCopy(text, done);
    }

    function fallbackCopy(text, done) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(area);
      done();
    }

    if (typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('[data-copy-component]').forEach(function (button) {
        button.addEventListener('click', function () {
        var key = button.getAttribute('data-copy-component');
        if (!componentSnippets[key]) return;
        copyText(componentSnippets[key], function () {
          var label = button.querySelector('.demo-copy-label');
          if (label) label.textContent = 'Copied!';
          button.classList.add('is-copied');
          setTimeout(function () {
            if (label) label.textContent = 'Copy code';
            button.classList.remove('is-copied');
          }, 1400);
        });
        });
      });
    }

  });
})();
