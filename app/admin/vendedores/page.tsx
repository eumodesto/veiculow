"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "../../globals.css";

type Seller = { id: string; full_name: string; whatsapp: string; is_active: boolean };

export default function SellersAdminPage() {
  const hasConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const supabase = useMemo(() => hasConfig ? createSupabaseBrowserClient() : null, [hasConfig]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState(hasConfig ? "Carregando vendedores..." : "Configure o Supabase para gerenciar vendedores.");
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;

  async function loadSellers() {
    if (!supabase) return;
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      setStatus("Faça login no painel para consultar e cadastrar vendedores.");
      return;
    }
    const { data, error } = await supabase.from("seller_profiles").select("id, full_name, whatsapp, is_active").order("full_name");
    if (error) {
      const message = error.message.toLowerCase();
      setStatus(message.includes("seller_profiles") || message.includes("relation")
        ? "A estrutura de vendedores ainda não foi criada no Supabase. Execute o arquivo supabase/migrations/0003_seller_whatsapp.sql no SQL Editor."
        : `Não foi possível carregar os vendedores: ${error.message}`);
      return;
    }
    setSellers(data ?? []);
    setStatus(data?.length ? "" : "Nenhum vendedor cadastrado. Crie o usuário em Authentication → Users e depois informe o UUID acima.");
  }

  useEffect(() => { if (supabase) void loadSellers(); }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !companyId) { setStatus("Configure NEXT_PUBLIC_COMPANY_ID e o Supabase antes de cadastrar."); return; }
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) { setStatus("Faça login no painel antes de cadastrar um vendedor."); return; }
    setStatus("Salvando vendedor...");
    const { error } = await supabase.from("seller_profiles").insert({ company_id: companyId, user_id: userId.trim(), full_name: fullName.trim(), whatsapp: whatsapp.trim() });
    if (error) {
      const message = error.message.toLowerCase();
      setStatus(message.includes("seller_profiles") || message.includes("relation")
        ? "A estrutura de vendedores ainda não foi criada no Supabase. Execute o arquivo supabase/migrations/0003_seller_whatsapp.sql no SQL Editor."
        : `Não foi possível cadastrar: ${error.message}`);
      return;
    }
    setUserId(""); setFullName(""); setWhatsapp(""); setStatus("Vendedor cadastrado."); await loadSellers();
  }

  return <main className="admin-page"><div className="admin-shell"><header className="admin-header"><div><span className="eyebrow"><span /> ADMINISTRAÇÃO</span><h1>Vendedores</h1><p>Cadastre o WhatsApp de cada vendedor para preencher os anúncios automaticamente.</p></div><div className="admin-header-actions"><a className="button button-secondary" href="/admin/marcas">Marcas</a><a className="button button-secondary" href="/admin/login">Entrar</a></div></header><section className="admin-card"><div className="admin-card-heading"><div><h2>Adicionar vendedor</h2><p>O User ID vem de Authentication → Users no Supabase.</p></div><UserPlus color="var(--brand)" /></div><form className="admin-form seller-form" onSubmit={handleSubmit}><label>User ID do Supabase<input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="UUID do usuário" required /></label><label>Nome completo<input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nome do vendedor" required /></label><label>WhatsApp<input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="(83) 99999-9999" required /></label><button className="button button-primary" type="submit">Cadastrar vendedor</button></form>{status && <p className="admin-status" role="status">{status}</p>}</section><section className="admin-card"><h2>Vendedores cadastrados</h2><div className="brand-admin-list">{sellers.length ? sellers.map((seller) => <div className="brand-admin-row" key={seller.id}><span className="brand-symbol"><Check size={20} /></span><div><strong>{seller.full_name}</strong><small>{seller.whatsapp}</small></div><span className="brand-admin-active">{seller.is_active ? "Ativo" : "Inativo"}</span></div>) : <p className="admin-empty">Nenhum vendedor para exibir ainda.</p>}</div></section></div></main>;
}
