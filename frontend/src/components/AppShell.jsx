import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navCls = ({ isActive }) =>
  `flex items-center px-3 py-2 rounded-lg text-sm font-sans-ui transition-colors ${
    isActive ? "text-[#ededed] bg-[#232325]" : "text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325]"
  }`;

function NavLinks({ onNavigate }) {
  const { user } = useAuth();
  return (
    <>
      {user && (
        <>
          <NavLink to="/create" data-testid="nav-create-link" className={navCls} onClick={onNavigate}>Crear cuento</NavLink>
          <NavLink to="/library" data-testid="nav-library-link" className={navCls} onClick={onNavigate}>Biblioteca</NavLink>
          <NavLink to="/experiments" data-testid="nav-experiments-link" className={navCls} onClick={onNavigate}>Experimentos</NavLink>
        </>
      )}
      <NavLink to="/about" data-testid="nav-about-link" className={navCls} onClick={onNavigate}>Arquitectura</NavLink>
    </>
  );
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <header className="lg:hidden sticky top-0 z-40 bg-[#141415]/95 border-b border-[rgba(237,237,237,0.08)]">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2" data-testid="brand-link">
            <div className="h-8 w-8 rounded-lg border border-[rgba(237,237,237,0.08)] flex items-center justify-center bg-[#19191b]">
              <BookOpen className="h-4 w-4 text-[#a1a1a6]" strokeWidth={1.5} />
            </div>
            <span className="font-sans-ui text-sm font-medium text-[#ededed]">Storybook</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[rgba(237,237,237,0.08)] text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325]"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-4 w-4" strokeWidth={1.5} /> : <Menu className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </div>
        {open && (
          <div className="px-4 pb-4 border-t border-[rgba(237,237,237,0.08)]">
            <nav className="pt-3 flex flex-col gap-1">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>
            <div className="mt-3 pt-3 border-t border-[rgba(237,237,237,0.08)] flex items-center justify-between gap-2">
              {user ? (
                <>
                  <span data-testid="user-name" className="text-sm font-sans-ui text-[#a1a1a6] truncate">{user.name}</span>
                  <Button data-testid="logout-button" variant="ghost" className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 px-3" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" strokeWidth={1.5} /> Salir
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-auto">
                  <Link to="/login" onClick={() => setOpen(false)}><Button data-testid="header-login-button" variant="ghost" className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 px-3">Iniciar sesión</Button></Link>
                  <Link to="/register" onClick={() => setOpen(false)}><Button data-testid="header-register-button" className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-8 px-3 rounded-lg">Crear cuenta</Button></Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[rgba(237,237,237,0.08)] sticky top-0 h-screen bg-[#141415]">
          <div className="p-4 border-b border-[rgba(237,237,237,0.08)]">
            <Link to="/" className="flex items-center gap-3" data-testid="brand-link">
              <div className="h-9 w-9 rounded-lg border border-[rgba(237,237,237,0.08)] flex items-center justify-center bg-[#19191b]">
                <BookOpen className="h-4 w-4 text-[#a1a1a6]" strokeWidth={1.5} />
              </div>
              <div className="leading-tight">
                <div className="font-sans-ui text-sm font-medium text-[#ededed]">Storybook</div>
                <div className="text-xs font-sans-ui text-[#85858b]">Cuentos en tu equipo</div>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 flex flex-col gap-1">
            <NavLinks />
          </nav>
          <div className="p-3 border-t border-[rgba(237,237,237,0.08)]">
            <span data-testid="demo-badge" className="inline-flex items-center text-xs font-sans-ui text-[#85858b] border border-[rgba(237,237,237,0.08)] rounded-lg px-2 py-1 mb-3">Local</span>
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <span data-testid="user-name" className="text-sm font-sans-ui text-[#a1a1a6] truncate">{user.name}</span>
                <Button data-testid="logout-button" variant="ghost" className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 w-8 p-0 shrink-0" onClick={handleLogout} aria-label="Salir">
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login"><Button data-testid="header-login-button" variant="ghost" className="w-full justify-start text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-9 px-3">Iniciar sesión</Button></Link>
                <Link to="/register"><Button data-testid="header-register-button" className="w-full bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-9 rounded-lg">Crear cuenta</Button></Link>
              </div>
            )}
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
