import { useRef, useEffect } from 'react';
import { useSceneProgress } from '../components/Stage';
import './Scene3Flow.css';

const FLOW_STEPS = [
  { n: '01', title: 'Игрок пишет в чат',        text: 'Где мой депозит? Я переводил 30 минут назад.',                 icon: 'chat' },
  { n: '02', title: 'AI проверяет транзакцию',   text: 'Запрос через API казино: статус платежа, кошелёк, провайдер.', icon: 'api' },
  { n: '03', title: 'Находит проблему',          text: 'Создаёт тикет с полным контекстом игрока и историей.',         icon: 'ticket' },
  { n: '04', title: 'Финотдел получает бриф',    text: 'Готовое решение или эскалация — без переключения контекста.',  icon: 'brief' },
];

function FlowIcon({ kind }) {
  const stroke = '#10B981';
  const muted = '#EFECE1';
  const wrap = { width: 36, height: 36 };
  if (kind === 'chat') return (
    <svg viewBox="0 0 24 24" fill="none" style={wrap}>
      <path d="M4 6.5a2.5 2.5 0 012.5-2.5h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H9.5L6 19v-3H6.5A2.5 2.5 0 014 13.5v-7z" stroke={muted} strokeWidth="1.2"/>
      <circle cx="9" cy="10" r="1" fill={stroke}><animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/></circle>
      <circle cx="12" cy="10" r="1" fill={stroke}><animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" begin="0.2s" repeatCount="indefinite"/></circle>
      <circle cx="15" cy="10" r="1" fill={stroke}><animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" begin="0.4s" repeatCount="indefinite"/></circle>
    </svg>
  );
  if (kind === 'api') return (
    <svg viewBox="0 0 24 24" fill="none" style={wrap}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke={muted} strokeWidth="1.2"/>
      <path d="M7 12h2M11 12h2M15 12h2" stroke={stroke} strokeWidth="1.4" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
  if (kind === 'ticket') return (
    <svg viewBox="0 0 24 24" fill="none" style={wrap}>
      <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z" stroke={muted} strokeWidth="1.2"/>
      <path d="M10 8v8" stroke={stroke} strokeDasharray="1.5 2" strokeWidth="1.2">
        <animate attributeName="stroke-dashoffset" from="0" to="-7" dur="1.4s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" style={wrap}>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke={muted} strokeWidth="1.2"/>
      <path d="M8 8h8M8 12h8M8 16h5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Scene3Flow({ from, to }) {
  const trackRef = useRef(null);
  const lineRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const stepRefs = useRef([]);
  const titleRef = useRef(null);
  const pathLen = useRef(2200);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      pathLen.current = len;
      lineRef.current.style.strokeDasharray = String(len);
      lineRef.current.style.strokeDashoffset = String(len);
    }
  }, []);

  useSceneProgress(from, to, (lp) => {
    const eased = (t) => 1 - Math.pow(1 - t, 3);

    if (titleRef.current) {
      const t = eased(Math.min(1, Math.max(0, (lp - 0.02) / 0.14)));
      titleRef.current.style.opacity = String(t);
      titleRef.current.style.transform = `translate3d(0, ${(1 - t) * 16}px, 0)`;
    }

    if (trackRef.current) {
      const baseCamera = -lp * 55;
      trackRef.current.style.transform = `translate3d(${baseCamera}%, -50%, 0)`;
      trackRef.current.style.opacity = '1';
    }

    const len = pathLen.current;
    if (lineRef.current) {
      const drawLp = Math.min(1, lp);
      lineRef.current.style.strokeDashoffset = String(len - len * drawLp);
      lineRef.current.style.opacity = '1';
    }

    if (pathRef.current && dotRef.current) {
      const t = Math.max(0.001, Math.min(len - 0.001, lp * len));
      const pt = pathRef.current.getPointAtLength(t);
      dotRef.current.setAttribute('transform', `translate(${pt.x} ${pt.y}) scale(1)`);
      dotRef.current.style.opacity = (lp > 0.005 && lp < 1.05) ? 1 : 0;
    }

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = (i + 0.5) / FLOW_STEPS.length;
      const local = Math.max(0, Math.min(1, (lp - i * 0.18) * 4));
      const e = eased(local);
      el.style.opacity = String(e);
      el.style.transform = `translate3d(0, ${(1 - e) * 30}px, 0)`;
      const dist = Math.abs(lp - center);
      const focus = Math.max(0.35, 1 - dist * 2.6);
      el.style.setProperty('--focus', String(focus));
    });
  });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div ref={titleRef} className="s3-title" style={{ willChange: 'transform, opacity' }}>
        <div className="t-label" style={{ marginBottom: 12 }}>— Как это работает</div>
        <h2 className="t-h2" style={{ maxWidth: 620, margin: '0 auto', fontSize: 'clamp(26px, 3vw, 34px)' }}>
          От вопроса игрока до брифа финотделу — за один проход.
        </h2>
      </div>

      <div className="s3-bg-grid" />

      <div ref={trackRef} className="s3-track">
        <svg width="4800" height="220" style={{
          position: 'absolute', top: 100, left: 80, pointerEvents: 'none', overflow: 'visible',
        }}>
          <defs>
            <linearGradient id="s3-lg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.3"/>
            </linearGradient>
            <radialGradient id="s3-dot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.55"/>
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.14"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <path
            ref={pathRef}
            d="M 0 110 C 200 70, 400 150, 540 110 S 880 70, 1080 110 S 1480 150, 1620 110 S 1960 70, 2160 110"
            stroke="#152E1E" strokeWidth="1" fill="none" opacity="0.6"
          />
          <path
            ref={lineRef}
            d="M 0 110 C 200 70, 400 150, 540 110 S 880 70, 1080 110 S 1480 150, 1620 110 S 1960 70, 2160 110"
            stroke="url(#s3-lg)" strokeWidth="1.5" fill="none"
            style={{ willChange: 'stroke-dashoffset' }}
          />
          <g ref={dotRef} style={{ opacity: 0, transition: 'opacity 0.3s ease-out', willChange: 'transform' }}>
            <circle r="28" fill="url(#s3-dot)">
              <animate attributeName="r" values="22;34;22" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite"/>
            </circle>
            <circle r="5.5" fill="#10B981" style={{ filter: 'drop-shadow(0 0 6px #10B981)' }} />
            <circle r="2" fill="#EFECE1" />
          </g>
        </svg>

        {FLOW_STEPS.map((s, i) => (
          <div key={s.n} ref={el => (stepRefs.current[i] = el)} className="s3-step" style={{ '--focus': 0.6 }}>
            <div className="s3-icon">
              <div className="s3-icon-ring" />
              <FlowIcon kind={s.icon} />
              <span className="s3-icon-num">{s.n}</span>
            </div>
            <h3 className="s3-step-title">{s.title}</h3>
            <p className="s3-step-text">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
