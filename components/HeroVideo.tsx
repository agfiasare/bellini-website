"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Umbral de píxeles de scroll para considerar "primer scroll" */
const FIRST_SCROLL_THRESHOLD = 8;

/**
 * Hero en dos estados:
 * - Inicial: fondo negro, texto centrado, sin video ni navbar.
 * - Tras el primer scroll: video fade-in, navbar slide-down sticky; texto sigue visible.
 * Animaciones suaves con GSAP; el hero se mantiene en 100vh.
 */
export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const hasTriggeredRef = useRef(false);

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

  // --- Primer scroll: mostrar video + navbar; luego ScrollTrigger para fade-out del video al seguir scrolleando ---
  useEffect(() => {
    if (!sectionRef.current || !videoWrapRef.current || !navbarRef.current) return;

    const onScroll = () => {
      if (hasTriggeredRef.current) return;
      const y = window.scrollY ?? document.documentElement.scrollTop;
      if (y < FIRST_SCROLL_THRESHOLD) return;

      hasTriggeredRef.current = true;

      window.removeEventListener("scroll", onScroll);

      const ctx = gsap.context(() => {
        // Video: fade-in suave como background
        gsap.to(videoWrapRef.current, {
          opacity: 1,
          duration: 1.4,
          ease: "power2.inOut",
        });
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }

        // Navbar: slide-down desde arriba y queda fijo
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

        // Fade-out del video al seguir scrolleando (solo activo después del primer scroll)
        gsap.to(videoWrapRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "80vh top",
            scrub: 1.2,
          },
        });

        gsap.to(contentRef.current, {
          opacity: 0,
          y: -40,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "60vh top",
            scrub: 1,
          },
        });

        gsap.to(scrollCueRef.current, {
          opacity: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "30vh top",
            scrub: 0.5,
          },
        });
      }, sectionRef);
    };

    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Navbar: oculto hasta el primer scroll, luego sticky desde arriba */}
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
          <nav className="flex items-center gap-6 text-sm text-industrial-silver">
            <a
              href="#producto"
              className="transition-colors hover:text-industrial-accent"
            >
              Producto
            </a>
            <a
              href="#linea"
              className="transition-colors hover:text-industrial-accent"
            >
              Línea
            </a>
            <a
              href="#especificaciones"
              className="transition-colors hover:text-industrial-accent"
            >
              Especificaciones
            </a>
            <a
              href="#proceso"
              className="transition-colors hover:text-industrial-accent"
            >
              Proceso
            </a>
            <a
              href="#contacto"
              className="transition-colors hover:text-industrial-accent"
            >
              Contacto
            </a>
          </nav>
        </div>
      </header>

      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden"
        aria-label="Hero con video de fabricación"
      >
        {/* Fondo negro sólido siempre visible (debajo del video) */}
        <div className="absolute inset-0 bg-industrial-black" aria-hidden />

        {/* Contenedor del video: opacity 0 inicial, fade-in al primer scroll */}
        <div
          ref={videoWrapRef}
          className="absolute inset-0 z-0 opacity-0"
          aria-hidden
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/fabricacion.mp4"
            poster="/images/hero-poster.jpg"
          >
            Tu navegador no soporta video HTML5.
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 50%, transparent 40%, black 100%)`,
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
            <span className="mt-2 block text-industrial-accent">
              el estándar
            </span>
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
