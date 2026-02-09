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
import Alerts from './pages/Alerts';
import AccountCreation from './pages/AccountCreation';
import AuthCallback from './pages/AuthCallback';
import BusinessDetails from './pages/BusinessDetails';
import Annonces from './pages/Annonces';
import Categories from './pages/Categories';
import CreateBusiness from './pages/CreateBusiness';
import Dataroom from './pages/Dataroom';
import FAQ from './pages/FAQ';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Messages from './pages/Messages';
import MyLeads from './pages/MyLeads';
import MyListings from './pages/MyListings';
import PasswordReset from './pages/PasswordReset';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Register from './pages/Register';
import SmartMatching from './pages/SmartMatching';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Alerts": Alerts,
    "AccountCreation": AccountCreation,
    "AuthCallback": AuthCallback,
    "BusinessDetails": BusinessDetails,
    "Annonces": Annonces,
    "Categories": Categories,
    "CreateBusiness": CreateBusiness,
    "Dataroom": Dataroom,
    "FAQ": FAQ,
    "Favorites": Favorites,
    "Home": Home,
    "Leads": Leads,
    "Login": Login,
    "Messages": Messages,
    "MyLeads": MyLeads,
    "MyListings": MyListings,
    "PasswordReset": PasswordReset,
    "Pricing": Pricing,
    "Profile": Profile,
    "Register": Register,
    "SmartMatching": SmartMatching,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};