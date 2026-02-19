"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_RAW,
  CONTACT_PHONE_DISPLAY,
} from "@/lib/contact";

gsap.registerPlugin(ScrollTrigger);

/** Errores de validación por campo */
type FormErrors = {
  nombre?: string;
  empresa?: string;
  email?: string;
  mensaje?: string;
};

/** Datos del formulario para envío mock */
type FormData = {
  nombre: string;
  empresa: string;
  email: string;
  mensaje: string;
};

/**
 * Sección final de contacto / CTA.
 * Fondo oscuro, estilo industrial premium, dos columnas (info + formulario).
 * Animación de entrada con ScrollTrigger; validación básica; envío mock.
 */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<FormData>({
    nombre: "",
    empresa: "",
    email: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Animación de entrada: fade-in + slide-up una vez al entrar en viewport ---
  useEffect(() => {
    if (!sectionRef.current || !leftRef.current || !formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([leftRef.current, formRef.current], { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
      tl.to(leftRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }).to(
        formRef.current,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        0.15
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /** Validación básica: requeridos y formato email */
  const validate = useCallback((data: FormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.nombre?.trim()) next.nombre = "Ingresá tu nombre.";
    if (!data.empresa?.trim()) next.empresa = "Ingresá la empresa.";
    if (!data.email?.trim()) next.email = "Ingresá tu email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Email no válido.";
    }
    if (!data.mensaje?.trim()) next.mensaje = "Ingresá tu mensaje.";
    return next;
  }, []);

  /** Envío por mailto a CONTACT_EMAIL con datos del formulario. */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const nextErrors = validate(formState);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      setIsSubmitting(true);
      const subject = encodeURIComponent(
        `Contacto web: ${formState.empresa || formState.nombre}`
      );
      const body = encodeURIComponent(
        `Nombre: ${formState.nombre}\nEmpresa: ${formState.empresa}\nEmail: ${formState.email}\n\nMensaje:\n${formState.mensaje}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setFormState({ nombre: "", empresa: "", email: "", mensaje: "" });
      setErrors({});
      setIsSubmitting(false);
    },
    [formState, validate]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="relative w-full border-t border-industrial-steel/50 bg-industrial-black py-20 md:py-28"
      aria-label="Contacto"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-14 text-center">
          <h2 className="text-3xl font-light tracking-tight text-white md:text-4xl">
            Hablemos de tu proyecto
          </h2>
          <p className="mt-3 text-industrial-silver">
            Soluciones térmicas industriales a medida
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Columna izquierda: texto institucional + contacto */}
          <div ref={leftRef} className="flex flex-col justify-center">
            <p className="mb-8 max-w-md text-sm leading-relaxed text-industrial-silver/90">
              Diseñamos y fabricamos hornos industriales adaptados a cada proceso.
              Contanos tu necesidad y te respondemos con una propuesta técnica y
              comercial.
            </p>
            <div className="space-y-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block text-sm text-industrial-silver transition-colors hover:text-industrial-accent"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:+${CONTACT_PHONE_RAW}`}
                className="block text-sm text-industrial-silver transition-colors hover:text-industrial-accent"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
          </div>

          {/* Columna derecha: formulario */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="contact-nombre"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-industrial-silver"
              >
                Nombre
              </label>
              <input
                id="contact-nombre"
                type="text"
                name="nombre"
                value={formState.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full rounded border border-industrial-steel bg-industrial-charcoal px-4 py-3 text-white placeholder-industrial-silver/50 outline-none transition-colors focus:border-industrial-accent/60 hover:border-industrial-silver/50"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? "error-nombre" : undefined}
              />
              {errors.nombre && (
                <p id="error-nombre" className="mt-1 text-xs text-red-400">
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-empresa"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-industrial-silver"
              >
                Empresa
              </label>
              <input
                id="contact-empresa"
                type="text"
                name="empresa"
                value={formState.empresa}
                onChange={handleChange}
                placeholder="Nombre de la empresa"
                className="w-full rounded border border-industrial-steel bg-industrial-charcoal px-4 py-3 text-white placeholder-industrial-silver/50 outline-none transition-colors focus:border-industrial-accent/60 hover:border-industrial-silver/50"
                aria-invalid={!!errors.empresa}
                aria-describedby={errors.empresa ? "error-empresa" : undefined}
              />
              {errors.empresa && (
                <p id="error-empresa" className="mt-1 text-xs text-red-400">
                  {errors.empresa}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-industrial-silver"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="tu@empresa.com"
                className="w-full rounded border border-industrial-steel bg-industrial-charcoal px-4 py-3 text-white placeholder-industrial-silver/50 outline-none transition-colors focus:border-industrial-accent/60 hover:border-industrial-silver/50"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              {errors.email && (
                <p id="error-email" className="mt-1 text-xs text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-mensaje"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-industrial-silver"
              >
                Mensaje
              </label>
              <textarea
                id="contact-mensaje"
                name="mensaje"
                value={formState.mensaje}
                onChange={handleChange}
                placeholder="Contanos sobre tu proyecto o necesidad."
                rows={4}
                className="w-full resize-y rounded border border-industrial-steel bg-industrial-charcoal px-4 py-3 text-white placeholder-industrial-silver/50 outline-none transition-colors focus:border-industrial-accent/60 hover:border-industrial-silver/50"
                aria-invalid={!!errors.mensaje}
                aria-describedby={errors.mensaje ? "error-mensaje" : undefined}
              />
              {errors.mensaje && (
                <p id="error-mensaje" className="mt-1 text-xs text-red-400">
                  {errors.mensaje}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-industrial-accent px-6 py-3.5 text-sm font-medium uppercase tracking-wider text-industrial-black transition-colors hover:bg-industrial-accent/90 disabled:opacity-60 md:w-auto"
            >
              {isSubmitting ? "Enviando…" : "Solicitar cotización"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
