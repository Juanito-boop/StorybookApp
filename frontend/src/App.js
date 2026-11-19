import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Create from "@/pages/Create";
import Library from "@/pages/Library";
import StoryReader from "@/pages/StoryReader";
import Experiments from "@/pages/Experiments";
import About from "@/pages/About";
import AppShell from "@/components/AppShell";

function Protected({ children }) {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#a1a1a6] font-sans-ui text-sm">
        Cargando sesión
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicStory() {
  const { token } = useParams();
  return <StoryReader publicToken={token} />;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/create" replace />;
  return children;
}

export default function App() {
  return (
    <div className="App relative">
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
            <Route path="/create" element={<Protected><Create /></Protected>} />
            <Route path="/library" element={<Protected><Library /></Protected>} />
            <Route path="/story/:id" element={<Protected><StoryReader /></Protected>} />
            <Route path="/experiments" element={<Protected><Experiments /></Protected>} />
            <Route path="/about" element={<About />} />
            <Route path="/s/:token" element={<PublicStory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </div>
  );
}
