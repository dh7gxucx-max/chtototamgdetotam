import { useRef, useEffect, useState } from 'react';
import { useSceneProgress } from '../components/Stage';
import logoMark from '../assets/logo-mark.svg';
import './Scene5CTA.css';

function ConfettiCanvas({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * dpr;
    c.height = c.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#10B981', '#0EA472', '#13C28C', '#E2C87E', '#EFECE1'];
    const particles = [];
    const cx = c.offsetWidth / 2, cy = c.offsetHeight / 2;
    for (let i = 0; i < 180; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 4 + Math.random() * 10;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0, maxLife: 90 + Math.random() * 50,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.32,
      });
    }
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, c.offsetWidth, c.offsetHeight);
      let alive = false;
      for (const p of particles) {
        if (p.life > p.maxLife) continue;
        alive = true;
        p.vy += 0.18; p.vx *= 0.99;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
        const a = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = a;
        ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return <canvas ref={ref} className="s5-confetti" />;
}

function LiquidButton({ children, type, onClick }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--lx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--ly', `${e.clientY - r.top}px`);
  };
  return (
    <button ref={ref} type={type} onClick={onClick} onMouseMove={onMove} className="s5-liquid">
      <span className="s5-liquid-blob" />
      <span className="s5-liquid-text">{children}</span>
    </button>
  );
}

export default function Scene5CTA({ from, to }) {
  const titleRef = useRef(null);
  const portalRef = useRef(null);
  const formRef = useRef(null);
  const ringRefs = useRef([]);
  const [submitted, setSubmitted] = useState(false);

  useSceneProgress(from, to, (lp) => {
    const eased = (t) => 1 - Math.pow(1 - t, 3);
    if (titleRef.current) {
      const t = eased(Math.min(1, Math.max(0, lp / 0.20)));
      titleRef.current.style.opacity = String(t);
      titleRef.current.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`;
    }
    if (portalRef.current) {
      const intensity = 0.4 + eased(Math.min(1, lp * 1.5)) * 0.6;
      portalRef.current.style.setProperty('--portal-i', String(intensity));
    }
    if (formRef.current) {
      const t = eased(Math.min(1, Math.max(0, (lp - 0.25) / 0.35)));
      formRef.current.style.opacity = String(t);
      formRef.current.style.transform = `translate3d(0, ${(1 - t) * 32}px, 0)`;
    }
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let alive = true, raf, t0 = performance.now();
    const tick = () => {
      if (!alive) return;
      const t = (performance.now() - t0) / 1000;
      ringRefs.current.forEach((el, i) => {
        if (!el) return;
        const phase = (t * 0.22 + i * 0.20) % 1;
        const s = 0.4 + phase * 1.3;
        const op = (1 - phase) * 0.55;
        el.style.transform = `translate(-50%, -50%) scale(${s})`;
        el.style.opacity = String(op);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={portalRef} className="s5-portal-bg" style={{ '--portal-i': 0.5 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} ref={el => (ringRefs.current[i] = el)} className="s5-ring" />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, padding: '0 48px', textAlign: 'center' }}>
        <div ref={titleRef} style={{ willChange: 'transform, opacity' }}>
          <div className="t-label" style={{ marginBottom: 12 }}>— Запросить пилот</div>
          <h2 className="t-h2" style={{ fontSize: 'clamp(26px, 3vw, 38px)', marginBottom: 12, lineHeight: 1.15 }}>
            90% чатов без оператора —<br />у вас в проде за месяц.
          </h2>
          <p className="t-subtitle" style={{ marginBottom: 28, fontSize: 15 }}>
            Подключаемся к существующему стеку. Платите только за результат.
          </p>
        </div>

        <form ref={formRef} onSubmit={submit} className="s5-form" style={{ willChange: 'transform, opacity' }}>
          <ConfettiCanvas active={submitted} />
          {!submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label className="sr-only" htmlFor="s5-name">Имя</label>
              <input id="s5-name" className="input" placeholder="Имя" required aria-required="true" />
              <label className="sr-only" htmlFor="s5-company">Компания</label>
              <input id="s5-company" className="input" placeholder="Компания / казино" required aria-required="true" />
              <label className="sr-only" htmlFor="s5-contact">Контакт</label>
              <input id="s5-contact" className="input" placeholder="Контакт (Telegram, email)" required aria-required="true" />
              <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
                <LiquidButton type="submit">Запросить пилот</LiquidButton>
              </div>
              <div className="t-small" style={{ textAlign: 'center', marginTop: 4 }}>
                Ответим в течение рабочего дня. Без рассылок.
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px 12px', textAlign: 'center' }}>
              <div className="s5-check">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5L10 17L19 7.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="t-h2" style={{ fontSize: 22, marginBottom: 8 }}>Заявка отправлена</h3>
              <p className="t-body">Свяжемся с вами в течение рабочего дня.</p>
            </div>
          )}
        </form>

        <div className="s5-foot">
          <img src={logoMark} alt="" />
          <span>emerald · AI support for iGaming</span>
        </div>
      </div>
    </div>
  );
}
