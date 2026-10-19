import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Vehicle = {
  id: string;
  name: string;
  version: string;
  price: string;
  year: string;
  km: string;
  imageUrl?: string;
  tone: "silver" | "white" | "pearl";
};

const previewVehicles: Vehicle[] = [
  { id: "preview-creta", name: "Hyundai Creta", version: "1.0 T GDI Platinum Auto", price: "R$ 114.990", year: "2024", km: "70.000 km", tone: "silver" },
  { id: "preview-audi", name: "Audi A1", version: "1.8 Ambition Sportback S Tronic", price: "R$ 99.990", year: "2018", km: "91.000 km", tone: "white" },
  { id: "preview-hrv", name: "Honda HR-V", version: "1.5 Turbo Advance CVT", price: "R$ 154.900", year: "2025", km: "22.000 km", tone: "pearl" },
];

function formatPrice(value: number | null) {
  if (value === null) return "Consulte o preço";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function formatKm(value: number | null) {
  return value === null ? "Quilometragem não informada" : `${value.toLocaleString("pt-BR")} km`;
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!hasSupabaseConfig) {
    return process.env.NEXT_PUBLIC_USE_PREVIEW_DATA === "true" ? previewVehicles : [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, make, model, version, price, model_year, mileage, primary_image_url")
    .eq("status", "available")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data) {
    console.error("Unable to load featured vehicles", error);
    return [];
  }

  return data.map((vehicle, index) => ({
    id: vehicle.id,
    name: `${vehicle.make} ${vehicle.model}`,
    version: vehicle.version ?? "Versão não informada",
    price: formatPrice(vehicle.price),
    year: vehicle.model_year ? String(vehicle.model_year) : "Ano não informado",
    km: formatKm(vehicle.mileage),
    imageUrl: vehicle.primary_image_url ?? undefined,
    tone: (["silver", "white", "pearl"] as const)[index % 3],
  }));
}
