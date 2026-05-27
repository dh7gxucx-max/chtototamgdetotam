import { useRef, useEffect } from 'react';
import { useSceneProgress } from '../components/Stage';
import './Scene2Metrics.css';

const METRICS = [
  { value: '90', suffix: '%', label: 'чатов без оператора', angle: -90 },
  { value: '$0.054', suffix: '',  label: 'стоимость одного чата', angle: -22 },
  { value: '1', suffix: ' мес', label: 'до запуска в проде', angle: 46 },
  { value: '4.2', suffix: '/5', label: 'CSAT по чатам', angle: 114, mono: true },
  { value: '8', suffix: ' GEO', label: 'из коробки', angle: -158 },
];

const TOKENS = [
  'tx_8a31f02', 'user_id: usr_4421', 'wallet: SkrillEU', '€120,00',
  'intent: deposit_status', 'lang: ru', 'session: 18m',
];

export default function Scene2Metrics({ from, to }) {
  const titleRef = useRef(null);
  const orbRef = useRef(null);
  const orbitARef = useRef(null);
  const orbitBRef = useRef(null);
  const cardRefs = useRef([]);
  const tokenRefs = useRef([]);
  const ringRefs = useRef([]);
  const lpRef = useRef(0);

  useSceneProgress(from, to, (lp) => {
    lpRef.current = lp;
    const eased = (t) => 1 - Math.pow(1 - t, 3);

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const appear = Math.max(0, Math.min(1, (lp - i * 0.04) * 5));
      el.style.opacity = String(eased(appear));
    });

    if (titleRef.current) {
      const titleIn = eased(Math.max(0, Math.min(1, (lp - 0.02) / 0.14)));
      const titleOut = Math.max(0, 1 - Math.max(0, lp - 0.92) * 14);
      titleRef.current.style.opacity = String(titleIn * titleOut);
      titleRef.current.style.transform = `translate3d(0, ${(1 - titleIn) * 24}px, 0)`;
    }
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let alive = true, raf, t0 = performance.now();
    const eased = (v) => 1 - Math.pow(1 - v, 3);
    const tick = () => {
      if (!alive) return;
      const t = (performance.now() - t0) / 1000;
      const lp = lpRef.current;

      const orbitAAngle = t * 2.2 + lp * 60;
      const orbitBAngle = -t * 1.6 - lp * 40;
      if (orbitARef.current) {
        orbitARef.current.style.transform = `translate(-50%, -50%) rotate(${orbitAAngle}deg)`;
      }
      if (orbitBRef.current) {
        orbitBRef.current.style.transform = `translate(-50%, -50%) rotate(${orbitBAngle}deg)`;
      }

      const N = METRICS.length;
      const focusPhase = ((t * 0.16) + lp * 0.5) % 1;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const orbitAngle = i < 3 ? orbitAAngle : orbitBAngle;
        el.style.transform = `translate(-50%, -50%) rotate(${-orbitAngle}deg)`;
        const center = (i + 0.5) / N;
        let d = Math.abs(focusPhase - center);
        d = Math.min(d, 1 - d);
        const focus = Math.max(0, 1 - d * N * 0.9);
        el.style.setProperty('--focus', String(focus));
      });

      if (orbRef.current) {
        const breath = (Math.sin(t * 1.25) + 1) / 2;
        const scrollBoost = eased(lp);
        const s = 0.86 + scrollBoost * 0.22 + breath * 0.04;
        const scrollGlow = 0.35 + Math.sin(lp * Math.PI) * 0.5;
        orbRef.current.style.transform = `translate(-50%, -50%) scale(${s})`;
        orbRef.current.style.setProperty('--orb-glow', String(scrollGlow * (0.85 + breath * 0.35)));
      }

      ringRefs.current.forEach((el, i) => {
        if (!el) return;
        const phase = (t * 0.22 + i * 0.33) % 1;
        el.style.transform = `translate(-50%, -50%) scale(${0.55 + phase * 0.95})`;
        el.style.opacity = String(Math.max(0, 1 - phase) * 0.5);
      });

      tokenRefs.current.forEach((el, i) => {
        if (!el) return;
        const phase = (t * 0.10 + i * 0.13) % 1;
        const dir = i % 2 === 0 ? 1 : -1;
        el.style.transform = `translate3d(${dir * (phase - 0.5) * 240}px, ${Math.sin(phase * Math.PI * 2 + i) * 30}px, 0)`;
        el.style.opacity = String(Math.sin(phase * Math.PI) * 0.6 + 0.15);
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div className="s2-grid" />

      {[0, 1, 2].map(i => (
        <div key={i} ref={el => (ringRefs.current[i] = el)} className="s2-ring" />
      ))}

      {TOKENS.map((t, i) => (
        <div key={t} ref={el => (tokenRefs.current[i] = el)} className="s2-token"
          style={{ left: `${20 + (i * 11) % 60}%`, top: `${22 + (i * 17) % 60}%` }}>{t}</div>
      ))}

      <div ref={orbRef} className="s2-orb">
        <div className="s2-orb-core" />
        <div className="s2-orb-inner" />
        <div className="s2-orb-flares" />
      </div>

      <div ref={orbitARef} className="s2-orbit s2-orbit-a">
        {METRICS.slice(0, 3).map((m, i) => {
          const angleRad = (m.angle * Math.PI) / 180;
          const rx = 320, ry = 200;
          const x = Math.cos(angleRad) * rx;
          const y = Math.sin(angleRad) * ry;
          return (
            <div key={i} ref={el => (cardRefs.current[i] = el)} className="s2-metric"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}>
              <div className={`s2-metric-value ${m.mono ? 'mono' : ''}`}>
                {m.value}<span>{m.suffix}</span>
              </div>
              <div className="s2-metric-label">{m.label}</div>
            </div>
          );
        })}
      </div>

      <div ref={orbitBRef} className="s2-orbit s2-orbit-b">
        {METRICS.slice(3).map((m, i) => {
          const idx = i + 3;
          const angleRad = (m.angle * Math.PI) / 180;
          const rx = 440, ry = 270;
          const x = Math.cos(angleRad) * rx;
          const y = Math.sin(angleRad) * ry;
          return (
            <div key={idx} ref={el => (cardRefs.current[idx] = el)} className="s2-metric"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}>
              <div className={`s2-metric-value ${m.mono ? 'mono' : ''}`}>
                {m.value}<span>{m.suffix}</span>
              </div>
              <div className="s2-metric-label">{m.label}</div>
            </div>
          );
        })}
      </div>

      <div ref={titleRef} className="s2-title" style={{ willChange: 'transform, opacity' }}>
        <div className="t-label" style={{ marginBottom: 12 }}>— Метрики из прода</div>
        <h2 className="t-h2" style={{ maxWidth: 520, margin: '0 auto', fontSize: 'clamp(28px, 3.4vw, 38px)' }}>
          9 из 10 обращений — без оператора.<br/>В пять раз дешевле живой смены.
        </h2>
      </div>
    </div>
  );
}
