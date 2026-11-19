import React from "react";

const STEPS = [
  { title: "Interfaz web", sub: "Idea, género y parámetros desde la aplicación React." },
  { title: "API y cola", sub: "FastAPI recibe la solicitud y guarda el trabajo en SQLite." },
  { title: "Texto", sub: "Qwen2.5-Instruct define el protagonista y escribe 5 escenas con arco narrativo." },
  { title: "Imagen", sub: "SD-Turbo o SDXL-Turbo ilustra cada escena con estilo por género y semilla compartida." },
  { title: "Voz", sub: "Meta MMS-TTS genera la narración en español para cada escena." },
  { title: "Ambiente", sub: "Se sintetiza un paisaje sonoro por escena de forma procedural." },
];

const MODELS = [
  ["Qwen/Qwen2.5-1.5B · 3B · 7B-Instruct", "Texto narrativo y prompts visuales", "1.5B y 7B: Apache 2.0 · 3B: Qwen Research (no comercial)"],
  ["stabilityai/sd-turbo · sdxl-turbo", "Ilustraciones 512–768 px en 1–4 pasos", "Stability AI Community (uso no comercial / investigación)"],
  ["h94/IP-Adapter (SDXL)", "Identidad del personaje entre escenas (opcional)", "Apache 2.0"],
  ["facebook/mms-tts-spa", "Síntesis de voz en español", "CC BY-NC 4.0"],
  ["openai/clip-vit-base-patch32", "Mide la consistencia visual (no genera contenido)", "MIT"],
  ["Síntesis procedural propia (NumPy/SciPy)", "Lluvia, viento, mar, bosque, fuego, magia y otros ambientes", "Código propio, sin restricciones"],
];

const CONSISTENCY = [
  "El modelo define el nombre y los rasgos visuales del protagonista una sola vez y se reutilizan en todas las escenas.",
  "Cada escena se escribe con el contexto de las anteriores, siguiendo un arco de cinco actos.",
  "Se usa un estilo visual fijo por género y una misma semilla de difusión para mantener paleta y composición.",
  "En el perfil calidad, la primera ilustración puede servir de referencia visual para las demás (IP-Adapter).",
  "El ambiente sonoro combina una capa base del género con un efecto específico por escena.",
  "La similitud CLIP entre las cinco ilustraciones se registra como métrica en el panel de experimentos.",
];

export default function About() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 sm:py-12 space-y-8">
      <div>
        <h1 className="font-sans-ui text-3xl sm:text-4xl font-medium text-[#ededed]">Arquitectura</h1>
        <p className="font-sans-ui text-base text-[#a1a1a6] mt-3 max-w-3xl">La aplicación genera cuentos de forma local. Los modelos se descargan una vez y después el texto, las ilustraciones, la voz y el ambiente se producen en tu computadora, sin enviar la idea a servicios externos.</p>
      </div>

      <div data-testid="architecture-diagram" className="parchment rounded-xl p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STEPS.map(({ title, sub }, i) => (
          <div key={title} className="rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 p-4">
            <div className="text-xs font-sans-ui text-[#85858b] tabular-nums">Paso {i + 1}</div>
            <div className="font-sans-ui text-base font-medium text-[#ededed] mt-2">{title}</div>
            <div className="text-sm text-[#a1a1a6] font-sans-ui mt-1 leading-relaxed">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="parchment rounded-xl p-6">
          <h2 className="font-sans-ui text-xl font-medium text-[#ededed]">Estrategia de consistencia</h2>
          <ul className="mt-4 space-y-3 font-sans-ui text-sm text-[#a1a1a6]">
            {CONSISTENCY.map((c) => <li key={c} className="flex gap-3"><span className="mt-2 h-1 w-1 rounded-full bg-[#85858b] shrink-0" />{c}</li>)}
          </ul>
          <p className="mt-4 text-xs text-[#85858b] font-sans-ui">Se puede desactivar en Opciones avanzadas para comparar resultados en el panel de experimentos.</p>
        </div>
        <div className="parchment rounded-xl p-6">
          <h2 className="font-sans-ui text-xl font-medium text-[#ededed]">Modelos y licencias</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm font-sans-ui" data-testid="licenses-table">
              <tbody>
                {MODELS.map(([m, use, lic]) => (
                  <tr key={m} className="border-t border-[rgba(237,237,237,0.08)] align-top">
                    <td className="py-3 pr-3 text-[#ededed]">{m}<div className="text-xs text-[#85858b] mt-0.5">{use}</div></td>
                    <td className="py-3 text-[#a1a1a6] text-xs">{lic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[#85858b] font-sans-ui">Para uso comercial habría que sustituir imagen y voz por alternativas con licencia abierta (por ejemplo FLUX.1-schnell y Piper). La arquitectura modular permite cambiar solo los perfiles.</p>
        </div>
      </div>
    </main>
  );
}
