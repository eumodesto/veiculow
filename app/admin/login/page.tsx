"use client";

import { FormEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "../../globals.css";

export default function AdminLoginPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Entrando...");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setStatus(`Não foi possível entrar: ${error.message}`);
      return;
    }
    window.location.href = "/admin/vendedores";
  }

  return <main className="admin-page"><div className="admin-shell admin-login-shell"><section className="admin-card"><span className="eyebrow"><span /> ADMINISTRAÇÃO</span><h1>Entrar no painel</h1><p>Use o e-mail e a senha cadastrados em Authentication → Users no Supabase.</p><form className="admin-form" onSubmit={handleSubmit}><label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" required /></label><label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button className="button button-primary" type="submit">Entrar</button></form>{status && <p className="admin-status" role="status">{status}</p>}<a className="admin-back-link" href="/">Voltar ao site</a></section></div></main>;
}
