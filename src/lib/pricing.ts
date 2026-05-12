import productFlyers from "@/assets/product-flyers.jpg";
import productPosters from "@/assets/product-posters.jpg";
import productBrochures from "@/assets/product-brochures.jpg";
import productBanners from "@/assets/product-banners.jpg";
import productCalendars from "@/assets/product-calendars.jpg";
import productCertificates from "@/assets/product-certificates.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  sizes: string[];
  startingPrice: number;
  icon: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "flyers",
    name: "Flyers & Leaflets",
    description: "A4, A5, DL — Perfect for promotions and events",
    sizes: ["A4", "A5", "DL"],
    startingPrice: 45,
    icon: "📄",
    image: productFlyers,
    category: "Flyers",
  },
  {
    id: "posters",
    name: "Posters",
    description: "A3 to A0 — Eye-catching wall displays",
    sizes: ["A3", "A2", "A1", "A0"],
    startingPrice: 45,
    icon: "🖼️",
    image: productPosters,
    category: "Posters",
  },
  {
    id: "brochures",
    name: "Brochures",
    description: "Tri-fold, Bi-fold — Professional marketing materials",
    sizes: ["Tri-fold", "Bi-fold"],
    startingPrice: 149,
    icon: "📖",
    image: productBrochures,
    category: "Brochures",
  },
  {
    id: "banners",
    name: "Pull-up Banners",
    description: "850×2000mm — Stand-out at events and expos",
    sizes: ["850×2000mm"],
    startingPrice: 99,
    icon: "🏗️",
    image: productBanners,
    category: "Banners",
  },
  {
    id: "calendars",
    name: "Calendars",
    description: "Wall & Desk — Branded calendars year-round",
    sizes: ["Wall", "Desk"],
    startingPrice: 75,
    icon: "📅",
    image: productCalendars,
    category: "Calendars",
  },
  {
    id: "certificates",
    name: "Certificates",
    description: "Award & Custom — Professional recognition",
    sizes: ["A4", "A3"],
    startingPrice: 65,
    icon: "🏆",
    image: productCertificates,
    category: "Certificates",
  },
];

export const paperTypes = [
  { id: "standard", name: "Standard 90gsm", multiplier: 1 },
  { id: "gloss", name: "Premium 130gsm Gloss", multiplier: 1.15 },
  { id: "matte", name: "170gsm Matte", multiplier: 1.15 },
  { id: "card", name: "350gsm Card", multiplier: 1.3 },
];

export const quantities = [100, 250, 500, 1000];

const basePrices: Record<string, Record<string, Record<number, number>>> = {
  flyers: {
    A5: { 100: 35, 250: 55, 500: 75, 1000: 125 },
    A4: { 100: 45, 250: 65, 500: 89, 1000: 149 },
    DL: { 100: 40, 250: 58, 500: 82, 1000: 138 },
  },
  posters: {
    A3: { 100: 45, 250: 75, 500: 119, 1000: 199 },
    A2: { 100: 65, 250: 99, 500: 159, 1000: 269 },
    A1: { 100: 89, 250: 139, 500: 219, 1000: 369 },
    A0: { 100: 129, 250: 199, 500: 319, 1000: 529 },
  },
  brochures: {
    "Tri-fold": { 100: 149, 250: 199, 500: 279, 1000: 429 },
    "Bi-fold": { 100: 139, 250: 189, 500: 259, 1000: 399 },
  },
  banners: {
    "850×2000mm": { 100: 99, 250: 189, 500: 329, 1000: 599 },
  },
  calendars: {
    Wall: { 100: 75, 250: 129, 500: 219, 1000: 389 },
    Desk: { 100: 85, 250: 149, 500: 249, 1000: 429 },
  },
  certificates: {
    A4: { 100: 65, 250: 99, 500: 159, 1000: 269 },
    A3: { 100: 79, 250: 119, 500: 189, 1000: 319 },
  },
};

export function getBasePrice(productId: string, size: string, quantity: number): number {
  const productPrices = basePrices[productId];
  if (!productPrices) return 0;
  const sizePrices = productPrices[size];
  if (!sizePrices) return 0;
  const qty = quantities.reduce((prev, curr) =>
    Math.abs(curr - quantity) < Math.abs(prev - quantity) ? curr : prev,
  );
  return sizePrices[qty] ?? sizePrices[quantities[0]] ?? 0;
}

export function calculatePrice(params: {
  productId: string;
  size: string;
  quantity: number;
  paperType: string;
  doubleSided: boolean;
  express: boolean;
}): { subtotal: number; gst: number; delivery: number; total: number } {
  let base = getBasePrice(params.productId, params.size, params.quantity);
  const paper = paperTypes.find((p) => p.id === params.paperType);
  if (paper) base *= paper.multiplier;
  if (params.doubleSided) base *= 1.2;
  if (params.express) base *= 1.3;
  const subtotal = Math.round(base * 100) / 100;
  const gst = Math.round(subtotal * 0.1 * 100) / 100;
  const delivery = 12.5;
  const total = Math.round((subtotal + gst + delivery) * 100) / 100;
  return { subtotal, gst, delivery, total };
}

export function getPricingTable(
  productId: string,
): { size: string; prices: Record<number, number> }[] {
  const productPrices = basePrices[productId];
  if (!productPrices) return [];
  return Object.entries(productPrices).map(([size, prices]) => ({
    size,
    prices: prices as Record<number, number>,
  }));
}
