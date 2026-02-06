import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier .env.local non trouvé: ${filePath}`);
  }
  
  const envContent = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return env;
}

const envPath = path.join(__dirname, '.env.local');
const envVars = loadEnv(envPath);

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Expected tables schema
const expectedTables = {
  profiles: ['id', 'email', 'full_name', 'avatar_url', 'role', 'company_name', 'phone', 'bio', 'created_at', 'updated_at'],
  businesses: ['id', 'seller_id', 'title', 'description', 'sector', 'asking_price', 'annual_revenue', 'ebitda', 'employees', 'location', 'country', 'region', 'year_founded', 'reason_for_sale', 'assets_included', 'images', 'status', 'confidential', 'views_count', 'legal_structure', 'registration_number', 'lease_info', 'licenses', 'financial_years', 'market_position', 'competitive_advantages', 'growth_opportunities', 'customer_base', 'created_at', 'updated_at'],
  leads: ['id', 'buyer_id', 'business_id', 'status', 'notes', 'created_at', 'updated_at'],
  conversations: ['id', 'participant_1_id', 'participant_2_id', 'business_id', 'subject', 'created_at', 'updated_at'],
  messages: ['id', 'conversation_id', 'sender_id', 'content', 'created_at', 'updated_at'],
  favorites: ['id', 'user_id', 'business_id', 'created_at']
};

async function testConnection() {
  console.log('🔗 Test de connexion à Supabase...\n');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('✅ Connexion établie (pas d\'utilisateur actif, c\'est normal)\n');
    } else {
      console.log('✅ Connexion à Supabase réussie\n');
    }
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return false;
  }
}

async function listTables() {
  console.log('📋 Récupération des tables...\n');
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      // Fallback: Try to get info from our known tables
      console.log('⚠️  Impossible de récupérer la liste complète, test des tables attendues...\n');
      return Object.keys(expectedTables);
    }

    const tables = data.map(t => t.table_name).filter(t => !t.startsWith('pg_'));
    return tables;
  } catch (error) {
    console.error('⚠️  Erreur lors de la récupération des tables:', error.message);
    return Object.keys(expectedTables);
  }
}

async function checkTableSchema(tableName) {
  console.log(`🔍 Vérification de la table: ${tableName}`);
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`  ❌ Erreur: ${error.message}`);
      return { exists: false, columns: [] };
    }

    let columns = [];
    if (data && data.length > 0) {
      columns = Object.keys(data[0]);
    } else {
      // Try to infer columns from a count query
      const { data: countData, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        console.log(`  ✅ Table existe (${countData?.length || 0} colonnes détectées)`);
      }
    }

    const expected = expectedTables[tableName] || [];
    const missing = expected.filter(col => !columns.includes(col));
    
    if (missing.length === 0) {
      console.log(`  ✅ Toutes les colonnes attendues présentes\n`);
    } else if (missing.length > 0) {
      console.log(`  ⚠️  Colonnes manquantes: ${missing.join(', ')}\n`);
    }

    return { exists: true, columns };
  } catch (error) {
    console.log(`  ⚠️  Impossible de vérifier: ${error.message}\n`);
    return { exists: false, columns: [] };
  }
}

async function testTableOperations() {
  console.log('🧪 Test d\'opérations CRUD simples...\n');
  const results = [];

  // Test profiles table
  try {
    console.log('  Test: Lecture de la table profiles');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (!error) {
      console.log(`  ✅ Lecture réussie (${data?.length || 0} enregistrement(s))\n`);
      results.push({ table: 'profiles', operation: 'SELECT', success: true });
    } else {
      console.log(`  ⚠️  Erreur: ${error.message}\n`);
      results.push({ table: 'profiles', operation: 'SELECT', success: false });
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}\n`);
    results.push({ table: 'profiles', operation: 'SELECT', success: false });
  }

  // Test businesses table
  try {
    console.log('  Test: Lecture de la table businesses');
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .limit(1);

    if (!error) {
      console.log(`  ✅ Lecture réussie (${data?.length || 0} enregistrement(s))\n`);
      results.push({ table: 'businesses', operation: 'SELECT', success: true });
    } else {
      console.log(`  ⚠️  Erreur: ${error.message}\n`);
      results.push({ table: 'businesses', operation: 'SELECT', success: false });
    }
  } catch (error) {
    console.log(`  ❌ Exception: ${error.message}\n`);
    results.push({ table: 'businesses', operation: 'SELECT', success: false });
  }

  return results;
}

async function generateReport(tables, crudResults) {
  const report = `
═══════════════════════════════════════════════════════════════
              RAPPORT DE VÉRIFICATION SUPABASE
═══════════════════════════════════════════════════════════════

📅 Date: ${new Date().toLocaleString('fr-FR')}
🌐 URL Supabase: ${supabaseUrl}

═══════════════════════════════════════════════════════════════
📋 TABLES DÉTECTÉES
═══════════════════════════════════════════════════════════════

${tables.map(t => `✅ ${t}`).join('\n')}

═══════════════════════════════════════════════════════════════
🔍 VÉRIFICATION DU SCHÉMA ATTENDU
═══════════════════════════════════════════════════════════════

Tables attendues: ${Object.keys(expectedTables).join(', ')}
Tables détectées: ${tables.length}/${Object.keys(expectedTables).length}

${Object.keys(expectedTables).map(table => {
  const detected = tables.includes(table);
  return `${detected ? '✅' : '❌'} ${table}`;
}).join('\n')}

═══════════════════════════════════════════════════════════════
🧪 RÉSULTATS DES TESTS CRUD
═══════════════════════════════════════════════════════════════

${crudResults.map(result => 
  `${result.success ? '✅' : '❌'} ${result.table} - ${result.operation}: ${result.success ? 'Succès' : 'Échec'}`
).join('\n')}

═══════════════════════════════════════════════════════════════
📊 RÉSUMÉ
═══════════════════════════════════════════════════════════════

✅ Connexion Supabase: Réussie
✅ Tables détectées: ${tables.length}/${Object.keys(expectedTables).length}
✅ Tests CRUD: ${crudResults.filter(r => r.success).length}/${crudResults.length} réussis

Statut Global: ${tables.length === Object.keys(expectedTables).length && crudResults.filter(r => r.success).length === crudResults.length ? '✅ TOUT EST BON' : '⚠️  À VÉRIFIER'}

═══════════════════════════════════════════════════════════════
`;

  return report;
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   🚀 TEST DE CONNEXION SUPABASE - CESSIONPRO      ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }

  // List tables
  const tables = await listTables();
  console.log(`📊 ${tables.length} table(s) trouvée(s): ${tables.join(', ')}\n`);

  // Check schema for each table
  console.log('═══════════════════════════════════════════════════\n');
  for (const table of Object.keys(expectedTables)) {
    await checkTableSchema(table);
  }

  // Test CRUD operations
  console.log('═══════════════════════════════════════════════════\n');
  const crudResults = await testTableOperations();

  // Generate report
  const report = await generateReport(tables, crudResults);
  console.log(report);

  // Save report to file
  const reportPath = path.join(__dirname, 'TEST_REPORT.txt');
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);

  process.exit(0);
}

main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
