"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LogoIntro.module.css";

type Phase = "reveal" | "steam" | "exit" | "done";

type Particle = {
  x: number;
  baseY: number;
  speed: number;      // px per ms
  radius: number;
  maxOpacity: number;
  delay: number;      // ms after steam phase starts
  duration: number;   // ms lifecycle
};

const COL_FRACS = [0.05, 0.18, 0.30, 0.42, 0.56, 0.70, 0.84];
const ROWS = 8;

function buildParticles(w: number, h: number): Particle[] {
  const ps: Particle[] = [];
  COL_FRACS.forEach((cx, ci) => {
    for (let r = 0; r < ROWS; r++) {
      ps.push({
        x: cx * w + (Math.random() - 0.5) * 28,
        baseY: h + 24,
        speed: 0.15 + Math.random() * 0.10,
        radius: 30 + Math.random() * 30,
        maxOpacity: 0.55 + Math.random() * 0.35,
        delay: r * 260 + ci * 65 + Math.random() * 190,
        duration: 3200 + Math.random() * 1800,
      });
    }
  });
  return ps;
}

const T_STEAM = 1900;
const T_EXIT  = 7200;
// Must be >= T_EXIT + transition duration (2s)
const T_DONE  = 9800;

export function LogoIntro() {
  const [phase, setPhase] = useState<Phase>("reveal");
  const [exitTransform, setExitTransform] = useState<string | null>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("steam"), T_STEAM);
    const t2 = setTimeout(() => setPhase("exit"),  T_EXIT);
    const t3 = setTimeout(() => setPhase("done"),  T_DONE);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // When exit phase starts: measure navbar logo and calculate precise FLIP transform
  useEffect(() => {
    if (phase !== "exit") return;

    const navLogo  = document.getElementById("navbar-logo");
    const introWrap = logoWrapRef.current;
    if (!navLogo || !introWrap) return;

    const navRect   = navLogo.getBoundingClientRect();
    const introRect = introWrap.getBoundingClientRect();

    const s  = navRect.width / introRect.width;
    const dx = (navRect.left + navRect.width  / 2) - (introRect.left + introRect.width  / 2);
    const dy = (navRect.top  + navRect.height / 2) - (introRect.top  + introRect.height / 2);

    setExitTransform(`translate(${dx}px, ${dy}px) scale(${s})`);
  }, [phase]);

  // Canvas steam — starts at T_STEAM, keeps running through exit until T_DONE
  useEffect(() => {
    const startTimer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width);
      canvas.height = Math.round(rect.height);

      const particles = buildParticles(canvas.width, canvas.height);
      const t0 = performance.now();

      const draw = (now: number) => {
        const elapsed = now - t0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          if (elapsed < p.delay) return;
          const t    = elapsed - p.delay;
          const prog = Math.min(t / p.duration, 1);
          if (prog >= 1) return;

          const y       = p.baseY - t * p.speed;
          const spreadX = p.radius * (1 + prog * 1.6);
          const fadeIn  = Math.min(t / (p.duration * 0.10), 1);
          const fadeOut = prog > 0.72 ? 1 - (prog - 0.72) / 0.28 : 1;
          const opacity = p.maxOpacity * fadeIn * fadeOut;
          if (opacity <= 0.01) return;

          const grad = ctx.createRadialGradient(p.x, y, 0, p.x, y, spreadX);
          grad.addColorStop(0,    `rgba(250,238,218,${opacity})`);
          grad.addColorStop(0.38, `rgba(228,202,170,${opacity * 0.48})`);
          grad.addColorStop(1,    "transparent");

          ctx.beginPath();
          ctx.ellipse(p.x, y, spreadX, p.radius, 0, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        rafRef.current = requestAnimationFrame(draw);
      };

      rafRef.current = requestAnimationFrame(draw);
    }, T_STEAM);

    const stopTimer = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
    }, T_DONE);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (phase === "done") return null;

  const isExiting = phase === "exit";

  return (
    <div
      className={`${styles.root} ${isExiting ? styles.rootExit : ""}`}
      aria-hidden="true"
    >
      <div
        ref={logoWrapRef}
        className={styles.logoWrap}
        style={exitTransform ? { transform: exitTransform } : undefined}
      >
        <div className={styles.logoHalo} />
        <div className={styles.logoGlow}>
          <Image
            src="/images/logo.png"
            alt="Tacos Don Refugio — El Sabor de Siempre"
            width={480}
            height={246}
            priority
            className={styles.logoImg}
          />
        </div>
      </div>

      <canvas ref={canvasRef} className={styles.steam} />
    </div>
  );
}
