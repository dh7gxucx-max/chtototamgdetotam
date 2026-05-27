import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth < 900) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf;
    let alive = true;

    const clampTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (target < 0) target = 0;
      if (target > max) target = max;
    };

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      target += e.deltaY;
      clampTarget();
    };

    const onKey = (e) => {
      const k = e.key;
      const page = window.innerHeight * 0.85;
      let dy = 0;
      if (k === 'PageDown' || k === ' ') dy = page;
      else if (k === 'PageUp') dy = -page;
      else if (k === 'ArrowDown') dy = 80;
      else if (k === 'ArrowUp') dy = -80;
      else if (k === 'Home') { target = 0; e.preventDefault(); clampTarget(); return; }
      else if (k === 'End')  { target = document.documentElement.scrollHeight; e.preventDefault(); clampTarget(); return; }
      if (dy !== 0) {
        const ae = document.activeElement;
        if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        target += dy;
        clampTarget();
      }
    };

    const tick = () => {
      if (!alive) return;
      current += (target - current) * 0.10;
      if (Math.abs(target - current) < 0.4) current = target;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);

    const onResync = () => {
      if (Math.abs(window.scrollY - current) > 4) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };
    window.addEventListener('scroll', onResync, { passive: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onResync);
    };
  }, []);
  return null;
}
