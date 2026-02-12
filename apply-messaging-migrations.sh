#!/bin/bash

# Script pour appliquer les migrations de correction du système de messagerie
# Exécuter: bash apply-messaging-migrations.sh

echo "================================================"
echo "Application des Migrations de Messagerie"
echo "================================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  ATTENTION:${NC}"
echo "Cette commande va modifier votre schéma de base de données Supabase."
echo "Assurez-vous d'avoir une sauvegarde avant de continuer."
echo ""
read -p "Êtes-vous sûr? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Annulé.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Migrations à appliquer:${NC}"
echo "1. supabase_migration_add_seller_email.sql"
echo "2. supabase_migration_fix_conversations_schema.sql"
echo ""
echo -e "${YELLOW}Instructions manuelles:${NC}"
echo "1. Allez sur: https://app.supabase.com"
echo "2. Sélectionnez votre projet"
echo "3. Allez à SQL Editor > New Query"
echo "4. Copiez le contenu du fichier 1 et exécutez"
echo "5. Copiez le contenu du fichier 2 et exécutez"
echo ""
echo -e "${GREEN}✓ Migrations prêtes à être appliquées manuellement.${NC}"
echo ""
echo "Fichiers:"
ls -lh supabase_migration_add_seller_email.sql
ls -lh supabase_migration_fix_conversations_schema.sql
