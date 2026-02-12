import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  MessageSquare,
  Building2,
  Loader2,
  Star,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

const statusConfig = {
  new: { label: { fr: 'Nouveau', en: 'New' }, color: 'bg-blue-100 text-blue-700', icon: Star },
  contacted: { label: { fr: 'Contacté', en: 'Contacted' }, color: 'bg-purple-100 text-purple-700', icon: Mail },
  in_discussion: { label: { fr: 'En discussion', en: 'In Discussion' }, color: 'bg-yellow-100 text-yellow-700', icon: MessageSquare },
  qualified: { label: { fr: 'Qualifié', en: 'Qualified' }, color: 'bg-green-100 text-green-700', icon: CheckCircle },
  not_interested: { label: { fr: 'Pas intéressé', en: 'Not Interested' }, color: 'bg-gray-100 text-gray-600', icon: XCircle },
  converted: { label: { fr: 'Converti', en: 'Converted' }, color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
};

export default function Leads() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBusiness, setFilterBusiness] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      // Get my businesses
      const myBusinesses = await base44.entities.Business.filter({ seller_email: userData.email });
      const businessMap = {};
      myBusinesses.forEach(b => {
        businessMap[b.id] = b;
      });
      setBusinesses(businessMap);

      // Get all leads for my businesses
      const allLeads = await base44.entities.Lead.list('-created_date');
      const myLeads = allLeads.filter(lead => businessMap[lead.business_id]);
      setLeads(myLeads);

    } catch (e) {
      base44.auth.redirectToLogin();
    }
    setLoading(false);
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    await base44.entities.Lead.update(leadId, { status: newStatus });
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  const updateLeadNotes = async (leadId, notes) => {
    await base44.entities.Lead.update(leadId, { notes });
    setLeads(leads.map(l => l.id === leadId ? { ...l, notes } : l));
  };

  const filteredLeads = leads.filter(lead => {
    const statusMatch = filterStatus === 'all' || lead.status === filterStatus;
    const businessMatch = filterBusiness === 'all' || lead.business_id === filterBusiness;
    return statusMatch && businessMatch;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Gestion des Leads' : 'Lead Management'}
          </h1>
          <p className="text-gray-500">
            {language === 'fr' 
              ? 'Suivez et gérez les acheteurs intéressés par vos annonces' 
              : 'Track and manage buyers interested in your listings'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{language === 'fr' ? 'Total' : 'Total'}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{language === 'fr' ? 'Nouveaux' : 'New'}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.new}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{language === 'fr' ? 'Qualifiés' : 'Qualified'}</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.qualified}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{language === 'fr' ? 'Convertis' : 'Converted'}</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.converted}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder={language === 'fr' ? 'Tous les statuts' : 'All statuses'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'fr' ? 'Tous les statuts' : 'All statuses'}</SelectItem>
                  {Object.keys(statusConfig).map(status => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status].label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterBusiness} onValueChange={setFilterBusiness}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder={language === 'fr' ? 'Toutes les annonces' : 'All listings'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'fr' ? 'Toutes les annonces' : 'All listings'}</SelectItem>
                  {Object.values(businesses).map(business => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucun lead' : 'No leads'}
              </h3>
              <p className="text-gray-500">
                {language === 'fr' 
                  ? 'Les acheteurs intéressés apparaîtront ici' 
                  : 'Interested buyers will appear here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status];
              const StatusIcon = status.icon;
              const business = businesses[lead.business_id];

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Lead Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                                {lead.buyer_name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="font-display font-semibold text-gray-900">{lead.buyer_name}</p>
                                <p className="text-sm text-gray-500">{lead.buyer_email}</p>
                              </div>
                            </div>
                            <Badge className={`${status.color} border-0`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label[language]}
                            </Badge>
                          </div>

                          <Link 
                            to={createPageUrl(`BusinessDetails?id=${lead.business_id}`)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors mb-3"
                          >
                            <Building2 className="w-4 h-4" />
                            {business?.title}
                          </Link>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {moment(lead.last_contact_date || lead.created_date).fromNow()}
                            </span>
                            <span className="capitalize">{lead.source}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:w-64 space-y-3">
                          <Select 
                            value={lead.status} 
                            onValueChange={(newStatus) => updateLeadStatus(lead.id, newStatus)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(statusConfig).map(status => (
                                <SelectItem key={status} value={status}>
                                  {statusConfig[status].label[language]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Link to={createPageUrl(`Messages?business=${lead.business_id}`)}>
                            <Button variant="outline" className="w-full">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {language === 'fr' ? 'Voir messages' : 'View messages'}
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Textarea
                          value={lead.notes || ''}
                          onChange={(e) => updateLeadNotes(lead.id, e.target.value)}
                          placeholder={language === 'fr' ? 'Ajouter des notes sur ce lead...' : 'Add notes about this lead...'}
                          className="min-h-20 resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}