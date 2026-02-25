/**
 * Crée les profils partenaires (Fusacq, CessionPME) et met à jour
 * les annonces importées pour pointer vers ces profils.
 *
 * Usage:
 *   node scripts/create-partner-profiles.js
 *
 * Prérequis: SUPABASE_SERVICE_ROLE_KEY dans .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load .env.local manually
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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variables manquantes dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const PARTNERS = [
  {
    email: 'fusacq@partners.riviqo.com',
    company_name: 'Fusacq',
    full_name: 'Fusacq',
    logo_url: '/images/partners/fusacq.svg',
    domain: 'fusacq.com',
  },
  {
    email: 'cessionpme@partners.riviqo.com',
    company_name: 'CessionPME',
    full_name: 'CessionPME',
    logo_url: '/images/partners/cessionpme.svg',
    domain: 'cessionpme.com',
  },
];

async function getOrCreatePartner(partner) {
  // Vérifier si le profil existe déjà
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, email, company_name, logo_url')
    .eq('email', partner.email)
    .single();

  if (existing) {
    console.log(`   ✓ Profil existant: ${partner.company_name} (${existing.id})`);
    // Mettre à jour le logo si nécessaire
    if (existing.logo_url !== partner.logo_url) {
      await supabase.from('profiles')
        .update({ logo_url: partner.logo_url, company_name: partner.company_name })
        .eq('id', existing.id);
      console.log(`     → Logo mis à jour: ${partner.logo_url}`);
    }
    return existing.id;
  }

  // Créer l'auth user
  const password = randomBytes(24).toString('base64');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: partner.email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error(`   ❌ Erreur création auth user ${partner.email}:`, authError.message);
    return null;
  }

  const userId = authData.user.id;
  console.log(`   ✓ Auth user créé: ${partner.company_name} (${userId})`);

  // Mettre à jour le profil (créé par le trigger handle_new_user)
  // Petit délai pour laisser le trigger s'exécuter
  await new Promise(r => setTimeout(r, 1000));

  const { error: profileError } = await supabase.from('profiles')
    .update({
      company_name: partner.company_name,
      full_name: partner.full_name,
      logo_url: partner.logo_url,
      is_seller: true,
    })
    .eq('id', userId);

  if (profileError) {
    console.error(`   ❌ Erreur mise à jour profil:`, profileError.message);
    return userId;
  }

  console.log(`   ✓ Profil mis à jour: logo=${partner.logo_url}`);
  return userId;
}

async function main() {
  console.log('🏢 Création des profils partenaires\n');

  const partnerIds = {};

  for (const partner of PARTNERS) {
    console.log(`\n📌 ${partner.company_name} (${partner.email})`);
    const id = await getOrCreatePartner(partner);
    if (id) {
      partnerIds[partner.domain] = id;
    }
  }

  console.log('\n\n📝 Mise à jour des annonces importées\n');

  for (const [domain, sellerId] of Object.entries(partnerIds)) {
    // Trouver les annonces avec external_url contenant ce domaine
    const { data: listings, error } = await supabase
      .from('businesses')
      .select('id, reference_number, title, external_url, seller_id')
      .like('external_url', `%${domain}%`);

    if (error) {
      console.error(`   ❌ Erreur recherche annonces ${domain}:`, error.message);
      continue;
    }

    if (!listings || listings.length === 0) {
      console.log(`   Aucune annonce trouvée pour ${domain}`);
      continue;
    }

    // Mettre à jour le seller_id
    const ids = listings.map(l => l.id);
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ seller_id: sellerId })
      .in('id', ids);

    if (updateError) {
      console.error(`   ❌ Erreur mise à jour seller_id pour ${domain}:`, updateError.message);
    } else {
      console.log(`   ✓ ${listings.length} annonces ${domain} → seller_id=${sellerId}`);
      listings.forEach(l => {
        console.log(`     - ${l.reference_number} — ${l.title?.substring(0, 50)}`);
      });
    }
  }

  console.log('\n\n✅ Terminé! Résumé des UUIDs partenaires:');
  for (const [domain, id] of Object.entries(partnerIds)) {
    console.log(`   ${domain} → ${id}`);
  }
}

main().catch((err) => {
  console.error('❌ Erreur fatale:', err.message);
  process.exit(1);
});
