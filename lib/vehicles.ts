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

export type PopularBrand = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  symbol: string;
};

const previewVehicles: Vehicle[] = [
  { id: "preview-creta", name: "Hyundai Creta", version: "1.0 T GDI Platinum Auto", price: "R$ 114.990", year: "2024", km: "70.000 km", tone: "silver" },
  { id: "preview-audi", name: "Audi A1", version: "1.8 Ambition Sportback S Tronic", price: "R$ 99.990", year: "2018", km: "91.000 km", tone: "white" },
  { id: "preview-hrv", name: "Honda HR-V", version: "1.5 Turbo Advance CVT", price: "R$ 154.900", year: "2025", km: "22.000 km", tone: "pearl" },
];

const previewBrands: PopularBrand[] = [
  { id: "preview-vw", name: "Volkswagen", slug: "volkswagen", symbol: "VW" },
  { id: "preview-fiat", name: "Fiat", slug: "fiat", symbol: "FIAT" },
  { id: "preview-toyota", name: "Toyota", slug: "toyota", symbol: "TOYOTA" },
  { id: "preview-chevrolet", name: "Chevrolet", slug: "chevrolet", symbol: "＋" },
  { id: "preview-jeep", name: "Jeep", slug: "jeep", symbol: "JEEP" },
  { id: "preview-hyundai", name: "Hyundai", slug: "hyundai", symbol: "H" },
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

function slugifyBrand(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getPopularBrands(): Promise<PopularBrand[]> {
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!hasSupabaseConfig) {
    return process.env.NEXT_PUBLIC_USE_PREVIEW_DATA === "true" ? previewBrands : [];
  }

  const supabase = await createSupabaseServerClient();
  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicles")
    .select("make")
    .eq("status", "available")
    .eq("is_published", true);

  if (vehiclesError || !vehicles?.length) return [];

  const publishedSlugs = new Set(vehicles.map((vehicle) => slugifyBrand(vehicle.make)));
  const { data: brands, error: brandsError } = await supabase
    .from("vehicle_brands")
    .select("id, name, slug, logo_url, sort_order")
    .eq("is_active", true)
    .in("slug", [...publishedSlugs])
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (brandsError || !brands) return [];

  return brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logoUrl: brand.logo_url ?? undefined,
    symbol: brand.name.slice(0, 2).toUpperCase(),
  }));
}
