"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Testimonial B2B: reseña técnica, sin fotos ni estrellas */
type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  city: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Los hornos Bellini llevan tres años en nuestra línea de panificados. La estabilidad de temperatura y el bajo consumo nos permiten proyectar costos con precisión. Equipo técnico muy responsable en la puesta en marcha.",
    name: "Martín Ríos",
    role: "Gerente de Producción",
    city: "Córdoba",
  },
  {
    id: "2",
    quote:
      "Reemplazamos dos equipos antiguos por una unidad Bellini. La curva de enfriamiento es uniforme y el mantenimiento es sencillo. Cumple con lo acordado en la especificación técnica.",
    name: "Laura Fernández",
    role: "Jefa de Planta",
    city: "Buenos Aires",
  },
  {
    id: "3",
    quote:
      "Necesitábamos capacidad y repetibilidad para lotes de confitería. El horno se integró bien al proceso y el soporte post-venta respondió ante cualquier consulta. Recomendable para uso industrial serio.",
    name: "Pablo Gutiérrez",
    role: "Director Técnico",
    city: "Rosario, Santa Fe",
  },
  {
    id: "4",
    quote:
      "Trabajamos con materias primas sensibles al calor. El control digital y la distribución del aire en el Bellini nos dieron el resultado que buscábamos. Buena relación calidad-precio para el segmento.",
    name: "Ana Martínez",
    role: "Responsable de Calidad",
    city: "Mendoza",
  },
];

/**
 * Bloque de reseñas / testimonios.
 * Estilo industrial premium, B2B, sin fotos ni estrellas.
 * Entrada: fade-in + slide-up con stagger; hover sutil en cards.
 */
export default function TestimonialsSection() {
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
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        },
        0.2
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonios"
      ref={sectionRef}
      className="relative min-h-screen w-full border-t border-industrial-steel/50 bg-industrial-black py-5 md:py-5"
      aria-label="Empresas que confían en Bellini"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header ref={headerRef} className="mb-14 text-center md:mb-16">
          <h2 className="mb-3 text-3xl font-light tracking-tight text-white md:text-4xl">
            Empresas que confían en Bellini
          </h2>
          <p className="mx-auto max-w-2xl text-industrial-silver">
            Hornos industriales operando en todo el país
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="flex flex-col rounded-lg border border-industrial-steel/60 bg-industrial-charcoal/50 p-6 transition-colors hover:border-industrial-accent/40 hover:bg-industrial-charcoal/70 md:p-7"
            >
              <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-industrial-silver/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="border-t border-industrial-steel/40 pt-4">
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-industrial-silver">{t.role}</p>
                <p className="mt-1 text-xs text-industrial-accent/90">
                  {t.city}
                </p>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
