import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Eye, 
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  TrendingUp,
  Copy,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateUniqueReference } from '@/utils/referenceGenerator';
import { getPrimaryImageUrl } from '@/utils/imageHelpers';

const statusConfig = {
  active: { label: 'active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  draft: { label: 'draft', color: 'bg-gray-100 text-gray-600', icon: Clock },
  pending: { label: 'pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  sold: { label: 'sold', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  withdrawn: { label: 'withdrawn', color: 'bg-red-100 text-red-600', icon: XCircle },
};

export default function MyListings() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [myListings, setMyListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [duplicating, setDuplicating] = useState(null);

  useEffect(() => {
    loadData();
    
    // Set up interval to refresh data periodically
    const interval = setInterval(() => {
      if (user) {
        loadData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    filterListings();
  }, [myListings, statusFilter]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading listings for user:', user.id);
      const listings = await base44.entities.Business.filter(
        { seller_id: user.id }
      );
      console.log('Loaded listings:', listings);
      
      // Just load listings - don't try to update missing references since that column may not exist
      setMyListings(listings || []);
    } catch (e) {
      console.error('Error loading listings:', e);
      setMyListings([]);
    }
    setLoading(false);
  };

  const filterListings = () => {
    if (statusFilter === 'all') {
      setFilteredListings(myListings);
    } else {
      setFilteredListings(myListings.filter(l => l.status === statusFilter));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette annonce ?' : 'Are you sure you want to delete this listing?')) {
      return;
    }
    
    setUpdating(prev => ({ ...prev, [id]: 'deleting' }));
    try {
      await base44.entities.Business.delete(id);
      setMyListings(myListings.filter(l => l.id !== id));
      setDeletingId(null);
    } catch (e) {
      console.error('Error deleting listing:', e);
      alert(language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting listing');
    }
    setUpdating(prev => ({ ...prev, [id]: null }));
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: 'updating' }));
    try {
      await base44.entities.Business.update(id, { status });
      setMyListings(myListings.map(l => l.id === id ? { ...l, status } : l));
    } catch (e) {
      console.error('Error updating status:', e);
      alert(language === 'fr' ? 'Erreur lors de la mise à jour' : 'Error updating status');
    }
    setUpdating(prev => ({ ...prev, [id]: null }));
  };

  const handleDuplicate = async (listing) => {
    setDuplicating(listing.id);
    try {
      const newTitle = `${listing.title} ${language === 'fr' ? '(Copie)' : '(Copy)'}`;
      
      // Only include fields that exist in the schema
      const newData = {
        title: newTitle,
        description: listing.description,
        sector: listing.sector,
        asking_price: listing.asking_price,
        annual_revenue: listing.annual_revenue,
        ebitda: listing.ebitda,
        employees: listing.employees,
        location: listing.location,
        country: listing.country,
        region: listing.region,
        year_founded: listing.year_founded,
        reason_for_sale: listing.reason_for_sale,
        confidential: listing.confidential,
        assets_included: Array.isArray(listing.assets_included) ? listing.assets_included : [],
        images: Array.isArray(listing.images) ? listing.images : [],
        legal_structure: listing.legal_structure,
        registration_number: listing.registration_number,
        lease_info: listing.lease_info,
        licenses: listing.licenses,
        financial_years: Array.isArray(listing.financial_years) ? listing.financial_years : [],
        market_position: listing.market_position,
        competitive_advantages: listing.competitive_advantages,
        growth_opportunities: listing.growth_opportunities,
        customer_base: listing.customer_base,
        status: 'draft',
        views_count: 0,
        seller_id: user?.id,
        type: listing.type,
        buyer_budget_min: listing.buyer_budget_min,
        buyer_budget_max: listing.buyer_budget_max,
        buyer_sectors_interested: Array.isArray(listing.buyer_sectors_interested) ? listing.buyer_sectors_interested : [],
        buyer_locations: Array.isArray(listing.buyer_locations) ? listing.buyer_locations : [],
        buyer_employees_min: listing.buyer_employees_min,
        buyer_employees_max: listing.buyer_employees_max,
        buyer_revenue_min: listing.buyer_revenue_min,
        buyer_revenue_max: listing.buyer_revenue_max,
        buyer_investment_available: listing.buyer_investment_available,
        buyer_profile_type: listing.buyer_profile_type,
        buyer_notes: listing.buyer_notes
      };
      
      const result = await base44.entities.Business.create(newData);
      setMyListings(prev => [...prev, result]);
      
      const message = language === 'fr' 
        ? `Annonce dupliquée avec succès` 
        : `Listing duplicated successfully`;
      alert(message);
    } catch (e) {
      console.error('Error duplicating listing:', e);
      alert(language === 'fr' ? 'Erreur lors de la duplication' : 'Error duplicating listing');
    }
    setDuplicating(null);
  };

  const totalViews = myListings.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const activeListings = myListings.filter(l => l.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {t('my_listings')}
            </h1>
            <p className="text-gray-500">
              {myListings.length} {language === 'fr' ? 'annonce(s)' : 'listing(s)'} • {activeListings} {language === 'fr' ? 'actif(s)' : 'active'} • 👁 {totalViews} {language === 'fr' ? 'vues' : 'views'}
            </p>
          </div>
          <Button onClick={() => navigate(createPageUrl('CreateBusiness'))} className="bg-gradient-to-r from-primary to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            {t('create_listing')}
          </Button>
        </div>

        {/* Status Filter */}
        {myListings.length > 0 && (
          <div className="mb-6 flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'fr' ? 'Filtrer par statut' : 'Filter by status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'fr' ? 'Tous' : 'All'}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="draft">{t('draft')}</SelectItem>
                <SelectItem value="sold">{t('sold')}</SelectItem>
                <SelectItem value="withdrawn">{language === 'fr' ? 'Archivée' : 'Withdrawn'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Empty State */}
        {myListings.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucune annonce' : 'No listings yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'fr' ? 'Publiez votre première annonce' : 'Publish your first listing'}
              </p>
              <Button onClick={() => navigate(createPageUrl('CreateBusiness'))}>
                <Plus className="w-4 h-4 mr-2" />
                {t('create_listing')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredListings.map((listing) => {
                const status = statusConfig[listing.status] || statusConfig.active;
                const StatusIcon = status.icon;
                
                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
                        <img 
                          src={getPrimaryImageUrl(listing)} 
                          alt={listing.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${status.color} border-0 text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {t(status.label)}
                          </Badge>
                        </div>

                        {/* Views */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs text-gray-700 font-medium">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="font-mono">{listing.views_count || 0}</span>
                        </div>
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        {/* Reference & Verified */}
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                          <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px]">
                            {listing.type === 'acquisition' ? (language === 'fr' ? 'Acquisition' : 'Acquisition') : (language === 'fr' ? 'Cession' : 'Sale')}
                          </Badge>
                          {listing.business_type && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-[10px]">
                              {t(listing.business_type)}
                            </Badge>
                          )}
                          {listing.reference_number && (
                            <Badge variant="secondary" className="bg-gray-900 text-white font-mono text-[10px]">
                              {listing.reference_number}
                            </Badge>
                          )}
                          {listing.verified && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">
                              ✓ {language === 'fr' ? 'Vérifié' : 'Verified'}
                            </Badge>
                          )}
                        </div>

                        {/* Title & Location */}
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{listing.location}</p>

                        {/* Financial Info */}
                        <div className="py-3 border-t border-gray-100 mb-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            {language === 'fr' ? 'Prix' : 'Price'}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-lg font-bold text-primary">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                                maximumFractionDigits: 0,
                                notation: 'compact'
                              }).format(listing.asking_price)}
                            </p>
                            {listing.annual_revenue && (
                              <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase">CA</p>
                                <p className="font-mono text-sm text-blue-600">
                                  {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    maximumFractionDigits: 0,
                                    notation: 'compact'
                                  }).format(listing.annual_revenue)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions - Option B: All buttons visible */}
                        <div className="mt-auto grid grid-cols-5 gap-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => navigate(createPageUrl(`CreateBusiness?edit=${listing.id}`))}
                            disabled={updating[listing.id]}
                            title={language === 'fr' ? 'Modifier' : 'Edit'}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(createPageUrl(`BusinessDetails?id=${listing.id}`), '_blank')}
                            title={language === 'fr' ? 'Voir' : 'View'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            onClick={() => handleDuplicate(listing)}
                            disabled={duplicating === listing.id}
                            title={language === 'fr' ? 'Dupliquer' : 'Duplicate'}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleStatusChange(listing.id, 'sold')}
                            disabled={updating[listing.id] || listing.status === 'sold'}
                            title={language === 'fr' ? 'Marquer comme vendu' : 'Mark as sold'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(listing.id)}
                            disabled={updating[listing.id]}
                            title={language === 'fr' ? 'Supprimer' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
