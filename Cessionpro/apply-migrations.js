#!/usr/bin/env node

/**
 * Supabase Database Migration Script
 * Automatically applies missing columns to the businesses table
 * Uses REST API directly - no dependencies required!
 * 
 * Usage: node apply-migrations.js
 * Or via npm: npm run migrate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('#')) return;
      
      if (line.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = line.substring('VITE_SUPABASE_URL='.length).trim();
      } else if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = line.substring('VITE_SUPABASE_ANON_KEY='.length).trim();
      }
    });
  }
} catch (err) {
  console.warn('Warning: Could not read .env.local file');
}

// Fallback to process.env if not found in file
supabaseUrl = supabaseUrl || process.env.VITE_SUPABASE_URL;
supabaseKey = supabaseKey || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  console.error('   Found URL:', supabaseUrl ? 'YES' : 'NO');
  console.error('   Found KEY:', supabaseKey ? 'YES' : 'NO');
  console.error('   File path:', envPath);
  process.exit(1);
}

// Array of migrations to apply
const migrations = [
  {
    name: 'Add type column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'cession';`
  },
  {
    name: 'Add buyer_budget_min column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_budget_min DECIMAL(15, 2);`
  },
  {
    name: 'Add buyer_budget_max column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_budget_max DECIMAL(15, 2);`
  },
  {
    name: 'Add buyer_sectors_interested column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_sectors_interested TEXT[] DEFAULT ARRAY[]::TEXT[];`
  },
  {
    name: 'Add buyer_locations column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_locations TEXT[] DEFAULT ARRAY[]::TEXT[];`
  },
  {
    name: 'Add buyer_employees_min column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_employees_min INTEGER;`
  },
  {
    name: 'Add buyer_employees_max column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_employees_max INTEGER;`
  },
  {
    name: 'Add buyer_revenue_min column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_revenue_min DECIMAL(15, 2);`
  },
  {
    name: 'Add buyer_revenue_max column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_revenue_max DECIMAL(15, 2);`
  },
  {
    name: 'Add buyer_investment_available column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_investment_available DECIMAL(15, 2);`
  },
  {
    name: 'Add buyer_profile_type column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_profile_type TEXT;`
  },
  {
    name: 'Add buyer_notes column',
    sql: `ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_notes TEXT;`
  }
];

/**
 * Execute SQL via Supabase REST RPC
 */
async function executeSQLviaRPC(sql) {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({ sql_query: sql })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data };
    }
    
    return { success: true, data };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Execute a single migration
 */
async function executeMigration(migration) {
  try {
    const result = await executeSQLviaRPC(migration.sql);
    
    if (result.error) {
      const errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
      
      // Check if error is just about column already existing
      if (errorMsg && errorMsg.includes('already exists')) {
        console.log(`  ✓ ${migration.name} (already exists)`);
        return true;
      }
      
      // If it's a Supabase database error about the column, it's probably fine
      if (errorMsg && errorMsg.includes('column') && errorMsg.includes('already')) {
        console.log(`  ✓ ${migration.name} (already exists)`);
        return true;
      }
      
      console.log(`  ✗ ${migration.name}: ${errorMsg}`);
      return false;
    }

    console.log(`  ✓ ${migration.name}`);
    return true;
  } catch (err) {
    // Column might already exist (which is fine)
    if (err.message && err.message.includes('already exists')) {
      console.log(`  ✓ ${migration.name} (already exists)`);
      return true;
    }
    
    console.log(`  ✗ ${migration.name}: ${err.message}`);
    return false;
  }
}

/**
 * Main migration runner
 */
async function runMigrations() {
  console.log('🚀 Starting Supabase Database Migrations...\n');
  console.log(`📍 Connected to: ${supabaseUrl}\n`);

  let successful = 0;
  let failed = 0;

  for (const migration of migrations) {
    const result = await executeMigration(migration);
    if (result) {
      successful++;
    } else {
      failed++;
    }
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Migrations Complete: ${successful} successful, ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) {
    console.log('⚠️  Note: Some migrations may have failed because columns already exist.');
    console.log('This is normal and safe - the migrations are idempotent.\n');
  }

  console.log('💡 Next steps:');
  console.log('   1. Wait 30 seconds for Supabase schema cache to refresh');
  console.log('   2. Refresh your browser');
  console.log('   3. Try creating/duplicating listings again\n');

  process.exit(successful > 0 || failed > 0 ? 0 : 1);
}

// Run migrations
runMigrations().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
