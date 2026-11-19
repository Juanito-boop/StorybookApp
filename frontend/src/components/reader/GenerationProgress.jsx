import React from "react";
import { Check, Loader2 } from "lucide-react";

function Step({ done, active, label }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-sans-ui ${done ? "text-[#ededed]" : active ? "text-[#a1a1a6]" : "text-[#85858b]"}`}>
      {done ? <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} /> : <span className="h-3.5 w-3.5 inline-block" />}
      {label}
    </span>
  );
}

export function GenerationProgress({ story }) {
  const pct = Math.round((story.progress / story.total_steps) * 100);
  const scenes = story.scenes || [];
  return (
    <div data-testid="generation-progress" className="parchment rounded-xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div data-testid="generation-stage" className="font-sans-ui text-base font-medium text-[#ededed]">
            {story.status === "queued" ? `En cola · posición ${story.queue_position || 1}` : story.stage}
          </div>
          <div className="text-sm font-sans-ui text-[#a1a1a6] mt-1">Generando localmente con modelos abiertos. Puedes salir y volver más tarde.</div>
        </div>
        <div data-testid="generation-percent" className="font-sans-ui text-2xl text-[#ededed] tabular-nums">{pct}%</div>
      </div>
      <div className="mt-4 h-1.5 bg-[#232325] rounded-full overflow-hidden">
        <div className="h-full bg-[#ededed]/70 transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((i) => {
          const sc = scenes[i];
          const textDone = !!sc;
          const imageDone = !!sc?.image;
          const audioDone = !!sc?.audio;
          const textActive = !textDone && scenes.length === i && story.status !== "queued";
          const imageActive = textDone && !imageDone;
          const audioActive = imageDone && !audioDone;
          return (
            <div key={i} className="rounded-lg border border-[rgba(237,237,237,0.08)] bg-[#232325]/40 px-3 py-2">
              <div className="text-xs font-sans-ui text-[#a1a1a6] mb-2 tabular-nums">Escena {i + 1}</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Step done={textDone} active={textActive} label="texto" />
                <Step done={imageDone} active={imageActive} label="imagen" />
                <Step done={audioDone} active={audioActive} label="audio" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
