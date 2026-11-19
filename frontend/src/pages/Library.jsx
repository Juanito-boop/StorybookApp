import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Search, Heart } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { GENRE_LIST } from "@/lib/genres";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LibraryCard } from "@/components/LibraryCard";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Library() {
  const [stories, setStories] = useState(null);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = (quiet) => {
    setError(false);
    if (!quiet) setStories(null);
    api.get("/stories").then(({ data }) => setStories(data)).catch(() => setError(true));
  };

  useEffect(() => { load(); }, []);

  const pending = stories?.some((s) => ["queued", "generating"].includes(s.status));
  useEffect(() => {
    if (!pending) return undefined;
    const t = setInterval(() => load(true), 4000);
    return () => clearInterval(t);
  }, [pending]);

  const visible = useMemo(() => (stories || []).filter((s) =>
    (!favOnly || s.favorite) && (!genre || s.genre === genre) &&
    (!q || `${s.title} ${s.idea}`.toLowerCase().includes(q.toLowerCase()))), [stories, favOnly, genre, q]);

  const toggleFav = async (s) => {
    try {
      const { data } = await api.patch(`/stories/${s.id}`, { favorite: !s.favorite });
      setStories((list) => list.map((x) => (x.id === s.id ? data : x)));
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
  };
  const remove = async () => {
    try {
      await api.delete(`/stories/${toDelete.id}`);
      setStories((list) => list.filter((x) => x.id !== toDelete.id));
      toast.success("Cuento eliminado");
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    setToDelete(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 sm:py-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-sans-ui text-3xl sm:text-4xl font-medium text-[#ededed]">Biblioteca</h1>
          <p className="font-sans-ui text-base text-[#a1a1a6] mt-2">Tus cuentos guardados en este equipo.</p>
        </div>
        <Link to="/create">
          <Button data-testid="library-new-story-button" className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-10 px-4 rounded-lg">
            Nuevo cuento
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {error && (
          <div data-testid="library-error" className="parchment rounded-xl p-8 text-center">
            <p className="font-sans-ui text-base text-[#ededed]">No se pudo abrir la biblioteca.</p>
            <p className="font-sans-ui text-sm text-[#a1a1a6] mt-2">Comprueba que el servidor esté encendido e inténtalo de nuevo.</p>
            <Button data-testid="library-retry-button" onClick={() => load()} variant="outline" className="mt-4 border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325]">Reintentar</Button>
          </div>
        )}

        {!error && stories === null && (
          <div className="flex items-center gap-2 text-[#a1a1a6] font-sans-ui text-sm"><Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Cargando biblioteca</div>
        )}

        {stories && stories.length === 0 && (
          <div className="parchment rounded-xl p-10 text-center">
            <h2 className="font-sans-ui text-xl font-medium text-[#ededed]">Aún no tienes cuentos guardados</h2>
            <p className="font-sans-ui text-sm text-[#a1a1a6] mt-2">Cuando crees un cuento, aparecerá aquí para que puedas leerlo y editarlo.</p>
            <Link to="/create" className="inline-block mt-6">
              <Button data-testid="library-empty-cta" className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium">Crear un cuento</Button>
            </Link>
          </div>
        )}

        {stories && stories.length > 0 && (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85858b]" strokeWidth={1.5} />
                <Input data-testid="library-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título o idea"
                  className="pl-9 w-64 bg-[#232325] border-[rgba(237,237,237,0.08)] text-[#ededed] placeholder:text-[#85858b]" />
              </div>
              <button data-testid="library-filter-favorites" onClick={() => setFavOnly((v) => !v)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-sans-ui inline-flex items-center gap-2 transition-colors ${favOnly ? "border-[rgba(237,237,237,0.24)] bg-[#232325] text-[#ededed]" : "border-[rgba(237,237,237,0.08)] text-[#a1a1a6] hover:bg-[#232325] hover:text-[#ededed]"}`}>
                <Heart className={`h-4 w-4 ${favOnly ? "fill-[#ededed] text-[#ededed]" : ""}`} strokeWidth={1.5} /> Favoritos
              </button>
              {[{ id: "", name: "Todos" }, ...GENRE_LIST].map((g) => (
                <button key={g.id || "all"} data-testid={`library-filter-genre-${g.id || "all"}`} onClick={() => setGenre(g.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-sans-ui transition-colors ${genre === g.id ? "border-[rgba(237,237,237,0.24)] bg-[#232325] text-[#ededed]" : "border-[rgba(237,237,237,0.08)] text-[#a1a1a6] hover:bg-[#232325] hover:text-[#ededed]"}`}>
                  {g.name}
                </button>
              ))}
            </div>
            {visible.length === 0 && <p data-testid="library-no-results" className="font-sans-ui text-sm text-[#a1a1a6]">Ningún cuento coincide con esos filtros.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((s, i) => (
                <LibraryCard key={s.id} s={s} i={i} onFavorite={() => toggleFav(s)} onDelete={() => setToDelete(s)} />
              ))}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="parchment border-[rgba(237,237,237,0.08)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans-ui text-[#ededed]">¿Borrar «{toDelete?.title}»?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a1a1a6]">Se eliminarán sus ilustraciones y audios. No se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="library-delete-cancel" className="bg-transparent border-[rgba(237,237,237,0.16)] text-[#ededed] hover:bg-[#232325]">Cancelar</AlertDialogCancel>
            <AlertDialogAction data-testid="library-delete-confirm" onClick={remove} className="bg-[#e5484d] hover:bg-[#d63d42] text-white">Borrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
