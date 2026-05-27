import { useRef, useEffect } from 'react';
import { useSceneProgress, smoothstep } from '../components/Stage';
import './Scene1Hero.css';

export default function Scene1Hero({ from, to }) {
  const meshRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const bubbleRef = useRef(null);
  const agentRef = useRef(null);
  const typingRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let tx = 0.5, ty = 0.5, mx = 0.5, my = 0.5, raf, alive = true;
    const onMove = (e) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    const tick = () => {
      if (!alive) return;
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      if (meshRef.current) {
        meshRef.current.style.setProperty('--mx', `${tx * 100}%`);
        meshRef.current.style.setProperty('--my', `${ty * 100}%`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);

  useSceneProgress(from, to, (lp) => {
    const headlineOut = smoothstep(0.18, 0.38, lp);
    const bubbleIn = Math.max(0, Math.min(1, (lp - 0.44) / 0.18));
    const agentIn  = Math.max(0, Math.min(1, (lp - 0.66) / 0.20));
    const eased = (t) => 1 - Math.pow(1 - t, 3);

    if (headlineRef.current) {
      headlineRef.current.style.setProperty('transform', `translate3d(0, ${-headlineOut * 80}px, 0)`, 'important');
      headlineRef.current.style.setProperty('opacity', String(1 - headlineOut), 'important');
    }
    if (subRef.current) {
      subRef.current.style.setProperty('transform', `translate3d(0, ${-headlineOut * 60}px, 0)`, 'important');
      subRef.current.style.setProperty('opacity', String(Math.max(0, 1 - headlineOut * 1.3)), 'important');
    }
    if (ctaRef.current) {
      ctaRef.current.style.setProperty('transform', `translate3d(0, ${-headlineOut * 40}px, 0)`, 'important');
      ctaRef.current.style.setProperty('opacity', String(Math.max(0, 1 - headlineOut * 1.5)), 'important');
    }
    if (labelRef.current) {
      labelRef.current.style.setProperty('opacity', String(Math.max(0, 1 - lp * 2.5)), 'important');
    }
    if (bubbleRef.current) {
      const e = eased(bubbleIn);
      bubbleRef.current.style.opacity = String(e);
      bubbleRef.current.style.transform = `translate3d(0, ${(1 - e) * 40}px, 0)`;
    }
    if (agentRef.current) {
      const e = eased(agentIn);
      agentRef.current.style.opacity = String(e);
      agentRef.current.style.transform = `translate3d(0, ${(1 - e) * 40}px, 0)`;
    }
    if (typingRef.current) {
      const showTyping = Math.max(0, Math.min(1, (lp - 0.60) / 0.06));
      const hideTyping = Math.max(0, Math.min(1, (lp - 0.68) / 0.08));
      typingRef.current.style.opacity = String(showTyping * (1 - hideTyping));
    }
  });

  const line1 = 'Экономия в 5 раз';
  const line2 = '— и 90% без оператора.';
  const renderStagger = (text, baseDelay) => [...text].map((c, i) => (
    <span
      key={baseDelay + '-' + i}
      className="s1-char"
      style={{
        animationDelay: `${baseDelay + i * 28}ms`,
        whiteSpace: c === ' ' ? 'pre' : 'normal',
      }}>{c}</span>
  ));

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={meshRef} className="s1-mesh" style={{ '--mx': '50%', '--my': '50%' }}>
        <div className="s1-blob s1-blob-a" />
        <div className="s1-blob s1-blob-b" />
        <div className="s1-blob s1-blob-c" />
        <div className="s1-noise" />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 960, textAlign: 'center', padding: '0 48px' }}>
        <div ref={labelRef} className="t-label" style={{ marginBottom: 24 }}>
          — AI-саппорт нового поколения
        </div>

        <h1 ref={headlineRef} className="t-h1" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, willChange: 'transform, opacity' }}>
          {renderStagger(line1, 200)}<br />
          {renderStagger(line2, 200 + line1.length * 28 + 100)}
        </h1>

        <p ref={subRef} className="t-subtitle s1-sub" style={{
          marginTop: 24, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
          willChange: 'transform, opacity',
        }}>
          AI-саппорт для iGaming. Обрабатывает рутину, эскалирует только важное.
        </p>

        <div ref={ctaRef} className="s1-cta-row" style={{ willChange: 'transform, opacity' }}>
          <a href="#scene-5" className="btn btn-primary">Запросить пилот</a>
          <a href="#scene-3" className="btn btn-secondary">Как это работает</a>
        </div>
      </div>

      <div className="s1-dialog">
        <div ref={bubbleRef} className="s1-bubble s1-bubble-player" style={{
          opacity: 0, transform: 'translate3d(0, 40px, 0)', willChange: 'transform, opacity',
        }}>
          <div className="s1-bubble-meta">
            <span className="s1-avatar s1-avatar-user" aria-hidden="true">У</span>
            <div>
              <div className="s1-name">Игрок · usr_4421</div>
              <div className="s1-time">14:23 · live</div>
            </div>
          </div>
          <div className="s1-bubble-body">где мой депозит? переводил 30 минут назад</div>
          <div ref={typingRef} className="s1-bubble-typing" style={{ opacity: 0 }}>
            <span /><span /><span />
          </div>
        </div>

        <div ref={agentRef} className="s1-bubble s1-bubble-agent" style={{
          opacity: 0, transform: 'translate3d(0, 40px, 0)', willChange: 'transform, opacity',
        }}>
          <div className="s1-bubble-meta">
            <span className="s1-avatar s1-avatar-agent" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" stroke="#10B981" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="#10B981"/>
              </svg>
            </span>
            <div>
              <div className="s1-name s1-name-agent">emerald AI <span className="s1-badge">agent</span></div>
              <div className="s1-time">14:23 · 1.2s</div>
            </div>
          </div>
          <div className="s1-bubble-body">Проверил <span className="s1-mono">tx_8a31…</span> — платёж висит у провайдера. Создал тикет <span className="s1-mono s1-link">#11824</span> для финотдела.</div>
        </div>
      </div>
    </div>
  );
}
