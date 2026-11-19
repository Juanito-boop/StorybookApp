import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { GENRE_LIST } from "@/lib/genres";
import { api, formatApiError } from "@/lib/api";
import { AdvancedOptions } from "@/components/AdvancedOptions";

const IDEAS = [
  "una niña que colecciona sonidos del bosque",
  "un faro que recuerda a quien no volvió",
  "un robot jardinero en una estación espacial abandonada",
  "un oso que quiere aprender a volar",
];

export default function Create() {
  const [idea, setIdea] = useState("");
  const [genre, setGenre] = useState("fantasia");
  const [loading, setLoading] = useState(false);
  const [sys, setSys] = useState(null);
  const [opts, setOpts] = useState({ profile: "", seed: "", image_steps: 0, temperature: 0.8, consistency: true });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/system").then(({ data }) => { setSys(data); setOpts((o) => ({ ...o, profile: data.default_profile })); }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (idea.trim().length < 3) {
      toast.error("Describe tu idea con al menos 3 caracteres");
      return;
    }
    setLoading(true);
    try {
      const body = { idea: idea.trim(), genre, temperature: opts.temperature, consistency: opts.consistency };
      if (opts.profile) body.profile = opts.profile;
      if (opts.seed !== "") body.seed = Number(opts.seed);
      if (opts.image_steps) body.image_steps = opts.image_steps;
      const { data } = await api.post("/stories", body);
      toast.success("La generación del cuento ha comenzado");
      navigate(`/story/${data.id}`);
    } catch (err) {
      setLoading(false);
      toast.error(formatApiError(err.response?.data?.detail) || "No se pudo iniciar la generación del cuento");
    }
  };

  const activeGenre = GENRE_LIST.find((g) => g.id === genre);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-sans-ui text-3xl font-medium text-[#ededed]">Crear un cuento</h1>
        <p className="font-sans-ui text-sm text-[#a1a1a6] mt-1">
          Escribe una idea y elige un género para generar 5 escenas con texto, imagen, voz y ambiente.
        </p>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="parchment rounded-xl p-5 sm:p-6 space-y-5">
          <div>
            <Label htmlFor="idea" className="text-[#a1a1a6] font-sans-ui text-sm font-normal">Idea del cuento</Label>
            <Textarea
              id="idea"
              data-testid="create-idea-input"
              value={idea}
              maxLength={500}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Quién es el protagonista, qué quiere y qué ocurre"
              rows={4}
              className="mt-2 bg-[#232325] border-[rgba(237,237,237,0.08)] text-[#ededed] font-sans-ui text-base leading-relaxed focus-visible:ring-[#ededed]/20 placeholder:text-[#85858b]"
              disabled={loading}
            />
            <div className="mt-2 flex items-start justify-between gap-3">
              <span className="text-xs text-[#85858b] font-sans-ui tabular-nums">{idea.length}/500</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {IDEAS.map((s, i) => (
                <button type="button" key={s} data-testid={`idea-suggestion-${i + 1}`} onClick={() => setIdea(s)}
                  className="rounded-lg border border-[rgba(237,237,237,0.08)] px-3 py-1.5 text-xs text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] transition-colors text-left">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[#a1a1a6] font-sans-ui text-sm font-normal">Género</Label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GENRE_LIST.map((g) => {
                const active = genre === g.id;
                return (
                  <button
                    type="button"
                    key={g.id}
                    data-testid={`genre-card-${g.id}`}
                    onClick={() => setGenre(g.id)}
                    disabled={loading}
                    className={`text-left rounded-lg p-3 border transition-colors ${
                      active ? "border-[#ededed]/30 bg-[#232325]" : "border-[rgba(237,237,237,0.08)] bg-transparent hover:bg-[#232325] hover:border-[rgba(237,237,237,0.16)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <g.Icon className="h-4 w-4 text-[#a1a1a6]" strokeWidth={1.5} />
                      <div className="font-sans-ui text-sm font-medium text-[#ededed]">{g.name}</div>
                    </div>
                    <div className="font-sans-ui text-xs text-[#85858b] leading-snug mt-1 line-clamp-1">{g.tagline}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <AdvancedOptions sys={sys} opts={opts} setOpts={setOpts} disabled={loading} />

          <div className="pt-1 flex items-center gap-3 flex-wrap">
            <Button type="submit" disabled={loading} data-testid="create-generate-button" className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-10 px-6 rounded-lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.5} />}
              Crear cuento
            </Button>
            <span className="text-sm font-sans-ui text-[#85858b]">5 escenas · texto, imagen, voz y ambiente</span>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="parchment rounded-xl p-5">
            <div className="text-xs font-sans-ui text-[#85858b]">Género seleccionado</div>
            <h3 className="font-sans-ui text-lg font-medium text-[#ededed] mt-1 flex items-center gap-2">
              <activeGenre.Icon className="h-4 w-4 text-[#a1a1a6]" strokeWidth={1.5} />
              {activeGenre.name}
            </h3>
            <p className="font-sans-ui text-sm text-[#a1a1a6] mt-1">{activeGenre.tagline}</p>
            <ol className="mt-4 space-y-2 font-sans-ui text-sm text-[#a1a1a6]">
              {[
                "Título y protagonista",
                "5 escenas con arco narrativo",
                "Ilustración por escena",
                "Narración y ambiente por escena",
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-5 w-5 shrink-0 rounded border border-[rgba(237,237,237,0.08)] bg-[#232325] text-[#85858b] text-xs flex items-center justify-center tabular-nums">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
          {sys && (
            <div data-testid="create-device-info" className="parchment rounded-xl p-4 text-sm font-sans-ui text-[#a1a1a6]">
              <div className="text-[#ededed] font-medium mb-1">Ejecución local</div>
              <span>
                <span className="text-[#ededed]">{sys.device === "cuda" ? sys.gpu : "CPU"}</span>
                {sys.device === "cuda" ? " · generación rápida" : " · puede tardar varios minutos"}
                {sys.queue_size > 0 && ` · en cola: ${sys.queue_size}`}
              </span>
            </div>
          )}
        </aside>
      </form>
    </main>
  );
}
