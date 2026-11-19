import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Share2, FileDown, Trash2, Copy, Link2Off, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, formatApiError, downloadPdf } from "@/lib/api";

const ghost = "border-[rgba(237,237,237,0.16)] text-[#ededed] bg-transparent hover:bg-[#232325]";

export function StoryActions({ story, onChange }) {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const done = story.status === "done";
  const link = story.share_token ? `${window.location.origin}/s/${story.share_token}` : "";
  const fail = (e) => toast.error(formatApiError(e.response?.data?.detail));

  const toggleFav = async () => {
    try {
      const { data } = await api.patch(`/stories/${story.id}`, { favorite: !story.favorite });
      onChange(data);
      toast.success(data.favorite ? "Agregado a favoritos" : "Quitado de favoritos");
    } catch (e) { fail(e); }
  };
  const share = async () => {
    try {
      const { data } = await api.post(`/stories/${story.id}/share`);
      onChange({ ...story, share_token: data.share_token });
      setShareOpen(true);
    } catch (e) { fail(e); }
  };
  const unshare = async () => {
    try {
      await api.delete(`/stories/${story.id}/share`);
      onChange({ ...story, share_token: null });
      setShareOpen(false);
      toast.success("Enlace desactivado");
    } catch (e) { fail(e); }
  };
  const pdf = async () => {
    setPdfLoading(true);
    try { await downloadPdf(`/stories/${story.id}/pdf`, story.title); } catch { toast.error("No se pudo generar el PDF"); }
    setPdfLoading(false);
  };
  const remove = async () => {
    try {
      await api.delete(`/stories/${story.id}`);
      toast.success("Cuento eliminado");
      navigate("/library");
    } catch (e) { fail(e); }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button data-testid="story-favorite-button" size="sm" variant="outline" onClick={toggleFav} className={ghost}>
        <Heart className={`h-4 w-4 mr-1 ${story.favorite ? "fill-[#ededed] text-[#ededed]" : ""}`} strokeWidth={1.5} /> Favorito
      </Button>
      <Button data-testid="story-share-button" size="sm" variant="outline" onClick={share} disabled={!done} className={ghost}>
        <Share2 className="h-4 w-4 mr-1" strokeWidth={1.5} /> Compartir
      </Button>
      <Button data-testid="story-pdf-button" size="sm" variant="outline" onClick={pdf} disabled={!done || pdfLoading} className={ghost}>
        {pdfLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" strokeWidth={1.5} /> : <FileDown className="h-4 w-4 mr-1" strokeWidth={1.5} />} PDF
      </Button>
      <Button data-testid="story-delete-button" size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} disabled={story.status === "generating"} className="text-[#a1a1a6] hover:text-[#e5484d] hover:bg-[#232325]">
        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
      </Button>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="parchment border-[rgba(237,237,237,0.08)] text-[#ededed]">
          <DialogHeader>
            <DialogTitle className="font-sans-ui text-xl font-medium text-[#ededed]">Compartir cuento</DialogTitle>
            <DialogDescription className="text-[#a1a1a6]">Cualquier persona con este enlace podrá leer y escuchar el cuento, sin cuenta. Solo funciona mientras tu servidor esté encendido y accesible en la red.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <input data-testid="share-link-input" readOnly value={link} className="flex-1 rounded-lg bg-[#232325] border border-[rgba(237,237,237,0.08)] px-3 py-2 text-sm text-[#ededed]" />
            <Button data-testid="share-copy-button" onClick={() => { navigator.clipboard?.writeText(link); toast.success("Enlace copiado"); }} className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415]">
              <Copy className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
          <Button data-testid="share-disable-button" variant="ghost" onClick={unshare} className="text-[#a1a1a6] hover:text-[#e5484d] hover:bg-[#232325] justify-start">
            <Link2Off className="h-4 w-4 mr-2" strokeWidth={1.5} /> Desactivar enlace
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="parchment border-[rgba(237,237,237,0.08)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans-ui text-[#ededed]">¿Borrar este cuento?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a1a1a6]">Se eliminarán sus ilustraciones y audios. No se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-cancel-button" className="bg-transparent border-[rgba(237,237,237,0.16)] text-[#ededed] hover:bg-[#232325]">Cancelar</AlertDialogCancel>
            <AlertDialogAction data-testid="delete-confirm-button" onClick={remove} className="bg-[#e5484d] hover:bg-[#d63d42] text-white">Borrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
