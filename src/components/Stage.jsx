import { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';

export const StoryCtx = createContext(null);

export function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
export function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function useSceneProgress(from, to, callback) {
  const ctx = useContext(StoryCtx);
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    if (!ctx) return;
    return ctx.subscribe((p) => {
      const lp = clamp01((p - from) / (to - from));
      cbRef.current(lp, p);
    });
  }, [ctx, from, to]);
}

export function Stage({ children, scrollHeight = '650vh', chapters }) {
  const stageRef = useRef(null);
  const progressRef = useRef(0);
  const subscribersRef = useRef([]);
  const [chapterIdx, setChapterIdx] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    let alive = true;
    let target = 0, current = 0;
    const tick = () => {
      if (!alive) return;
      const el = stageRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        target = Math.max(0, Math.min(1, -r.top / total));
        current += (target - current) * 0.115;
        if (Math.abs(target - current) < 0.0003) current = target;
        progressRef.current = current;

        const subs = subscribersRef.current;
        for (let i = 0; i < subs.length; i++) subs[i](current);

        if (chapters) {
          let idx = 0;
          for (let i = 0; i < chapters.length; i++) {
            if (current >= chapters[i].from && current < chapters[i].to) { idx = i; break; }
            if (current >= chapters[i].to) idx = i;
          }
          setChapterIdx(prev => prev === idx ? prev : idx);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, [chapters]);

  const api = useMemo(() => ({
    subscribe(fn) {
      subscribersRef.current.push(fn);
      fn(progressRef.current);
      return () => {
        const i = subscribersRef.current.indexOf(fn);
        if (i >= 0) subscribersRef.current.splice(i, 1);
      };
    },
    getProgress() { return progressRef.current; },
    scrollToChapter(i) {
      if (!chapters || !chapters[i] || !stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + r.top;
      const total = r.height - window.innerHeight;
      const targetScroll = sectionTop + total * ((chapters[i].from + chapters[i].to) / 2);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    },
  }), [chapters]);

  return (
    <StoryCtx.Provider value={api}>
      <div ref={stageRef} className="story-spacer" style={{ height: scrollHeight, position: 'relative' }}>
        <div className="story-viewport" style={{
          position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden',
          background: 'var(--bg-base)',
        }}>
          {children}
        </div>
      </div>
      {chapters && (
        <ChapterRail chapters={chapters} active={chapterIdx} onJump={api.scrollToChapter} />
      )}
    </StoryCtx.Provider>
  );
}

function ChapterRail({ chapters, active, onJump }) {
  const hidden = active === 3; // hide during Scene 4 (Dashboard)
  return (
    <div className={`chapter-rail${hidden ? ' is-hidden' : ''}`}>
      {chapters.map((c, i) => (
        <button key={i} className={`chapter-dot ${i === active ? 'is-active' : ''}`} onClick={() => onJump(i)} aria-label={`${String(i+1).padStart(2,'0')} ${c.label}`}>
          <span className="chapter-line" />
          <span className="chapter-label">
            <span className="chapter-num">0{i + 1}</span>
            <span className="chapter-name">{c.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function Scene({ from, to, label, children, style, customEnter = false, customExit = false }) {
  const ctx = useContext(StoryCtx);
  const ref = useRef(null);
  const isFirst = from <= 0.0001;
  const isLast = to >= 0.9999;
  const skipEnter = isFirst || customEnter;
  const skipExit  = isLast  || customExit;

  useEffect(() => {
    if (!ctx) return;
    const unsub = ctx.subscribe((p) => {
      const el = ref.current;
      if (!el) return;
      const span = to - from;
      const lp = (p - from) / span;
      const inWindow = lp >= -0.05 && lp <= 1.05;
      el.style.display = inWindow ? 'block' : 'none';
      if (!inWindow) return;

      const opIn  = skipEnter ? 1 : smoothstep(-0.03, 0.10, lp);
      const opOut = skipExit  ? 1 : (1 - smoothstep(0.90, 1.03, lp));
      const opacity = opIn * opOut;

      const t = lp;
      const enterScale = skipEnter ? 0 : smoothstep(-0.05, 0.18, t) * 0.15;
      const exitScale  = skipExit  ? 0 : smoothstep(0.82, 1.1, t) * 0.18;
      const scale = (skipEnter ? 1.0 : 0.85) + enterScale + exitScale;

      const enterBlur = skipEnter ? 0 : (1 - smoothstep(0.0, 0.12, t)) * 6;
      const exitBlur  = skipExit  ? 0 : smoothstep(0.88, 1.0, t) * 8;
      const blur = enterBlur + exitBlur;

      const enterTz = skipEnter ? 0 : (-120 + smoothstep(-0.05, 0.18, t) * 120);
      const exitTz  = skipExit  ? 0 : smoothstep(0.82, 1.1, t) * 200;
      const tz = enterTz + exitTz;

      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(0,0,0) perspective(1400px) translateZ(${tz}px) scale(${scale})`;
      el.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
      el.style.pointerEvents = (lp > 0.05 && lp < 0.95 && opacity > 0.5) ? 'auto' : 'none';
    });
    return unsub;
  }, [ctx, from, to, isFirst, isLast, skipEnter, skipExit]);

  return (
    <div
      ref={ref}
      className="scene"
      data-scene={label}
      style={{
        position: 'absolute', inset: 0,
        display: 'none',
        transformOrigin: 'center center',
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
