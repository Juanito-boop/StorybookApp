import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ArrowLeft, Loader2, Repeat, AlertTriangle, RefreshCw, FileDown, Cpu, Save, Volume2, RotateCcw } from "lucide-react";
import { api, mediaUrl, formatApiError, downloadPdf } from "@/lib/api";
import { GENRE_BY_ID } from "@/lib/genres";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AudioPanel } from "@/components/reader/AudioPanel";
import { GenerationProgress } from "@/components/reader/GenerationProgress";
import { StoryActions } from "@/components/reader/StoryActions";
import { useSceneAudio } from "@/components/reader/useSceneAudio";

function SceneImage({ scene, total }) {
  return (
    <div className="parchment rounded-xl overflow-hidden relative">
      <div className="relative aspect-square overflow-hidden bg-[#232325]" data-testid="reader-illustration">
        {scene?.image && !scene.regenerating ? (
          <img key={scene.image} src={mediaUrl(scene.image)} alt={`Escena ${scene.index}`} className="absolute inset-0 w-full h-full object-cover animate-scene-in" />
        ) : (
          <div className="absolute inset-0 bg-[#232325] flex items-center justify-center">
            <div className="text-[#a1a1a6] font-sans-ui text-sm flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Generando ilustración</div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(237,237,237,0.08)] text-xs font-sans-ui text-[#85858b]">
        <span data-testid="scene-badge" className="tabular-nums">Escena {scene?.index || 1} de {total}</span>
        <span className="tabular-nums">{scene?.index || 1} / {total}</span>
      </div>
    </div>
  );
}

function SceneEditor({ storyId, scene, onStoryChange, refresh }) {
  const [draft, setDraft] = useState(scene.text);
  const [saving, setSaving] = useState(false);
  const [narrating, setNarrating] = useState(false);
  const dirty = draft.trim() !== scene.text;
  const busy = scene.regenerating || scene.audio_regenerating;

  useEffect(() => setDraft(scene.text), [scene.index, scene.text]);

  const saveText = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/stories/${storyId}/scenes/${scene.index}`, { text: draft });
      onStoryChange(data);
      toast.success("Cambios guardados; la versión anterior quedó en el historial.");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  const narrate = async () => {
    setNarrating(true);
    try {
      await api.post(`/stories/${storyId}/scenes/${scene.index}/narrate`);
      await refresh();
      toast.success("Narración agregada a la cola.");
    } catch (e) {
      toast.error(formatApiError(e.response?.data?.detail));
    } finally {
      setNarrating(false);
    }
  };

  return (
    <section className="rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 p-4" data-testid="scene-workshop">
      <label htmlFor={`scene-text-${scene.index}`} className="text-sm text-[#a1a1a6] font-sans-ui">
        Editar texto de la escena
      </label>
      <Textarea
        id={`scene-text-${scene.index}`}
        data-testid="scene-edit-input"
        value={draft}
        maxLength={2000}
        onChange={(e) => setDraft(e.target.value)}
        disabled={busy || saving}
        rows={5}
        className="mt-2 bg-[#232325] border-[rgba(237,237,237,0.08)] text-[#ededed] font-prose text-lg leading-relaxed"
      />
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-[#85858b] font-sans-ui flex-wrap">
        <span className="tabular-nums">{draft.length}/2000 caracteres</span>
        {scene.audio_stale && <span className="text-[#a1a1a6]">La narración corresponde a una versión anterior del texto.</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button data-testid="scene-save-button" size="sm" onClick={saveText} disabled={!dirty || saving || busy}
          className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] disabled:opacity-40">
          {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" strokeWidth={1.5} /> : <Save className="h-4 w-4 mr-1" strokeWidth={1.5} />}
          Guardar texto
        </Button>
        <Button data-testid="scene-narrate-button" size="sm" variant="outline" onClick={narrate}
          disabled={dirty || saving || narrating || busy}
          className="border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325] disabled:opacity-40">
          {narrating || scene.audio_regenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4 mr-1" strokeWidth={1.5} />}
          {scene.audio_regenerating ? "Narrando" : "Actualizar narración"}
        </Button>
      </div>
      {scene.audio_error && <p role="alert" className="mt-2 text-sm text-[#e5484d]">{scene.audio_error}</p>}
      {!!scene.text_versions?.length && (
        <div className="mt-4 border-t border-[rgba(237,237,237,0.08)] pt-3">
          <div className="text-xs text-[#85858b] font-sans-ui">Versiones anteriores</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {scene.text_versions.map((version, index) => (
              <Button key={`${version.saved_at}-${index}`} size="sm" variant="ghost"
                onClick={() => setDraft(version.text)} disabled={busy || saving}
                className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 px-2">
                <RotateCcw className="h-3.5 w-3.5 mr-1" strokeWidth={1.5} /> Restaurar versión {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function StoryReader({ publicToken }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const owner = !publicToken;
  const endpoint = owner ? `/stories/${id}` : `/public/stories/${publicToken}`;

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(endpoint);
      setStory(data);
    } catch {
      toast.error(owner ? "No se encontró ese cuento en tu biblioteca." : "Este enlace no existe o fue desactivado.");
      navigate(owner ? "/library" : "/");
    }
  }, [endpoint, owner, navigate]);

  useEffect(() => { load(); }, [load]);

  const busy = story && (["queued", "generating"].includes(story.status) || story.scenes.some((s) => s.regenerating || s.audio_regenerating));
  useEffect(() => {
    if (!busy) return undefined;
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, [busy, load]);

  const total = 5;
  const available = story?.scenes.length || 0;
  const scene = story?.scenes[sceneIdx];
  const genre = useMemo(() => GENRE_BY_ID[story?.genre] || GENRE_BY_ID.fantasia, [story?.genre]);

  const goNext = useCallback(() => setSceneIdx((i) => Math.min(available - 1, i + 1)), [available]);
  const goPrev = useCallback(() => setSceneIdx((i) => Math.max(0, i - 1)), []);

  const onVoiceEnded = useCallback(() => {
    if (!autoplay) return;
    if (sceneIdx >= total - 1) { setAutoplay(false); toast.success("Fin del cuento"); return; }
    setTimeout(goNext, 1200);
  }, [autoplay, sceneIdx, goNext]);

  const audio = useSceneAudio(scene, { autoplay, onVoiceEnded });

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (e.defaultPrevented || t.closest?.('[role="slider"], input, textarea, button, a, [contenteditable="true"]')) return;
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === " " && audio.ready) { e.preventDefault(); if (audio.state === "playing") audio.pause(); else audio.play(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, audio]);

  const retry = async (profile) => {
    try { await api.post(`/stories/${id}/retry`, profile ? { profile } : {}); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const regen = async () => {
    try { await api.post(`/stories/${id}/scenes/${scene.index}/regenerate`, {}); toast.success("Reilustrando escena"); load(); }
    catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };

  if (!story) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[#a1a1a6] font-sans-ui text-sm"><Loader2 className="h-4 w-4 animate-spin mr-2" strokeWidth={1.5} /> Cargando cuento</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {owner ? (
          <Link to="/library" data-testid="reader-back-to-library" className="inline-flex items-center gap-2 text-[#a1a1a6] hover:text-[#ededed] font-sans-ui text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Biblioteca
          </Link>
        ) : (
          <span data-testid="public-reader-label" className="text-[#a1a1a6] font-sans-ui text-sm">Cuento compartido</span>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg border border-[rgba(237,237,237,0.08)] bg-[#232325] text-xs font-sans-ui text-[#a1a1a6] inline-flex items-center gap-1.5">
            <genre.Icon className="h-3.5 w-3.5" strokeWidth={1.5} />{genre.name}
          </span>
          <span className="px-2.5 py-1 rounded-lg border border-[rgba(237,237,237,0.08)] bg-[#232325] text-xs font-sans-ui text-[#85858b] tabular-nums">
            {available}/{total} escenas
          </span>
          {owner ? <StoryActions story={story} onChange={setStory} /> : (
            <Button data-testid="public-pdf-button" size="sm" variant="outline" onClick={() => downloadPdf(`/public/stories/${publicToken}/pdf`, story.title)} className="border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325]">
              <FileDown className="h-4 w-4 mr-1" strokeWidth={1.5} /> PDF
            </Button>
          )}
        </div>
      </div>

      <h1 data-testid="story-title" className="font-sans-ui text-3xl sm:text-4xl font-medium text-[#ededed] leading-tight mt-4">{story.title}</h1>
      {story.protagonist && <p className="font-sans-ui text-sm text-[#a1a1a6] mt-2">Protagonista: {story.protagonist}</p>}

      {busy && story.status !== "done" && <div className="mt-6"><GenerationProgress story={story} /></div>}

      {story.status === "error" && (
        <div data-testid="generation-error" className="mt-6 rounded-xl border border-[#e5484d]/30 bg-[#e5484d]/10 p-5 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-[#e5484d] mt-0.5" strokeWidth={1.5} />
            <div>
              <div className="font-sans-ui text-base font-medium text-[#ededed]">La generación se interrumpió</div>
              <div className="text-sm text-[#a1a1a6] font-sans-ui mt-1 break-all">{story.error}</div>
            </div>
          </div>
          {owner && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button data-testid="generation-retry-button" onClick={() => retry()} className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415]">
                <RefreshCw className="h-4 w-4 mr-1" strokeWidth={1.5} /> Reintentar
              </Button>
              {story.config.profile !== "ligero" && (
                <Button data-testid="generation-retry-light-button" onClick={() => retry("ligero")} variant="outline" className="border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325]">
                  <Cpu className="h-4 w-4 mr-1" strokeWidth={1.5} /> Reintentar con perfil ligero
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {scene ? (
        <div key={sceneIdx} className="mt-8 grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
          <div>
            <SceneImage scene={scene} total={total} />
            {owner && story.status === "done" && (
              <Button data-testid="scene-regenerate-button" size="sm" variant="ghost" onClick={regen} disabled={scene.regenerating} className="mt-3 text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325]">
                {scene.regenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" strokeWidth={1.5} /> : <RefreshCw className="h-4 w-4 mr-1" strokeWidth={1.5} />} Reilustrar esta escena
              </Button>
            )}
          </div>
          <div className="parchment rounded-xl p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <div className="text-xs text-[#85858b] font-sans-ui tabular-nums">Escena {scene.index} de {total}</div>
              <p data-testid="reader-scene-text" className="mt-3 font-prose text-xl sm:text-2xl text-[#ededed] leading-relaxed">{scene.text}</p>
            </div>
            {owner && story.status === "done" && (
              <SceneEditor storyId={story.id} scene={scene} onStoryChange={setStory} refresh={load} />
            )}
            <AudioPanel audio={audio} scene={scene} />
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-sans-ui text-[#ededed]">Reproducción automática</div>
                <div className="text-xs font-sans-ui text-[#85858b]">Narra y pasa a la siguiente escena</div>
              </div>
              <Switch data-testid="autoplay-switch" checked={autoplay} disabled={story.status !== "done"} onCheckedChange={(v) => { setAutoplay(v); if (v) audio.play(); else audio.stopAll(); }} />
            </div>
          </div>
        </div>
      ) : !busy ? null : (
        <div className="mt-8 font-sans-ui text-sm text-[#a1a1a6]">La primera escena aparecerá aquí cuando el modelo termine de escribirla.</div>
      )}

      {available > 0 && (
        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          <Button data-testid="scene-prev-button" onClick={goPrev} disabled={sceneIdx === 0} variant="outline" className="border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325] disabled:opacity-40">
            <ChevronLeft className="h-4 w-4 mr-1" strokeWidth={1.5} /> Anterior
          </Button>
          <div className="flex items-center gap-2" data-testid="scene-indicator">
            {[0, 1, 2, 3, 4].map((i) => {
              const sc = story.scenes[i];
              const active = i === sceneIdx;
              return (
                <button key={i} disabled={!sc} onClick={() => setSceneIdx(i)} data-testid={`scene-dot-${i + 1}`} aria-label={`Ir a escena ${i + 1}`}
                  className={`relative h-12 w-12 rounded-lg overflow-hidden border transition-colors ${active ? "border-[#ededed]/40" : "border-[rgba(237,237,237,0.08)] hover:border-[rgba(237,237,237,0.16)]"} disabled:opacity-30 bg-[#232325]`}>
                  {sc?.image ? <img src={mediaUrl(sc.image)} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-[#85858b] font-sans-ui tabular-nums">{i + 1}</span>}
                  {active && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#ededed]" />}
                </button>
              );
            })}
          </div>
          <Button data-testid="scene-next-button" onClick={goNext} disabled={sceneIdx >= available - 1} className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium disabled:opacity-40">
            Siguiente <ChevronRight className="h-4 w-4 ml-1" strokeWidth={1.5} />
          </Button>
        </div>
      )}

      <p data-testid="reader-provenance-note" className="mt-10 text-xs font-sans-ui text-[#85858b] leading-relaxed max-w-3xl">
        Generado en local: texto con {story.config.text_model}, ilustraciones con {story.config.image_model} (semilla {story.config.seed}
        {story.config.ip_adapter ? ", IP-Adapter" : ""}), voz con {story.config.tts_model} y ambiente sonoro sintetizado proceduralmente.
        Atajos: ← → escenas, espacio reproducir o pausar.
      </p>
    </main>
  );
}
