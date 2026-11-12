/**
 * KAUI Core Component Runtime (v1.1.1)
 * Zero-dependency vanilla JavaScript for KAUI Interactive Components:
 * - Dropdowns & Custom Selects (.k-dropdown, .k-dropdown-select)
 * - Navigation Bar & Multi-level Responsive Submenus (.k-navbar)
 * - Modal Dialogs & Confirm Overlays (.k-modal, .k-confirm)
 * - Interactive Tabs (.k-tabs)
 * - Accordions (.k-accordion)
 * - Data Tables (search, sort, column totals, frozen multi-pane, select-all)
 */

(function (global) {
  'use strict';

  var Kaui = {};

  // 1. Dropdowns & Custom Select (.k-dropdown, .k-dropdown-select)
  function initDropdowns() {
    function adjustPlacement(toggle, menu) {
      if (!toggle || !menu) return;
      var parent = toggle.closest('.k-dropdown');
      if (!parent) return;
      parent.classList.remove('k-dropdown--dropup', 'k-dropdown--align-right');
      var toggleRect = toggle.getBoundingClientRect();
      var menuHeight = menu.offsetHeight || 220;
      var spaceBelow = window.innerHeight - toggleRect.bottom;
      var spaceAbove = toggleRect.top;
      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        parent.classList.add('k-dropdown--dropup');
      }
      var menuWidth = menu.offsetWidth || 200;
      if (toggleRect.left + menuWidth > window.innerWidth - 12 && toggleRect.right - menuWidth > 12) {
        parent.classList.add('k-dropdown--align-right');
      }
    }

    document.querySelectorAll('[data-k-dropdown-select]').forEach(function (container) {
      var toggle = container.querySelector('.k-dropdown__toggle');
      var menu = container.querySelector('.k-dropdown__menu');
      var hiddenSelect = container.querySelector('select');
      var valueDisplay = container.querySelector('.k-dropdown__value');
      var searchInput = container.querySelector('[data-k-dropdown-search]');
      var items = container.querySelectorAll('.k-dropdown__item');

      if (toggle && menu) {
        toggle.addEventListener('click', function (e) {
          e.stopPropagation();
          var isOpen = container.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (isOpen) {
            adjustPlacement(toggle, menu);
            if (searchInput) searchInput.focus();
          }
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', function () {
          var q = searchInput.value.toLowerCase().trim();
          items.forEach(function (item) {
            var text = item.textContent.toLowerCase();
            item.hidden = q.length > 0 && text.indexOf(q) === -1;
          });
        });
      }

      items.forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.stopPropagation();
          var val = item.getAttribute('data-value') || '';
          var text = item.textContent.replace('✓', '').trim();
          items.forEach(function (it) { it.classList.remove('is-selected'); it.removeAttribute('aria-selected'); });
          item.classList.add('is-selected');
          item.setAttribute('aria-selected', 'true');
          if (valueDisplay) {
            valueDisplay.textContent = text;
            valueDisplay.classList.remove('is-placeholder');
          }
          if (hiddenSelect) {
            hiddenSelect.value = val;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
          container.classList.remove('is-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.addEventListener('click', function (e) {
      document.querySelectorAll('.k-dropdown.is-open').forEach(function (d) {
        if (!d.contains(e.target)) {
          d.classList.remove('is-open');
          var toggle = d.querySelector('.k-dropdown__toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 2. Navigation Bar & Multi-level Submenus (.k-navbar)
  function initNavbar() {
    document.querySelectorAll('.k-navbar').forEach(function (navbar) {
      var toggle = navbar.querySelector('.k-navbar__toggle');
      var menu = navbar.querySelector('.k-navbar__menu');

      if (toggle && menu) {
        toggle.addEventListener('click', function () {
          var isOpen = menu.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      }

      var hasChildren = navbar.querySelectorAll('.k-navbar__item--has-children');
      hasChildren.forEach(function (item) {
        var link = item.querySelector(':scope > .k-navbar__link');
        var submenu = item.querySelector(':scope > .k-navbar__submenu');
        if (link && submenu) {
          link.addEventListener('click', function (e) {
            if (window.innerWidth < 992 || link.tagName === 'BUTTON' || link.getAttribute('href') === '#') {
              e.preventDefault();
              e.stopPropagation();
              var isOpen = item.classList.toggle('is-open');
              link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
              if (isOpen && window.innerWidth >= 992) {
                item.classList.remove('is-dropup', 'is-dropstart');
                var rect = submenu.getBoundingClientRect();
                if (rect.bottom > window.innerHeight - 12) item.classList.add('is-dropup');
                if (rect.right > window.innerWidth - 12) item.classList.add('is-dropstart');
              }
            }
          });
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.k-navbar__item--has-children')) {
        document.querySelectorAll('.k-navbar__item--has-children.is-open').forEach(function (item) {
          item.classList.remove('is-open');
          var link = item.querySelector(':scope > .k-navbar__link');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // 3. Modal Dialogs (.k-modal)
  function initModals() {
    document.addEventListener('click', function (e) {
      var openTrigger = e.target.closest('[data-k-modal-target]');
      if (openTrigger) {
        var targetId = openTrigger.getAttribute('data-k-modal-target');
        var modal = document.querySelector(targetId);
        if (modal) modal.classList.add('is-open');
        return;
      }

      var dismissTrigger = e.target.closest('[data-k-modal-dismiss]');
      if (dismissTrigger) {
        var openModal = dismissTrigger.closest('.k-modal.is-open');
        if (openModal) openModal.classList.remove('is-open');
        return;
      }

      var backdrop = e.target.closest('.k-modal-backdrop');
      if (backdrop) {
        var backdropModal = backdrop.closest('.k-modal.is-open');
        if (backdropModal && backdropModal.getAttribute('data-k-backdrop') === 'true') {
          backdropModal.classList.remove('is-open');
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openModal = document.querySelector('.k-modal.is-open');
        if (openModal) {
          openModal.classList.remove('is-open');
        }
      }
    });
  }

  // 3b. Confirm Dialogs (.k-confirm)
  function initConfirms() {
    document.addEventListener('click', function (e) {
      var openTrigger = e.target.closest('[data-k-confirm-target]');
      if (openTrigger) {
        var targetId = openTrigger.getAttribute('data-k-confirm-target');
        var confirm = document.querySelector(targetId);
        if (confirm) confirm.classList.add('is-open');
        return;
      }

      var dismissTrigger = e.target.closest('[data-k-confirm-dismiss]');
      if (dismissTrigger) {
        var openConfirm = dismissTrigger.closest('.k-confirm.is-open');
        if (openConfirm) openConfirm.classList.remove('is-open');
        return;
      }

      var backdrop = e.target.closest('.k-confirm__backdrop');
      if (backdrop) {
        var backdropConfirm = backdrop.closest('.k-confirm.is-open');
        if (backdropConfirm && backdropConfirm.getAttribute('data-k-backdrop') === 'true') {
          backdropConfirm.classList.remove('is-open');
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openConfirm = document.querySelector('.k-confirm.is-open');
        if (openConfirm) {
          openConfirm.classList.remove('is-open');
        }
      }
    });
  }

  // 4. Tabs & Accordions (.k-tabs, .k-accordion)
  function initTabsAndAccordions() {
    document.addEventListener('click', function (e) {
      var tab = e.target.closest('.k-tabs__tab');
      if (tab) {
        var list = tab.closest('.k-tabs__list');
        var targetSelector = tab.getAttribute('data-tab-target');
        if (list && targetSelector) {
          list.querySelectorAll('.k-tabs__tab').forEach(function (t) {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          var container = list.parentElement;
          if (container) {
            container.querySelectorAll('.k-tabs__panel').forEach(function (p) { p.classList.remove('is-active'); });
            var targetPanel = container.querySelector(targetSelector);
            if (targetPanel) targetPanel.classList.add('is-active');
          }
        }
        return;
      }

      var trigger = e.target.closest('.k-accordion__trigger');
      if (trigger) {
        var item = trigger.closest('.k-accordion__item');
        if (item) {
          var isOpen = item.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      }
    });
  }

  // 5. Data Tables (Search, Sort, Sum, Frozen Multi-Pane)
  function initTables() {
    function normalize(text) {
      return String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    }

    document.querySelectorAll('[data-k-table]').forEach(function (root) {
      var table = root.matches('table') ? root : root.querySelector('table');
      var tbody = table && table.tBodies && table.tBodies[0];
      if (!table || !tbody) return;

      var rows = Array.prototype.filter.call(tbody.rows, function (row) { return !row.hasAttribute('data-k-table-no-results'); });
      var empty = tbody.querySelector('[data-k-table-no-results]');
      var search = root.querySelector('[data-k-table-search]');

      // Pagination setup
      var hasPagination = root.getAttribute('data-k-pagination') === 'true' || !!root.querySelector('.k-table__pagination');
      var pageSize = parseInt(root.getAttribute('data-k-page-size') || '10', 10);
      if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;
      var currentPage = 1;
      var paginationRoot = root.querySelector('.k-table__pagination');
      var sizeSelect = paginationRoot ? paginationRoot.querySelector('[data-k-table-page-size]') : null;
      var startSpan = paginationRoot ? paginationRoot.querySelector('[data-k-table-pagination-start]') : null;
      var endSpan = paginationRoot ? paginationRoot.querySelector('[data-k-table-pagination-end]') : null;
      var totalSpan = paginationRoot ? paginationRoot.querySelector('[data-k-table-pagination-total]') : null;
      var totalPagesSpan = paginationRoot ? paginationRoot.querySelector('[data-k-table-pagination-pages]') : null;
      var jumpInput = paginationRoot ? paginationRoot.querySelector('[data-k-table-page-jump]') : null;
      var navContainer = paginationRoot ? paginationRoot.querySelector('[data-k-table-pagination-nav]') : null;

      function getSearchMatchedRows() {
        if (!search) return rows.slice();
        var q = normalize(search.value).trim().split(/\s+/).filter(Boolean);
        if (!q.length) return rows.slice();
        return rows.filter(function (row) {
          var text = normalize(row.textContent || '');
          return q.every(function (word) { return text.indexOf(word) !== -1; });
        });
      }

      function updateSums() {
        var sumAttr = root.getAttribute('data-k-sum-columns') || '';
        var sumCols = sumAttr.split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(Number).filter(function (i) { return Number.isInteger(i) && i >= 0; });
        if (!sumCols.length) return;

        sumCols.forEach(function (index) {
          var header = table.tHead && table.tHead.rows[0] && table.tHead.rows[0].cells[index];
          if (header) header.classList.add('k-table__numeric');
          rows.forEach(function (row) { if (row.cells[index]) row.cells[index].classList.add('k-table__numeric'); });
        });

        var footer = table.tFoot || table.createTFoot();
        footer.className = 'k-table__footer';
        var footerRow = footer.rows[0] || footer.insertRow();
        var colCount = table.tHead.rows[0].cells.length;
        while (footerRow.cells.length < colCount) footerRow.insertCell();
        Array.prototype.forEach.call(footerRow.cells, function (cell) { cell.textContent = ''; cell.className = ''; });
        if (footerRow.cells[0]) { footerRow.cells[0].textContent = 'Total'; footerRow.cells[0].className = 'k-table__sum-label'; }

        sumCols.forEach(function (index) {
          var total = rows.reduce(function (sum, row) {
            if (row.hidden) return sum;
            var cell = row.cells[index];
            var val = cell && (cell.getAttribute('data-k-sum-value') || cell.textContent || '');
            var num = Number(String(val).replace(/[^0-9.-]/g, ''));
            return Number.isFinite(num) ? sum + num : sum;
          }, 0);
          if (footerRow.cells[index]) {
            footerRow.cells[index].textContent = '$' + total.toLocaleString();
            footerRow.cells[index].classList.add('k-table__numeric');
          }
        });
      }

      function renderPaginationControls(totalMatches) {
        if (!hasPagination || !paginationRoot) return;
        var totalPages = Math.ceil(totalMatches / pageSize) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var startEntry = totalMatches === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        var endEntry = Math.min(currentPage * pageSize, totalMatches);

        if (startSpan) startSpan.textContent = startEntry;
        if (endSpan) endSpan.textContent = endEntry;
        if (totalSpan) totalSpan.textContent = totalMatches;
        if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
        if (jumpInput) {
          jumpInput.max = totalPages;
          jumpInput.value = currentPage;
        }

        if (navContainer) {
          navContainer.innerHTML = '';

          var firstBtn = document.createElement('button');
          firstBtn.type = 'button';
          firstBtn.className = 'k-pagination__item' + (currentPage <= 1 ? ' is-disabled' : '');
          firstBtn.setAttribute('aria-label', 'First page');
          firstBtn.setAttribute('title', 'First page');
          if (currentPage <= 1) {
            firstBtn.disabled = true;
            firstBtn.setAttribute('aria-disabled', 'true');
          }
          firstBtn.innerHTML = '«';
          firstBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
              currentPage = 1;
              applyVisibility();
            }
          });
          navContainer.appendChild(firstBtn);

          var prevBtn = document.createElement('button');
          prevBtn.type = 'button';
          prevBtn.className = 'k-pagination__item' + (currentPage <= 1 ? ' is-disabled' : '');
          prevBtn.setAttribute('aria-label', 'Previous page');
          prevBtn.setAttribute('title', 'Previous page');
          if (currentPage <= 1) {
            prevBtn.disabled = true;
            prevBtn.setAttribute('aria-disabled', 'true');
          }
          prevBtn.innerHTML = '‹';
          prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
              currentPage--;
              applyVisibility();
            }
          });
          navContainer.appendChild(prevBtn);

          var pages = [];
          if (totalPages <= 7) {
            for (var p = 1; p <= totalPages; p++) pages.push(p);
          } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            var startP = Math.max(2, currentPage - 1);
            var endP = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 3) endP = 4;
            if (currentPage >= totalPages - 2) startP = totalPages - 3;
            for (var p2 = startP; p2 <= endP; p2++) {
              if (pages.indexOf(p2) === -1) pages.push(p2);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
          }

          pages.forEach(function (pItem) {
            if (pItem === '...') {
              var ellipsis = document.createElement('span');
              ellipsis.className = 'k-pagination__ellipsis';
              ellipsis.textContent = '…';
              navContainer.appendChild(ellipsis);
            } else {
              var pBtn = document.createElement('button');
              pBtn.type = 'button';
              pBtn.className = 'k-pagination__item' + (pItem === currentPage ? ' is-active' : '');
              pBtn.setAttribute('aria-label', 'Page ' + pItem);
              if (pItem === currentPage) pBtn.setAttribute('aria-current', 'page');
              pBtn.textContent = pItem;
              pBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (currentPage !== pItem) {
                  currentPage = pItem;
                  applyVisibility();
                }
              });
              navContainer.appendChild(pBtn);
            }
          });

          var nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'k-pagination__item' + (currentPage >= totalPages ? ' is-disabled' : '');
          nextBtn.setAttribute('aria-label', 'Next page');
          nextBtn.setAttribute('title', 'Next page');
          if (currentPage >= totalPages) {
            nextBtn.disabled = true;
            nextBtn.setAttribute('aria-disabled', 'true');
          }
          nextBtn.innerHTML = '›';
          nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage < totalPages) {
              currentPage++;
              applyVisibility();
            }
          });
          navContainer.appendChild(nextBtn);

          var lastBtn = document.createElement('button');
          lastBtn.type = 'button';
          lastBtn.className = 'k-pagination__item' + (currentPage >= totalPages ? ' is-disabled' : '');
          lastBtn.setAttribute('aria-label', 'Last page');
          lastBtn.setAttribute('title', 'Last page');
          if (currentPage >= totalPages) {
            lastBtn.disabled = true;
            lastBtn.setAttribute('aria-disabled', 'true');
          }
          lastBtn.innerHTML = '»';
          lastBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage < totalPages) {
              currentPage = totalPages;
              applyVisibility();
            }
          });
          navContainer.appendChild(lastBtn);
        }
      }

      function applyVisibility() {
        var matchedRows = getSearchMatchedRows();
        var totalMatches = matchedRows.length;

        if (hasPagination) {
          var totalPages = Math.ceil(totalMatches / pageSize) || 1;
          if (currentPage > totalPages) currentPage = totalPages;
          if (currentPage < 1) currentPage = 1;

          var startIndex = (currentPage - 1) * pageSize;
          var endIndex = startIndex + pageSize;

          rows.forEach(function (row) {
            var matchIdx = matchedRows.indexOf(row);
            if (matchIdx !== -1 && matchIdx >= startIndex && matchIdx < endIndex) {
              row.hidden = false;
            } else {
              row.hidden = true;
            }
          });

          renderPaginationControls(totalMatches);
        } else {
          rows.forEach(function (row) {
            row.hidden = matchedRows.indexOf(row) === -1;
          });
        }

        if (empty) empty.hidden = totalMatches !== 0;
        updateLastVisibleRow();
        updateSums();
      }

      function updateLastVisibleRow() {
        var last = null;
        rows.forEach(function (r) {
          r.classList.remove('is-last-row');
          if (!r.hidden) last = r;
        });
        if (last) last.classList.add('is-last-row');
      }

      if (sizeSelect) {
        sizeSelect.value = String(pageSize);
        sizeSelect.addEventListener('change', function () {
          var val = parseInt(sizeSelect.value, 10);
          if (!isNaN(val) && val > 0) {
            pageSize = val;
            currentPage = 1;
            applyVisibility();
          }
        });
      }
      if (jumpInput) {
        jumpInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            var targetPage = parseInt(jumpInput.value, 10);
            var matched = getSearchMatchedRows();
            var totalPages = Math.ceil(matched.length / pageSize) || 1;
            if (!isNaN(targetPage)) {
              if (targetPage < 1) targetPage = 1;
              if (targetPage > totalPages) targetPage = totalPages;
              if (currentPage !== targetPage) {
                currentPage = targetPage;
                applyVisibility();
              } else {
                jumpInput.value = currentPage;
              }
            }
          }
        });
        jumpInput.addEventListener('blur', function () {
          jumpInput.value = currentPage;
        });
      }


      if (search) {
        search.addEventListener('input', function () {
          currentPage = 1;
          applyVisibility();
        });
      }

      applyVisibility();

      root.querySelectorAll('[data-k-table-select-all]').forEach(function (selectAll) {
        selectAll.addEventListener('change', function () {
          rows.forEach(function (row) {
            if (!row.hidden) row.querySelectorAll('input[type="checkbox"]').forEach(function (input) { input.checked = selectAll.checked; });
          });
        });
      });

      updateSums();
    });

    function syncFrozenRowHeights() {
      document.querySelectorAll('.k-table-frozen-container').forEach(function (container) {
        var tables = container.querySelectorAll('.k-table');
        if (tables.length < 2) return;
        var headRows = Array.prototype.map.call(tables, function (t) { return t.tHead && t.tHead.rows[0]; }).filter(Boolean);
        var headHeight = 0;
        headRows.forEach(function (row) { headHeight = Math.max(headHeight, row.offsetHeight); });
        if (headRows.length > 1) headRows.forEach(function (row) { if (row.offsetHeight !== headHeight) row.style.height = headHeight + 'px'; });
        var bodyCount = (tables[0].tBodies && tables[0].tBodies[0] && tables[0].tBodies[0].rows.length) || 0;
        for (var i = 0; i < bodyCount; i++) {
          var rowGroup = [];
          for (var t = 0; t < tables.length; t++) {
            var b = tables[t].tBodies && tables[t].tBodies[0];
            if (b && b.rows[i]) rowGroup.push(b.rows[i]);
          }
          var maxH = 0;
          rowGroup.forEach(function (row) { maxH = Math.max(maxH, row.offsetHeight); });
          if (rowGroup.length > 1) rowGroup.forEach(function (row) { if (row.offsetHeight !== maxH) row.style.height = maxH + 'px'; });
        }
      });
    }
    var frozenResizeFrame = 0;
    function scheduleFrozenRowHeights() {
      if (frozenResizeFrame) return;
      frozenResizeFrame = requestAnimationFrame(function () {
        frozenResizeFrame = 0;
        syncFrozenRowHeights();
      });
    }
    syncFrozenRowHeights();
    window.addEventListener('resize', scheduleFrozenRowHeights, { passive: true });
  }


  // 6. Form input formats and password visibility controls
  function initFormInputs() {
    function pad(value, size) {
      var digits = String(value || '').replace(/\D/g, '');
      return typeof size === 'number' ? digits.slice(0, size) : digits;
    }
    function formatDate(value) {
      var d = pad(value, 8);
      if (!d) return '';
      if (d.length <= 4) return d;
      var y = d.slice(0, 4);
      var m = d.slice(4, 6);
      if (d.length <= 6) return y + '-' + m;
      var day = d.slice(6, 8);
      return y + '-' + m + '-' + day;
    }

    function formatDateTime(value) {
      var d = pad(value, 14);
      if (!d) return '';
      if (d.length <= 4) return d;
      var y = d.slice(0, 4);
      var m = d.slice(4, 6);
      var res = y + '-' + m;
      if (d.length <= 6) return res;
      var day = d.slice(6, 8);
      res += '-' + day;
      if (d.length <= 8) return res;
      var hh = d.slice(8, 10);
      res += ' ' + hh;
      if (d.length <= 10) return res;
      var ii = d.slice(10, 12);
      res += ':' + ii;
      if (d.length <= 12) return res;
      var ss = d.slice(12, 14);
      return res + ':' + ss;
    }

    function formatMonth(value) {
      var d = pad(value, 6);
      if (!d) return '';
      if (d.length <= 4) return d;
      var y = d.slice(0, 4);
      var m = d.slice(4, 6);
      return y + '-' + m;
    }
    function formatTime(value) {
      var d = pad(value, 6);
      if (!d) return '';
      var hh = d.slice(0, 2);
      if (hh.length === 2 && parseInt(hh, 10) > 23) hh = '23';
      if (d.length <= 2) return hh;

      var ii = d.slice(2, 4);
      if (ii.length === 2 && parseInt(ii, 10) > 59) ii = '59';
      var res = hh + ':' + ii;
      if (d.length <= 4) return res;

      var ss = d.slice(4, 6);
      if (ss.length === 2 && parseInt(ss, 10) > 59) ss = '59';
      return res + ':' + ss;
    }

    function formatNumber(value) {
      var clean = String(value || '').replace(/[^0-9,.-]/g, '').replace(/-/g, '');
      var parts = clean.split(',');
      var integer = (parts[0] || '').replace(/\./g, '').replace(/^0+(?=\d)/, '');
      var decimals = (parts[1] || '').replace(/\D/g, '').slice(0, 2);
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return integer + (clean.indexOf(',') >= 0 ? ',' + decimals : '');
    }
    function formatPhone10(value) {
      var digits = String(value || '').replace(/\D/g, '').slice(0, 10);
      if (!digits) return '';
      var res = digits.slice(0, 4);
      if (digits.length > 4) res += '-' + digits.slice(4, 7);
      if (digits.length > 7) res += '-' + digits.slice(7, 10);
      return res;
    }

    function formatPhone11(value) {
      var digits = String(value || '').replace(/\D/g, '').slice(0, 11);
      if (!digits) return '';
      var res = digits.slice(0, 5);
      if (digits.length > 5) res += '-' + digits.slice(5, 8);
      if (digits.length > 8) res += '-' + digits.slice(8, 11);
      return res;
    }

    var countryCallingCodes2 = [
      '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49',
      '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98'
    ];

    function formatPhoneGlobal(value) {
      var raw = String(value || '').replace(/[^\d+]/g, '');
      if (!raw) return '';
      if (raw.charAt(0) !== '+') raw = '+' + raw.replace(/\+/g, '');
      else raw = '+' + raw.slice(1).replace(/\+/g, '');
      var digits = raw.slice(1).slice(0, 15);
      if (!digits) return '+';

      var ccLen = 3;
      if (digits.charAt(0) === '1' || digits.charAt(0) === '7') {
        ccLen = 1;
      } else if (digits.length >= 2 && countryCallingCodes2.indexOf(digits.slice(0, 2)) !== -1) {
        ccLen = 2;
      } else if (digits.length < 3) {
        ccLen = digits.length;
      }

      var country = digits.slice(0, ccLen);
      var rest = digits.slice(ccLen);
      var res = '+' + country;
      if (rest) {
        res += ' ' + rest;
      }
      return res;
    }

    function formatPhone(value) {
      var raw = String(value || '').trim();
      if (raw.charAt(0) === '+') return formatPhoneGlobal(raw);
      var digits = raw.replace(/\D/g, '');
      if (digits.length > 10) return formatPhone11(digits);
      return formatPhone10(digits);
    }
    function applyFormatWithCursor(input, formatter) {
      var oldVal = input.value;
      var oldPos = input.selectionStart || oldVal.length;
      var oldDigitsBeforeCursor = oldVal.slice(0, oldPos).replace(/\D/g, '').length;
      var newVal = formatter(oldVal);
      input.value = newVal;

      var newPos = 0;
      var digitsFound = 0;
      for (var i = 0; i < newVal.length; i++) {
        if (/\d/.test(newVal.charAt(i))) {
          digitsFound++;
        }
        if (digitsFound >= oldDigitsBeforeCursor) {
          newPos = i + 1;
          break;
        }
      }
      if (digitsFound < oldDigitsBeforeCursor || newPos === 0) newPos = newVal.length;
      input.setSelectionRange(newPos, newPos);
    }

    var formatters = {
      date: formatDate,
      datetime: formatDateTime,
      time: formatTime,
      month: formatMonth,
      amount: formatNumber,
      money: formatNumber,
      phone: formatPhone,
      'phone-10': formatPhone10,
      'phone-11': formatPhone11,
      'phone-global': formatPhoneGlobal
    };
    var maxLengths = {
      date: 10,
      month: 7,
      datetime: 19,
      time: 8,
      'phone-10': 12,
      'phone-11': 13,
      'phone-global': 20
    };

    document.querySelectorAll('[data-k-input-format]').forEach(function (input) {
      var fmtKey = input.getAttribute('data-k-input-format');
      var formatter = formatters[fmtKey];
      if (!formatter || input.dataset.kInputFormatReady) return;
      input.dataset.kInputFormatReady = 'true';
      if (maxLengths[fmtKey] && !input.getAttribute('maxlength')) {
        input.setAttribute('maxlength', maxLengths[fmtKey]);
      }
      input.addEventListener('input', function () { applyFormatWithCursor(input, formatter); });
      if (input.value) input.value = formatter(input.value);
    });
    document.querySelectorAll('[data-k-input-range]').forEach(function (range) {
      var inputs = range.querySelectorAll('[data-k-input-format]');
      var kind = range.getAttribute('data-k-input-range');
      if (inputs.length < 2 || (kind !== 'date' && kind !== 'month')) return;
      function validateRange() {
        var start = inputs[0].value.replace(/\D/g, '');
        var end = inputs[1].value.replace(/\D/g, '');
        var comparable = kind === 'date' ? function (value) { return value.length === 8 ? Number(value) : NaN; } : function (value) { return value.length === 6 ? Number(value.slice(0, 4)) * 12 + Number(value.slice(4)) : NaN; };
        var startVal = comparable(start);
        var endVal = comparable(end);
        var invalid = !isNaN(startVal) && !isNaN(endVal) && startVal > endVal;
        inputs[1].classList.toggle('is-invalid', Boolean(invalid));
        inputs[1].setAttribute('aria-invalid', invalid ? 'true' : 'false');
        if (invalid) inputs[1].setCustomValidity('End value must be greater than or equal to start value.');
        else inputs[1].setCustomValidity('');
        var feedback = range.parentElement.querySelector('[data-k-range-feedback]');
        if (feedback) feedback.classList.toggle('k-d-none', !invalid);
      }
      inputs.forEach(function (input) { input.addEventListener('input', validateRange); });
      validateRange();
    });
    // Password inputs get an eye toggle by default. An explicit data attribute
    // remains supported for custom toggle buttons and existing markup.
    document.querySelectorAll('input[type="password"]').forEach(function (input) {
      var wrapper = input.closest('.k-input-wrapper');
      var toggle = wrapper && wrapper.querySelector('[data-k-password-toggle]');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'k-input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }
      if (!input.id) input.id = 'k-password-' + Math.random().toString(36).slice(2, 9);
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.className = 'k-input__password-toggle';
        toggle.setAttribute('data-k-password-toggle', input.id);
        toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>';
        wrapper.appendChild(toggle);
      }
      if (input.disabled) toggle.disabled = true;
    });

    document.querySelectorAll('[data-k-password-toggle]').forEach(function (toggle) {
      if (toggle.dataset.kPasswordReady) return;
      var input = document.getElementById(toggle.getAttribute('data-k-password-toggle')) || toggle.previousElementSibling;
      if (!input) return;
      toggle.dataset.kPasswordReady = 'true';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Show password');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.addEventListener('click', function () {
        var visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
        toggle.setAttribute('aria-pressed', visible ? 'false' : 'true');
        toggle.classList.toggle('is-active', !visible);
      });
    });


    // 6b. Interactive Pickers: Calendar & Calculator
    var activePickerInput = null;
    var pickerPopover = null;
    var pickerYear = new Date().getFullYear();
    var pickerMonth = new Date().getMonth();
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function getPopover() {
      if (!pickerPopover) {
        pickerPopover = document.createElement('div');
        pickerPopover.className = 'k-picker-popover';
        pickerPopover.style.display = 'none';
        pickerPopover.setAttribute('role', 'dialog');
        pickerPopover.addEventListener('mousedown', function (e) {
          if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
          }
        });
        document.body.appendChild(pickerPopover);
      }
      return pickerPopover;
    }

    function positionPopover(input, popover) {
      if (!input || !popover) return;
      var rect = input.getBoundingClientRect();
      var pWidth = popover.offsetWidth || 296;
      var pHeight = popover.offsetHeight || 300;
      var top = rect.bottom + 6;
      var left = rect.left;
      if (top + pHeight > window.innerHeight - 10 && rect.top > pHeight + 10) top = rect.top - pHeight - 6;
      if (left + pWidth > window.innerWidth - 10) left = window.innerWidth - pWidth - 10;
      if (left < 10) left = 10;
      popover.style.top = top + 'px';
      popover.style.left = left + 'px';
    }

    function closePicker() {
      if (pickerPopover) pickerPopover.style.display = 'none';
      activePickerInput = null;
    }

    function getCalcHtml(title) {
      var t = title || 'Calculator';
      return '<div class="k-picker-popover__header"><span class="k-picker-popover__title">' + t + '</span><button type="button" class="k-picker-popover__nav" data-picker-act="close" aria-label="Close">✕</button></div>' +
        '<div class="k-picker-popover__grid k-picker-popover__grid--calc">' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--action" data-calc="C">C</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--action" data-calc="(">(</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--action" data-calc=\")\">)</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--op" data-calc="÷">÷</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="7">7</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="8">8</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="9">9</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--op" data-calc="×">×</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="4">4</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="5">5</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="6">6</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--op" data-calc="-">-</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="1">1</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="2">2</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="3">3</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--op" data-calc="+">+</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="0">0</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc="000">000</button>' +
        '<button type="button" class="k-picker-popover__cell" data-calc=",">,</button>' +
        '<button type="button" class="k-picker-popover__cell k-picker-popover__cell--op is-selected" data-calc="=">=</button>' +
        '</div>';
    }

    function getTimeHtml(val) {
      var timeMatches = (val || '').match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
      var curH = timeMatches ? timeMatches[1] : '00';
      var curM = timeMatches ? timeMatches[2] : '00';
      var curS = (timeMatches && timeMatches[3]) ? timeMatches[3] : '00';

      return '<div class="k-picker-popover__header">' +
        '<span class="k-picker-popover__title">Select Time</span>' +
        '<button type="button" class="k-picker-popover__nav" data-picker-act="close" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="k-picker-popover__time k-picker-popover__time--standalone">' +
        '<div class="k-picker-popover__time-col">' +
        '<span class="k-picker-popover__time-col-title">Hour</span>' +
        '<input type="number" min="0" max="23" class="k-picker-time-val" data-time-unit="h" value="' + curH + '">' +
        '</div>' +
        '<span class="k-picker-popover__time-sep">:</span>' +
        '<div class="k-picker-popover__time-col">' +
        '<span class="k-picker-popover__time-col-title">Min</span>' +
        '<input type="number" min="0" max="59" class="k-picker-time-val" data-time-unit="m" value="' + curM + '">' +
        '</div>' +
        '<span class="k-picker-popover__time-sep">:</span>' +
        '<div class="k-picker-popover__time-col">' +
        '<span class="k-picker-popover__time-col-title">Sec</span>' +
        '<input type="number" min="0" max="59" class="k-picker-time-val" data-time-unit="s" value="' + curS + '">' +
        '</div>' +
        '</div>' +
        '<div class="k-picker-popover__quick-times">' +
        '<button type="button" class="k-picker-quick-btn" data-time-quick="08:00:00">08:00</button>' +
        '<button type="button" class="k-picker-quick-btn" data-time-quick="12:00:00">12:00</button>' +
        '<button type="button" class="k-picker-quick-btn" data-time-quick="13:30:00">13:30</button>' +
        '<button type="button" class="k-picker-quick-btn" data-time-quick="17:00:00">17:00</button>' +
        '<button type="button" class="k-picker-quick-btn" data-time-quick="20:00:00">20:00</button>' +
        '<button type="button" class="k-picker-quick-btn" data-time-quick="00:00:00">00:00</button>' +
        '</div>' +
        '<div class="k-picker-popover__footer">' +
        '<button type="button" class="k-picker-popover__btn" data-picker-act="now-time">Now</button>' +
        '<button type="button" class="k-picker-popover__btn k-picker-popover__btn--muted" data-picker-act="clear">Clear</button>' +
        '</div>';
    }

    function getMonthHtml(val) {
      var curYear = pickerYear;
      var selectedMonth = /^\d{4}-\d{2}$/.test(val) ? val : '';
      var mHtml = '<div class="k-picker-popover__header">' +
        '<button type="button" class="k-picker-popover__nav" data-picker-act="prev-year" aria-label="Previous year">‹</button>' +
        '<span class="k-picker-popover__title">' + curYear + '</span>' +
        '<button type="button" class="k-picker-popover__nav" data-picker-act="next-year" aria-label="Next year">›</button>' +
        '</div>' +
        '<div class="k-picker-popover__grid k-picker-popover__grid--months">';
      for (var m = 1; m <= 12; m++) {
        var mStr = (m < 10 ? '0' : '') + m;
        var ymStr = curYear + '-' + mStr;
        var isSelM = ymStr === selectedMonth;
        mHtml += '<button type="button" class="k-picker-popover__cell' + (isSelM ? ' is-selected' : '') + '" data-month-val="' + ymStr + '">' + mStr + '</button>';
      }
      mHtml += '</div><div class="k-picker-popover__footer">' +
        '<button type="button" class="k-picker-popover__btn" data-picker-act="this-month">This month</button>' +
        '<button type="button" class="k-picker-popover__btn k-picker-popover__btn--muted" data-picker-act="clear">Clear</button></div>';
      return mHtml;
    }

    function getDateHtml(val, isDateTime) {
      var dYear = pickerYear;
      var dMonth = pickerMonth;
      var today = new Date();
      var todayStr = today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
      var selectedDate = val.slice(0, 10);
      var timePart = isDateTime ? (val.slice(11, 19) || '00:00:00') : '';
      var timeMatches = timePart.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
      var curH = timeMatches ? timeMatches[1] : '00';
      var curM = timeMatches ? timeMatches[2] : '00';
      var curS = (timeMatches && timeMatches[3]) ? timeMatches[3] : '00';

      var firstDayIndex = new Date(dYear, dMonth, 1).getDay();
      var daysInCurrentMonth = new Date(dYear, dMonth + 1, 0).getDate();
      var daysInPrevMonth = new Date(dYear, dMonth, 0).getDate();
      var startOffset = (firstDayIndex + 6) % 7;

      var dHtml = '<div class="k-picker-popover__header">' +
        '<button type="button" class="k-picker-popover__nav" data-picker-act="prev-month" aria-label="Previous month">‹</button>' +
        '<span class="k-picker-popover__title">' + monthNames[dMonth] + ' ' + dYear + '</span>' +
        '<button type="button" class="k-picker-popover__nav" data-picker-act="next-month" aria-label="Next month">›</button>' +
        '</div>' +
        '<div class="k-picker-popover__weekdays"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div>' +
        '<div class="k-picker-popover__grid">';

      for (var p = startOffset - 1; p >= 0; p--) {
        var pDay = daysInPrevMonth - p;
        dHtml += '<button type="button" class="k-picker-popover__cell is-muted" data-picker-day-offset="prev" data-day="' + pDay + '">' + pDay + '</button>';
      }
      for (var day = 1; day <= daysInCurrentMonth; day++) {
        var dayStr = (day < 10 ? '0' : '') + day;
        var monStr = (dMonth < 9 ? '0' : '') + (dMonth + 1);
        var fullDateStr = dYear + '-' + monStr + '-' + dayStr;
        var cellClass = 'k-picker-popover__cell';
        if (fullDateStr === todayStr) cellClass += ' is-today';
        if (fullDateStr === selectedDate) cellClass += ' is-selected';
        dHtml += '<button type="button" class="' + cellClass + '" data-date-val="' + fullDateStr + '">' + day + '</button>';
      }
      var nextPadding = (7 - ((startOffset + daysInCurrentMonth) % 7)) % 7;
      for (var n = 1; n <= nextPadding; n++) {
        dHtml += '<button type="button" class="k-picker-popover__cell is-muted" data-picker-day-offset="next" data-day="' + n + '">' + n + '</button>';
      }
      dHtml += '</div>';

      if (isDateTime) {
        dHtml += '<div class="k-picker-popover__time">' +
          '<span class="k-picker-popover__time-label">Time</span>' +
          '<div class="k-picker-popover__time-inputs">' +
          '<input type="number" min="0" max="23" class="k-picker-time-val" data-time-unit="h" value="' + curH + '" aria-label="Hour">' +
          '<span class="k-picker-popover__time-sep">:</span>' +
          '<input type="number" min="0" max="59" class="k-picker-time-val" data-time-unit="m" value="' + curM + '" aria-label="Minute">' +
          '<span class="k-picker-popover__time-sep">:</span>' +
          '<input type="number" min="0" max="59" class="k-picker-time-val" data-time-unit="s" value="' + curS + '" aria-label="Second">' +
          '</div>' +
          '</div>';
      }

      dHtml += '<div class="k-picker-popover__footer">' +
        '<button type="button" class="k-picker-popover__btn" data-picker-act="today">' + (isDateTime ? 'Now' : 'Today') + '</button>' +
        '<button type="button" class="k-picker-popover__btn k-picker-popover__btn--muted" data-picker-act="clear">Clear</button></div>';
      return dHtml;
    }

    function renderPicker() {
      if (!activePickerInput) return;
      var pop = getPopover();
      var format = activePickerInput.getAttribute('data-k-input-format');
      var val = activePickerInput.value.trim();

      if (format === 'time') {
        pop.innerHTML = getTimeHtml(val);
      } else if (format === 'month') {
        pop.innerHTML = getMonthHtml(val);
      } else if (format === 'date') {
        pop.innerHTML = getDateHtml(val, false);
      } else if (format === 'datetime') {
        pop.innerHTML = getDateHtml(val, true);
      } else {
        closePicker();
        return;
      }
      pop.style.display = 'block';
      positionPopover(activePickerInput, pop);
    }

    function syncPickerStateFromValue(input) {
      var val = (input && input.value) ? input.value.trim() : '';
      var fmt = input ? input.getAttribute('data-k-input-format') : '';
      if (fmt === 'date' || fmt === 'datetime') {
        var m = val.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
        if (m) {
          pickerYear = parseInt(m[1], 10);
          pickerMonth = Math.max(0, Math.min(11, parseInt(m[2], 10) - 1));
        } else {
          var now = new Date();
          pickerYear = now.getFullYear();
          pickerMonth = now.getMonth();
        }
      } else if (fmt === 'month') {
        var my = val.match(/^(\d{4})/);
        pickerYear = my ? parseInt(my[1], 10) : new Date().getFullYear();
      }
    }

    function openPickerFor(input) {
      if (!input || input.disabled || input.readOnly) return;
      var format = input.getAttribute('data-k-input-format');
      if (format !== 'date' && format !== 'datetime' && format !== 'time' && format !== 'month') return;
      activePickerInput = input;
      syncPickerStateFromValue(input);
      renderPicker();
    }

    var isSyncingFromTimePopover = false;

    document.querySelectorAll('[data-k-input-format]').forEach(function (input) {
      var fmt = input.getAttribute('data-k-input-format');
      if (fmt === 'date' || fmt === 'datetime' || fmt === 'time' || fmt === 'month') {
        input.addEventListener('focus', function () { openPickerFor(input); });
        input.addEventListener('click', function () { openPickerFor(input); });
        input.addEventListener('input', function () {
          if (isSyncingFromTimePopover) return;
          if (activePickerInput === input) {
            syncPickerStateFromValue(input);
            renderPicker();
          }
        });
      }
    });

    var popover = getPopover();
    popover.addEventListener('focusin', function (e) {
      if (e.target.classList.contains('k-picker-time-val')) {
        e.target.select();
      }
    });

    popover.addEventListener('input', function (e) {
      if (!activePickerInput) return;
      var format = activePickerInput.getAttribute('data-k-input-format');
      if (format !== 'datetime' && format !== 'time') return;
      var target = e.target;
      if (!target.classList.contains('k-picker-time-val')) return;

      var hIn = popover.querySelector('.k-picker-time-val[data-time-unit="h"]');
      var mIn = popover.querySelector('.k-picker-time-val[data-time-unit="m"]');
      var sIn = popover.querySelector('.k-picker-time-val[data-time-unit="s"]');
      if (!hIn || !mIn || !sIn) return;

      // Auto-advance if 2 digits entered
      if (target.value.length >= 2) {
        if (target === hIn && mIn) mIn.focus();
        else if (target === mIn && sIn) sIn.focus();
      }

      var h = Math.max(0, Math.min(23, parseInt(hIn.value, 10) || 0));
      var m = Math.max(0, Math.min(59, parseInt(mIn.value, 10) || 0));
      var s = Math.max(0, Math.min(59, parseInt(sIn.value, 10) || 0));

      var hStr = (h < 10 ? '0' : '') + h;
      var mStr = (m < 10 ? '0' : '') + m;
      var sStr = (s < 10 ? '0' : '') + s;

      isSyncingFromTimePopover = true;
      if (format === 'time') {
        activePickerInput.value = hStr + ':' + mStr + ':' + sStr;
      } else {
        var curVal = activePickerInput.value.trim();
        var datePart = curVal.slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
          var now = new Date();
          datePart = now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate();
        }
        activePickerInput.value = datePart + ' ' + hStr + ':' + mStr + ':' + sStr;
      }
      activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
      activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
      isSyncingFromTimePopover = false;
    });

    popover.addEventListener('focusout', function (e) {
      if (e.target.classList.contains('k-picker-time-val')) {
        var val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 0;
        var max = e.target.getAttribute('data-time-unit') === 'h' ? 23 : 59;
        val = Math.max(0, Math.min(max, val));
        e.target.value = (val < 10 ? '0' : '') + val;
      }
    });

    popover.addEventListener('click', function (e) {
      if (!activePickerInput) return;
      var target = e.target.closest('button');
      if (!target) return;
      var format = activePickerInput.getAttribute('data-k-input-format');
      var act = target.getAttribute('data-picker-act');

      if (act === 'now-time') {
        var tn = new Date();
        var curHn = (tn.getHours() < 10 ? '0' : '') + tn.getHours();
        var curMinn = (tn.getMinutes() < 10 ? '0' : '') + tn.getMinutes();
        var curSecn = (tn.getSeconds() < 10 ? '0' : '') + tn.getSeconds();
        activePickerInput.value = curHn + ':' + curMinn + ':' + curSecn;
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        renderPicker();
        return;
      }

      var quickTime = target.getAttribute('data-time-quick');
      if (quickTime) {
        activePickerInput.value = quickTime;
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        renderPicker();
        return;
      }

      if (act === 'close') { closePicker(); return; }
      if (act === 'clear') {
        activePickerInput.value = '';
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        renderPicker();
        return;
      }
      if (act === 'today') {
        var t = new Date();
        var y = t.getFullYear();
        var m = (t.getMonth() < 9 ? '0' : '') + (t.getMonth() + 1);
        var d = (t.getDate() < 10 ? '0' : '') + t.getDate();
        var dateVal = y + '-' + m + '-' + d;
        if (format === 'datetime') {
          var curH = (t.getHours() < 10 ? '0' : '') + t.getHours();
          var curMin = (t.getMinutes() < 10 ? '0' : '') + t.getMinutes();
          var curSec = (t.getSeconds() < 10 ? '0' : '') + t.getSeconds();
          dateVal += ' ' + curH + ':' + curMin + ':' + curSec;
        }
        activePickerInput.value = dateVal;
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        syncPickerStateFromValue(activePickerInput);
        renderPicker();
        return;
      }
      if (act === 'this-month') {
        var tm = new Date();
        var tmy = tm.getFullYear();
        var tmm = (tm.getMonth() < 9 ? '0' : '') + (tm.getMonth() + 1);
        activePickerInput.value = tmy + '-' + tmm;
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        syncPickerStateFromValue(activePickerInput);
        renderPicker();
        return;
      }
      if (act === 'prev-month') {
        pickerMonth--;
        if (pickerMonth < 0) { pickerMonth = 11; pickerYear--; }
        renderPicker();
        return;
      }
      if (act === 'next-month') {
        pickerMonth++;
        if (pickerMonth > 11) { pickerMonth = 0; pickerYear++; }
        renderPicker();
        return;
      }
      if (act === 'prev-year') { pickerYear--; renderPicker(); return; }
      if (act === 'next-year') { pickerYear++; renderPicker(); return; }

      var dateVal = target.getAttribute('data-date-val');
      if (dateVal) {
        if (format === 'datetime') {
          var curTime = activePickerInput.value.slice(10).trim();
          dateVal += curTime ? ' ' + curTime : ' 00:00:00';
        }
        activePickerInput.value = dateVal;
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        renderPicker();
        return;
      }

      var monthVal = target.getAttribute('data-month-val');
      if (monthVal) {
        activePickerInput.value = monthVal;
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
        renderPicker();
        return;
      }

      var calcKey = target.getAttribute('data-calc');
      if (calcKey) {
        var currentVal = activePickerInput.value;
        if (calcKey === 'C') {
          activePickerInput.value = '';
        } else if (calcKey === '=') {
          var expr = currentVal.replace(/×/g, '*').replace(/÷/g, '/').replace(/\./g, '').replace(/,/g, '.');
          if (/^[0-9+\-*/().\s]+$/.test(expr)) {
            try {
              var evalResult = Function('"use strict"; return (' + expr + ')')();
              if (typeof evalResult === 'number' && isFinite(evalResult)) {
                var strResult = evalResult.toFixed(2).replace(/\.00$/, '').replace('.', ',');
                activePickerInput.value = formatNumber(strResult);
              }
            } catch (_) {}
          }
        } else if (calcKey === '+' || calcKey === '-' || calcKey === '×' || calcKey === '÷') {
          activePickerInput.value = currentVal ? currentVal + ' ' + calcKey + ' ' : '';
        } else {
          activePickerInput.value = formatNumber(currentVal + calcKey);
        }
        activePickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        activePickerInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    document.addEventListener('mousedown', function (e) {
      if (pickerPopover && pickerPopover.style.display !== 'none') {
        if (!pickerPopover.contains(e.target) && e.target !== activePickerInput) {
          closePicker();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pickerPopover && pickerPopover.style.display !== 'none') {
        closePicker();
      }
    });

    window.addEventListener('resize', function () {
      if (activePickerInput && pickerPopover && pickerPopover.style.display !== 'none') {
        positionPopover(activePickerInput, pickerPopover);
      }
    });

    window.addEventListener('scroll', function () {
      if (activePickerInput && pickerPopover && pickerPopover.style.display !== 'none') {
        positionPopover(activePickerInput, pickerPopover);
      }
    }, true);
    // 6c. Code Area Copy Buttons (.k-code-area)
    function initCodeAreas() {
      document.querySelectorAll('.k-code-area').forEach(function (area) {
        var copyBtn = area.querySelector('.k-code-area__copy');
        if (!copyBtn) {
          copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'k-code-area__copy';
          copyBtn.setAttribute('aria-label', 'Copy code');
          copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><span>Copy</span>';
          area.appendChild(copyBtn);
        }

        if (copyBtn.dataset.kCopyReady) return;
        copyBtn.dataset.kCopyReady = 'true';

        copyBtn.addEventListener('click', function () {
          var pre = area.querySelector('pre, .k-code-area__pre');
          var text = pre ? pre.innerText || pre.textContent : '';
          text = text.trim();

          function onCopied() {
            copyBtn.classList.add('is-copied');
            copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>';
            setTimeout(function () {
              copyBtn.classList.remove('is-copied');
              copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><span>Copy</span>';
            }, 2000);
          }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(onCopied).catch(function () {
              fallbackCopyText(text, onCopied);
            });
          } else {
            fallbackCopyText(text, onCopied);
          }
        });
      });

      function fallbackCopyText(text, cb) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); if (cb) cb(); } catch (_) {}
        document.body.removeChild(ta);
      }
    }

    initCodeAreas();
  }

  function initAll() {
    initDropdowns();
    initNavbar();
    initModals();
    initConfirms();
    initTabsAndAccordions();
    initTables();
    initFormInputs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  Kaui.init = initAll;
  global.Kaui = Kaui;

})(typeof window !== 'undefined' ? window : this);
