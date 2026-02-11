#!/usr/bin/env node

/**
 * Script pour accorder l'accès au plan Smart Matching
 * Usage: node grant-smartmatching.js
 */

const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Variables d\'environnement Supabase manquantes');
  console.error('Assurez-vous que .env.local contient:');
  console.error('  VITE_SUPABASE_URL');
  console.error('  VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

async function grantSmartMatchingAccess() {
  console.log('🎯 Attribution du plan Smart Matching...\n');

  try {
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Erreur: Impossible de récupérer l\'utilisateur');
      console.error('Assurez-vous d\'être connecté');
      process.exit(1);
    }

    const userEmail = user.email;
    console.log(`📧 Utilisateur: ${userEmail}\n`);

    // Mettre à jour le profil
    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'premium_plus',
        plan_type: 'smart_matching',
        access_level: 'admin',
        credits: 999999,
        credits_monthly: 999999,
        features: {
          has_smartmatching: true,
          has_messaging: true,
          has_favorites: true,
          unlimited_listings: true,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('email', userEmail)
      .select();

    if (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.error('❌ Profil non trouvé pour cet utilisateur');
      process.exit(1);
    }

    console.log('✅ Plan Smart Matching accordé avec succès!\n');
    console.log('📊 Détails du profil:');
    console.log(`   Subscription Tier: ${data[0].subscription_tier}`);
    console.log(`   Plan Type: ${data[0].plan_type}`);
    console.log(`   Access Level: ${data[0].access_level}`);
    console.log(`   Credits: ${data[0].credits}`);
    console.log('\n🚀 Rafraîchissez votre navigateur et accédez à /SmartMatching!');

  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
}

grantSmartMatchingAccess();
