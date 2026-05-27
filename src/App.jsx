import { useEffect } from 'react';
import { Stage, Scene } from './components/Stage';
import SmoothScroll from './components/SmoothScroll';
import Scene1Hero from './scenes/Scene1Hero';
import Scene2Metrics from './scenes/Scene2Metrics';
import Scene3Flow from './scenes/Scene3Flow';
import Scene4Dashboard from './scenes/Scene4Dashboard';
import Scene5CTA from './scenes/Scene5CTA';
import logoMark from './assets/logo-mark.svg';
import './styles/tokens.css';
import './styles/chrome.css';

const CHAPTERS = [
  { label: 'Игрок',      from: 0.00, to: 0.18 },
  { label: 'Метрики',    from: 0.18, to: 0.40 },
  { label: 'Поток',      from: 0.40, to: 0.62 },
  { label: 'Дашборд',    from: 0.62, to: 0.84 },
  { label: 'Запросить',  from: 0.84, to: 1.00 },
];

function MasterProgress() {
  useEffect(() => {
    let raf, alive = true;
    const tick = () => {
      if (!alive) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const el = document.getElementById('master-progress');
      if (el) el.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);
  return null;
}

function AnchorLinks() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#scene-"]');
      if (!a) return;
      const idx = parseInt(a.getAttribute('href').replace('#scene-', ''), 10) - 1;
      if (isNaN(idx) || !CHAPTERS[idx]) return;
      e.preventDefault();
      const spacer = document.querySelector('.story-spacer');
      if (!spacer) return;
      const r = spacer.getBoundingClientRect();
      const sectionTop = window.scrollY + r.top;
      const total = r.height - window.innerHeight;
      const target = sectionTop + total * ((CHAPTERS[idx].from + CHAPTERS[idx].to) / 2);
      window.scrollTo({ top: target, behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}

export default function App() {
  return (
    <>
      <SmoothScroll />
      <MasterProgress />
      <AnchorLinks />

      <nav className="top-nav">
        <a href="#" className="nav-logo">
          <img src={logoMark} alt="" style={{ height: 24 }} />
          <span>emerald</span>
        </a>
      </nav>

      <div className="master-progress" id="master-progress" />

      <Stage scrollHeight="1100vh" chapters={CHAPTERS}>
        <Scene from={0.00} to={0.18} label="01 Игрок">
          <Scene1Hero from={0.00} to={0.18} />
        </Scene>
        <Scene from={0.18} to={0.40} label="02 Метрики">
          <Scene2Metrics from={0.18} to={0.40} />
        </Scene>
        <Scene from={0.40} to={0.62} label="03 Поток">
          <Scene3Flow from={0.40} to={0.62} />
        </Scene>
        <Scene from={0.62} to={0.84} label="04 Дашборд">
          <Scene4Dashboard from={0.62} to={0.84} />
        </Scene>
        <Scene from={0.84} to={1.00} label="05 Запросить пилот">
          <Scene5CTA from={0.84} to={1.00} />
        </Scene>
      </Stage>
    </>
  );
}
