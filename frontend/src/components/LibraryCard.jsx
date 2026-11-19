import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { mediaUrl } from "@/lib/api";
import { GENRE_BY_ID } from "@/lib/genres";

function StatusBadge({ s }) {
  if (s.status === "done") return <span className="text-[#a1a1a6]">5 escenas</span>;
  if (s.status === "error") return <span className="text-[#e5484d] inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} /> Error</span>;
  return (
    <span className="text-[#a1a1a6] inline-flex items-center gap-1.5 tabular-nums">
      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} /> {s.status === "queued" ? "En cola" : `${Math.round((s.progress / s.total_steps) * 100)}%`}
    </span>
  );
}

export function LibraryCard({ s, i, onFavorite, onDelete }) {
  const g = GENRE_BY_ID[s.genre] || GENRE_BY_ID.fantasia;
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };
  return (
    <Link to={`/story/${s.id}`} data-testid={`library-card-${i + 1}`}
      className="group book-card parchment rounded-xl overflow-hidden relative block">
      <div className="relative aspect-[5/3] overflow-hidden bg-[#232325]">
        {s.cover ? (
          <img src={mediaUrl(s.cover)} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#232325]" />
        )}
        <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md border border-[rgba(237,237,237,0.08)] bg-[#19191b]/90 text-[#a1a1a6] font-sans-ui inline-flex items-center gap-1.5">
          <g.Icon className="h-3.5 w-3.5" strokeWidth={1.5} />{g.name}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button data-testid={`library-card-fav-${i + 1}`} onClick={stop(onFavorite)} aria-label="Favorito"
            className="h-8 w-8 rounded-lg bg-[#19191b]/90 border border-[rgba(237,237,237,0.08)] flex items-center justify-center text-[#a1a1a6] hover:text-[#ededed] transition-colors">
            <Heart className={`h-4 w-4 ${s.favorite ? "fill-[#ededed] text-[#ededed]" : ""}`} strokeWidth={1.5} />
          </button>
          {s.status !== "generating" && (
            <button data-testid={`library-card-delete-${i + 1}`} onClick={stop(onDelete)} aria-label="Borrar"
              className="h-8 w-8 rounded-lg bg-[#19191b]/90 border border-[rgba(237,237,237,0.08)] flex items-center justify-center text-[#a1a1a6] hover:text-[#e5484d] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-sans-ui text-base font-medium text-[#ededed] leading-snug line-clamp-2">{s.title}</h3>
        <p className="font-sans-ui text-sm text-[#a1a1a6] mt-1 line-clamp-2">{s.idea}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-sans-ui">
          <StatusBadge s={s} />
          <span className="text-[#85858b]">{s.status === "done" ? "Leer cuento" : "Ver avance"}</span>
        </div>
      </div>
    </Link>
  );
}
