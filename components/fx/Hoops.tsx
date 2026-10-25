'use client';

import { useEffect, useRef } from 'react';
import { hoopsCopy } from '@/content/interests';
import { KEYS, store } from '@/lib/storage';
import { useFx } from './FxProvider';

/**
 * Basketball mini-game. Hold (mouse, touch, Space or Enter) to charge, release
 * inside the random green zone. Best streak is saved; every 3 in a row releases
 * the bat swarm. The game loop is imperative canvas code, ported as-is.
 */
export default function Hoops() {
  const fx = useFx();
  const cvRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const bandRef = useRef<HTMLSpanElement>(null);
  const msgRef = useRef<HTMLParagraphElement>(null);
  const scRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cv = cvRef.current,
      btn = btnRef.current,
      fillEl = fillRef.current,
      band = bandRef.current,
      msg = msgRef.current,
      sc = scRef.current;
    const ctx = cv?.getContext?.('2d');
    if (!cv || !ctx || !btn || !fillEl || !band || !msg || !sc) return;

    const ZONE = 0.075;
    let W = 0,
      H = 0,
      sweet = 0.68,
      power = 0,
      charging = false,
      chargeStart = 0,
      busy = false,
      made = 0,
      shots = 0,
      streak = 0,
      spin = 0;
    let best = Number(store.get(KEYS.best) || 0);
    const ball = { x: 0, y: 0 };
    let chargeRaf = 0,
      shotRaf = 0,
      resetTimer = 0,
      alive = true;

    const geom = () => ({ sx: 48, sy: H - 32, hx: W - 98, hy: Math.max(72, H * 0.36), floor: H - 14 });
    function newSweet() {
      sweet = 0.5 + Math.random() * 0.36;
      band!.style.left = (sweet - ZONE) * 100 + '%';
      band!.style.width = ZONE * 200 + '%';
    }
    function resetBall() {
      const g = geom();
      ball.x = g.sx;
      ball.y = g.sy;
      spin = 0;
    }
    function score() {
      sc!.textContent = made + ' / ' + shots + ' · best streak ' + best;
    }
    function size() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv!.clientWidth;
      H = cv!.clientHeight;
      cv!.width = Math.round(W * dpr);
      cv!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!busy) resetBall();
      draw();
    }
    function drawBall(x: number, y: number) {
      const c = ctx!;
      c.save();
      c.translate(x, y);
      c.rotate(spin);
      c.fillStyle = '#E0864A';
      c.beginPath();
      c.arc(0, 0, 12, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#5A2E12';
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(-12, 0);
      c.lineTo(12, 0);
      c.moveTo(0, -12);
      c.lineTo(0, 12);
      c.stroke();
      c.beginPath();
      c.arc(-15, 0, 10, -0.9, 0.9);
      c.stroke();
      c.beginPath();
      c.arc(15, 0, 10, Math.PI - 0.9, Math.PI + 0.9);
      c.stroke();
      c.restore();
    }
    function draw() {
      const c = ctx!;
      const g = geom(),
        bbx = g.hx + 34;
      c.clearRect(0, 0, W, H);
      c.strokeStyle = '#2E312C';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, g.floor + 0.5);
      c.lineTo(W, g.floor + 0.5);
      c.stroke();
      c.setLineDash([4, 6]);
      c.beginPath();
      c.arc(bbx, g.floor, Math.min(W * 0.45, 300), Math.PI, Math.PI * 1.5);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = '#3A3D37';
      c.fillRect(bbx + 6, g.hy - 40, 4, g.floor - (g.hy - 40));
      c.fillStyle = 'rgba(236,232,223,.85)';
      c.fillRect(bbx - 2, g.hy - 52, 6, 72);
      drawBall(ball.x, ball.y);
      c.strokeStyle = '#8E8E85';
      c.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        c.beginPath();
        c.moveTo(g.hx - 24 + i * 12, g.hy);
        c.lineTo(g.hx - 14 + i * 7, g.hy + 30);
        c.stroke();
      }
      c.beginPath();
      c.moveTo(g.hx - 20, g.hy + 12);
      c.lineTo(g.hx + 20, g.hy + 12);
      c.moveTo(g.hx - 17, g.hy + 22);
      c.lineTo(g.hx + 17, g.hy + 22);
      c.stroke();
      c.strokeStyle = '#7DDCB0';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(g.hx - 26, g.hy);
      c.lineTo(bbx - 2, g.hy);
      c.stroke();
    }
    function chargeLoop(now: number) {
      if (!charging) return;
      const t = ((now - chargeStart) / 1100) % 2;
      power = t < 1 ? t : 2 - t;
      fillEl!.style.width = power * 100 + '%';
      chargeRaf = requestAnimationFrame(chargeLoop);
    }
    function startCharge() {
      if (busy || charging) return;
      charging = true;
      chargeStart = performance.now();
      btn!.classList.add('charging');
      msg!.textContent = hoopsCopy.charging;
      chargeRaf = requestAnimationFrame(chargeLoop);
    }
    function release() {
      if (!charging) return;
      charging = false;
      btn!.classList.remove('charging');
      shoot(power);
    }
    function shoot(p: number) {
      if (busy) return;
      busy = true;
      shots++;
      const g = geom(),
        ok = Math.abs(p - sweet) <= ZONE,
        long = !ok && p > sweet;
      let tx: number, ty: number;
      if (ok) {
        tx = g.hx;
        ty = g.hy - 4;
      } else if (long) {
        tx = g.hx + 26;
        ty = g.hy - 30;
      } else {
        tx = g.sx + (g.hx - g.sx) * Math.max(0.35, p / sweet) - 20;
        ty = g.hy + 12;
      }
      const sx = ball.x,
        sy = ball.y,
        arc = 120 + p * 90,
        t0 = performance.now(),
        D1 = 820,
        D2 = 520;
      const ex = ok ? g.hx : long ? tx - 70 : tx + 26,
        ey = g.floor - 12;
      const step = (now: number) => {
        if (!alive) return;
        const e = now - t0;
        if (e < D1) {
          const t = e / D1;
          ball.x = sx + (tx - sx) * t;
          ball.y = sy + (ty - sy) * t - arc * 4 * t * (1 - t);
          spin += 0.18;
        } else if (e < D1 + D2) {
          const t = (e - D1) / D2;
          ball.x = tx + (ex - tx) * t;
          ball.y = ty + (ey - ty) * t * t - (ok ? 0 : Math.sin(t * Math.PI) * 26);
          spin += 0.1;
        } else {
          if (ok) {
            made++;
            streak++;
          } else streak = 0;
          if (streak > best) {
            best = streak;
            store.set(KEYS.best, String(best));
          }
          msg!.textContent = ok
            ? streak >= 3
              ? hoopsCopy.onFire(streak)
              : hoopsCopy.swish
            : long
              ? hoopsCopy.long
              : hoopsCopy.short;
          score();
          if (ok && streak >= 3 && streak % 3 === 0) fx.swarm();
          resetTimer = window.setTimeout(() => {
            resetBall();
            newSweet();
            fillEl!.style.width = '0%';
            busy = false;
            draw();
          }, 650);
          draw();
          return;
        }
        draw();
        shotRaf = requestAnimationFrame(step);
      };
      step(t0);
    }

    const onBtnDown = (e: PointerEvent) => {
      e.preventDefault();
      btn.setPointerCapture?.(e.pointerId);
      startCharge();
    };
    const onBtnKeyDown = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        startCharge();
      }
    };
    const onBtnKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        release();
      }
    };
    const noMenu = (e: Event) => e.preventDefault();
    const onCvDown = (e: PointerEvent) => {
      e.preventDefault();
      cv.setPointerCapture?.(e.pointerId);
      startCharge();
    };

    btn.addEventListener('pointerdown', onBtnDown);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('lostpointercapture', release);
    btn.addEventListener('keydown', onBtnKeyDown);
    btn.addEventListener('keyup', onBtnKeyUp);
    btn.addEventListener('contextmenu', noMenu);
    cv.addEventListener('pointerdown', onCvDown);
    cv.addEventListener('pointerup', release);
    cv.addEventListener('pointercancel', release);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(size);
      ro.observe(cv);
    } else window.addEventListener('resize', size);

    newSweet();
    size();
    score();
    const unregister = fx.register('hoopsAuto', () => shoot(sweet));

    return () => {
      alive = false;
      unregister();
      cancelAnimationFrame(chargeRaf);
      cancelAnimationFrame(shotRaf);
      window.clearTimeout(resetTimer);
      btn.removeEventListener('pointerdown', onBtnDown);
      btn.removeEventListener('pointerup', release);
      btn.removeEventListener('pointercancel', release);
      btn.removeEventListener('lostpointercapture', release);
      btn.removeEventListener('keydown', onBtnKeyDown);
      btn.removeEventListener('keyup', onBtnKeyUp);
      btn.removeEventListener('contextmenu', noMenu);
      cv.removeEventListener('pointerdown', onCvDown);
      cv.removeEventListener('pointerup', release);
      cv.removeEventListener('pointercancel', release);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', size);
    };
  }, [fx]);

  return (
    <article className="panel crop card wide" aria-labelledby="hoopsTitle">
      <div className="top">
        <span className="label">{hoopsCopy.label}</span>
        <span className="label" id="hoopScore" aria-live="polite" ref={scRef}>
          0 / 0
        </span>
      </div>
      <h3 id="hoopsTitle">{hoopsCopy.title}</h3>
      <canvas id="hoops" role="img" aria-label={hoopsCopy.canvasLabel} ref={cvRef}></canvas>
      <div className="shootrow">
        <button className="btn primary" id="shootBtn" type="button" ref={btnRef}>
          {hoopsCopy.button}
        </button>
        <div className="meter" aria-hidden="true">
          <span className="band" id="meterBand" ref={bandRef}></span>
          <span className="fill" id="meterFill" ref={fillRef}></span>
        </div>
      </div>
      <p className="hoopmsg" id="hoopMsg" aria-live="polite" ref={msgRef}>
        {hoopsCopy.intro}
      </p>
    </article>
  );
}
