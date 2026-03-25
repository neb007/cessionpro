/**
 * pages.config.js - Page routing configuration
 *
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 *
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import { lazy } from 'react';
import Home from './pages/Home';
import __Layout from './Layout.jsx';

const AccountCreation = lazy(() => import('./pages/AccountCreation'));
const Ceder = lazy(() => import('./pages/Ceder'));
const Reprendre = lazy(() => import('./pages/Reprendre'));
const Expert = lazy(() => import('./pages/Expert'));
const GuideCession = lazy(() => import('./pages/GuideCession'));
const GuideRepreneur = lazy(() => import('./pages/GuideRepreneur'));
const GuideRepreneuriat = lazy(() => import('./pages/GuideRepreneuriat'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const BusinessDetails = lazy(() => import('./pages/BusinessDetails'));
const Annonces = lazy(() => import('./pages/Annonces'));
const Abonnement = lazy(() => import('./pages/Abonnement'));
const Billing = lazy(() => import('./pages/Billing'));
const Categories = lazy(() => import('./pages/Categories'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const CreateBusiness = lazy(() => import('./pages/CreateBusiness'));
const Dataroom = lazy(() => import('./pages/Dataroom'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Financing = lazy(() => import('./pages/Financing'));
const Leads = lazy(() => import('./pages/Leads'));
const Login = lazy(() => import('./pages/Login'));
const Messages = lazy(() => import('./pages/Messages'));
const MyLeads = lazy(() => import('./pages/MyLeads'));
const MyListings = lazy(() => import('./pages/MyListings'));
const Outils = lazy(() => import('./pages/Outils'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Profile = lazy(() => import('./pages/Profile'));
const Register = lazy(() => import('./pages/Register'));
const Settings = lazy(() => import('./pages/Settings'));
const SmartMatching = lazy(() => import('./pages/SmartMatching'));
const SmartMatchingFeatures = lazy(() => import('./pages/SmartMatchingFeatures'));
const SmartMatchingNotifications = lazy(() => import('./pages/SmartMatchingNotifications'));
const Targeting = lazy(() => import('./pages/Targeting'));
const Valuations = lazy(() => import('./pages/Valuations'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const CGU = lazy(() => import('./pages/CGU'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));
const Partners = lazy(() => import('./pages/Partners'));

export const PAGES = {
    "AccountCreation": AccountCreation,
    "Ceder": Ceder,
    "Reprendre": Reprendre,
    "Expert": Expert,
    "GuideCession": GuideCession,
    "GuideRepreneur": GuideRepreneur,
    "GuideRepreneuriat": GuideRepreneuriat,
    "AuthCallback": AuthCallback,
    "BusinessDetails": BusinessDetails,
    "Annonces": Annonces,
    "Abonnement": Abonnement,
    "Billing": Billing,
    "Categories": Categories,
    "Checkout": Checkout,
    "Contact": Contact,
    "CreateBusiness": CreateBusiness,
    "Dataroom": Dataroom,
    "FAQ": FAQ,
    "Favorites": Favorites,
    "Financing": Financing,
    "Home": Home,
    "Leads": Leads,
    "Login": Login,
    "Messages": Messages,
    "MyLeads": MyLeads,
    "MyListings": MyListings,
    "Outils": Outils,
    "PasswordReset": PasswordReset,
    "Pricing": Pricing,
    "Profile": Profile,
    "Register": Register,
    "Settings": Settings,
    "SmartMatching": SmartMatching,
    "SmartMatchingFeatures": SmartMatchingFeatures,
    "SmartMatchingNotifications": SmartMatchingNotifications,
    "Targeting": Targeting,
    "Valuations": Valuations,
    "MentionsLegales": MentionsLegales,
    "CGU": CGU,
    "PolitiqueConfidentialite": PolitiqueConfidentialite,
    "Blog": Blog,
    "BlogArticle": BlogArticle,
    "Partners": Partners,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
