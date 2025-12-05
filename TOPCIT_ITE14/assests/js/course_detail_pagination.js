(function () {
  // Avoid executing if React isn't present. This file expects React & ReactDOM globals.
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM not found; pagination will not initialize.');
    return;
  }

  const e = React.createElement;

  function getCurrentPage() {
    const numberEl = document.querySelector('.detail-card__number');
    if (!numberEl) return 1;
    const n = parseInt(numberEl.textContent.trim(), 10);
    return Number.isNaN(n) ? 1 : n;
  }

  function createPageHref(pageNum) {
    if (pageNum === 1) return 'course_details.html';
    return `course_details_${String(pageNum).padStart(2, '0')}.html`;
  }

  function Pagination({ totalPages = 11 }) {
    const currentPage = getCurrentPage();

    function getCompletedIds() {
      const raw = localStorage.getItem('courseCompletedIds');
      if (!raw) return [];
      try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch (e) { return []; }
    }

    function saveCompletedIds(arr) {
      const unique = Array.from(new Set(arr));
      localStorage.setItem('courseCompletedIds', JSON.stringify(unique));
    }

    function persistCurrentCourse() {
      const numberEl = document.querySelector('.detail-card__number');
      if (!numberEl) return;
      const raw = numberEl.textContent.trim();
      const parsed = parseInt(raw, 10);
      const courseId = Number.isNaN(parsed) ? raw : String(parsed);
      const completed = new Set(getCompletedIds());
      if (!completed.has(courseId)) {
        completed.add(courseId);
        saveCompletedIds(Array.from(completed));
      }
    }

    // Build page array with ellipsis logic
    let pages = [];
    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages = [1, 2];
      let start = Math.max(3, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);
      if (start > 3) pages.push('...');
      for (let p = start; p <= end; p++) pages.push(p);
      if (end < totalPages - 2) pages.push('...');
      pages.push(totalPages - 1, totalPages);
    }

    function handleGoTo(page) {
      // Persist that the user has opened this course detail before navigating
      try { persistCurrentCourse(); } catch (e) { /* ignore */ }
      window.location.href = createPageHref(page);
    }

    const pageNodes = pages.map((p, i) => {
      if (p === '...') {
        return e('span', { key: `ell-${i}`, className: 'page-number page-number--ellipsis' }, '...');
      }
      return e(
        'span',
        {
          key: p,
          className: `page-number ${p === currentPage ? 'page-number--active' : ''}`,
          role: 'button',
          tabIndex: 0,
          onClick: () => handleGoTo(p),
          onKeyUp: (ev) => { if (ev.key === 'Enter') handleGoTo(p); }
        },
        String(p)
      );
    });

    const canNext = currentPage < totalPages;

    return e('div', { className: 'pagination' },
      ...pageNodes,
      e('button', {
        className: 'button button--next',
        onClick: () => handleGoTo(Math.min(currentPage + 1, totalPages)),
        disabled: !canNext,
        'aria-disabled': !canNext
      }, 'NEXT')
    );
  }

  const rootEl = document.getElementById('pagination-root');
  if (rootEl) {
    const totalFromAttr = Number(rootEl.dataset.total);
    const totalPages = (Number.isFinite(totalFromAttr) && totalFromAttr > 0) ? totalFromAttr : 11;
    ReactDOM.createRoot(rootEl).render(e(Pagination, { totalPages }));
  }
})();
