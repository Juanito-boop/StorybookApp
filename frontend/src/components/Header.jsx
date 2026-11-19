import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navCls = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive ? "text-[#ededed] bg-[#232325]" : "text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325]"
  }`;

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#141415]/95 border-b border-[rgba(237,237,237,0.08)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" data-testid="brand-link">
          <div className="h-8 w-8 rounded-lg border border-[rgba(237,237,237,0.08)] flex items-center justify-center bg-[#19191b]">
            <BookOpen className="h-4 w-4 text-[#a1a1a6]" strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="font-sans-ui text-sm font-medium text-[#ededed]">Storybook</div>
            <div className="text-xs font-sans-ui text-[#85858b]">Cuentos en tu equipo</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 font-sans-ui">
          {user && (
            <>
              <NavLink to="/create" data-testid="nav-create-link" className={navCls}>
                Crear cuento
              </NavLink>
              <NavLink to="/library" data-testid="nav-library-link" className={navCls}>
                Biblioteca
              </NavLink>
              <NavLink to="/experiments" data-testid="nav-experiments-link" className={navCls}>
                Experimentos
              </NavLink>
            </>
          )}
          <NavLink to="/about" data-testid="nav-about-link" className={navCls}>
            Arquitectura
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <span
            data-testid="demo-badge"
            className="hidden sm:inline-flex items-center text-xs font-sans-ui text-[#85858b] border border-[rgba(237,237,237,0.08)] rounded-lg px-2 py-1"
          >
            Local
          </span>
          {user ? (
            <>
              <span data-testid="user-name" className="hidden md:block text-sm font-sans-ui text-[#a1a1a6]">
                {user.name}
              </span>
              <Button
                data-testid="logout-button"
                variant="ghost"
                className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 px-3"
                onClick={async () => { await logout(); navigate("/"); }}
              >
                <LogOut className="h-4 w-4 mr-2" strokeWidth={1.5} /> Salir
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button data-testid="header-login-button" variant="ghost" className="text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#232325] h-8 px-3">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button data-testid="header-register-button" className="bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-8 px-3 rounded-lg">
                  Crear cuenta
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
