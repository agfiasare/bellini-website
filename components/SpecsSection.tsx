"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Métricas del bloque (confiabilidad y alcance). */
const METRICS = [
  {
    label: "Clientes",
    value: 500,
    prefix: "Más de ",
    suffix: " clientes",
    duration: 2,
    description:
      "Empresas y panaderías en toda Argentina confían en nuestros hornos.",
  },
  {
    label: "Cobertura",
    headline: "Presencia regional",
    description:
      "Equipos instalados en Argentina, Bolivia y Brasil.",
  },
];

/**
 * Cuenta desde 0 hasta el valor final en la duración dada.
 * Usado para efecto count-up en métricas.
 */
function useCountUp(
  end: number,
  duration: number,
  isActive: boolean
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let startTime: number;
    let raf: number;

    const step = (timestamp: number) => {
      if (startTime === undefined) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Easing suave
      const easeOut = 1 - Math.pow(1 - progress, 2);
      setCount(Math.round(easeOut * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, isActive]);

  return count;
}

/** Carta de una métrica: count-up opcional y texto secundario */
function MetricCard({
  item,
  isActive,
}: {
  item: (typeof METRICS)[number];
  isActive: boolean;
}) {
  const hasCountUp = "value" in item && item.value != null;
  const count = useCountUp(
    hasCountUp ? (item as { value: number }).value : 0,
    hasCountUp ? (item as { duration: number }).duration : 0,
    isActive && hasCountUp
  );

  const headline = hasCountUp
    ? `${(item as { prefix?: string }).prefix ?? ""}${count}${(item as { suffix?: string }).suffix ?? ""}`
    : (item as { headline: string }).headline;

  return (
    <div className="rounded-lg border border-industrial-steel bg-industrial-charcoal/50 p-6 backdrop-blur-sm transition-colors hover:border-industrial-accent/40 md:p-8">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-industrial-silver">
        {item.label}
      </p>
      <p className="font-mono text-3xl font-light tabular-nums text-white md:text-4xl">
        {headline}
      </p>
      {"description" in item && item.description && (
        <p className="mt-3 text-sm leading-relaxed text-industrial-silver/90">
          {item.description}
        </p>
      )}
    </div>
  );
}

/**
 * Bloque de métricas y especificaciones.
 * Ocupa todo el viewport (min-h-screen), contenido centrado verticalmente.
 * Con pin: mientras está activo solo se ve este bloque (ritmo cinematográfico).
 * Grid de métricas limpio y equilibrado.
 */
export default function SpecsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [specsVisible, setSpecsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const gridEl = gridRef.current;
      const children = gridEl?.children;
      if (children) gsap.set(children, { opacity: 0, y: 24 });

      // Activar count-up cuando la sección entra en viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => setSpecsVisible(true),
      });

      // Entrada de las cards: fade-in + slide-up con stagger
      if (children) {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 40%",
            scrub: 1,
          },
          overwrite: true,
        });
      }

      // Pin: mientras la sección está en viewport queda fija, no se ve el bloque anterior ni el siguiente
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="especificaciones"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center border-t border-industrial-steel/50 bg-industrial-black"
      aria-label="Especificaciones técnicas"
    >
      <div
        ref={contentRef}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16"
      >
        <header className="mb-12 w-full max-w-5xl border-l-2 border-industrial-accent/60 pl-6 md:mb-14">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-industrial-accent">
            Ficha técnica
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white md:text-4xl">
            Métricas y rendimiento
          </h2>
        </header>

        <div
          ref={gridRef}
          className="grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8"
        >
          {METRICS.map((metric) => (
            <MetricCard key={metric.label} item={metric} isActive={specsVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
