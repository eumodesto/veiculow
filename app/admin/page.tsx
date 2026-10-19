"use client";

import { useEffect, useMemo, useState } from "react";
import { CarFront, ImagePlus, LogIn, ShieldCheck, UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "../globals.css";

export default function AdminDashboardPage() {
  const hasConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const supabase = useMemo(() => hasConfig ? createSupabaseBrowserClient() : null, [hasConfig]);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [supabase]);

  return <main className="admin-page"><div className="admin-shell"><header className="admin-header"><div><span className="eyebrow"><span /> ADMINISTRAÇÃO</span><h1>Painel administrativo</h1><p>Gerencie o estoque, vendedores e marcas da Ponto Auto Veículos.</p></div>{email ? <span className="admin-user"><UserRound size={16} /> {email}</span> : <a className="button button-primary" href="/admin/login"><LogIn size={17} /> Entrar</a>}</header><section className="admin-grid"><a className="admin-card admin-card-link" href="/admin/veiculos/novo"><CarFront size={28} color="var(--brand)" /><h2>Novo veículo</h2><p>Cadastre dados, vendedor, localização e salve o anúncio como rascunho.</p></a><a className="admin-card admin-card-link" href="/admin/vendedores"><UserRound size={28} color="var(--brand)" /><h2>Vendedores</h2><p>Configure o WhatsApp responsável por cada anúncio.</p></a><a className="admin-card admin-card-link" href="/admin/marcas"><ImagePlus size={28} color="var(--brand)" /><h2>Marcas</h2><p>Gerencie logotipos e marcas exibidas no estoque.</p></a><a className="admin-card admin-card-link" href="/admin/permissoes"><ShieldCheck size={28} color="var(--brand)" /><h2>Permissões</h2><p>Defina Dono, Gerente e Vendedor para cada usuário.</p></a></section></div></main>;
}
