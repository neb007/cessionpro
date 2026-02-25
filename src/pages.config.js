/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AccountCreation from './pages/AccountCreation';
import Ceder from './pages/Ceder';
import Reprendre from './pages/Reprendre';
import Expert from './pages/Expert';
import GuideCession from './pages/GuideCession';
import GuideRepreneur from './pages/GuideRepreneur';
import AuthCallback from './pages/AuthCallback';
import BusinessDetails from './pages/BusinessDetails';
import Annonces from './pages/Annonces';
import Abonnement from './pages/Abonnement';
import Billing from './pages/Billing';
import Categories from './pages/Categories';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import CreateBusiness from './pages/CreateBusiness';
import Dataroom from './pages/Dataroom';
import FAQ from './pages/FAQ';
import Favorites from './pages/Favorites';
import Financing from './pages/Financing';
import Home from './pages/Home';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Messages from './pages/Messages';
import MyLeads from './pages/MyLeads';
import MyListings from './pages/MyListings';
import Outils from './pages/Outils';
import PasswordReset from './pages/PasswordReset';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Settings from './pages/Settings';
import SmartMatching from './pages/SmartMatching';
import SmartMatchingFeatures from './pages/SmartMatchingFeatures';
import SmartMatchingNotifications from './pages/SmartMatchingNotifications';
import Targeting from './pages/Targeting';
import Valuations from './pages/Valuations';
import MentionsLegales from './pages/MentionsLegales';
import CGU from './pages/CGU';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Blog from './pages/Blog';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccountCreation": AccountCreation,
    "Ceder": Ceder,
    "Reprendre": Reprendre,
    "Expert": Expert,
    "GuideCession": GuideCession,
    "GuideRepreneur": GuideRepreneur,
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
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
