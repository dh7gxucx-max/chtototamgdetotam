import { useRef, useState, useEffect } from 'react';
import { useSceneProgress } from '../components/Stage';
import './Scene4Dashboard.css';

/* ────────────────── Mini-dashboard screens (unchanged) ────────────────── */

function MiniFinance() {
  return (
    <div className="md-screen">
      <header className="md-head">
        <div>
          <div className="md-eyebrow">— Финотдел</div>
          <div className="md-h">Тикеты от AI</div>
        </div>
        <div className="md-chip"><span className="md-dot" />12 в очереди</div>
      </header>
      <div className="md-stats">
        <div><b>42</b><span>за сегодня</span></div>
        <div><b className="gold">€8,420</b><span>в обработке</span></div>
        <div><b>98%</b><span>с контекстом</span></div>
        <div><b>8м</b><span>ср. решение</span></div>
      </div>
      <div className="md-list">
        {[
          { id: '#11824', who: 'usr_4421', amt: '€120,00', tag: 'депозит висит',     sev: 'high' },
          { id: '#11823', who: 'usr_8810', amt: '€48,50',  tag: 'двойное списание',  sev: 'med' },
          { id: '#11822', who: 'usr_1133', amt: '€350,00', tag: 'задержка вывода',   sev: 'high' },
        ].map(t => (
          <div key={t.id} className="md-row">
            <div className={`md-sev md-sev-${t.sev}`} />
            <div className="md-row-main">
              <div className="md-row-id">{t.id} · {t.tag}</div>
              <div className="md-row-meta">{t.who}</div>
            </div>
            <div className="md-row-amt">{t.amt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniSupport() {
  return (
    <div className="md-screen">
      <header className="md-head">
        <div>
          <div className="md-eyebrow">— Саппорт · live</div>
          <div className="md-h">Лента диалогов</div>
        </div>
        <div className="md-chip"><span className="md-dot" />4 активных</div>
      </header>
      <div className="md-stats">
        <div><b>8,412</b><span>сегодня</span></div>
        <div><b className="gold">91%</b><span>без оператора</span></div>
        <div><b>28с</b><span>ср. ответ</span></div>
        <div><b>4.3</b><span>CSAT</span></div>
      </div>
      <div className="md-chat">
        <div className="md-bub user">где мой депозит, перевёл 30 минут назад</div>
        <div className="md-bub bot">
          <div className="md-bot-tag">AI · 1.2s</div>
          Проверил tx_8a31… — платёж висит у провайдера. Создал тикет #11824 для финотдела.
        </div>
        <div className="md-bub user">спасибо</div>
        <div className="md-bub bot md-thinking">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function MiniAnalytics() {
  return (
    <div className="md-screen">
      <header className="md-head">
        <div>
          <div className="md-eyebrow">— Аналитика · 30д</div>
          <div className="md-h">Эффективность бота</div>
        </div>
        <div className="md-chip"><span className="md-dot" />в проде</div>
      </header>
      <div className="md-stats">
        <div><b className="gold">91%</b><span>без оператора</span></div>
        <div><b className="gold">$0.052</b><span>ср. цена чата</span></div>
        <div><b>4.3</b><span>CSAT</span></div>
        <div><b>−68%</b><span>нагрузка</span></div>
      </div>
      <div className="md-chart">
        <div className="md-chart-h">
          <span className="md-chart-val">8,412 <em>+12%</em></span>
          <span className="md-chart-legend"><i className="lg em" /> AI <i className="lg gold" /> оператор</span>
        </div>
        <svg viewBox="0 0 600 140" preserveAspectRatio="none" className="md-chart-svg">
          <defs>
            <linearGradient id="md-em" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0 100 L40 90 L80 96 L120 75 L160 82 L200 55 L240 67 L280 45 L320 58 L360 38 L400 50 L440 32 L480 42 L520 24 L560 32 L600 18 L600 140 L0 140 Z" fill="url(#md-em)"/>
          <path d="M0 100 L40 90 L80 96 L120 75 L160 82 L200 55 L240 67 L280 45 L320 58 L360 38 L400 50 L440 32 L480 42 L520 24 L560 32 L600 18" fill="none" stroke="#10B981" strokeWidth="1.5"/>
          <path d="M0 130 L40 126 L80 130 L120 120 L160 124 L200 116 L240 122 L280 110 L320 118 L360 106 L400 114 L440 104 L480 112 L520 98 L560 106 L600 96" fill="none" stroke="#E2C87E" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}

/* ────────────────── Data ────────────────── */

const ROLES = [
  { id: 'finance',   label: 'Финотдел',         render: MiniFinance,   trust: { label: '— Интеграция', title: '5 API-ручек, неделя на подключение', text: 'Без переделки архитектуры.' } },
  { id: 'support',   label: 'Саппорт-менеджер', render: MiniSupport,   trust: { label: '— Самообучение', title: 'Ревьюер поправил — бот не повторит', text: 'Исправления попадают в датасет.' } },
  { id: 'analytics', label: 'Руководитель',     render: MiniAnalytics, trust: { label: '— Безопасность',  title: 'Только user_id покидает контур',    text: 'PII никогда не выходит за периметр.' } },
];

const COUNTERS = [
  [ // Finance
    { to: 42,   fmt: v => String(Math.round(v)) },
    { to: 8420, fmt: v => '€' + Math.round(v).toLocaleString('en') },
    { to: 98,   fmt: v => Math.round(v) + '%' },
    { to: 8,    fmt: v => Math.round(v) + 'м' },
  ],
  [ // Support
    { to: 8412, fmt: v => Math.round(v).toLocaleString('en') },
    { to: 91,   fmt: v => Math.round(v) + '%' },
    { to: 28,   fmt: v => Math.round(v) + 'с' },
    { to: 4.3,  fmt: v => v.toFixed(1) },
  ],
  [ // Analytics
    { to: 91,    fmt: v => Math.round(v) + '%' },
    { to: 0.052, fmt: v => '$' + v.toFixed(3) },
    { to: 4.3,   fmt: v => v.toFixed(1) },
    { to: 68,    fmt: v => { const r = Math.round(v); return r === 0 ? '0%' : '−' + r + '%'; } },
  ],
];

/* ── Slot-machine text helper ── */
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
function slotText(finalStr, progress, frame) {
  if (progress >= 0.98) return finalStr;
  if (progress <= 0.01) return finalStr.replace(/\d/g, '0');
  const chars = [...finalStr];
  const dIdx = [];
  chars.forEach((c, i) => { if (/\d/.test(c)) dIdx.push(i); });
  if (!dIdx.length) return finalStr;
  const locked = Math.ceil(progress * dIdx.length);
  const seed = Math.floor(frame / 4);
  for (let d = locked; d < dIdx.length; d++) {
    chars[dIdx[d]] = String((PRIMES[d % 10] * seed + d * 7) % 10);
  }
  return chars.join('');
}

/* ────────────────── Main component ────────────────── */

export default function Scene4Dashboard({ from, to }) {
  const titleRef = useRef(null);
  const deviceRef = useRef(null);
  const popRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const screensRef = useRef(null);
  const rippleRef = useRef(null);
  const pathLensRef = useRef(new WeakMap());
  const [active, setActive] = useState(0);

  /* Mutable animation state shared between scroll callback & ambient loop */
  const A = useRef({
    activeTab: 0, prevTab: -1,
    tabStartTime: null,
    dev: { tilt: 2, tz: -60, scale: 0.94, opacity: 0, transY: 18 },
    mx: 0.5, my: 0.5,
    time: 0, frame: 0,
    visible: false,
  }).current;

  /* ── Mouse tracking ── */
  useEffect(() => {
    const onMove = (e) => {
      A.mx = e.clientX / window.innerWidth;
      A.my = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  /* ── Ambient rAF loop (parallax + breathing + cascade reveal + slots) ── */
  useEffect(() => {
    let alive = true;
    let last = performance.now();
    /* smoothstep — gentle start, smooth acceleration, gentle stop */
    const smooth = (t) => t * t * (3 - 2 * t);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* helper: returns 0..1 for a sub-range of rp */
    const band = (rp, start, dur) =>
      smooth(Math.max(0, Math.min(1, (rp - start) / dur)));

    const tick = (now) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      A.time += dt;
      A.frame++;

      /* ── Auto-reveal: LINEAR rp over 4s (no double-easing) ── */
      const REVEAL_DUR = 4.0;
      const REVEAL_DELAY = 0.3;            /* small pause after tab switch */
      const rawT = A.tabStartTime !== null
        ? Math.max(0, A.time - A.tabStartTime - REVEAL_DELAY)
        : -1;
      const rp = rawT >= 0 ? Math.min(1, rawT / REVEAL_DUR) : 0;

      /* ── Mouse parallax on device ── */
      if (deviceRef.current && A.visible) {
        const d = A.dev;
        const mxOff = reducedMotion ? 0 : (A.mx - 0.5);
        const myOff = reducedMotion ? 0 : (A.my - 0.5);
        deviceRef.current.style.transform =
          `perspective(1600px) translate3d(${mxOff * 14}px, ${d.transY + myOff * 8}px, ${d.tz}px)`
          + ` rotateX(${d.tilt + myOff * -2.5}deg) rotateY(${mxOff * 3.5}deg) scale(${d.scale})`;
        deviceRef.current.style.opacity = String(d.opacity);
      }

      /* ── Content cascade ── */
      if (!screensRef.current || !A.visible) {
        requestAnimationFrame(tick);
        return;
      }

      const allScreens = screensRef.current.children;
      for (let si = 0; si < allScreens.length; si++) {
        const scr = allScreens[si];
        const on = si === A.activeTab;

        /* Header — first to appear, slow fade-up */
        const head = scr.querySelector('.md-head');
        if (head) {
          const hp = on ? band(rp, 0.0, 0.25) : 0;
          head.style.opacity = String(hp);
          head.style.transform = `translateY(${(1 - hp) * 18}px)`;
        }

        /* Stat cards — wide stagger, each card 0.28 rp-window */
        const cards = scr.querySelectorAll('.md-stats > div');
        cards.forEach((card, ci) => {
          const cp = on ? band(rp, 0.08 + ci * 0.10, 0.28) : 0;
          let ty = (1 - cp) * 28;
          if (on && cp > 0.95 && !reducedMotion) {
            const blend = Math.min(1, (cp - 0.95) * 20);
            ty = Math.sin(A.time * 1.2 + ci * 0.9) * 2.5 * blend;
          }
          card.style.opacity = String(cp);
          card.style.transform = `translateY(${ty}px)`;
        });

        /* Slot-machine counters — long spin window */
        const bolds = scr.querySelectorAll('.md-stats b');
        const cdata = COUNTERS[si];
        if (cdata) {
          bolds.forEach((b, ci) => {
            if (ci >= cdata.length) return;
            const cp = on ? band(rp, 0.06 + ci * 0.08, 0.50) : 0;
            const finalStr = cdata[ci].fmt(cdata[ci].to);
            b.textContent = slotText(finalStr, cp, A.frame + ci * 17);
          });
        }

        /* Finance rows — cascade after cards settle */
        scr.querySelectorAll('.md-row').forEach((row, ri) => {
          const rt = on ? band(rp, 0.35 + ri * 0.10, 0.25) : 0;
          row.style.opacity = String(rt);
          row.style.transform = `translateX(${(1 - rt) * -28}px)`;
        });

        /* Chat bubbles — one by one, well-spaced */
        scr.querySelectorAll('.md-bub').forEach((bub, bi) => {
          const bp = on ? band(rp, 0.18 + bi * 0.15, 0.22) : 0;
          bub.style.opacity = String(bp);
          bub.style.transform = `translateY(${(1 - bp) * 16}px)`;
        });

        /* Chart SVG — slow line-draw + delayed fill */
        const svg = scr.querySelector('.md-chart-svg');
        if (svg) {
          svg.querySelectorAll('path').forEach((path, pi) => {
            if (pi === 0) {
              /* area fill — fades in after line progresses */
              path.style.opacity = String(on ? band(rp, 0.28, 0.50) : 0);
            } else if (pi === 2) {
              /* gold dashed line — late, gentle */
              path.style.opacity = String(0.6 * (on ? band(rp, 0.40, 0.45) : 0));
            } else {
              /* emerald line — long draw */
              if (!pathLensRef.current.has(path)) {
                pathLensRef.current.set(path, path.getTotalLength ? path.getTotalLength() : 800);
              }
              const len = pathLensRef.current.get(path);
              const dp = on ? band(rp, 0.10, 0.65) : 0;
              path.style.strokeDasharray = String(len);
              path.style.strokeDashoffset = String(len * (1 - dp));
            }
          });
        }

        /* Chart header counter (slot-machine) */
        const chartVal = scr.querySelector('.md-chart-val');
        if (chartVal) {
          const vp = on ? band(rp, 0.0, 0.55) : 0;
          const txt = chartVal.firstChild;
          if (txt && txt.nodeType === 3) txt.textContent = slotText('8,412 ', vp, A.frame);
          const em = chartVal.querySelector('em');
          if (em) em.textContent = slotText('+12%', vp, A.frame + 5);
        }
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { alive = false; };
  }, []);

  /* ── Scroll callback: macro animations + animation targets ── */
  useSceneProgress(from, to, (lp) => {
    const ease3 = (t) => 1 - Math.pow(1 - t, 3);
    const devT = Math.min(1, Math.max(0, (lp - 0.02) / 0.20));
    const devE = ease3(devT);

    A.visible = lp > 0.001 && lp < 0.999;

    /* Title */
    if (titleRef.current) {
      const t = ease3(Math.min(1, Math.max(0, (lp - 0.02) / 0.18)));
      const tOut = Math.max(0, 1 - Math.max(0, lp - 0.92) * 12);
      titleRef.current.style.opacity = String(t * tOut);
      titleRef.current.style.transform = `translate3d(0, ${(1 - t) * 16}px, 0)`;
    }

    /* Tabs */
    if (tabsContainerRef.current) {
      tabsContainerRef.current.style.setProperty('opacity', String(devE), 'important');
    }

    /* Trust popover */
    if (popRef.current) {
      const popT = Math.max(0, (devT - 0.5) / 0.5);
      const tOut = Math.max(0, 1 - Math.max(0, lp - 0.92) * 12);
      popRef.current.style.setProperty('opacity', String(ease3(popT) * tOut), 'important');
    }

    /* Device base params (ambient loop combines with mouse parallax) */
    const exit = Math.max(0, (lp - 0.85) / 0.15);
    const exitE = ease3(Math.min(1, exit));
    A.dev = {
      tilt: (1 - devE) * 2 + exitE * -6,
      tz: (1 - devE) * -60 + exitE * 100,
      scale: 0.94 + devE * 0.06,
      opacity: devT,
      transY: (1 - devE) * 18,
    };

    /* ── Tab cycling ── */
    const cycleStart = 0.30, cycleEnd = 0.88;
    const tc = Math.max(0, Math.min(1, (lp - cycleStart) / (cycleEnd - cycleStart)));
    const targetIdx = Math.min(ROLES.length - 1, Math.floor(tc * ROLES.length));

    /* Tab change → ripple + start auto-reveal */
    const nowVisible = lp > 0.01;
    if (nowVisible && targetIdx !== A.prevTab) {
      A.tabStartTime = A.time;
      if (A.prevTab >= 0 && rippleRef.current) {
        rippleRef.current.classList.remove('is-active');
        void rippleRef.current.offsetWidth;
        rippleRef.current.classList.add('is-active');
      }
      A.prevTab = targetIdx;
    }
    if (!nowVisible) { A.prevTab = -1; A.tabStartTime = null; }
    A.activeTab = targetIdx;

    if (targetIdx !== active) setActive(targetIdx);
  });

  /* ── JSX ── */
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div ref={titleRef} className="s4-title" style={{ willChange: 'transform, opacity' }}>
        <div className="t-label" style={{ marginBottom: 12 }}>— Продукт</div>
        <h2 className="t-h2" style={{ maxWidth: 720, margin: '0 auto', fontSize: 'clamp(26px, 3vw, 36px)' }}>
          Один бот — три рабочих места.
        </h2>
      </div>

      <div className="s4-room-glow" />

      <div ref={tabsContainerRef} className="s4-tabs" style={{ opacity: 0, willChange: 'opacity' }}>
        {ROLES.map((r, i) => (
          <div key={r.id} className={`s4-tab ${i === active ? 'is-active' : ''}`}>
            <span className="s4-tab-num">0{i + 1}</span>
            <span className="s4-tab-name">{r.label}</span>
            <span className="s4-tab-bar" />
          </div>
        ))}
      </div>

      <div ref={deviceRef} className="s4-device" style={{ willChange: 'transform, opacity' }}>
        <div className="s4-chrome">
          <span className="s4-dot s4-dot-r" />
          <span className="s4-dot s4-dot-y" />
          <span className="s4-dot s4-dot-g" />
          <span className="s4-url">emerald-support.io · {ROLES[active].id}</span>
        </div>
        <div ref={screensRef} className="s4-screens">
          {ROLES.map((r, i) => {
            const Render = r.render;
            const isActive = i === active;
            const rel = i - active;
            return (
              <div key={r.id} className={`s4-screen ${isActive ? 'is-active' : ''}`}
                style={{
                  transform: `translate3d(${rel * 80}px, 0, 0) scale(${isActive ? 1 : 0.96})`,
                  opacity: isActive ? 1 : 0,
                  filter: isActive ? 'none' : 'blur(6px)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  zIndex: isActive ? 2 : 1,
                }}>
                <Render />
              </div>
            );
          })}
        </div>
        <div ref={rippleRef} className="s4-ripple" />
      </div>

      <div ref={popRef} key={active} className="s4-pop" style={{ opacity: 0, willChange: 'opacity' }}>
        <div className="s4-pop-label">{ROLES[active].trust.label}</div>
        <div className="s4-pop-title">{ROLES[active].trust.title}</div>
        <div className="s4-pop-text">{ROLES[active].trust.text}</div>
      </div>
    </div>
  );
}
