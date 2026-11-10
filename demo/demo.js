/**
 * KAUI Demo Interactive Showcase Scripts
 * Zero-dependency vanilla JavaScript for theme switching, mobile drawer navigation, and alert dismissal.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Render every demo icon from the KAUI project icon registry (no external icon CDN).
    function renderKauiIcons() {
      if (typeof iconSvgPaths === 'undefined' || !iconSvgPaths) return;
      var aliases = {
        'palette': 'settings', 'compass': 'external-link', 'layout-grid': 'folder', 'square-mouse-pointer': 'add',
        'file-text': 'file', 'history': 'calendar', 'layers-3': 'folder', 'shapes': 'settings', 'chart-no-axes-combined': 'success',
        'layers': 'folder', 'tag': 'success', 'scan': 'search', 'message-square': 'mail', 'list-collapse': 'menu',
        'loader-2': 'settings', 'bot': 'user', 'github': 'external-link', 'globe': 'external-link', 'smartphone': 'user',
        'tablet-smartphone': 'user', 'apple': 'success', 'braces': 'settings', 'shield-check': 'success', 'sparkles': 'success',
        'panel-top': 'folder', 'timer': 'calendar', 'bell-ring': 'bell', 'check-circle-2': 'success', 'circle-help': 'info',
        'triangle-alert': 'warning', 'trash-2': 'delete', 'plus': 'add', 'x': 'close', 'activity': 'success',
        'arrow-up-down': 'arrow-up-down', 'file-code-2': 'file', 'clipboard-list': 'file', 'table-2': 'folder'
      };
      document.querySelectorAll('[data-kaui-icon]').forEach(function (element) {
        var name = element.getAttribute('data-kaui-icon');
        var path = iconSvgPaths[name] || iconSvgPaths[aliases[name]] || iconSvgPaths.settings;
        var holder = document.createElement('span');
        holder.innerHTML = '<svg class="kaui-icon" viewBox="0 0 24 24" aria-hidden="' + (element.getAttribute('aria-hidden') || 'true') + '">' + path + '</svg>';
        var svg = holder.firstElementChild;
        svg.setAttribute('data-kaui-icon', name);
        Array.prototype.slice.call(element.attributes).forEach(function (attribute) {
          if (attribute.name === 'data-kaui-icon' || attribute.name === 'aria-hidden') return;
          if (attribute.name === 'class') {
            svg.setAttribute('class', 'kaui-icon ' + attribute.value);
          } else {
            svg.setAttribute(attribute.name, attribute.value);
          }
        });
        element.replaceWith(svg);
      });
    }

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

    function blurTrigger(element) {
      var target = element || (document.activeElement && document.activeElement.tagName === 'BUTTON' ? document.activeElement : null);
      if (target && typeof target.blur === 'function') target.blur();
    }

    function openModal() {
      blurTrigger(openModalBtn);
      if (modal) modal.classList.add('is-open');
      renderKauiIcons();
    }
    function isModalStatic() {
      return !modal || modal.getAttribute('data-k-backdrop') !== 'true';
    }
    function closeModal() { if (modal) modal.classList.remove('is-open'); }

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (confirmModalBtn) confirmModalBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', function () {
      if (!isModalStatic()) closeModal();
    });

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal && !isModalStatic()) closeModal();
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && modal && modal.classList.contains('is-open')) {
        e.preventDefault();
        if (confirmModalBtn) confirmModalBtn.click();
        return;
      }
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        e.preventDefault();
        closeModal();
      }
    });


    // Long-content countries modal demo.
    var countriesModal = document.getElementById('demo-countries-modal');
    var countriesOpenBtn = document.getElementById('demo-open-countries');
    var countriesCloseBtn = document.getElementById('demo-close-countries');
    var countriesCancelBtn = document.getElementById('demo-cancel-countries');
    var countriesBackdrop = document.getElementById('demo-countries-backdrop');
    var countriesBody = document.getElementById('demo-countries-body');
    if (countriesBody && typeof demoCountries !== 'undefined') {
      countriesBody.innerHTML = demoCountries.map(function (country, index) {
        return '<tr><td data-k-sort-value="' + (index + 1) + '">' + (index + 1) + '</td><td>' + country[1] + '</td><td>' + country[2] + '</td><td><code>' + country[3] + '</code></td></tr>';
      }).join('');
    }
    function openCountriesModal() {
      blurTrigger(countriesOpenBtn);
      if (countriesModal) countriesModal.classList.add('is-open');
      renderKauiIcons();
    }
    function closeCountriesModal() {
      if (countriesModal) countriesModal.classList.remove('is-open');
    }
    if (countriesOpenBtn) countriesOpenBtn.addEventListener('click', openCountriesModal);
    if (countriesCloseBtn) countriesCloseBtn.addEventListener('click', closeCountriesModal);
    if (countriesCancelBtn) countriesCancelBtn.addEventListener('click', closeCountriesModal);
    if (countriesBackdrop) countriesBackdrop.addEventListener('click', function () {
      if (countriesModal && countriesModal.getAttribute('data-k-backdrop') === 'true') closeCountriesModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && countriesModal && countriesModal.classList.contains('is-open')) {
        e.preventDefault();
        closeCountriesModal();
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
        blurTrigger(openBtn);
        dialog.classList.add('is-open');
        renderKauiIcons();
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
        if (e.key === 'Enter' && dialog.classList.contains('is-open')) {
          e.preventDefault();
          if (acceptBtn) acceptBtn.click();
          return;
        }
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
                '<i data-kaui-icon="check-circle-2" class="k-text-success"></i>' +
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
        renderKauiIcons();

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
    // 1. Theme preset selector contract
    // -------------------------------------------------------------------------
    var themePreset = document.getElementById('theme-preset');
    var htmlElement = document.documentElement;
    var themePresets = ['default', 'ocean', 'forest', 'sunset', 'dark'];

    function syncThemePresetDropdown(value) {
      var container = document.querySelector('[data-k-theme-preset]');
      if (!container) return;
      var item = container.querySelector('.k-dropdown__item[data-value="' + value + '"]');
      var display = container.querySelector('.k-dropdown__value');
      if (display && item) display.textContent = item.textContent.trim();
      container.querySelectorAll('.k-dropdown__item').forEach(function (option) {
        var active = option === item;
        option.classList.toggle('is-selected', active);
        option.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function applyThemePreset(theme) {
      var selected = themePresets.indexOf(theme) >= 0 ? theme : 'default';
      if (selected === 'default') htmlElement.removeAttribute('data-theme');
      else htmlElement.setAttribute('data-theme', selected);
      if (themePreset) themePreset.value = selected;
      syncThemePresetDropdown(selected);
    }

    var savedTheme = null;
    try { savedTheme = localStorage.getItem('kaui-theme'); } catch (e) {}
    applyThemePreset(savedTheme || 'default');

    if (themePreset) {
      themePreset.addEventListener('change', function () {
        applyThemePreset(themePreset.value);
        try { localStorage.setItem('kaui-theme', themePreset.value); } catch (e) {}
      });
    }
    var themeDropdown = document.querySelector('[data-k-theme-preset]');
    if (themeDropdown) {
      themeDropdown.addEventListener('change', function () {
        if (!themePreset) return;
        applyThemePreset(themePreset.value);
        try { localStorage.setItem('kaui-theme', themePreset.value); } catch (e) {}
      });
    }

    // -------------------------------------------------------------------------
    // 2. Responsive Mobile Navbar Drawer
    // -------------------------------------------------------------------------
    var navToggle = document.querySelector('.k-navbar__toggle');
    var navMenu = document.querySelector('.k-navbar__menu');

    if (navToggle && navMenu) {
      function adjustItemPlacement(item) {
        if (window.innerWidth < 768) return;
        var submenu = item.querySelector(':scope > .k-navbar__submenu');
        if (!submenu) return;
        var isRootItem = item.parentElement && item.parentElement.classList.contains('k-navbar__nav');
        var parentRect = item.getBoundingClientRect();
        var menuRect = submenu.getBoundingClientRect();
        var menuWidth = menuRect.width || 192;
        var viewportPadding = 12;

        // Vertical adjustment
        var spaceBelow = window.innerHeight - parentRect.bottom;
        var spaceAbove = parentRect.top;
        if (menuRect.bottom > window.innerHeight - viewportPadding && spaceAbove > spaceBelow) {
          item.classList.add('is-dropup');
        } else {
          item.classList.remove('is-dropup');
        }

        // Horizontal adjustment for nested submenus:
        // Enforce a strict single-direction cascade. Once a branch direction is determined,
        // all child submenus open consistently in that same direction (nearest side).
        if (!isRootItem) {
          var parentSubmenuItem = item.parentElement ? item.parentElement.closest('.k-navbar__item--has-children') : null;
          var parentIsDropstart = parentSubmenuItem && parentSubmenuItem.classList.contains('is-dropstart');

          if (parentIsDropstart) {
            // Inherit the leftward direction strictly from ancestor
            item.classList.add('is-dropstart');
          } else {
            // Find root parent item in navbar
            var rootParent = item.closest('.k-navbar__nav > .k-navbar__item--has-children');
            var rootRect = rootParent ? rootParent.getBoundingClientRect() : parentRect;
            var spaceOnRight = window.innerWidth - parentRect.right;
            var spaceOnLeft = parentRect.left;

            // If not enough room on the right, or root is located on the right half of the screen
            var shouldOpenLeft = (spaceOnRight < menuWidth + viewportPadding) ||
                                 (rootRect.left + rootRect.width / 2 > window.innerWidth / 2 && spaceOnLeft > spaceOnRight);

            if (shouldOpenLeft) {
              item.classList.add('is-dropstart');
            } else {
              item.classList.remove('is-dropstart');
            }
          }
        }
      }

      function positionNavbarSubmenus() {
        if (window.innerWidth < 768) return;
        navMenu.querySelectorAll('.k-navbar__item--has-children.is-open').forEach(function (item) {
          adjustItemPlacement(item);
        });
      }

      function refreshNavbarSubmenus() {
        window.requestAnimationFrame(positionNavbarSubmenus);
      }

      function openItem(item) {
        item.classList.add('is-open');
        var btn = item.querySelector(':scope > .k-navbar__link[aria-expanded]');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        adjustItemPlacement(item);
      }

      function closeItem(item) {
        item.classList.remove('is-open', 'is-dropup', 'is-dropstart');
        var btn = item.querySelector(':scope > .k-navbar__link[aria-expanded]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        closeChildBranches(item);
      }

      function closeChildBranches(container) {
        if (!container) return;
        container.querySelectorAll('.k-navbar__item--has-children').forEach(function (child) {
          child.classList.remove('is-open', 'is-dropup', 'is-dropstart');
          var childBtn = child.querySelector(':scope > .k-navbar__link[aria-expanded]');
          if (childBtn) childBtn.setAttribute('aria-expanded', 'false');
        });
      }

      navToggle.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (!isOpen) closeChildBranches(navMenu);
      });

      // Pure Click-driven navigation: opening submenus requires clicking
      var navLinks = navMenu.querySelectorAll('.k-navbar__link');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
          var parent = link.parentElement;
          var dropdownItem = parent && parent.classList.contains('k-navbar__item--has-children');
          if (dropdownItem && link.tagName === 'BUTTON') {
            event.preventDefault();
            var isCurrentlyOpen = parent.classList.contains('is-open');
            if (isCurrentlyOpen) {
              closeItem(parent);
            } else {
              // Close sibling branches at the same depth, then open this branch
              var siblingItems = parent.parentElement ? parent.parentElement.children : [];
              Array.prototype.forEach.call(siblingItems, function (sibling) {
                if (sibling !== parent && sibling.classList && sibling.classList.contains('k-navbar__item--has-children')) {
                  closeItem(sibling);
                }
              });
              openItem(parent);
            }
            refreshNavbarSubmenus();
            return;
          }
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          closeChildBranches(navMenu);
        });
      });

      function closeNavbarMenus() {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        closeChildBranches(navMenu);
      }

      window.addEventListener('resize', refreshNavbarSubmenus);
      window.addEventListener('scroll', refreshNavbarSubmenus, true);
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeNavbarMenus();
      });
      // Outside click closes all open navbar menus and mobile drawer
      document.addEventListener('click', function (event) {
        var target = event.target;
        if (!target) return;
        var hasOpenChildren = Boolean(navMenu.querySelector('.k-navbar__item--has-children.is-open'));
        var isMobileMenuOpen = navMenu.classList.contains('is-open');
        if (!hasOpenChildren && !isMobileMenuOpen) return;

        var clickedInsideToggle = navToggle === target || (typeof navToggle.contains === 'function' && navToggle.contains(target));
        var clickedInsideNavbar = (typeof navMenu.contains === 'function' && navMenu.contains(target));

        // If clicked completely outside the menu and toggle, dismiss all menus
        if (!clickedInsideToggle && !clickedInsideNavbar) {
          closeNavbarMenus();
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
      // Keep sidebar state synchronized with the current page and optional section hash.
      var sidebarScrollStorageKey = 'kaui-demo-sidebar-scroll-top';
      var sidebarBody;

      function saveSidebarScrollPosition() {
        if (!sidebarBody) return;
        try { sessionStorage.setItem(sidebarScrollStorageKey, String(sidebarBody.scrollTop)); } catch (e) {}
      }

      function restoreSidebarScrollPosition() {
        if (!sidebarBody) return;
        var savedPosition = null;
        try { savedPosition = sessionStorage.getItem(sidebarScrollStorageKey); } catch (e) {}
        if (savedPosition === null) return;
        var position = Number(savedPosition);
        if (!Number.isFinite(position)) return;
        sidebarBody.scrollTop = Math.max(0, position);
      }

      function currentSidebarPage() {
        var path = (window.location.pathname || '').split('/').pop();
        return path || 'index.html';
      }
      function setActiveSidebarPage() {
        var page = currentSidebarPage();
        var matched = false;
        sidebarLinks.forEach(function (item) {
          var href = item.getAttribute('href') || '';
          if (href.charAt(0) === '#') return;
          var linkPage = href.split('#')[0].split('/').pop() || 'index.html';
          var active = linkPage === page;
          item.classList.toggle('is-active', active);
          if (active) matched = true;
        });
        return matched;
      }

      function setActiveSidebarHash(hash) {
        var hasHashLinks = false;
        sidebarLinks.forEach(function (item) {
          if ((item.getAttribute('href') || '').charAt(0) === '#') hasHashLinks = true;
        });

        // Multi-page demo navigation is active by filename, not by the current page's section IDs.
        if (!hasHashLinks) {
          setActiveSidebarPage();
          return;
        }

        var target = hash || '#hero';
        var matched = false;
        sidebarLinks.forEach(function (item) {
          var active = item.getAttribute('href') === target;
          item.classList.toggle('is-active', active);
          if (active) matched = true;
        });
        if (!matched && !hash) {
          var overview = sidebar.querySelector('a[href="#hero"]');
          if (overview) overview.classList.add('is-active');
        }
      }

      function updateActiveSection() {
        var sections = [];
        sidebarLinks.forEach(function (item) {
          var href = item.getAttribute('href') || '';
          if (href.charAt(0) !== '#') return;
          var section = document.getElementById(href.slice(1));
          if (section) sections.push({ section: section, hash: href });
        });
        var threshold = window.innerHeight * 0.35;
        var current = sections[0];
        sections.forEach(function (entry) {
          if (entry.section.getBoundingClientRect().top <= threshold) current = entry;
        });
        if (current) setActiveSidebarHash(current.hash);
      }

      setActiveSidebarHash(window.location.hash);
      window.addEventListener('hashchange', function () {
        setActiveSidebarHash(window.location.hash);
        window.setTimeout(updateActiveSection, 0);
      });
      window.addEventListener('scroll', updateActiveSection, { passive: true });
      if (!window.location.hash) updateActiveSection();


      sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          saveSidebarScrollPosition();
          sidebar.classList.remove('is-open');
          sidebarToggle.setAttribute('aria-expanded', 'false');
        });
      });




    var sidebarBody = document.querySelector('.demo-sidebar__body');
    if (sidebarBody) {
      sidebarBody.addEventListener('scroll', saveSidebarScrollPosition, { passive: true });
      restoreSidebarScrollPosition();
      window.addEventListener('pagehide', saveSidebarScrollPosition);
      window.addEventListener('beforeunload', saveSidebarScrollPosition);
    }

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
        var rows = Array.prototype.filter.call(tbody.rows, function (row) { return !row.hasAttribute('data-k-table-no-results'); });
        var empty = tbody.querySelector('[data-k-table-no-results]');
        var search = root.querySelector('[data-k-table-search]');
        var freeze = Number(root.getAttribute('data-k-freeze'));
        if (Number.isInteger(freeze) && freeze > 0) table.classList.add('k-table--frozen-1');
        function applyFrozenColumns() {
          var freezeLeft = [];
          var freezeRight = [];
          var freezeColsAttr = root.getAttribute('data-k-freeze-columns');
          if (freezeColsAttr) {
            freezeColsAttr.split(',').forEach(function (token) {
              token = token.trim();
              if (!token) return;
              if (token.indexOf('left:') === 0) freezeLeft.push(Number(token.replace('left:', '')));
              else if (token.indexOf('right:') === 0) freezeRight.push(Number(token.replace('right:', '')));
              else if (token === 'last') {
                var headerCells = table.tHead && table.tHead.rows[0] ? table.tHead.rows[0].cells : null;
                if (headerCells) freezeRight.push(headerCells.length - 1);
              } else {
                var idx = Number(token);
                if (Number.isInteger(idx)) freezeLeft.push(idx);
              }
            });
          }
          if (table.tHead && table.tHead.rows[0]) {
            Array.prototype.forEach.call(table.tHead.rows[0].cells, function (cell, idx) {
              var dir = cell.getAttribute('data-k-freeze');
              if (dir === 'left' && freezeLeft.indexOf(idx) === -1) freezeLeft.push(idx);
              if (dir === 'right' && freezeRight.indexOf(idx) === -1) freezeRight.push(idx);
            });
          }
          if (!freezeLeft.length && !freezeRight.length) return;
          var headRow = table.tHead && table.tHead.rows[0];
          var leftOffsets = {};
          var currentLeft = 0;
          freezeLeft.sort(function (a, b) { return a - b; }).forEach(function (colIdx) {
            leftOffsets[colIdx] = currentLeft;
            var cell = headRow && headRow.cells[colIdx];
            currentLeft += cell ? cell.offsetWidth : 120;
          });
          var rightOffsets = {};
          var currentRight = 0;
          freezeRight.sort(function (a, b) { return b - a; }).forEach(function (colIdx) {
            rightOffsets[colIdx] = currentRight;
            var cell = headRow && headRow.cells[colIdx];
            currentRight += cell ? cell.offsetWidth : 120;
          });
          var lastLeftCol = freezeLeft.length ? freezeLeft[freezeLeft.length - 1] : null;
          // freezeRight was sorted descending: index 0 has the smallest column index which borders the center content
          var firstRightCol = freezeRight.length ? freezeRight[0] : null;
          function tagRow(row) {
            if (!row) return;
            freezeLeft.forEach(function (colIdx) {
              var cell = row.cells[colIdx];
              if (!cell) return;
              cell.classList.add('k-table__cell--frozen-left');
              if (colIdx === lastLeftCol) cell.classList.add('k-table__cell--frozen-left-last');
              cell.style.setProperty('--k-table-freeze-left', leftOffsets[colIdx] + 'px');
            });
            freezeRight.forEach(function (colIdx) {
              var cell = row.cells[colIdx];
              if (!cell) return;
              cell.classList.add('k-table__cell--frozen-right');
              if (colIdx === firstRightCol) cell.classList.add('k-table__cell--frozen-right-first');
              cell.style.setProperty('--k-table-freeze-right', rightOffsets[colIdx] + 'px');
            });
          }

          if (headRow) tagRow(headRow);
          Array.prototype.forEach.call(tbody.rows, tagRow);
          if (table.tFoot && table.tFoot.rows[0]) tagRow(table.tFoot.rows[0]);
          var wrap = root.matches('.k-table-wrap') ? root : root.closest('.k-table-wrap');
          if (wrap) {
            wrap.style.setProperty('--k-table-scroll-inset-left', currentLeft + 'px');
            wrap.style.setProperty('--k-table-scroll-inset-right', currentRight + 'px');
            wrap.style.setProperty('--k-table-freeze-bg', 'var(--k-table-bg, var(--k-color-surface))');
          }
        }
        applyFrozenColumns();

        function markVisualCells() {
          rows.forEach(function (row) {
            ['.k-table__avatar', '.k-table__image', '.k-table__chart'].forEach(function (selector) {
              row.querySelectorAll(selector).forEach(function (element) {
                var cell = element.closest('td, th');
                if (cell && (cell.children.length === 1 && !cell.textContent.trim())) {
                  cell.classList.add('k-table__visual');
                }
              });
            });
          });
        }
        markVisualCells();
        function updateSums() {
          var sumColumns = (root.getAttribute('data-k-sum-columns') || '').split(',').map(function (value) { return value.trim(); }).filter(Boolean).map(Number).filter(function (index) { return Number.isInteger(index) && index >= 0; });
          if (!sumColumns.length) return;
          sumColumns.forEach(function (index) {
            var header = table.tHead && table.tHead.rows[0] && table.tHead.rows[0].cells[index];
            if (header) header.classList.add('k-table__numeric');
            rows.forEach(function (row) { if (row.cells[index]) row.cells[index].classList.add('k-table__numeric'); });
          });
          var footer = table.tFoot || table.createTFoot(); footer.className = 'k-table__footer';
          var footerRow = footer.rows[0] || footer.insertRow(); var count = table.tHead.rows[0].cells.length;
          while (footerRow.cells.length < count) footerRow.insertCell();
          Array.prototype.forEach.call(footerRow.cells, function (cell) { cell.textContent = ''; cell.className = ''; });
          if (footerRow.cells[0]) { footerRow.cells[0].textContent = 'Total'; footerRow.cells[0].className = 'k-table__sum-label'; }
          sumColumns.forEach(function (index) {
            var total = rows.reduce(function (sum, row) {
              if (row.hidden) return sum;
              var cell = row.cells[index];
              var value = cell && (cell.getAttribute('data-k-sum-value') || cell.textContent || '');
              var number = Number(String(value).replace(/[^0-9.-]/g, ''));
              return Number.isFinite(number) ? sum + number : sum;
            }, 0);
            if (footerRow.cells[index]) {
              footerRow.cells[index].textContent = '$' + total.toLocaleString();
              footerRow.cells[index].classList.add('k-table__numeric');
            }
          });

        }


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
            updateSums();
          });
        }

        if (root.getAttribute('data-k-sortable') !== 'true') { updateSums(); return; }
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
          button.innerHTML = '<span></span><i data-kaui-icon="arrow-up-down" class="k-table__sort-icon" aria-hidden="true"></i>';
          button.firstChild.textContent = header.textContent.trim();
          header.replaceChildren(button);
          button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var nextDescending = button.getAttribute('aria-sort') === 'ascending';

            root.querySelectorAll('.k-table__sort').forEach(function (item) {
              item.setAttribute('aria-sort', 'none');
              var icon = item.querySelector('[data-kaui-icon]');
              if (icon) icon.setAttribute('data-kaui-icon', 'arrow-up-down');
            });
            button.setAttribute('aria-sort', nextDescending ? 'descending' : 'ascending');
            var activeIcon = button.querySelector('[data-kaui-icon]');
            if (activeIcon) activeIcon.setAttribute('data-kaui-icon', nextDescending ? 'arrow-down' : 'arrow-up');
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
            applyFrozenColumns();
            updateSums();
            renderKauiIcons();
          });
        });
        root.querySelectorAll('[data-k-table-select-all]').forEach(function (selectAll) {
          selectAll.addEventListener('change', function () {
            rows.forEach(function (row) { if (!row.hidden) row.querySelectorAll('input[type="checkbox"]').forEach(function (input) { input.checked = selectAll.checked; }); });
          });
        });
        updateSums();
        renderKauiIcons();
      });

      function syncFrozenContainerRowHeights() {
        document.querySelectorAll('.k-table-frozen-container').forEach(function (container) {
          var tables = container.querySelectorAll('.k-table');
          if (tables.length < 2) return;
          var headRows = Array.prototype.map.call(tables, function (t) { return t.tHead && t.tHead.rows[0]; }).filter(Boolean);
          if (headRows.length > 1) {
            var maxHeadH = Math.max.apply(null, headRows.map(function (r) { return r.offsetHeight; }));
            headRows.forEach(function (r) { r.style.height = maxHeadH + 'px'; });
          }
          var bodyCount = (tables[0].tBodies && tables[0].tBodies[0] && tables[0].tBodies[0].rows.length) || 0;
          for (var i = 0; i < bodyCount; i++) {
            var rowGroup = [];
            for (var t = 0; t < tables.length; t++) {
              var b = tables[t].tBodies && tables[t].tBodies[0];
              if (b && b.rows[i]) rowGroup.push(b.rows[i]);
            }
            if (rowGroup.length > 1) {
              var maxH = Math.max.apply(null, rowGroup.map(function (r) { return r.offsetHeight; }));
              rowGroup.forEach(function (r) { r.style.height = maxH + 'px'; });
            }
          }
        });
      }
      syncFrozenContainerRowHeights();
      window.addEventListener('resize', syncFrozenContainerRowHeights);
    }
    initDataTables();



    var latestManifestUrl = 'https://longbm64.github.io/kaui/dist/versions/{latest}/kaui-agent-manifest.json';
    // Component HTML copy actions
    var componentSnippets = {
      'agent-prompt': 'You are a senior frontend and UI engineer building production user interfaces using the KAUI Design System.\n\nMANDATORY FIRST STEP: Always use official KAUI tokens, classes, and conventions. Never recreate components or write arbitrary ad-hoc CSS when KAUI provides built-in contracts.\n\n1. INSTALLATION & PLATFORM CONTRACTS:\n   - Web / React / Next.js / Vite: Install `npm install filekat` and import `import \'filekat/kaui\';` once at the application entrypoint (e.g. `app/layout.tsx` or `main.js`).\n   - Flutter: Add `flutter pub add filekat` and import `import \'package:filekat/kaui.dart\';`.\n   - CDN / Static HTML: Include `<link rel="stylesheet" href="https://longbm64.github.io/kaui/dist/kaui.min.css">` and `<script src="https://longbm64.github.io/kaui/dist/kaui.min.js" defer></script>` for interactive dropdowns, navbar submenus, modal overlays, and rich table features.\n\n2. OFFICIAL MANIFEST & VERSION DOCUMENTATION:\n   - Manifest index: https://longbm64.github.io/kaui/dist/versions/index.json\n   - Read the latest release version and access canonical documentation: https://longbm64.github.io/kaui/dist/versions/<latest>/kaui-agent-manifest.json\n   - Inspect live component showcase and source code: https://longbm64.github.io/kaui/demo\n\n3. SYSTEM CONVENTIONS & TOKENS:\n   - Prefix: Always use the `.k-*` BEM hierarchy (e.g., `.k-card`, `.k-btn`, `.k-table`, `.k-modal`).\n   - Design Tokens: Consume `--k-primary`, `--k-bg`, `--k-text`, `--k-border`, `--k-spacing-*`, `--k-radius-*`.\n   - Dark Theme: Fully native via `[data-theme="dark"]` on root or containers.\n\n4. COMPONENT ARCHITECTURE & CONTRACTS:\n   - Table:\n     * Base: `.k-table-wrap`, `.k-table`, `.k-table--striped`, `.k-table--hover`, `.k-table--bordered`, `.k-table--sm`.\n     * Rich Cells: `.k-table__avatar` (avatar/initials), `.k-table__image`, `.k-table__chart` (`.k-table__chart-bar` with `--k-table-chart-value`), `.k-table__checkbox` (18x18px custom checkbox with 0.5rem spacing).\n     * Alignment: Text is left-aligned (`text-align: left`), numbers and currency are right-aligned (`data-k-table-number` / `.k-table__numeric` with tabular-nums), visual indicators are centered (`.k-table__visual`).\n     * Column Sum: Set `data-k-sum-columns="<col_indexes>"` on table root; values use `data-k-sum-value` and automatically recalculate on search/filter.\n     * Frozen Columns: Multi-pane architecture `.k-table-frozen-container` with `.k-table-pane--fixed-left`, `.k-table-viewport--scrollable` (where horizontal scroll strictly lives), and `.k-table-pane--fixed-right`.\n   - Buttons: `.k-btn` with styles `.k-btn--primary`, `.k-btn--secondary`, `.k-btn--outline`, loading state `.k-btn--loading` with `.k-btn__loader`.\n   - Forms: `.k-input`, `.k-select`, `.k-checkbox`, `.k-radio`, `.k-form-group`, `.k-form-label`, `.k-form-feedback`.\n   - Navigation: `.k-navbar`, multi-level nested submenus with viewport-aware auto-flip (`.is-dropup`, `.is-dropstart`).\n   - Feedback & Overlays: `.k-modal` (header/body/footer scroll containment), `.k-toast-container`, `.k-alert`.\n\n5. COMPLIANCE & LICENSING:\n   - KAUI 1.1.0+ is licensed for Personal & Non-Commercial use.\n   - For commercial deployment licenses, contact contact@filekat.com.',
      buttons: '<button class="k-btn k-btn--primary"><span class="k-btn__icon"><i data-kaui-icon="plus"></i></span><span class="k-btn__text">Primary Action</span></button>',
      forms: '<div class="k-input-wrapper">\n  <i data-kaui-icon="mail" class="k-input__icon k-input__icon--left"></i>\n  <input class="k-input" type="email">\n</div>',
      'full-name': '<div class="k-form-group">\n  <label for="demo-name" class="k-form-label">Full Name</label>\n  <div class="k-input-wrapper">\n    <i data-kaui-icon="user" class="k-input__icon k-input__icon--left" aria-hidden="true"></i>\n    <input type="text" id="demo-name" class="k-input" placeholder="e.g. Dang Long">\n  </div>\n  <span class="k-form-hint">Enter your legal full name as shown on official ID.</span>\n</div>',
      country: '<div class="k-form-group">\n  <label for="demo-country" class="k-form-label">Country / Region</label>\n  <div class="k-dropdown k-dropdown-select" data-k-dropdown-select data-k-searchable="true" data-k-placeholder="Select country...">\n    <select id="demo-country" class="k-select k-d-none" tabindex="-1" aria-hidden="true">\n      <option value="" disabled selected hidden>Select country...</option>\n      <option value="vn">Vietnam</option>\n      <option value="us">United States</option>\n    </select>\n    <button type="button" class="k-input k-dropdown__toggle" aria-haspopup="listbox" aria-expanded="false">\n      <span class="k-dropdown__value is-placeholder">Select country...</span>\n      <span class="k-dropdown__chevron" aria-hidden="true"><i data-kaui-icon="chevron-down"></i></span>\n    </button>\n  </div>\n</div>',
      notes: '<div class="k-form-group">\n  <label for="demo-notes" class="k-form-label">Project Bio / Notes</label>\n  <textarea id="demo-notes" class="k-textarea" rows="3" placeholder="Tell us about your project..."></textarea>\n</div>',
      'valid-email': '<div class="k-form-group">\n  <label for="demo-valid-email" class="k-form-label">Valid Username / Email</label>\n  <div class="k-input-wrapper">\n    <input type="text" id="demo-valid-email" class="k-input is-valid" value="danglong@example.com">\n    <i data-kaui-icon="check-circle-2" class="k-input__icon k-input__icon--right" aria-hidden="true"></i>\n  </div>\n  <div class="k-form-feedback k-form-feedback--valid">Username is available and looks great!</div>\n</div>',
      password: '<div class="k-form-group">\n  <label for="demo-invalid-password" class="k-form-label">Account Password</label>\n  <input type="password" id="demo-invalid-password" class="k-input is-invalid" value="123">\n  <div class="k-form-feedback k-form-feedback--invalid">Password must contain at least 8 characters with numbers and symbols.</div>\n</div>',
      'invalid-mod': '<div class="k-form-group">\n  <label for="demo-invalid-mod" class="k-form-label">Explicit Modifier State</label>\n  <input type="text" id="demo-invalid-mod" class="k-input k-input--invalid" value="invalid_token_syntax">\n  <div class="k-form-feedback k-form-feedback--invalid">Syntax error detected in token definition.</div>\n</div>',
      disabled: '<div class="k-form-group">\n  <label for="demo-disabled" class="k-form-label">Disabled Control</label>\n  <input type="text" id="demo-disabled" class="k-input is-disabled" value="Read-only system value" disabled>\n  <span class="k-form-hint">This setting is locked by administrator policy.</span>\n</div>',
      cards: '<div class="k-card">\n  <div class="k-card__header"><span class="k-card__icon"><i data-kaui-icon="layers"></i></span>Card Header</div>\n  <div class="k-card__body">Card content</div>\n</div>',
      badges: '<span class="k-badge k-badge--success k-badge--pill">Completed</span>',
      'guide-accordion': '<div class="k-accordion"><div class="k-accordion__item is-open"><button type="button" class="k-accordion__trigger">Shipping details</button><div class="k-accordion__body">Delivery takes 2–4 business days.</div></div></div>',
      'guide-alerts': '<div class="k-alert k-alert--success" role="status"><strong class="k-alert__title">Saved</strong><div class="k-alert__body">Your changes are now live.</div></div>',
      'guide-badges': '<span class="k-badge k-badge--success k-badge--pill">Completed</span>',
      'guide-buttons': '<button type="button" class="k-btn k-btn--primary"><span class="k-btn__icon">＋</span><span class="k-btn__text">Save changes</span></button>',
      'guide-cards': '<article class="k-card k-card--bordered"><div class="k-card__header">Account</div><div class="k-card__body">Plan details</div><div class="k-card__footer">Updated today</div></article>',
      'guide-button-loading': '<button type="button" class="k-btn k-btn--primary k-btn--loading" aria-busy="true"><span class="k-btn__loader" aria-hidden="true"></span><span class="k-btn__text">Saving...</span></button>',
      'guide-charts': '<div id="revenue-chart" class="k-chart" aria-label="Revenue trend"></div><script>KauiChart.create("#revenue-chart", { type: "line", labels: ["Jan", "Feb", "Mar"], datasets: [{ id: "revenue", label: "Revenue", data: [42, 58, 74] }] });</script>',
      'guide-forms': '<div class="k-form-group"><label for="email" class="k-form-label">Email</label><input id="email" class="k-input" type="email"><span class="k-form-hint">We never share your email.</span></div>',
      'guide-icons': '<svg class="k-icon" aria-hidden="true"><use href="../dist/icons/sprite.svg#search" xlink:href="../dist/icons/sprite.svg#search"></use></svg>',
      'guide-indicators': '<span class="k-spinner" aria-label="Loading"></span><div class="k-progress"><div class="k-progress__bar" style="width: 45%;"></div></div>',
      'guide-layout': '<div class="k-grid k-gap-4"><div class="k-col-12 k-col-md-6">Left column</div><div class="k-col-12 k-col-md-6">Right column</div></div>',
      'guide-modal': '<div class="k-modal is-open" role="dialog" aria-modal="true"><div class="k-modal__dialog"><div class="k-modal__header"><h3 class="k-modal__title">Title</h3></div><div class="k-modal__body">Dialog body text</div><div class="k-modal__footer"><button type="button" class="k-btn k-btn--primary">Confirm</button></div></div></div>',
      'guide-navbar': '<header class="k-navbar k-navbar--expand-lg k-navbar--offcanvas"><div class="k-navbar__container"><a href="#" class="k-navbar__brand">Brand</a><button type="button" class="k-navbar__toggle" aria-controls="primary-menu" aria-expanded="false">Menu</button><nav class="k-navbar__menu" id="primary-menu"><ul class="k-navbar__nav"><li><a href="#" class="k-navbar__link is-active" aria-current="page">Home</a></li><li class="k-navbar__item--has-children"><button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">Products</button><ul class="k-navbar__submenu"><li><a href="#" class="k-navbar__link">Overview</a></li><li class="k-navbar__item--has-children"><button type="button" class="k-navbar__link" aria-haspopup="true" aria-expanded="false">Advanced</button><ul class="k-navbar__submenu"><li><a href="#" class="k-navbar__link">Reports</a></li></ul></li></ul></li></ul><div class="k-navbar__actions"><button class="k-btn k-btn--primary"><span class="k-btn__text">Get started</span><span class="k-btn__icon"><i data-kaui-icon="arrow-right"></i></span></button></div></nav></div></header>',
      'guide-tabs': '<div class="k-tabs__list" role="tablist"><button class="k-tabs__tab is-active" data-tab-target="#profile" role="tab" aria-selected="true">Profile</button></div><div id="profile" class="k-tabs__panel is-active" role="tabpanel">Profile content</div>',
      'guide-toast': '<div class="k-toast-container k-toast-container--top-right" aria-live="polite"><div class="k-toast k-toast--success"><div class="k-toast__title">Saved</div><div class="k-toast__body">Preferences updated.</div></div></div>',
      'guide-tokens': '<div style="color: var(--k-primary); background: var(--k-bg);">Token-powered content</div>',

      alerts: '<div class="k-alert k-alert--success">\n  <strong class="k-alert__title">Success</strong>\n  <div class="k-alert__body">Operation completed.</div>\n</div>',
      charts: '<link rel="stylesheet" href="dist/kaui-chart.min.css">\n<script src="dist/kaui-chart.min.js"></script>\n\n<div id="revenue-chart" class="k-chart" data-k-chart="line" aria-label="Revenue trend"></div>\n\n<script>\n  KauiChart.create("#revenue-chart", {\n    type: "line",\n    labels: ["Jan", "Feb", "Mar", "Apr"],\n    datasets: [{ id: "revenue", label: "Revenue", data: [42, 58, 51, 74] }]\n  });\n</script>',
      'chart-line': '<div id="revenue-chart" class="k-chart" data-k-chart="line" aria-label="Revenue trend"></div>\n<script>\nKauiChart.create("#revenue-chart", { type: "line", labels: ["Jan", "Feb", "Mar"], datasets: [{ id: "revenue", label: "Revenue", data: [42, 58, 51] }] });\n</script>',
      'chart-bar': '<div id="sales-chart" class="k-chart k-chart--sm" data-k-chart="bar" aria-label="Quarterly sales"></div>\n<script>\nKauiChart.create("#sales-chart", { type: "bar", labels: ["Q1", "Q2", "Q3", "Q4"], datasets: [{ id: "sales", label: "Sales", data: [42, 68, 54, 82] }] });\n</script>',
      'guide-navbar-basic': '<header class="k-navbar k-navbar--expand-lg k-navbar--offcanvas"><div class="k-navbar__container"><a class="k-navbar__brand" href="#">Brand</a><button class="k-navbar__toggle" type="button" aria-controls="primary-menu" aria-expanded="false">Menu</button><nav class="k-navbar__menu" id="primary-menu" aria-label="Primary navigation"><ul class="k-navbar__nav"><li><a class="k-navbar__link is-active" href="#" aria-current="page">Home</a></li><li><a class="k-navbar__link" href="#about">About</a></li></ul><div class="k-navbar__actions"><a class="k-btn k-btn--primary" href="#start">Get started</a></div></nav></div></header>',
      'guide-navbar-nested': '<nav class="k-navbar__menu is-open" id="primary-menu" aria-label="Primary navigation"><ul class="k-navbar__nav"><li class="k-navbar__item--has-children"><button class="k-navbar__link" type="button" aria-haspopup="true" aria-expanded="false">Products <i data-kaui-icon="chevron-down" aria-hidden="true"></i></button><ul class="k-navbar__submenu"><li><a class="k-navbar__link" href="#overview">Overview</a></li><li class="k-navbar__item--has-children"><button class="k-navbar__link" type="button" aria-haspopup="true" aria-expanded="false">Advanced <i data-kaui-icon="chevron-right" aria-hidden="true"></i></button><ul class="k-navbar__submenu"><li><a class="k-navbar__link" href="#reports">Reports</a></li><li><a class="k-navbar__link" href="#analytics">Analytics</a></li></ul></li></ul></li></ul></nav>',
      'guide-navbar-overflow': '<li class="k-navbar__item--has-children"><button class="k-navbar__link" type="button" aria-haspopup="true" aria-expanded="false">Edge test</button><ul class="k-navbar__submenu"><li><a class="k-navbar__link" href="#overview">Overview</a></li><li class="k-navbar__item--has-children"><button class="k-navbar__link" type="button" aria-haspopup="true" aria-expanded="false">More levels</button><ul class="k-navbar__submenu"><li><a class="k-navbar__link" href="#settings">Settings</a></li></ul></li></ul></li>',

      'icon-usage': '<svg class=\"k-icon\" aria-hidden=\"true\"><use href=\"dist/icons/sprite.svg#search\" xlink:href=\"dist/icons/sprite.svg#search\"></use></svg>',

      'platform-tokens': 'npm run tokens:build\nnpm run tokens:verify',
      'platform-icons': 'npm run icons:build',
      'platform-release': 'npm run audit:license\nnpm run verify:release\nnpm test',

      'chart-donut': '<div id="status-chart" class="k-chart k-chart--sm k-chart--donut" data-k-chart="donut" aria-label="Project status"></div>\n<script>\nKauiChart.create("#status-chart", { type: "donut", labels: ["Done", "Review", "Todo"], datasets: [{ id: "status", label: "Status", data: [58, 24, 18] }] });\n</script>',
      'chart-realtime': '<div id="traffic-chart" class="k-chart" data-k-chart="line" aria-label="Realtime traffic"></div>\n<script>\nconst chart = KauiChart.create("#traffic-chart", { type: "line", maxPoints: 60, datasets: [{ id: "requests", label: "Requests", data: [] }] });\nsetInterval(() => chart.push({ time: Date.now(), values: { requests: Math.round(Math.random() * 100) } }), 1000);\n</script>',

    };

    var iconSvgPaths = {
      'add': '<path d="M12 5v14M5 12h14"/>',
      'close': '<path d="M18 6 6 18M6 6l12 12"/>',
      'check': '<path d="m5 12 5 5L20 7"/>',
      'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      'edit': '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      'delete': '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
      'save': '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"/>',
      'menu': '<path d="M4 12h16M4 6h16M4 18h16"/>',
      'arrow-left': '<path d="m12 19-7-7 7-7M5 12h14"/>',
      'arrow-down': '<path d="M12 4v16M5 14l7 7 7-7"/>',
      'arrow-up': '<path d="M12 20V4M5 10l7-7 7 7"/>',
      'arrow-up-down': '<path d="M12 4v7m0-7-3 3m3-3 3 3M12 20v-7m0 7-3-3m3 3 3-3"/>',
      'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
      'chevron-down': '<path d="m6 9 6 6 6-6"/>',
      'chevron-up': '<path d="m18 15-6-6-6 6"/>',
      'chevron-left': '<path d="m15 18-6-6 6-6"/>',
      'chevron-right': '<path d="m9 18 6-6-6-6"/>',
      'external-link': '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
      'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
      'warning': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
      'error': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
      'success': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
      'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
      'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
      'file': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
      'folder': '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
      'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
      'copy': '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
      'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
      'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'
    };
    renderKauiIcons();
    var iconNames = Object.keys(iconSvgPaths);
    window.renderKauiIcons = renderKauiIcons;
    renderKauiIcons();


    function ensureInlineSprite(spriteXml) {
      if (document.getElementById('kaui-embedded-sprite')) return;
      var div = document.createElement('div');
      div.id = 'kaui-embedded-sprite';
      div.style.position = 'absolute';
      div.style.width = '0';
      div.style.height = '0';
      div.style.overflow = 'hidden';
      div.setAttribute('aria-hidden', 'true');
      div.innerHTML = spriteXml;
      document.body.insertBefore(div, document.body.firstChild);
    }

    function iconSnippet(name) {
      var paths = iconSvgPaths[name] || '';
      return '<svg class="k-icon k-icon--' + name + '" viewBox="0 0 24 24" aria-hidden="true">' + (paths || '<use href="#' + name + '" xlink:href="#' + name + '"></use>') + '</svg>';
    }

    function iconCategory(name) {
      var groups = {
        'Social': /^social-/,
        'Navigation': /^(arrow|chevron|compass|external-link|home|map|map-pin|menu)$/,
        'Files & Content': /^(clipboard|code|columns|file|folder|grid|image|table|terminal)$/,
        'Commerce': /^(credit-card|shopping-cart|wallet)$/,
        'Communication': /^(bell|mail|users?)$/,
        'Account & Security': /^(eye|eye-off|lock|shield|unlock|user)$/,
        'Media': /^(camera|pause|play|refresh|sync)$/,
        'Actions': /^(add|check|close|copy|delete|download|edit|save|upload)$/,
        'Feedback': /^(error|help|info|success|warning)$/,
        'Favorites & Labels': /^(heart|star|tag)$/
      };
      var category = Object.keys(groups).find(function (label) { return groups[label].test(name); });
      return category || 'Other';
    }

    function renderIconGallery(names) {
      var grid = document.getElementById('icon-gallery-grid');
      if (!grid) return;
      var count = document.getElementById('icon-gallery-count');
      if (count) count.textContent = names.length.toLocaleString() + ' icons';

      var grouped = names.reduce(function (result, name) {
        var category = iconCategory(name);
        (result[category] = result[category] || []).push(name);
        return result;
      }, {});
      var categoryOrder = ['Actions', 'Navigation', 'Files & Content', 'Feedback', 'Account & Security', 'Communication', 'Commerce', 'Media', 'Social', 'Favorites & Labels', 'Other'];
      grid.innerHTML = categoryOrder.filter(function (category) { return grouped[category] && grouped[category].length; }).map(function (category) {
        var cards = grouped[category].sort().map(function (name) {
          return '<div class="k-col-6 k-col-md-4 k-col-lg-3"><article class="demo-icon-card k-card k-card--bordered">' +
            '<div class="demo-icon-card__main">' + iconSnippet(name) + '<code class="demo-icon-card__name">' + name + '</code></div>' +
            '<button type="button" class="demo-icon-copy demo-copy-button" data-copy-icon="' + name + '"><span class="demo-copy-label">Copy</span></button>' +
          '</article></div>';
        }).join('');
        return '<section class="demo-icon-group" aria-labelledby="icon-group-' + category.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '">' +
          '<div class="demo-icon-group__header"><h3 id="icon-group-' + category.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '" class="demo-subheading">' + category + '</h3><span class="k-badge k-badge--pill">' + grouped[category].length + ' icons</span></div>' +
          '<div class="k-grid k-gap-3">' + cards + '</div></section>';
      }).join('');
    }

    Promise.all([
      fetch('../dist/icons/sprite.svg').then(function (response) {
        if (!response.ok) throw new Error('Icon sprite request failed');
        return response.text();
      }),
      fetch('../dist/icons/kaui-icons.json').then(function (response) {
        if (!response.ok) throw new Error('Icon manifest request failed');
        return response.json();
      })
    ]).then(function (result) {
      ensureInlineSprite(result[0]);
      renderIconGallery(Array.isArray(result[1].icons) ? result[1].icons : iconNames);
    }).catch(function () {
      renderIconGallery(iconNames);
    });


    fetch('https://longbm64.github.io/kaui/dist/versions/index.json').then(function (response) { return response.json(); }).then(function (registry) {
      var latest = registry.latest;
      latestManifestUrl = 'https://longbm64.github.io/kaui/dist/versions/' + latest + '/kaui-agent-manifest.json';
      componentSnippets['agent-prompt'] = componentSnippets['agent-prompt'].replace('{latest}', latest);
      var promptCode = document.querySelector('#agent-prompt-code code');
      if (promptCode) promptCode.textContent = promptCode.textContent.replace('{latest}', latest);
    }).catch(function () {});

    function copyText(text, done) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
        return;
      }
      fallbackCopy(text, done);
    }


    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-copy-icon]');
      if (!button) return;
      var name = button.getAttribute('data-copy-icon');
      copyText(iconSnippet(name), function () {
        var label = button.querySelector('.demo-copy-label');
        if (label) label.textContent = 'Copied!';
        button.classList.add('is-copied');
        setTimeout(function () {
          if (label) label.textContent = 'Copy';
          button.classList.remove('is-copied');
        }, 1400);
      });
    });


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
        var payload = componentSnippets[key];
        if (!payload && key === 'agent-prompt') {
          var promptBlock = document.querySelector('#agent-prompt-code code');
          if (promptBlock) payload = promptBlock.textContent;
        }
        if (!payload) return;
        copyText(payload, function () {
          var label = button.querySelector('.demo-copy-label');
          var fallbackText = key === 'agent-prompt' ? 'Copy prompt' : 'Copy code';
          if (label) label.textContent = 'Copied!';
          button.classList.add('is-copied');
          setTimeout(function () {
            if (label) label.textContent = fallbackText;
            button.classList.remove('is-copied');
          }, 1400);
        });

        });
      });

    // Color palette copy actions
    if (typeof document.querySelectorAll === 'function') {
      document.querySelectorAll('[data-copy-color]').forEach(function (button) {
        button.addEventListener('click', function () {
          var color = button.getAttribute('data-copy-color');
          if (!color) return;
          copyText(color, function () {
            var label = button.querySelector('.demo-copy-label');
            if (label) label.textContent = 'Copied!';
            button.classList.add('is-copied');
            setTimeout(function () {
              if (label) label.textContent = 'Copy';
              button.classList.remove('is-copied');
            }, 1400);
          });
        });
      });
    }


    // Dependency-free chart showcase: realtime push + static SVG examples.
    if (window.KauiChart) {
      var line = window.KauiChart.create('#demo-line-chart', { type: 'line', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ id: 'revenue', label: 'Revenue', color: 'var(--k-chart-1)', data: [42, 58, 51, 74, 68, 88] }, { id: 'orders', label: 'Orders', color: 'var(--k-chart-3)', data: [28, 36, 44, 40, 56, 63] }] });
      var bar = window.KauiChart.create('#demo-bar-chart', { type: 'bar', labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ id: 'sales', label: 'Sales', color: 'var(--k-chart-1)', data: [42, 68, 54, 82] }, { id: 'target', label: 'Target', color: 'var(--k-chart-2)', data: [55, 60, 65, 70] }] });
      var donut = window.KauiChart.create('#demo-donut-chart', { type: 'donut', labels: ['Done', 'Review', 'Todo'], datasets: [{ id: 'status', label: 'Status', data: [58, 24, 18] }] });
      var realtime = window.KauiChart.create('#demo-realtime-chart', {
        type: 'line', maxPoints: 24, pauseWhenHidden: true,
        labels: [], datasets: [{ id: 'requests', label: 'Requests', color: 'var(--k-chart-1)', data: [] }, { id: 'errors', label: 'Errors', color: 'var(--k-chart-2)', data: [] }]
      });
      var tick = 0, streamActive = true, stream = setInterval(function () {
        if (!streamActive) return;
        tick += 1;
        realtime.push({ time: Date.now(), values: { requests: 45 + Math.round(Math.random() * 40), errors: 4 + Math.round(Math.random() * 12) } });
      }, 700);
      var toggle = document.querySelector('[data-chart-toggle]'), clear = document.querySelector('[data-chart-clear]');
      if (toggle) toggle.addEventListener('click', function () {
        streamActive = !streamActive;
        if (streamActive) { realtime.resume(); toggle.textContent = 'Pause'; }
        else { realtime.pause(); toggle.textContent = 'Resume'; }
      });
      if (clear) clear.addEventListener('click', function () { realtime.clear(); });
      window.addEventListener('beforeunload', function () { clearInterval(stream); realtime.destroy(); line.destroy(); bar.destroy(); donut.destroy(); });
    }

    }

  });
})();
