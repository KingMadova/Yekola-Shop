// Import de la liste de prix (JSON nettoyé) vers la table `products`.
// Essai à blanc :  node --env-file=.env.local scripts/import-products.mjs liste-prix.json
// Pour écrire :    node --env-file=.env.local scripts/import-products.mjs liste-prix.json --apply
// Format attendu : { products: [...] } ou tableau d'objets { code, name, category, pricePublic, priceVip }
//   + facultatif : slug, shortDesc, healthGoals[], benefits[], duration, usageAdvice, isBestSeller, isPack, sortOrder
// Variables : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (clé secrète : jamais dans le dépôt).
// Ne touche ni aux photos ni aux promos des produits existants.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const CATEGORIES = ["Combo / Packs", "Boissons", "Produits de la Ruche", "Compléments Alimentaires",
  "Gestion du Poids", "Soins Personnels", "Soins de la Peau"];
const slugify = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error("Usage : node --env-file=.env.local scripts/import-products.mjs fichier.json [--apply]");
  process.exit(1);
}
const input = JSON.parse(readFileSync(file, "utf8"));
const items = Array.isArray(input) ? input : input.products;
if (!Array.isArray(items)) { console.error("Le JSON doit être un tableau (ou { products: [...] })."); process.exit(1); }

const rows = [];
const errors = [];
items.forEach((item, index) => {
  const price = Math.round(Number(item.pricePublic ?? item.price));
  const vipPrice = Math.round(Number(item.priceVip));
  const problems = [];
  if (!item.code) problems.push("code manquant");
  if (!item.name) problems.push("nom manquant");
  if (!CATEGORIES.includes(item.category)) problems.push(`catégorie inconnue (${item.category})`);
  if (!Number.isFinite(price) || price <= 0) problems.push("prix public invalide");
  if (!Number.isFinite(vipPrice) || vipPrice <= 0 || vipPrice > price) problems.push("prix client privilégié invalide");
  if (problems.length) { errors.push(`#${index + 1} ${item.code ?? item.name ?? "?"} : ${problems.join(", ")}`); return; }
  rows.push({
    code: String(item.code), slug: item.slug ?? slugify(item.name), name: item.name, category: item.category,
    price_public: price, price_vip: vipPrice, is_active: true,
    short_desc: item.shortDesc ?? "", health_goals: item.healthGoals ?? [],
    benefits: item.benefits ?? [], duration: item.duration ?? null, usage_advice: item.usageAdvice ?? null,
    is_best_seller: item.isBestSeller === true, is_pack: item.isPack === true, sort_order: item.sortOrder ?? 0,
  });
});

console.log(`${rows.length} produit(s) valide(s), ${errors.length} erreur(s).`);
errors.forEach((message) => console.log("  ✗", message));
if (!flags.includes("--apply")) { console.log("Essai à blanc : ajoutez --apply pour écrire dans la base."); process.exit(0); }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis."); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });

let done = 0;
for (const row of rows) {  // ligne par ligne : une colonne absente ne remet jamais une valeur existante à zéro
  const { error } = await supabase.from("products").upsert(row, { onConflict: "code" });
  if (error) console.log(`  ✗ ${row.code} : ${error.message}`); else done += 1;
}
console.log(`${done}/${rows.length} produit(s) écrit(s).`);
