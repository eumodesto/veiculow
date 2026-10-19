"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, ImagePlus, Plus, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "../../globals.css";

type Brand = { id: string; name: string; slug: string; logo_url: string | null; is_active: boolean };

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const [status, setStatus] = useState(hasSupabaseConfig ? "Carregando marcas..." : "Configure o Supabase e faça login para gerenciar marcas.");
  const supabase = useMemo(() => hasSupabaseConfig ? createSupabaseBrowserClient() : null, [hasSupabaseConfig]);

  async function loadBrands() {
    if (!supabase) return;
    const { data, error } = await supabase.from("vehicle_brands").select("id, name, slug, logo_url, is_active").order("name");
    if (error) setStatus("Configure o Supabase e faça login para gerenciar marcas.");
    else { setBrands(data ?? []); setStatus(""); }
  }

  useEffect(() => { if (supabase) void loadBrands(); }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;
    if (!companyId) { setStatus("Configure NEXT_PUBLIC_COMPANY_ID antes de cadastrar uma marca."); return; }
    if (!supabase) { setStatus("Configure o Supabase antes de cadastrar uma marca."); return; }
    setStatus("Salvando...");
    const { error } = await supabase.from("vehicle_brands").insert({ company_id: companyId, name: name.trim(), slug: slugify(name), logo_url: logoUrl.trim() || null });
    if (error) { setStatus(error.message); return; }
    setName(""); setLogoUrl(""); setStatus("Marca adicionada."); await loadBrands();
  }

  async function removeBrand(id: string) {
    if (!supabase) return;
    await supabase.from("vehicle_brands").delete().eq("id", id);
    await loadBrands();
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header"><div><span className="eyebrow"><span /> ADMINISTRAÇÃO</span><h1>Logotipos de marcas</h1><p>Cadastre as marcas que podem aparecer no site quando houver veículos publicados.</p></div><a className="button button-secondary" href="/">Voltar ao site</a></header>
        <section className="admin-card">
          <div className="admin-card-heading"><div><h2>Adicionar marca</h2><p>Use uma URL pública para o logotipo. O armazenamento Supabase será conectado na próxima etapa.</p></div><ImagePlus color="var(--brand)" /></div>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>Nome da marca<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Volkswagen" required /></label>
            <label>URL do logotipo<input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} placeholder="https://.../logo.svg" /></label>
            <button className="button button-primary" type="submit"><Plus size={18} /> Adicionar marca</button>
          </form>
          {status && <p className="admin-status">{status}</p>}
        </section>
        <section className="admin-card"><div className="admin-card-heading"><div><h2>Marcas cadastradas</h2><p>Somente marcas com veículos publicados aparecem no site.</p></div></div><div className="brand-admin-list">{brands.map((brand) => <div className="brand-admin-row" key={brand.id}><span className="brand-symbol">{brand.logo_url ? <img src={brand.logo_url} alt="" /> : brand.name.slice(0, 2).toUpperCase()}</span><div><strong>{brand.name}</strong><small>{brand.slug}</small></div><span className="brand-admin-active"><Check size={15} /> Ativa</span><button className="icon-button" type="button" onClick={() => void removeBrand(brand.id)} aria-label={`Excluir ${brand.name}`}><Trash2 size={17} /></button></div>)}</div></section>
      </div>
    </main>
  );
}
