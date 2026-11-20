import React from "react";
import { Play, Pause, Square, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const fmt = (s) => `${Math.floor((s || 0) / 60)}:${String(Math.floor((s || 0) % 60)).padStart(2, "0")}`;

const STATUS = { playing: "reproduciendo", paused: "en pausa", idle: "lista" };

const SHELL = "rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 p-3 sm:p-4 min-h-[196px] sm:min-h-[108px] lg:min-h-[64px]";

function Divider() {
  return <span aria-hidden="true" className="hidden h-8 w-px shrink-0 bg-[rgba(237,237,237,0.08)] lg:block" />;
}

function VolumeRow({ value, onChange, testId, ariaLabel }) {
  const Icon = value === 0 ? VolumeX : Volume2;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-2">
      <Icon className="h-4 w-4 shrink-0 text-[#85858b]" strokeWidth={1.5} />
      <Slider
        data-testid={testId}
        aria-label={ariaLabel}
        value={[value]}
        min={0}
        max={1}
        step={0.05}
        onValueChange={(v) => onChange(v[0])}
        className="min-w-0 flex-1 sm:w-24 sm:flex-none lg:w-24"
      />
      <span className="w-9 shrink-0 text-right text-xs font-sans-ui tabular-nums text-[#85858b]">{Math.round(value * 100)}%</span>
    </div>
  );
}

export function AudioPanel({ audio, scene }) {
  if (!audio.ready) {
    return (
      <div data-testid="audio-pending" className={`${SHELL} flex items-center gap-2 text-sm font-sans-ui text-[#a1a1a6]`}>
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Voz y ambiente en preparación
      </div>
    );
  }

  const playing = audio.state === "playing";

  return (
    <div className={SHELL}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-3 lg:flex-nowrap">
        {/* Transporte de la narración */}
        <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-4">
          <div className="text-sm font-sans-ui text-[#ededed]">
            Narración <span data-testid="voice-status" className="text-xs text-[#85858b]">({STATUS[audio.state]})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-testid={playing ? "voice-pause-button" : "voice-play-button"}
              size="sm"
              onClick={playing ? audio.pause : audio.play}
              className="h-10 px-3 bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] sm:h-8"
            >
              {playing ? <Pause className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> : <Play className="h-4 w-4 mr-1.5" strokeWidth={1.5} />}
              {playing ? "Pausar" : audio.state === "paused" ? "Reanudar" : "Reproducir"}
            </Button>
            <Button
              data-testid="voice-stop-button"
              size="sm"
              variant="ghost"
              onClick={audio.stop}
              className="h-10 w-10 p-0 text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] sm:h-8 sm:w-8"
              aria-label="Detener narración"
            >
              <Square className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Posición de la narración: único elemento que crece */}
        <div className="flex w-full items-center gap-3 text-xs font-sans-ui text-[#85858b] sm:w-auto sm:flex-1 lg:min-w-[160px]">
          <span className="w-9 shrink-0 tabular-nums">{fmt(audio.time)}</span>
          <Slider
            data-testid="voice-seek-slider"
            aria-label="Posición de la narración"
            aria-valuetext={`${fmt(audio.time)} de ${fmt(audio.duration)}`}
            value={[audio.time]}
            min={0}
            max={audio.duration || 1}
            step={0.1}
            onValueChange={(v) => audio.seek(v[0])}
            className="min-w-0 flex-1"
          />
          <span className="w-9 shrink-0 text-right tabular-nums">{fmt(audio.duration)}</span>
        </div>

        <Divider />

        {/* Ambiente y volúmenes: en dos filas desde sm, apilados en móvil */}
        <div className="flex flex-col gap-3 sm:w-full sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:w-auto lg:justify-start">
          <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-4">
            <div className="text-sm font-sans-ui text-[#ededed]">
              Ambiente <span data-testid="ambient-name" className="text-xs text-[#85858b]">· {scene.sound_name}</span>
            </div>
            <Button
              data-testid="ambient-toggle-button"
              size="sm"
              variant="outline"
              onClick={audio.toggleAmbient}
              className={`h-10 px-3 sm:h-8 ${audio.ambientOn
                ? "border-[rgba(237,237,237,0.24)] text-[#ededed] bg-[#232325] hover:bg-[#2a2a2c]"
                : "border-[rgba(237,237,237,0.16)] text-[#a1a1a6] bg-transparent hover:bg-[#232325] hover:text-[#ededed]"}`}
            >
              {audio.ambientOn
                ? <><Pause className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> Detener</>
                : <><Play className="h-4 w-4 mr-1.5" strokeWidth={1.5} /> Reproducir</>}
            </Button>
          </div>

          <Divider />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <VolumeRow value={audio.voiceVolume} onChange={audio.setVoiceVolume} testId="voice-volume-slider" ariaLabel="Volumen de narración" />
            <VolumeRow value={audio.ambientVolume} onChange={audio.setAmbientVolume} testId="ambient-volume-slider" ariaLabel="Volumen del ambiente" />
          </div>
        </div>
      </div>
    </div>
  );
}
