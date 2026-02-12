import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    // Navigation
    home: "Accueil",
    businesses: "Annonces",
    buyers_directory: "Annuaire Repreneurs",
    messages: "Messages",
    favorites: "Favoris",
    dashboard: "Tableau de bord",
    profile: "Profil",
    logout: "Déconnexion",
    login: "Connexion",
    
    // Home
    hero_title: "Trouvez votre prochaine entreprise",
    hero_subtitle: "La plateforme de référence pour la cession et reprise d'entreprises",
    search_placeholder: "Rechercher par secteur, localisation...",
    search: "Rechercher",
    featured_businesses: "Annonces en vedette",
    view_all: "Voir tout",
    how_it_works: "Comment ça marche",
    step_1_title: "Créez votre profil",
    step_1_desc: "Inscrivez-vous comme acheteur ou vendeur",
    step_2_title: "Publiez ou recherchez",
    step_2_desc: "Déposez une annonce ou explorez le catalogue",
    step_3_title: "Échangez en toute sécurité",
    step_3_desc: "Communiquez via notre messagerie sécurisée",
    
    // Businesses
    all_businesses: "Toutes les annonces",
    filter_by_sector: "Secteur",
    filter_by_price: "Budget",
    filter_by_location: "Localisation",
    sort_by: "Trier par",
    newest: "Plus récentes",
    price_low: "Prix croissant",
    price_high: "Prix décroissant",
    no_results: "Aucun résultat",
    
    // Business Details
    asking_price: "Prix demandé",
    annual_revenue: "CA annuel",
    ebitda: "EBITDA",
    employees: "Employés",
    founded: "Fondée en",
    reason_sale: "Raison de la vente",
    assets_included: "Actifs inclus",
    contact_seller: "Contacter le vendeur",
    add_favorite: "Ajouter aux favoris",
    remove_favorite: "Retirer des favoris",
    confidential: "Confidentiel",
    
    // Create Business
    create_listing: "Créer une annonce",
    edit_listing: "Modifier l'annonce",
    title: "Titre",
    description: "Description",
    sector: "Secteur d'activité",
    price: "Prix de cession",
    location: "Localisation",
    country: "Pays",
    year_founded: "Année de création",
    reason_for_sale: "Raison de la vente",
    upload_images: "Ajouter des photos",
    publish: "Publier",
    save_draft: "Enregistrer brouillon",
    
    // Sectors
    technology: "Technologie",
    retail: "Commerce de détail",
    hospitality: "Hôtellerie-Restauration",
    manufacturing: "Industrie",
    services: "Services",
    healthcare: "Santé",
    construction: "BTP",
    transport: "Transport",
    agriculture: "Agriculture",
    other: "Autre",
    
    // Reasons
    retirement: "Retraite",
    new_project: "Nouveau projet",
    health: "Raisons de santé",
    relocation: "Déménagement",
    
    // Countries
    france: "France",
    belgium: "Belgique",
    switzerland: "Suisse",
    canada: "Canada",
    luxembourg: "Luxembourg",
    germany: "Allemagne",
    spain: "Espagne",
    italy: "Italie",
    netherlands: "Pays-Bas",
    portugal: "Portugal",

    // Additional
    leads: "Leads",
    
    // Dashboard
    seller_dashboard: "Tableau de bord Vendeur",
    buyer_dashboard: "Tableau de bord Acheteur",
    my_listings: "Mes annonces",
    total_views: "Vues totales",
    messages_received: "Messages reçus",
    favorites_count: "En favoris",
    active: "Active",
    draft: "Brouillon",
    sold: "Vendue",
    pending: "En attente",
    
    // Messages
    conversations: "Conversations",
    no_conversations: "Aucune conversation",
    type_message: "Écrivez votre message...",
    send: "Envoyer",
    
    // Favorites
    my_favorites: "Mes favoris",
    no_favorites: "Aucun favori",
    
    // Buyers Directory
    potential_buyers: "Repreneurs potentiels",
    budget_range: "Budget",
    interests: "Intérêts",
    contact: "Contacter",
    
    // Profile
    edit_profile: "Modifier le profil",
    buyer: "Acheteur",
    seller: "Vendeur",
    both: "Acheteur & Vendeur",
    company_name: "Nom de société",
    phone: "Téléphone",
    bio: "Présentation",
    experience: "Expérience",
    budget: "Budget",
    sectors_interest: "Secteurs d'intérêt",
    visible_directory: "Visible dans l'annuaire",
    save: "Enregistrer",
    
    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    view: "Voir",
    from: "de",
    to: "à",
    views: "vues",
  },
  en: {
    // Navigation
    home: "Home",
    businesses: "Listings",
    buyers_directory: "Buyers Directory",
    messages: "Messages",
    favorites: "Favorites",
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout",
    login: "Login",
    
    // Home
    hero_title: "Find your next business",
    hero_subtitle: "The leading platform for business acquisitions and sales",
    search_placeholder: "Search by sector, location...",
    search: "Search",
    featured_businesses: "Featured Listings",
    view_all: "View all",
    how_it_works: "How it works",
    step_1_title: "Create your profile",
    step_1_desc: "Sign up as a buyer or seller",
    step_2_title: "List or search",
    step_2_desc: "Post a listing or browse the catalog",
    step_3_title: "Connect securely",
    step_3_desc: "Communicate through our secure messaging",
    
    // Businesses
    all_businesses: "All Listings",
    filter_by_sector: "Sector",
    filter_by_price: "Budget",
    filter_by_location: "Location",
    sort_by: "Sort by",
    newest: "Newest",
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    no_results: "No results",
    
    // Business Details
    asking_price: "Asking Price",
    annual_revenue: "Annual Revenue",
    ebitda: "EBITDA",
    employees: "Employees",
    founded: "Founded",
    reason_sale: "Reason for Sale",
    assets_included: "Assets Included",
    contact_seller: "Contact Seller",
    add_favorite: "Add to Favorites",
    remove_favorite: "Remove from Favorites",
    confidential: "Confidential",
    
    // Create Business
    create_listing: "Create Listing",
    edit_listing: "Edit Listing",
    title: "Title",
    description: "Description",
    sector: "Sector",
    price: "Asking Price",
    location: "Location",
    country: "Country",
    year_founded: "Year Founded",
    reason_for_sale: "Reason for Sale",
    upload_images: "Add Photos",
    publish: "Publish",
    save_draft: "Save Draft",
    
    // Sectors
    technology: "Technology",
    retail: "Retail",
    hospitality: "Hospitality",
    manufacturing: "Manufacturing",
    services: "Services",
    healthcare: "Healthcare",
    construction: "Construction",
    transport: "Transport",
    agriculture: "Agriculture",
    other: "Other",
    
    // Reasons
    retirement: "Retirement",
    new_project: "New Project",
    health: "Health Reasons",
    relocation: "Relocation",
    
    // Countries
    france: "France",
    belgium: "Belgium",
    switzerland: "Switzerland",
    canada: "Canada",
    luxembourg: "Luxembourg",
    germany: "Germany",
    spain: "Spain",
    italy: "Italy",
    netherlands: "Netherlands",
    portugal: "Portugal",

    // Additional
    leads: "Leads",
    
    // Dashboard
    seller_dashboard: "Seller Dashboard",
    buyer_dashboard: "Buyer Dashboard",
    my_listings: "My Listings",
    total_views: "Total Views",
    messages_received: "Messages Received",
    favorites_count: "Favorites",
    active: "Active",
    draft: "Draft",
    sold: "Sold",
    pending: "Pending",
    
    // Messages
    conversations: "Conversations",
    no_conversations: "No conversations",
    type_message: "Type your message...",
    send: "Send",
    
    // Favorites
    my_favorites: "My Favorites",
    no_favorites: "No favorites",
    
    // Buyers Directory
    potential_buyers: "Potential Buyers",
    budget_range: "Budget",
    interests: "Interests",
    contact: "Contact",
    
    // Profile
    edit_profile: "Edit Profile",
    buyer: "Buyer",
    seller: "Seller",
    both: "Buyer & Seller",
    company_name: "Company Name",
    phone: "Phone",
    bio: "Bio",
    experience: "Experience",
    budget: "Budget",
    sectors_interest: "Sectors of Interest",
    visible_directory: "Visible in Directory",
    save: "Save",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    from: "from",
    to: "to",
    views: "views",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('fr');
  
  useEffect(() => {
    const saved = localStorage.getItem('cessionpro_lang');
    if (saved) setLanguage(saved);
  }, []);
  
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('cessionpro_lang', lang);
  };
  
  const t = (key) => translations[language]?.[key] || translations['fr'][key] || key;
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: 'fr', changeLanguage: () => {}, t: (key) => key };
  }
  return context;
};