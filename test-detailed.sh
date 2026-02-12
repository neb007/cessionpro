#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🔍 DIAGNOSTIC DÉTAILLÉ SUPABASE - CESSIONPRO    ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
  echo -e "${GREEN}✅${NC} Fichier .env.local chargé"
  echo ""
  echo "Configuration trouvée:"
  echo "  • URL: $VITE_SUPABASE_URL"
  echo "  • Key: ${VITE_SUPABASE_ANON_KEY:0:20}..."
else
  echo -e "${RED}❌${NC} Fichier .env.local non trouvé"
  exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 TEST 1: RÉPONSE DE L'API GLOBALE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "Requête: GET $VITE_SUPABASE_URL/rest/v1/"
echo "Avec header: apikey: $VITE_SUPABASE_ANON_KEY"
echo ""

curl -s -v -X GET "$VITE_SUPABASE_URL/rest/v1/" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  2>&1 | grep -E "< HTTP|< Content-Type|apikey"

echo ""
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 TEST 2: REQUÊTE SIMPLE SUR TABLE 'profiles'"
echo "═══════════════════════════════════════════════════════════════"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$VITE_SUPABASE_URL/rest/v1/profiles?limit=1" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | head -20
echo ""

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 TEST 3: DIAGNOSTIC"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${RED}❌${NC} Erreur d'authentification (401)"
  echo "   → Vérifier les clés Supabase dans .env.local"
elif [ "$HTTP_CODE" = "400" ]; then
  echo -e "${YELLOW}⚠️${NC} Requête invalide (400)"
  echo "   → Les tables n'existent peut-être pas ou RLS les bloque"
  echo "   → Vérifier que supabase_setup.sql a été exécuté"
elif [ "$HTTP_CODE" = "403" ]; then
  echo -e "${YELLOW}⚠️${NC} Accès refusé (403)"
  echo "   → Les politiques RLS peuvent bloquer l'accès"
elif [ "$HTTP_CODE" = "404" ]; then
  echo -e "${YELLOW}⚠️${NC} Ressource non trouvée (404)"
  echo "   → Les tables n'ont probablement pas été créées"
elif [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅${NC} Requête acceptée (200)"
  echo "   → Les tables existent et sont accessibles"
else
  echo -e "${YELLOW}⚠️${NC} Code HTTP inattendu: $HTTP_CODE"
fi

echo ""
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 RECOMMANDATIONS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "1️⃣  Vérifier l'état des tables dans Supabase Dashboard:"
echo "   • Aller sur https://app.supabase.com"
echo "   • Accéder à votre projet: rjvndsrnajenoncgzrzq"
echo "   • Vérifier dans 'Databases' → 'Tables' que les tables existent"
echo ""

echo "2️⃣  Si les tables n'existent pas:"
echo "   • Aller à 'SQL Editor' dans Supabase"
echo "   • Copier le contenu de supabase_setup.sql"
echo "   • Exécuter le script"
echo ""

echo "3️⃣  Si les tables existent mais HTTP 400/403:"
echo "   • Vérifier les politiques RLS (Row Level Security)"
echo "   • S'assurer que l'accès anonyme est autorisé ou désactiver RLS pour tester"
echo ""

echo "4️⃣  Pour désactiver Disable RLS temporairement (pour tester):"
echo "   • SQL Editor → Exécuter:"
echo "   • ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;"
echo "   • (Faire pareil pour les autres tables)"
echo ""
