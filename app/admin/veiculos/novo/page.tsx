"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "../../../globals.css";

export default function NewVehiclePage() {
  const hasConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const supabase = useMemo(() => hasConfig ? createSupabaseBrowserClient() : null, [hasConfig]);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [sellerWhatsapp, setSellerWhatsapp] = useState("");
  const [status, setStatus] = useState(hasConfig ? "" : "Configure o Supabase para cadastrar veículos.");
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;

  useEffect(() => {
    if (!supabase) return;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) { setStatus("Faça login para cadastrar um veículo."); return; }
      setSellerId(user.id);
      const { data: seller } = await supabase.from("seller_profiles").select("whatsapp").eq("user_id", user.id).maybeSingle();
      if (seller?.whatsapp) setSellerWhatsapp(seller.whatsapp);
    })();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !companyId || !sellerId) { setStatus("Configure a empresa, faça login e cadastre seu perfil de vendedor."); return; }
    const numericPrice = Number(price.replace(/\./g, "").replace(",", "."));
    const { error } = await supabase.from("vehicles").insert({ company_id: companyId, seller_id: sellerId, seller_whatsapp: sellerWhatsapp.trim(), make: make.trim(), model: model.trim(), price: Number.isFinite(numericPrice) ? numericPrice : null, status: "draft", is_published: false });
    if (error) setStatus(error.message); else setStatus("Anúncio salvo como rascunho.");
  }

  return <main className="admin-page"><div className="admin-shell"><header className="admin-header"><div><span className="eyebrow"><span /> NOVO ANÚNCIO</span><h1>Cadastrar veículo</h1><p>O WhatsApp do vendedor é preenchido automaticamente, mas pode ser editado neste anúncio.</p></div><a className="button button-secondary" href="/"><ArrowLeft size={17} /> Voltar</a></header><section className="admin-card"><form className="admin-form vehicle-form" onSubmit={handleSubmit}><label>Marca<input value={make} onChange={(event) => setMake(event.target.value)} placeholder="Toyota" required /></label><label>Modelo<input value={model} onChange={(event) => setModel(event.target.value)} placeholder="Hilux CD SRX" required /></label><label>Preço<input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="207.800" /></label><label className="seller-whatsapp-field">WhatsApp do vendedor<input value={sellerWhatsapp} onChange={(event) => setSellerWhatsapp(event.target.value)} placeholder="(83) 99999-9999" required /><small>Preenchido pelo cadastro do vendedor. Editável para este anúncio.</small></label><button className="button button-primary" type="submit"><Save size={18} /> Salvar rascunho</button></form>{status && <p className="admin-status">{status}</p>}</section></div></main>;
}
