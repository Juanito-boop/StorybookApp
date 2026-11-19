import { Wand2, Compass, Ghost, MapPin, Rocket, Sparkles } from "lucide-react";

export const GENRE_LIST = [
  { id: "fantasia",       name: "Fantasía",        tagline: "Reinos olvidados y magias antiguas",  color: "#a855f7", Icon: Wand2 },
  { id: "misterio",       name: "Misterio",        tagline: "Pistas entre la niebla",              color: "#d97706", Icon: Compass },
  { id: "terror",         name: "Terror",          tagline: "Sombras que susurran",                color: "#dc2626", Icon: Ghost },
  { id: "aventura",       name: "Aventura",        tagline: "Expediciones hacia lo desconocido",   color: "#10b981", Icon: MapPin },
  { id: "ciencia_ficcion",name: "Ciencia Ficción", tagline: "Fronteras cósmicas",                  color: "#0284c7", Icon: Rocket },
  { id: "infantil",       name: "Infantil",        tagline: "Cuentos tiernos para soñar",          color: "#f59e0b", Icon: Sparkles },
];

export const GENRE_BY_ID = Object.fromEntries(GENRE_LIST.map((g) => [g.id, g]));
