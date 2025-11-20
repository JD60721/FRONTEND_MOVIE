import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../components/ui.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/movies", { replace: true });
  }, []);

  async function doLogin() {
    setError("");
    const validEmail = /.+@.+\..+/.test(email.trim());
    const validPassword = typeof password === "string" && password.length >= 6;
    if (!validEmail) return setError("Email inválido");
    if (!validPassword) return setError("La contraseña debe tener al menos 6 caracteres");
    try {
      const r = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await r.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/movies", { replace: true });
      } else {
        setError(data.error === "invalid_credentials" ? "Credenciales inválidas" : "Error de autenticación");
      }
    } catch {
      setError("Error de autenticación");
    }
  }

  async function doRegister() {
    setError("");
    const validEmail = /.+@.+\..+/.test(email.trim());
    const validPassword = typeof password === "string" && password.length >= 6;
    if (!validEmail) return setError("Email inválido");
    if (!validPassword) return setError("La contraseña debe tener al menos 6 caracteres");
    try {
      const r = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });
      const data = await r.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/movies", { replace: true });
      } else {
        setError(data.error === "email_exists" ? "El correo ya está registrado" : "Error al registrar");
      }
    } catch {
      setError("Error de registro");
    }
  }

  return (
    <div className="full">
      <div className="auth-card">
        <div className="auth-header">Api Externa • Acceso</div>
        <div className="auth-body">
          {error && <div className="alert">{error}</div>}
          <div className="spacer" />
          {mode === "login" ? (
            <>
              <Input value={email} onChange={setEmail} placeholder="Email" type="email" />
              <div className="spacer" />
              <Input value={password} onChange={setPassword} placeholder="Contraseña" type="password" />
              <div className="spacer" />
              <div className="auth-actions">
                <Button onClick={() => setMode("register")}>Crear cuenta</Button>
                <Button onClick={doLogin}>Iniciar sesión</Button>
              </div>
            </>
          ) : (
            <>
              <Input value={name} onChange={setName} placeholder="Nombre" />
              <div className="spacer" />
              <Input value={email} onChange={setEmail} placeholder="Email" type="email" />
              <div className="spacer" />
              <Input value={password} onChange={setPassword} placeholder="Contraseña (min 6)" type="password" />
              <div className="spacer" />
              <div className="auth-actions">
                <Button onClick={() => setMode("login")}>Iniciar sesión</Button>
                <Button onClick={doRegister}>Registrar</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}