import { useCallback, useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/api";

// Drives narration (WAV from MMS-TTS) + looping ambient (procedural WAV) for one scene.
export function useSceneAudio(scene, { autoplay, onVoiceEnded }) {
  const voice = useRef(null);
  const ambient = useRef(null);
  const endedCb = useRef(onVoiceEnded);
  endedCb.current = onVoiceEnded;

  const [state, setState] = useState("idle"); // idle | playing | paused
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [ambientOn, setAmbientOn] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.35);

  useEffect(() => {
    const v = new Audio();
    const a = new Audio();
    a.loop = true;
    voice.current = v;
    ambient.current = a;
    v.ontimeupdate = () => setTime(v.currentTime);
    v.onloadedmetadata = () => setDuration(v.duration || 0);
    v.onplay = () => setState("playing");
    v.onpause = () => setState(v.ended || v.currentTime === 0 ? "idle" : "paused");
    v.onended = () => { setState("idle"); endedCb.current?.(); };
    return () => { v.pause(); a.pause(); };
  }, []);

  const voiceSrc = scene?.audio ? mediaUrl(scene.audio) : null;
  const ambientSrc = scene?.ambient ? mediaUrl(scene.ambient) : null;

  useEffect(() => {
    const v = voice.current;
    v.pause();
    setTime(0);
    setState("idle");
    if (!voiceSrc) { v.removeAttribute("src"); return; }
    v.src = voiceSrc;
  }, [voiceSrc]);

  useEffect(() => {
    setDuration(scene?.audio_duration || 0);
  }, [scene?.audio_duration]);

  useEffect(() => {
    if (autoplay && voiceSrc) voice.current.play().catch(() => {});
  }, [autoplay, voiceSrc]);

  useEffect(() => {
    const a = ambient.current;
    if (!ambientSrc) { a.pause(); a.removeAttribute("src"); return; }
    const next = ambientSrc;
    if (a.getAttribute("src") !== next && a.src !== next) a.src = next;
    if (ambientOn) { a.play().catch(() => {}); } else { a.pause(); }
  }, [ambientSrc, ambientOn]);

  useEffect(() => {
    if (autoplay && ambientSrc) setAmbientOn(true);
  }, [autoplay, ambientSrc]);

  useEffect(() => { voice.current.volume = voiceVolume; }, [voiceVolume]);
  useEffect(() => { ambient.current.volume = ambientVolume; }, [ambientVolume]);

  const play = useCallback(() => voice.current?.src && voice.current.play().catch(() => {}), []);
  const pause = useCallback(() => voice.current.pause(), []);
  const stop = useCallback(() => {
    voice.current.pause();
    voice.current.currentTime = 0;
    setTime(0);
    setState("idle");
  }, []);
  const seek = useCallback((t) => { voice.current.currentTime = t; setTime(t); }, []);
  const toggleAmbient = useCallback(() => {
    if (!ambient.current?.src && !ambientSrc) return;
    setAmbientOn((v) => !v);
  }, [ambientSrc]);
  const stopAll = useCallback(() => { stop(); ambient.current.pause(); setAmbientOn(false); }, [stop]);

  return {
    ready: Boolean(voiceSrc), state, time, duration, play, pause, stop, seek,
    voiceVolume, setVoiceVolume, ambientOn, toggleAmbient, ambientVolume, setAmbientVolume, stopAll,
  };
}
