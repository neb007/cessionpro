/**
 * Import batch d'annonces partenaires depuis un fichier JSON
 *
 * Usage:
 *   node scripts/import-batch.js [chemin_json]
 *
 * Par défaut lit docs/riviqo_batch.json
 *
 * Prérequis:
 *   1. Exécuter la migration migrations/20260225_add_partner_import_columns.sql
 *   2. Ajouter SUPABASE_SERVICE_ROLE_KEY dans .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env.local manually (no dotenv dependency)
const envContent = readFileSync(resolve(ROOT, '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const value = trimmed.slice(idx + 1).trim();
  process.env[key] = value;
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || 'nebil007@hotmail.fr';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variables manquantes dans .env.local:');
  if (!SUPABASE_URL) console.error('   - VITE_SUPABASE_URL');
  if (!SERVICE_ROLE_KEY) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nAjoutez SUPABASE_SERVICE_ROLE_KEY dans .env.local');
  console.error('(Supabase Dashboard → Settings → API → service_role key)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Colonnes valides dans la table businesses
const VALID_COLUMNS = new Set([
  'title', 'description', 'sector', 'business_type', 'reason_for_sale',
  'location', 'department', 'region', 'country', 'hide_location',
  'type', 'asking_price', 'annual_revenue', 'ebitda', 'employees',
  'year_founded', 'legal_structure', 'registration_number',
  'lease_info', 'licenses', 'financial_years',
  'market_position', 'competitive_advantages', 'growth_opportunities',
  'customer_base', 'concurrence', 'external_url',
  'images', 'surface_area', 'cession_details',
  'show_cession_details', 'show_surface_area',
  'seller_id', 'status', 'reference_number'
]);

// Champs à supprimer (pas dans le schéma DB)
const FIELDS_TO_REMOVE = new Set([
  'gross_margin', 'operating_income', 'net_income',
  'contract_type'
]);

function generateReference() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `RVQ-${num}`;
}

// Champs numériques dans la table businesses
const NUMERIC_COLUMNS = new Set([
  'asking_price', 'annual_revenue', 'ebitda', 'employees', 'year_founded'
]);

function transformListing(raw, sellerId) {
  const listing = {};

  // Copier les champs valides
  for (const [key, value] of Object.entries(raw)) {
    if (VALID_COLUMNS.has(key) && !FIELDS_TO_REMOVE.has(key)) {
      // Nettoyer les champs numériques : "" → null, string → number
      if (NUMERIC_COLUMNS.has(key)) {
        if (value === '' || value === null || value === undefined) {
          listing[key] = null;
        } else {
          const parsed = Number(value);
          listing[key] = isNaN(parsed) ? null : parsed;
        }
      } else {
        listing[key] = value;
      }
    }
  }

  // url → external_url (le JSON utilise "url", la DB utilise "external_url")
  if (raw.url && !listing.external_url) {
    listing.external_url = raw.url;
  }

  // asking_price_normalized → asking_price (fallback si asking_price est vide)
  if (!listing.asking_price && raw.asking_price_normalized) {
    listing.asking_price = Number(raw.asking_price_normalized) || null;
  }
  if (!listing.annual_revenue && raw.annual_revenue_normalized) {
    listing.annual_revenue = Number(raw.annual_revenue_normalized) || null;
  }
  if (!listing.ebitda && raw.ebitda_normalized) {
    listing.ebitda = Number(raw.ebitda_normalized) || null;
  }

  // financial_years_data → financial_years
  if (raw.financial_years_data && !listing.financial_years) {
    listing.financial_years = raw.financial_years_data;
  }

  // brand_name → injecter dans description
  if (raw.brand_name && raw.brand_name.trim()) {
    const prefix = `[Enseigne : ${raw.brand_name.trim()}]\n`;
    listing.description = prefix + (listing.description || '');
  }

  // entry_fee → injecter dans cession_details
  if (raw.entry_fee != null && raw.entry_fee > 0) {
    const formatted = new Intl.NumberFormat('fr-FR').format(raw.entry_fee);
    const detail = `Droits d'entrée : ${formatted} €`;
    listing.cession_details = listing.cession_details
      ? `${listing.cession_details}\n${detail}`
      : detail;
  }

  // concurrence → colonne dédiée
  if (raw.concurrence) {
    listing.concurrence = raw.concurrence;
  }

  // Champs système
  listing.seller_id = sellerId;
  listing.status = 'active';
  listing.reference_number = generateReference();

  // images : s'assurer que c'est un array
  if (!listing.images || !Array.isArray(listing.images)) {
    listing.images = [];
  }

  return listing;
}

// Mapping partenaire → email du profil
const PARTNER_EMAILS = {
  'fusacq.com': 'fusacq@partners.riviqo.com',
  'cessionpme.com': 'cessionpme@partners.riviqo.com',
};

// Cache des seller_id par email
const sellerIdCache = {};

async function getSellerIdByEmail(email) {
  if (sellerIdCache[email]) return sellerIdCache[email];

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profile?.id) {
    sellerIdCache[email] = profile.id;
    return profile.id;
  }
  return null;
}

async function getAdminUserId() {
  const id = await getSellerIdByEmail(ADMIN_EMAIL);
  if (id) return id;

  // Fallback : chercher via auth.users (nécessite service_role)
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const admin = users?.find(u => u.email === ADMIN_EMAIL);
  if (admin?.id) {
    sellerIdCache[ADMIN_EMAIL] = admin.id;
    return admin.id;
  }

  throw new Error(`Utilisateur admin introuvable: ${ADMIN_EMAIL}`);
}

async function getSellerIdForListing(externalUrl) {
  if (externalUrl) {
    for (const [domain, email] of Object.entries(PARTNER_EMAILS)) {
      if (externalUrl.includes(domain)) {
        const partnerId = await getSellerIdByEmail(email);
        if (partnerId) return partnerId;
        console.warn(`   ⚠ Profil partenaire introuvable: ${email} — fallback admin`);
      }
    }
  }
  return getAdminUserId();
}

async function main() {
  const jsonPath = process.argv[2] || resolve(ROOT, 'docs/riviqo_batch.json');

  console.log('📂 Lecture du fichier:', jsonPath);
  const raw = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  console.log(`   ${raw.length} annonces trouvées\n`);

  // Vérifier les reference_number existants pour éviter les doublons
  const { data: existing } = await supabase
    .from('businesses')
    .select('reference_number')
    .like('reference_number', 'RVQ-%');
  const existingRefs = new Set((existing || []).map(b => b.reference_number));

  const listings = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const sellerId = await getSellerIdForListing(item.external_url || item.url);
    const listing = transformListing(item, sellerId);

    // S'assurer que le reference_number est unique
    while (existingRefs.has(listing.reference_number)) {
      listing.reference_number = generateReference();
    }
    existingRefs.add(listing.reference_number);

    console.log(`  [${i + 1}] ${listing.reference_number} — ${listing.title?.substring(0, 50)}...`);
    listings.push(listing);
  }

  console.log(`\n📤 Insertion de ${listings.length} annonces...`);
  const { data, error } = await supabase
    .from('businesses')
    .insert(listings)
    .select('id, reference_number, title');

  if (error) {
    console.error('❌ Erreur insertion:', error.message);
    if (error.details) console.error('   Détails:', error.details);
    if (error.hint) console.error('   Hint:', error.hint);
    process.exit(1);
  }

  console.log(`\n✅ ${data.length} annonces importées avec succès :\n`);
  data.forEach((item) => {
    console.log(`   ${item.reference_number} — ${item.title?.substring(0, 60)}`);
  });
}

main().catch((err) => {
  console.error('❌ Erreur fatale:', err.message);
  process.exit(1);
});
