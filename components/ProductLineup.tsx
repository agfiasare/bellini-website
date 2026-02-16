"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Modelo de horno para la línea de producto */
type ProductModel = {
  id: string;
  name: string;
  image: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  /** true = modelo protagonista (mayor jerarquía visual) */
  isFeatured?: boolean;
};

/** Imágenes desde public/images/assets */
const ASSETS_BASE = "/images/assets/";
const IMG_REFERENCIA =
  ASSETS_BASE +
  encodeURIComponent(
    "Horno bellini version de referencia pra hornos de 15 bandejas , 10 bandejas y 8 bandejas  (1).png"
  );
const IMG_OVEN_001 = ASSETS_BASE + "oven_001.png";

const MODELS: ProductModel[] = [
  {
    id: "serie-pro",
    name: "Serie Pro",
    image: IMG_OVEN_001,
    features: [
      "Acero inoxidable AISI",
      "Control digital de precisión",
      "Aislamiento térmico de alta densidad",
      "Eficiencia energética optimizada",
    ],
    ctaLabel: "Ver especificaciones",
    ctaHref: "#producto",
    isFeatured: true,
  },
  {
    id: "serie-standard",
    name: "Serie Standard",
    image: IMG_REFERENCIA,
    features: [
      "Construcción robusta",
      "Panel de control intuitivo",
      "Mantenimiento simplificado",
      "Ideal para volúmenes medios",
    ],
    ctaLabel: "Consultar",
    ctaHref: "#contacto",
  },
];

/**
 * Sección "Nuestra línea de hornos industriales".
 * Altura completa, fondo oscuro, dos cards (el primero con mayor jerarquía).
 * Entrada: fade-in + slide-up; hover sutil. Sin animaciones de scroll complejas.
 */
export default function ProductLineup() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: 24 });
      gsap.set(cardsRef.current, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }).to(
        cardsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        },
        0.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="linea"
      ref={sectionRef}
      className="relative min-h-screen w-full border-t border-industrial-steel/50 bg-industrial-dark py-20 md:py-28"
      aria-label="Línea de hornos industriales"
    >
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6">
        <header ref={headerRef} className="mb-14 text-center md:mb-16">
          <h2 className="mb-3 text-3xl font-light tracking-tight text-white md:text-4xl">
            Nuestra línea de hornos industriales
          </h2>
          <p className="mx-auto max-w-2xl text-industrial-silver">
            Dos soluciones diseñadas para distintos procesos productivos
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          {MODELS.map((model, i) => (
            <div
              key={model.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-industrial-charcoal/60 transition-colors hover:border-industrial-accent/40 hover:bg-industrial-charcoal/80 ${
                model.isFeatured
                  ? "border-industrial-accent/50 lg:scale-[1.02]"
                  : "border-industrial-steel"
              }`}
            >
              {/* Imagen del horno: altura fija para que ambas cards queden iguales */}
              <div className="relative flex h-96 shrink-0 items-center justify-center overflow-hidden bg-industrial-black md:h-96 lg:h-[28rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={model.image}
                  alt={model.name}
                  className="max-h-full max-w-full object-contain object-center px-6 py-4 transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {model.isFeatured && (
                  <span className="absolute right-4 top-4 rounded bg-industrial-accent/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-industrial-black">
                    Protagonista
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h3 className="mb-4 text-xl font-medium text-white md:text-2xl">
                  {model.name}
                </h3>
                <ul className="mb-6 flex-1 space-y-2 text-sm text-industrial-silver">
                  {model.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-px w-3 bg-industrial-accent/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={model.ctaHref}
                  className="inline-flex w-fit items-center border border-industrial-steel px-5 py-2.5 text-sm font-medium text-industrial-silver transition-colors hover:border-industrial-accent/60 hover:text-industrial-accent"
                >
                  {model.ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
