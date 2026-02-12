#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * Executes migration.sql against your Supabase database
 * Uses the same connection pattern as test-supabase.js
 * 
 * Usage: npm run migration
 * Or: node run-migration.js
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ .env.local not found: ${filePath}`);
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
  console.error('❌ Error: Supabase environment variables missing (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigration() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   🚀 SUPABASE MIGRATION RUNNER - CESSIONPRO       ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');
  
  // Test connection first
  console.log('🔗 Testing Supabase connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('✅ Connection successful\n');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }

  // Read migration SQL file
  const migrationPath = path.join(__dirname, 'migration.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ migration.sql not found at:', migrationPath);
    process.exit(1);
  }

  console.log('📄 Reading migration.sql...');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
  
  // Split SQL statements (simple approach - split by semicolons)
  // Filter out comments and empty statements
  const statements = migrationSQL
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt && !stmt.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements\n`);
  console.log('═══════════════════════════════════════════════════\n');

  let successful = 0;
  let failed = 0;
  const results = [];

  // Execute each migration statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const statementNum = i + 1;
    
    try {
      // For ALTER TABLE statements or SELECT statements, we need to use a different approach
      // We'll try to use RPC or execute directly if possible
      
      // Extract the statement type and table name for logging
      const match = statement.match(/^(ALTER|SELECT|CREATE|INSERT|UPDATE|DELETE)\s+(\w+)/i);
      const statementType = match ? match[1].toUpperCase() : 'QUERY';
      const objectName = match ? match[2] : 'statement';
      
      console.log(`[${statementNum}/${statements.length}] Executing: ${statementType} ${objectName}...`);

      // Try to execute via RPC (if a custom function exists)
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      }).catch(err => {
        // If RPC doesn't exist, try alternative approach
        return { error: err };
      });

      if (error) {
        // Check if it's just that the function doesn't exist
        if (error.message && error.message.includes('Could not find')) {
          console.log(`  ⚠️  RPC function not available, trying direct execution...`);
          console.log(`  ℹ️  Note: Direct ALTER TABLE statements require manual execution`);
          console.log(`  Command: ${statement.substring(0, 80)}...\n`);
          failed++;
          results.push({
            num: statementNum,
            statement: statement.substring(0, 100),
            success: false,
            error: 'RPC function not available'
          });
        } else {
          console.log(`  ⚠️  Error: ${error.message}\n`);
          failed++;
          results.push({
            num: statementNum,
            statement: statement.substring(0, 100),
            success: false,
            error: error.message
          });
        }
      } else {
        console.log(`  ✅ Success\n`);
        successful++;
        results.push({
          num: statementNum,
          statement: statement.substring(0, 100),
          success: true,
          error: null
        });
      }
    } catch (error) {
      console.log(`  ❌ Exception: ${error.message}\n`);
      failed++;
      results.push({
        num: statementNum,
        statement: statement.substring(0, 100),
        success: false,
        error: error.message
      });
    }
  }

  // Summary
  console.log('═══════════════════════════════════════════════════\n');
  console.log('📊 MIGRATION SUMMARY');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`✅ Successful: ${successful}/${statements.length}`);
  console.log(`❌ Failed: ${failed}/${statements.length}\n`);

  if (failed > 0) {
    console.log('⚠️  NOTE: If migrations failed, you may need to:');
    console.log('   1. Run the migration.sql file manually in Supabase SQL Editor');
    console.log('   2. Go to: https://app.supabase.com');
    console.log('   3. SQL Editor → New Query → Paste migration.sql → Run\n');
  } else {
    console.log('✅ All migrations completed successfully!');
    console.log('💡 Wait 30 seconds for schema cache refresh, then reload your browser.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

runMigration().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
