import React from "react";
import { ChevronDown, Dices } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdvancedOptions({ sys, opts, setOpts, disabled }) {
  const set = (k) => (v) => setOpts((o) => ({ ...o, [k]: v }));
  const profile = sys?.profiles?.[opts.profile];
  const steps = opts.image_steps || profile?.image_steps || 2;

  return (
    <Collapsible className="mt-8 rounded-xl border border-[rgba(237,237,237,0.08)] bg-[#232325]/40">
      <CollapsibleTrigger data-testid="advanced-options-toggle" className="w-full flex items-center justify-between px-4 py-3 text-sm font-sans-ui text-[#a1a1a6] hover:text-[#ededed] transition-colors group">
        <span>Opciones avanzadas</span>
        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" strokeWidth={1.5} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 grid sm:grid-cols-2 gap-5 text-sm font-sans-ui">
        <div>
          <Label className="text-[#a1a1a6] font-normal">Perfil de modelos</Label>
          <div className="mt-2 flex flex-col gap-2">
            {Object.entries(sys?.profiles || {}).map(([id, p]) => {
              const missing = [p.text_model, p.image_model, p.tts_model, p.ip_adapter && p.ip_adapter_model]
                .filter(Boolean)
                .filter((model) => !sys.cached_models?.[model]);
              const minVram = p.min_vram_gb;
              const hardwareUnavailable = minVram && (
                sys.device !== "cuda" || !sys.vram_gb || sys.vram_gb < minVram
              );
              const unavailable = hardwareUnavailable || (sys.offline && missing.length > 0);
              const unavailableReason = hardwareUnavailable
                ? `Requiere GPU NVIDIA con ${minVram} GB de VRAM`
                : missing.length > 0 ? `Faltan modelos: ${missing.join(", ")}` : "";
              return (
                <button type="button" key={id} disabled={disabled || unavailable} data-testid={`profile-option-${id}`} onClick={() => set("profile")(id)}
                  aria-label={unavailable ? `${p.label}: ${unavailableReason}` : p.label}
                  className={`text-left rounded-lg border px-3 py-2 transition-colors ${opts.profile === id ? "border-[rgba(237,237,237,0.24)] bg-[#232325] text-[#ededed]" : "border-[rgba(237,237,237,0.08)] text-[#a1a1a6] hover:bg-[#232325] hover:text-[#ededed]"} ${unavailable ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <div>{p.label}</div>
                  <div className="text-xs text-[#85858b] truncate mt-0.5">{p.text_model.split("/")[1]} · {p.image_model.split("/")[1]}</div>
                  {unavailable && <div className="text-xs text-[#e5484d] mt-1">{unavailableReason}</div>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <Label className="text-[#a1a1a6] font-normal">Semilla (reproducibilidad)</Label>
            <div className="mt-2 flex gap-2">
              <Input data-testid="advanced-seed-input" type="number" min={0} placeholder="aleatoria" value={opts.seed} disabled={disabled}
                onChange={(e) => set("seed")(e.target.value)} className="bg-[#232325] border-[rgba(237,237,237,0.08)] text-[#ededed] placeholder:text-[#85858b]" />
              <button type="button" data-testid="advanced-seed-random" onClick={() => set("seed")(String(Math.floor(Math.random() * 999999)))}
                className="rounded-lg border border-[rgba(237,237,237,0.08)] px-3 text-[#a1a1a6] hover:bg-[#232325] hover:text-[#ededed] transition-colors" aria-label="Semilla aleatoria"><Dices className="h-4 w-4" strokeWidth={1.5} /></button>
            </div>
          </div>
          <div>
            <Label className="text-[#a1a1a6] font-normal">Pasos de difusión: <span className="tabular-nums text-[#ededed]">{steps}</span></Label>
            <Slider data-testid="advanced-steps-slider" className="mt-3" min={1} max={8} step={1} value={[steps]} onValueChange={(v) => set("image_steps")(v[0])} disabled={disabled} />
          </div>
          <div>
            <Label className="text-[#a1a1a6] font-normal">Creatividad del texto (temperatura): <span className="tabular-nums text-[#ededed]">{opts.temperature.toFixed(2)}</span></Label>
            <Slider data-testid="advanced-temperature-slider" className="mt-3" min={0} max={1.3} step={0.05} value={[opts.temperature]} onValueChange={(v) => set("temperature")(v[0])} disabled={disabled} />
          </div>
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-[#a1a1a6]">Estrategia de consistencia<span className="block text-xs text-[#85858b] mt-0.5">personaje, contexto y semilla compartidos</span></span>
            <Switch data-testid="advanced-consistency-switch" checked={opts.consistency} onCheckedChange={set("consistency")} disabled={disabled} />
          </label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
