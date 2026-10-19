"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import "../../globals.css";

type Role = "owner" | "manager" | "seller";
type Member = { company_id: string; user_id: string; role: Role };
const roleLabels: Record<Role, string> = { owner: "Dono", manager: "Gerente", seller: "Vendedor" };

export default function PermissionsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;
  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState("Carregando permissões...");

  async function loadMembers() {
    if (!companyId) { setStatus("Configure NEXT_PUBLIC_COMPANY_ID."); return; }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setStatus("Faça login como dono para gerenciar permissões."); return; }
    const { data, error } = await supabase.from("company_members").select("company_id, user_id, role").eq("company_id", companyId).order("created_at");
    if (error) { setStatus(`Não foi possível carregar as permissões: ${error.message}`); return; }
    setMembers((data ?? []) as Member[]);
    setStatus(data?.length ? "" : "Nenhum usuário vinculado a esta empresa.");
  }

  useEffect(() => { void loadMembers(); }, []);

  async function changeRole(userId: string, role: Role) {
    if (!companyId) return;
    setStatus("Salvando permissão...");
    const { error } = await supabase.from("company_members").update({ role }).eq("company_id", companyId).eq("user_id", userId);
    if (error) { setStatus(`Não foi possível alterar: ${error.message}`); return; }
    setMembers((current) => current.map((member) => member.user_id === userId ? { ...member, role } : member));
    setStatus("Permissão atualizada.");
  }

  return <main className="admin-page"><div className="admin-shell"><header className="admin-header"><div><span className="eyebrow"><span /> ADMINISTRAÇÃO</span><h1>Permissões</h1><p>Defina o nível de acesso de cada usuário da empresa.</p></div><a className="button button-secondary" href="/admin">Painel</a></header><section className="admin-card"><div className="admin-card-heading"><div><h2>Níveis de acesso</h2><p><strong>Dono:</strong> acesso total. <strong>Gerente:</strong> operação e estoque. <strong>Vendedor:</strong> seus próprios anúncios.</p></div><ShieldCheck color="var(--brand)" /></div><div className="brand-admin-list">{members.map((member) => <div className="brand-admin-row" key={member.user_id}><div><strong>{member.user_id}</strong><small>Usuário do Supabase</small></div><select className="role-select" value={member.role} onChange={(event) => void changeRole(member.user_id, event.target.value as Role)}>{(Object.keys(roleLabels) as Role[]).map((role) => <option value={role} key={role}>{roleLabels[role]}</option>)}</select></div>)}</div>{status && <p className="admin-status" role="status">{status}</p>}</section></div></main>;
}
