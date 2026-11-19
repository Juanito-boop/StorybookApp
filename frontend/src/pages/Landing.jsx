import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GENRE_LIST } from "@/lib/genres";
import { useAuth } from "@/context/AuthContext";

export default function Landing() {
  const { user } = useAuth();
  const primaryTo = user ? "/create" : "/register";

  return (
    <main className="relative">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="text-sm font-sans-ui text-[#a1a1a6]">Generador local de cuentos</p>
            <h1 className="mt-4 font-sans-ui font-medium text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-[#ededed]">
              Convierte una idea en un cuento ilustrado y narrado de cinco escenas
            </h1>
            <p className="mt-6 max-w-xl font-sans-ui text-base sm:text-lg text-[#a1a1a6] leading-relaxed">
              Elige un género, escribe una idea breve y la aplicación crea un relato de cinco escenas con ilustraciones,
              narración en voz y ambiente sonoro. Todo se ejecuta en tu computadora, sin internet una vez descargados los modelos.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={primaryTo}>
                <Button data-testid="hero-primary-cta" size="lg" className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-12 px-6 rounded-lg">
                  Crear cuento
                </Button>
              </Link>
              {!user && (
                <Link to="/login">
                  <Button data-testid="hero-secondary-cta" size="lg" variant="outline" className="border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325] h-12 px-6 rounded-lg">
                    Iniciar sesión
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-2xl">
              {[
                { title: "6 géneros", sub: "Fantasía, misterio, terror, aventura, ciencia ficción e infantil" },
                { title: "5 escenas", sub: "Relato con inicio, desarrollo, conflicto, clímax y desenlace" },
                { title: "Ejecución local", sub: "Modelos abiertos en tu equipo, sin enviar tus ideas a servidores" },
              ].map(({ title, sub }) => (
                <div key={title} className="parchment rounded-xl p-4">
                  <div className="text-[#ededed] text-sm font-medium">{title}</div>
                  <div className="text-[#a1a1a6] text-sm leading-relaxed mt-2">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="w-full max-w-md mx-auto parchment rounded-xl p-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden relative border border-[rgba(237,237,237,0.08)]" data-testid="hero-illustration">
                <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" aria-hidden>
                  <rect width="400" height="500" fill="#1e1c1a" />
                  <rect x="0" y="0" width="400" height="220" fill="#23201c" />
                  <circle cx="300" cy="96" r="28" fill="#d4c4a0" opacity="0.9" />
                  <path d="M0 300 L70 240 L120 270 L190 210 L260 260 L320 230 L400 280 L400 500 L0 500Z" fill="#2a2722" />
                  <path d="M0 360 L90 310 L170 350 L250 300 L330 345 L400 325 L400 500 L0 500Z" fill="#201e1b" />
                  <g fill="#141312" opacity="0.9">
                    <rect x="236" y="288" width="16" height="48" /><polygon points="232,288 244,266 256,288" />
                    <rect x="256" y="304" width="28" height="32" /><rect x="288" y="284" width="12" height="52" /><polygon points="286,284 294,262 302,284" />
                  </g>
                  <rect x="244" y="300" width="4" height="6" fill="#c9a86a" opacity="0.8" />
                  <rect x="0" y="420" width="400" height="80" fill="#181716" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-[#19191b]/90 border-t border-[rgba(237,237,237,0.08)]">
                  <div className="text-xs text-[#85858b] font-sans-ui tabular-nums">Escena 3 de 5 · Fantasía</div>
                  <div className="font-prose text-lg text-[#ededed] mt-1">La torre de las lunas dormidas</div>
                  <p className="font-prose text-sm text-[#a1a1a6] mt-2 leading-relaxed">
                    “Cuando la tercera luna se apagó, Lía subió los peldaños de la torre con una lámpara y una promesa”.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#85858b] font-sans-ui">
                <span>Ejemplo de escena generada</span>
                <span className="tabular-nums">3/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-sans-ui text-2xl sm:text-3xl font-medium text-[#ededed]">Géneros disponibles</h2>
            <p className="font-sans-ui text-[#a1a1a6] mt-2">Elige el tipo de historia que quieres crear</p>
          </div>
          <Link to={primaryTo} className="hidden md:inline text-[#ededed] hover:underline text-sm font-sans-ui">Crear un cuento</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GENRE_LIST.map((g) => (
            <div key={g.id} data-testid={`landing-genre-${g.id}`} className="parchment rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border border-[rgba(237,237,237,0.08)] bg-[#232325] text-[#a1a1a6]">
                  <g.Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans-ui text-base font-medium text-[#ededed]">{g.name}</h3>
                  <p className="font-sans-ui text-sm text-[#a1a1a6] mt-1">{g.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="parchment rounded-xl p-6 sm:p-8">
          <h3 className="font-sans-ui text-xl font-medium text-[#ededed]">Funciona en tu computadora</h3>
          <p className="font-sans-ui text-base text-[#a1a1a6] mt-3 leading-relaxed">
            Un modelo de lenguaje escribe el texto, Stable Diffusion Turbo genera las ilustraciones y MMS-TTS narra en voz.
            Los modelos se descargan una vez desde Hugging Face y después la aplicación funciona sin internet, sin APIs pagas
            y sin enviar tus ideas a ningún servidor.
          </p>
          <Link to="/about" data-testid="landing-architecture-link" className="inline-block mt-4 text-[#ededed] hover:underline font-sans-ui text-sm">
            Ver cómo funciona
          </Link>
        </div>
      </section>
    </main>
  );
}
