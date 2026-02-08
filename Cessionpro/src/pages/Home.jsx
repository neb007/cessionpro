import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import BusinessCard from '@/components/ui/BusinessCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowRight, 
  UserPlus, 
  FileSearch, 
  MessageCircle,
  Building2,
  TrendingUp,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ businesses: 0, users: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const businesses = await base44.entities.Business.filter(
        { status: 'active' },
        '-created_date',
        6
      );
      setFeaturedBusinesses(businesses);
      
      const allBusinesses = await base44.entities.Business.filter({ status: 'active' });
      setStats({ businesses: allBusinesses.length, users: 150 });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(createPageUrl(`Annonces?search=${searchQuery}`));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900 hidden sm:inline">
                CessionPro
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/Login" className="text-gray-900 hover:text-gray-700 font-medium transition-colors px-4 py-2">
                {language === 'fr' ? 'Se connecter' : 'Login'}
              </Link>
              <Link to="/Register">
                <Button className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-white">
                  {language === 'fr' ? 'Créer un compte' : 'Sign up'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3B4759] via-[#2C3544] to-[#3B4759] text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B4A]/30 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF8F6D]/30 rounded-full filter blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">
                {language === 'fr' ? 'La référence pour les cessions d\'entreprises' : 'The reference for business transfers'}
              </span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('hero_title')}
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              {t('hero_subtitle')}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 p-2">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 text-lg"
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white px-8 py-6 rounded-xl shadow-lg shadow-[#FF6B4A]/25"
                >
                  {t('search')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-16 mt-12">
              <div className="text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-white">{stats.businesses}+</p>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Entreprises' : 'Businesses'}</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-white">{stats.users}+</p>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Utilisateurs' : 'Users'}</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="font-mono text-3xl sm:text-4xl font-bold text-white">98%</p>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Satisfaction' : 'Satisfaction'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-20 sm:h-24">
            <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FAF9F7"/>
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('how_it_works')}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Un processus simple et sécurisé pour acheter ou vendre votre entreprise'
                : 'A simple and secure process to buy or sell your business'}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: UserPlus, title: t('step_1_title'), desc: t('step_1_desc'), color: 'from-[#FF6B4A] to-[#FF8F6D]' },
              { icon: FileSearch, title: t('step_2_title'), desc: t('step_2_desc'), color: 'from-[#FF8F6D] to-[#FFA488]' },
              { icon: MessageCircle, title: t('step_3_title'), desc: t('step_3_desc'), color: 'from-[#FFB19D] to-[#FFC8B7]' },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 h-full">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-mono text-sm font-bold text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {t('featured_businesses')}
              </h2>
              <p className="text-gray-500">
                {language === 'fr' 
                  ? 'Découvrez les dernières opportunités'
                  : 'Discover the latest opportunities'}
              </p>
            </div>
            <Link
              to={createPageUrl('Businesses')}
              className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t('view_all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredBusinesses.map((business) => (
                <motion.div key={business.id} variants={itemVariants}>
                  <BusinessCard business={business} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to={createPageUrl('Businesses')}
              className="inline-flex items-center gap-2 text-primary font-medium"
            >
              {t('view_all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {language === 'fr' 
                  ? 'Pourquoi choisir CessionPro ?'
                  : 'Why choose CessionPro?'}
              </h2>
              <p className="text-lg text-gray-500 mb-10">
                {language === 'fr'
                  ? 'Notre plateforme offre un environnement sécurisé et professionnel pour faciliter la transmission d\'entreprises.'
                  : 'Our platform offers a secure and professional environment to facilitate business transfers.'}
              </p>

              <div className="space-y-6">
                {[
                  { 
                    icon: Shield, 
                    title: language === 'fr' ? 'Confidentialité garantie' : 'Guaranteed confidentiality',
                    desc: language === 'fr' ? 'Vos données sont protégées et les annonces peuvent être confidentielles' : 'Your data is protected and listings can be confidential'
                  },
                  { 
                    icon: Users, 
                    title: language === 'fr' ? 'Réseau qualifié' : 'Qualified network',
                    desc: language === 'fr' ? 'Acheteurs et vendeurs vérifiés pour des transactions sereines' : 'Verified buyers and sellers for smooth transactions'
                  },
                  { 
                    icon: TrendingUp, 
                    title: language === 'fr' ? 'Accompagnement expert' : 'Expert support',
                    desc: language === 'fr' ? 'Des outils et conseils pour réussir votre transaction' : 'Tools and advice to succeed in your transaction'
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FF6B4A]/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-[#FF6B4A]" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-[#3B4759] mb-1">{feature.title}</h4>
                      <p className="text-[#6B7A94]">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 via-violet-100 to-orange-100 p-8 lg:p-12">
                <div className="w-full h-full rounded-2xl bg-white shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
                    alt="Business meeting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-bold text-gray-900">{stats.businesses}</p>
                    <p className="text-sm text-gray-500">{language === 'fr' ? 'Entreprises actives' : 'Active listings'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FF6B4A] via-[#FF8F6D] to-[#FFA488] rounded-3xl p-12 lg:p-16 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
            </div>
            
            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
                {language === 'fr' 
                  ? 'Prêt à démarrer votre projet ?'
                  : 'Ready to start your project?'}
              </h2>
              <p className="text-xl text-white/80 mb-8">
                {language === 'fr'
                  ? 'Rejoignez CessionPro et accédez à un réseau de repreneurs et vendeurs qualifiés.'
                  : 'Join CessionPro and access a network of qualified buyers and sellers.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl">
                    {language === 'fr' ? 'Créer un compte gratuit' : 'Create a free account'}
                  </Button>
                </Link>
                <Link to={createPageUrl('Businesses')}>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    {t('view_all')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}