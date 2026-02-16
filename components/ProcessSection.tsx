"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Los 4 pasos del proceso industrial */
const STEPS = [
  {
    id: "diseno",
    number: "01",
    title: "Diseño y cálculo térmico",
    description:
      "Definimos especificaciones y simulamos el comportamiento térmico para garantizar el rendimiento del equipo.",
  },
  {
    id: "fabricacion",
    number: "02",
    title: "Fabricación y ensamblaje",
    description:
      "Construcción en planta con materiales certificados y procesos controlados.",
  },
  {
    id: "calidad",
    number: "03",
    title: "Control de calidad",
    description:
      "Inspección y pruebas según normas, con documentación técnica asociada.",
  },
  {
    id: "puesta",
    number: "04",
    title: "Puesta en marcha y soporte",
    description:
      "Instalación, capacitación y acompañamiento técnico post-entrega.",
  },
];

/**
 * Bloque institucional "Nuestro proceso industrial".
 * Fondo oscuro, estilo técnico; 4 pasos que aparecen con fade-in + slide-up al hacer scroll.
 */
export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Título: entrada suave
      gsap.set(titleRef.current, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
        onEnter: () => {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          });
        },
      });

      // Cada paso: fade-in + slide-up progresivo según scroll
      gsap.set(stepsRef.current, { opacity: 0, y: 36 });

      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          end: "top 55%",
          toggleActions: "play none none none",
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              delay: i * 0.08,
              ease: "power2.out",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proceso"
      ref={sectionRef}
      className="relative w-full border-t border-industrial-steel/50 bg-industrial-dark py-20 md:py-28"
      aria-label="Nuestro proceso industrial"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header ref={titleRef} className="mb-16 md:mb-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-industrial-accent">
            Cómo trabajamos
          </p>
          <h2 className="text-3xl font-light tracking-tight text-white md:text-4xl">
            Nuestro proceso industrial
          </h2>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => {
                stepsRef.current[i] = el;
              }}
              className="flex gap-5 rounded-lg border border-industrial-steel/60 bg-industrial-charcoal/50 p-6 opacity-0 md:p-8"
            >
              <span
                className="font-mono text-2xl font-light tabular-nums text-industrial-accent md:text-3xl"
                aria-hidden
              >
                {step.number}
              </span>
              <div>
                <h3 className="mb-2 text-lg font-medium text-white md:text-xl">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-industrial-silver/90">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
