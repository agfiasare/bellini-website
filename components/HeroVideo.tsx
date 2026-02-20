"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

/** Umbral de píxeles de scroll para considerar "primer scroll" (navbar) */
const FIRST_SCROLL_THRESHOLD = 8;

// --- Configuración del slider automático (ajustar si hace falta) ---
/** Intervalo entre cambios de imagen, en ms. Ej: 5000 = 5 segundos. */
const SLIDER_INTERVAL_MS = 5000;
/** Duración del crossfade entre imágenes, en segundos. */
const CROSSFADE_DURATION = 1.2;
/** Intensidad general del overlay (0–1). Afecta el tramo superior y medio; el inferior siempre termina en negro para transición hero → producto. */
const OVERLAY_OPACITY = 0.55;

const HERO_IMAGES = [
  "/images/hero-bakery/bakery_01.png",
  "/images/hero-bakery/bakery_02.png",
  "/images/hero-bakery/bakery_03.png",
  "/images/hero-bakery/bakery_04.png",
  "/images/hero-bakery/bakery_05.png",
  "/images/hero-bakery/bakery_06.png",
];

/**
 * Hero con slider automático de imágenes de panadería.
 * - Fondo: secuencia automática con crossfade (sin scroll).
 * - Overlay oscuro permanente entre imagen y texto para legibilidad.
 * - Texto centrado y estable. Scroll solo afecta secciones siguientes.
 */

export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Entrada inicial del copy (stagger) ---
  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set([logoRef.current, eyebrowRef.current, titleRef.current, subtitleRef.current], {
      opacity: 0,
      y: 28,
    });
    gsap.set(scrollCueRef.current, { opacity: 0 });
    gsap
      .timeline({ delay: 0.4 })
      .to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
        0.15
      )
      .to(
        titleRef.current,
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
        0.35
      )
      .to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        0.65
      )
      .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, 1.15);
  }, []);

  // --- Slider automático: crossfade cada SLIDER_INTERVAL_MS (sin scroll) ---
  useEffect(() => {
    const container = imagesContainerRef.current;
    if (!container) return;

    const layers = container.querySelectorAll<HTMLDivElement>("[data-hero-layer]");
    const n = layers.length;
    if (!n) return;

    let currentIndex = 0;

    const goToNext = () => {
      const nextIndex = (currentIndex + 1) % n;
      const currentEl = layers[currentIndex];
      const nextEl = layers[nextIndex];
      if (!currentEl || !nextEl) return;

      gsap.to(currentEl, { opacity: 0, duration: CROSSFADE_DURATION, ease: "power2.inOut" });
      gsap.to(nextEl, { opacity: 1, duration: CROSSFADE_DURATION, ease: "power2.inOut" });
      currentIndex = nextIndex;
    };

    const intervalId = setInterval(goToNext, SLIDER_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  // --- Primer scroll: mostrar navbar ---
  useEffect(() => {
    if (!navbarRef.current) return;

    const onScroll = () => {
      if (hasTriggeredRef.current) return;
      const y = window.scrollY ?? document.documentElement.scrollTop;
      if (y < FIRST_SCROLL_THRESHOLD) return;

      hasTriggeredRef.current = true;
      window.removeEventListener("scroll", onScroll);

      gsap.fromTo(
        navbarRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={navbarRef}
        className="fixed left-0 right-0 top-0 z-50 -translate-y-full opacity-0 border-b border-industrial-steel/40 bg-industrial-black/90 backdrop-blur-md"
        aria-label="Navegación principal"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:h-16">
          <a
            href="#"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-industrial-accent/50 focus:ring-offset-2 focus:ring-offset-industrial-black rounded"
            aria-label="Bellini - Inicio"
          >
            <Image
              src="/images/assets/bellini_logo_fondo_negro.png"
              alt="Bellini"
              width={140}
              height={33}
              className="object-contain"
              priority
            />
          </a>
          {/* ===== NAV DESKTOP ===== */}
          <nav className="hidden items-center gap-6 text-sm text-industrial-silver md:flex">
            <a href="#producto" className="transition-colors hover:text-industrial-accent">
              Producto
            </a>
            <a href="#linea" className="transition-colors hover:text-industrial-accent">
              Línea
            </a>
            <a
              href="#especificaciones"
              className="transition-colors hover:text-industrial-accent"
            >
              Especificaciones
            </a>
            <a href="#proceso" className="transition-colors hover:text-industrial-accent">
              Proceso
            </a>
            <a href="#contacto" className="transition-colors hover:text-industrial-accent">
              Contacto
            </a>

            {/* CTA TIENDA DESKTOP */}
            <a
              href="https://store.bellini.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="
                ml-4 inline-flex items-center
                rounded-md border border-industrial-accent
                px-4 py-2
                text-xs font-medium uppercase tracking-wide
                text-industrial-accent
                transition-colors
                hover:bg-industrial-accent hover:text-black
              "
            >
              Acceder a la tienda
            </a>
          </nav>

          {/* ===== BOTÓN HAMBURGUESA (MOBILE) ===== */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-industrial-silver md:hidden"
            aria-label="Abrir menú"
          >
            ☰
          </button>

        </div>
        {/* ===== MENÚ MOBILE ===== */}
        {menuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col gap-6 border-t border-industrial-steel/40 bg-industrial-black/95 px-6 py-8 text-sm text-industrial-silver">
              <a href="#producto" onClick={() => setMenuOpen(false)}>
                Producto
              </a>
              <a href="#linea" onClick={() => setMenuOpen(false)}>
                Línea
              </a>
              <a href="#especificaciones" onClick={() => setMenuOpen(false)}>
                Especificaciones
              </a>
              <a href="#proceso" onClick={() => setMenuOpen(false)}>
                Proceso
              </a>
              <a href="#contacto" onClick={() => setMenuOpen(false)}>
                Contacto
              </a>

              <div className="my-2 h-px bg-white/10" />

              {/* CTA TIENDA MOBILE */}
              <a
                href="https://store.bellini.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-2 inline-flex justify-center
                  rounded-md border border-industrial-accent
                  px-6 py-3
                  text-xs font-medium uppercase tracking-wide
                  text-industrial-accent
                "
              >
                Acceder a la tienda
              </a>
            </nav>
          </div>
        )}

      </header>

      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden"
        aria-label="Hero con secuencia de imágenes de panadería"
      >
        {/* Fondo negro sólido (debajo de las imágenes) */}
        <div className="absolute inset-0 bg-industrial-black" aria-hidden />

        {/* Secuencia de imágenes de panadería */}
        <div ref={imagesContainerRef} className="absolute inset-0 z-0" aria-hidden>
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              data-hero-layer
              className="absolute inset-0 transition-none"
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-hidden
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Overlay en gradiente vertical: suave arriba, muy oscuro abajo para fundir con la sección producto (negro) */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,${0.2 * OVERLAY_OPACITY}) 0%, rgba(0,0,0,${0.5 * OVERLAY_OPACITY}) 25%, rgba(0,0,0,${OVERLAY_OPACITY}) 50%, rgba(0,0,0,0.92) 85%, rgba(0,0,0,1) 100%)`,
            }}
            aria-hidden
          />
        </div>

        {/* Contenido centrado: logo + texto principal */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <div ref={logoRef} className="mb-2">
            <Image
              src="/images/assets/bellini_logo_fondo_negro.png"
              alt="Bellini"
              width={400}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h1
            ref={titleRef}
            className="max-w-4xl text-4xl font-light tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ textShadow: "0 0 60px rgba(0,0,0,0.5)" }}
          >
            Hornos que definen
            <span className="mt-2 block text-industrial-accent">el estándar</span>
          </h1>
          <p
            ref={subtitleRef}
            className="mt-8 max-w-xl text-base text-gray-400 sm:text-lg"
          >
            Precisión, durabilidad y eficiencia para la industria.
          </p>
          <p
            ref={eyebrowRef}
            className="mb-3 mt-8 text-xs font-medium uppercase tracking-[0.35em] text-industrial-silver"
          >
            Fabricación industrial
          </p>
        </div>

        {/* Indicador de scroll */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-industrial-silver/80">
            Descubrí el producto
          </span>
          <div className="h-10 w-6 rounded-full border border-industrial-silver/40 p-1.5">
            <div className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-industrial-accent/90" />
          </div>
        </div>
      </section>
    </>
  );
}
