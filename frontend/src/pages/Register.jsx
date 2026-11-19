import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    const r = await register(name, email, password);
    setLoading(false);
    if (r.ok) {
      toast.success("Cuenta creada");
      navigate("/create");
    } else {
      setError(r.error);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md parchment rounded-xl p-8">
        <div className="mb-8">
          <h1 className="font-sans-ui text-2xl font-medium text-[#ededed]">Crear cuenta</h1>
          <p className="text-sm text-[#a1a1a6] font-sans-ui mt-2">Crea una cuenta para guardar tus cuentos</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#a1a1a6] text-sm font-normal">Nombre</Label>
            <Input id="name" data-testid="register-name-input" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre" className="mt-2 bg-[#232325] border-[rgba(237,237,237,0.08)] focus-visible:ring-[#ededed]/20 text-[#ededed] placeholder:text-[#85858b]" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[#a1a1a6] text-sm font-normal">Correo</Label>
            <Input id="email" data-testid="register-email-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com" className="mt-2 bg-[#232325] border-[rgba(237,237,237,0.08)] focus-visible:ring-[#ededed]/20 text-[#ededed] placeholder:text-[#85858b]" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#a1a1a6] text-sm font-normal">Contraseña</Label>
            <Input id="password" data-testid="register-password-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Al menos 6 caracteres" className="mt-2 bg-[#232325] border-[rgba(237,237,237,0.08)] focus-visible:ring-[#ededed]/20 text-[#ededed] placeholder:text-[#85858b]" />
          </div>
          {error && (
            <div data-testid="register-error" className="text-sm text-[#e5484d] bg-[#e5484d]/10 border border-[#e5484d]/20 rounded-lg px-3 py-2">{error}</div>
          )}
          <Button type="submit" disabled={loading} data-testid="register-submit-button" className="w-full bg-[#ededed] hover:bg-[#d4d4d4] text-[#141415] font-medium h-10 rounded-lg mt-2">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" strokeWidth={1.5} />} Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-sm text-[#a1a1a6] font-sans-ui">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#ededed] hover:underline" data-testid="register-to-login-link">Iniciar sesión</Link>
        </p>
      </div>
    </main>
  );
}
