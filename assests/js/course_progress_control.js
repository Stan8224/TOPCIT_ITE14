(function () {
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React or ReactDOM not found; progress control will not initialize.');
    return;
  }

  const e = React.createElement;

  const TOTAL_COURSES = 10;
  const STORAGE_KEY = 'courseProgressPercent';

  function readPercentFromDOM() {
    const progressBar = document.querySelector('.header__bar-fill');
    const ratioEl = document.querySelector('.header__ratio');

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored != null) {
      const n = Number(stored);
      if (!Number.isNaN(n)) return Math.min(100, Math.max(0, n));
    }

    if (progressBar && progressBar.style.width) {
      const s = progressBar.style.width.trim();
      if (s.endsWith('%')) {
        const n = Number(s.slice(0, -1));
        if (!Number.isNaN(n)) return Math.min(100, Math.max(0, n));
      }
    }

    if (ratioEl) {
      const txt = ratioEl.textContent.trim();
      const match = txt.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        const completed = Number(match[1]);
        const total = Number(match[2]) || TOTAL_COURSES;
        const percent = (completed / total) * 100;
        return Math.min(100, Math.max(0, Math.round(percent)));
      }
    }

    return 80; 
  }

  function writePercentToDOM(percent) {
    const progressBar = document.querySelector('.header__bar-fill');
    const ratioEl = document.querySelector('.header__ratio');

    const p = Math.round(percent);
    if (progressBar) progressBar.style.width = `${p}%`;
    if (ratioEl) {
      const completed = Math.round((p / 100) * TOTAL_COURSES);
      ratioEl.textContent = `${completed}/${TOTAL_COURSES} COURSES`;
    }
  }

  function PersistPercent(percent) {
    localStorage.setItem(STORAGE_KEY, String(Math.round(percent)));
  }

  function ProgressControl({ initialPercent }) {
    const [value, setValue] = React.useState(initialPercent);
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
      writePercentToDOM(value);
      PersistPercent(value);
    }, [value]);

    return e('div', { className: 'progress-control' },
      e('button', {
        className: 'button progress-control__toggle',
        onClick: () => setShow(!show),
        'aria-pressed': show
      }, show ? 'Hide Controls' : 'Adjust Progress'),

      show && e('div', { className: 'progress-control__panel' },
        e('div', { className: 'progress-control__display' }, `${Math.round(value)}%`),
        e('input', {
          type: 'range',
          min: 0,
          max: 100,
          value: value,
          onChange: (ev) => setValue(Number(ev.target.value)),
          className: 'progress-control__slider'
        }),
        e('div', { className: 'progress-control__buttons' },
          e('button', {
            className: 'button',
            onClick: () => setValue(Math.max(0, value - 5))
          }, '-5%'),
          e('button', {
            className: 'button',
            onClick: () => setValue(Math.min(100, value + 5))
          }, '+5%'),
          e('button', {
            className: 'button button--next',
            onClick: () => setValue(0)
          }, 'Reset')
        )
      )
    );
  }

  const root = document.getElementById('progress-control-root');
  if (!root) return; 

  const initial = readPercentFromDOM();
  ReactDOM.createRoot(root).render(e(ProgressControl, { initialPercent: initial }));
})();
