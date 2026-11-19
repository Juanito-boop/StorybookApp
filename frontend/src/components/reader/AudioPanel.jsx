import React from "react";
import { Play, Pause, Square, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const fmt = (s) => `${Math.floor((s || 0) / 60)}:${String(Math.floor((s || 0) % 60)).padStart(2, "0")}`;

const STATUS = { playing: "reproduciendo", paused: "en pausa", idle: "lista" };

function VolumeRow({ label, value, onChange, testId }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-sans-ui text-[#85858b] w-20">{label}</span>
      {value === 0 ? <VolumeX className="h-4 w-4 text-[#85858b]" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4 text-[#85858b]" strokeWidth={1.5} />}
      <Slider data-testid={testId} value={[value]} min={0} max={1} step={0.05} onValueChange={(v) => onChange(v[0])} />
      <span className="text-xs font-sans-ui text-[#85858b] w-10 text-right tabular-nums">{Math.round(value * 100)}%</span>
    </div>
  );
}

export function AudioPanel({ audio, scene }) {
  if (!audio.ready) {
    return (
      <div data-testid="audio-pending" className="rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 p-4 flex items-center gap-2 text-sm font-sans-ui text-[#a1a1a6]">
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Voz y ambiente en preparación
      </div>
    );
  }

  const playing = audio.state === "playing";

  return (
    <div className="rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 p-4 space-y-4">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-sans-ui text-[#ededed]">
            Narración <span data-testid="voice-status" className="text-[#85858b] text-xs">({STATUS[audio.state]})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-testid={playing ? "voice-pause-button" : "voice-play-button"}
              size="sm"
              onClick={playing ? audio.pause : audio.play}
              className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] h-8 px-3"
            >
              {playing ? <Pause className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> : <Play className="h-4 w-4 mr-1.5" strokeWidth={1.5} />}
              {playing ? "Pausar" : audio.state === "paused" ? "Reanudar" : "Reproducir"}
            </Button>
            <Button data-testid="voice-stop-button" size="sm" variant="ghost" onClick={audio.stop} className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 w-8 p-0" aria-label="Detener narración">
              <Square className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs font-sans-ui text-[#85858b]">
          <span className="w-9 tabular-nums">{fmt(audio.time)}</span>
          <Slider data-testid="voice-seek-slider" value={[audio.time]} min={0} max={audio.duration || 1} step={0.1} onValueChange={(v) => audio.seek(v[0])} />
          <span className="w-9 text-right tabular-nums">{fmt(audio.duration)}</span>
        </div>
      </div>

      <div className="border-t border-[rgba(237,237,237,0.08)] pt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-sans-ui text-[#ededed]">
            Ambiente <span data-testid="ambient-name" className="text-[#85858b] text-xs">· {scene.sound_name}</span>
          </div>
          <Button
            data-testid="ambient-toggle-button"
            size="sm"
            variant="outline"
            onClick={audio.toggleAmbient}
            className={audio.ambientOn ? "border-[rgba(237,237,237,0.24)] text-[#ededed] bg-[#232325] hover:bg-[#2a2a2c] h-8 px-3" : "border-[rgba(237,237,237,0.16)] text-[#a1a1a6] bg-transparent hover:bg-[#232325] hover:text-[#ededed] h-8 px-3"}
          >
            {audio.ambientOn ? <><Pause className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> Detener</> : <><Play className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> Reproducir</>}
          </Button>
        </div>
        <div className="space-y-3">
          <VolumeRow label="Narración" value={audio.voiceVolume} onChange={audio.setVoiceVolume} testId="voice-volume-slider" />
          <VolumeRow label="Ambiente" value={audio.ambientVolume} onChange={audio.setAmbientVolume} testId="ambient-volume-slider" />
        </div>
      </div>
    </div>
  );
}
