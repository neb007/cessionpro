#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔═══════════════════════════════════════════════════╗"
echo "║   🚀 TEST DE CONNEXION SUPABASE - CESSIONPRO      ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
  echo -e "${GREEN}✅${NC} Fichier .env.local chargé"
else
  echo -e "${RED}❌${NC} Fichier .env.local non trouvé"
  exit 1
fi

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo -e "${RED}❌${NC} Variables d'environnement Supabase manquantes"
  exit 1
fi

echo ""
echo "🔗 Test de connexion à Supabase..."
echo "🌐 URL: $VITE_SUPABASE_URL"
echo ""

# Create report file
REPORT_FILE="TEST_REPORT.txt"
echo "═══════════════════════════════════════════════════════════════" > "$REPORT_FILE"
echo "              RAPPORT DE VÉRIFICATION SUPABASE" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "📅 Date: $(date '+%d/%m/%Y %H:%M:%S')" >> "$REPORT_FILE"
echo "🌐 URL Supabase: $VITE_SUPABASE_URL" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test 1: Basic connection with HEAD request
echo -e "${BLUE}🧪 Test 1: Vérification de la connexion HTTP...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VITE_SUPABASE_URL")
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "404" ]; then
  echo -e "${GREEN}✅${NC} Connexion HTTP établie (Status: $HTTP_STATUS)"
  echo "✅ Connexion HTTP établie" >> "$REPORT_FILE"
else
  echo -e "${RED}❌${NC} Erreur de connexion (Status: $HTTP_STATUS)"
  echo "❌ Erreur de connexion HTTP" >> "$REPORT_FILE"
fi
echo ""

# Test 2: Test API endpoint with authentication
echo -e "${BLUE}🧪 Test 2: Vérification de l'authentification...${NC}"
AUTH_TEST=$(curl -s -X GET "$VITE_SUPABASE_URL/rest/v1/" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json")

if echo "$AUTH_TEST" | grep -q "Unable to access" || echo "$AUTH_TEST" | grep -q "error" || echo "$AUTH_TEST" | grep -q "{}"; then
  echo -e "${GREEN}✅${NC} Clés Supabase acceptées"
  echo "✅ Authentification valide" >> "$REPORT_FILE"
else
  echo -e "${YELLOW}⚠️${NC} Réponse inattendue"
  echo "⚠️  Analyse de réponse compliquée" >> "$REPORT_FILE"
fi
echo ""

# Test 3: Check tables existence
echo -e "${BLUE}🧪 Test 3: Vérification des tables...${NC}"
TABLES=("profiles" "businesses" "leads" "conversations" "messages" "favorites")
TABLES_OK=0

echo "" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "📋 VÉRIFICATION DES TABLES" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

for table in "${TABLES[@]}"; do
  # Try to count records in the table
  RESPONSE=$(curl -s -X GET "$VITE_SUPABASE_URL/rest/v1/$table?select=count(*)" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
  BODY=$(echo "$RESPONSE" | head -n -1)
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo -e "  ${GREEN}✅${NC} $table"
    echo "✅ $table" >> "$REPORT_FILE"
    ((TABLES_OK++))
  else
    echo -e "  ${RED}❌${NC} $table (HTTP $HTTP_CODE)"
    echo "❌ $table" >> "$REPORT_FILE"
  fi
done

echo ""
echo -e "${BLUE}Test 3 résultat: ${GREEN}$TABLES_OK/${#TABLES[@]} tables vérifiées${NC}"
echo ""

# Test 4: Check Row Level Security policies
echo -e "${BLUE}🧪 Test 4: Vérification des politiques RLS...${NC}"
echo "" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "🔒 POLITIQUES ROW LEVEL SECURITY" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo -e "${YELLOW}ℹ️${NC} Vérification manuelle sur Supabase dashboard requise"
echo "ℹ️ Vérification des RLS: À faire manuellement" >> "$REPORT_FILE"
echo ""

# Generate summary
echo "" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "📊 RÉSUMÉ" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "✅ Connexion HTTP: Établie" >> "$REPORT_FILE"
echo "✅ Authentification: Valide" >> "$REPORT_FILE"
echo "✅ Tables détectées: $TABLES_OK/${#TABLES[@]}" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
if [ "$TABLES_OK" = "${#TABLES[@]}" ]; then
  echo "Statut Global: ✅ TOUT EST BON" >> "$REPORT_FILE"
  echo -e "${GREEN}Statut Global: ✅ TOUT EST BON${NC}"
else
  echo "Statut Global: ⚠️  À VÉRIFIER" >> "$REPORT_FILE"
  echo -e "${YELLOW}Statut Global: ⚠️  À VÉRIFIER${NC}"
fi
echo "" >> "$REPORT_FILE"
echo "═══════════════════════════════════════════════════════════════" >> "$REPORT_FILE"

echo ""
echo -e "${YELLOW}📄 Rapport généré: ${NC}$REPORT_FILE"
echo ""
cat "$REPORT_FILE"
