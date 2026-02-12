import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Loader2,
  Users,
  Mail,
  CheckCircle2,
  CircleDotDashed,
  MessageSquare,
  XCircle,
  MoreVertical
} from 'lucide-react';

const LEAD_STATUS = {
  new: { label: 'Nouveau', labelEn: 'New', color: 'bg-blue-100 text-blue-600', icon: CircleDotDashed },
  contacted: { label: 'Contacté', labelEn: 'Contacted', color: 'bg-purple-100 text-purple-600', icon: Mail },
  in_discussion: { label: 'En discussion', labelEn: 'In Discussion', color: 'bg-yellow-100 text-yellow-600', icon: MessageSquare },
  qualified: { label: 'Qualifié', labelEn: 'Qualified', color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
  not_interested: { label: 'Pas intéressé', labelEn: 'Not Interested', color: 'bg-red-100 text-red-600', icon: XCircle },
  converted: { label: 'Converti', labelEn: 'Converted', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
};

export default function MyLeads() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const allBusinesses = await base44.entities.Business.filter(
        { seller_email: userData.email },
        '-created_date'
      );
      setBusinesses(allBusinesses);

      const allLeads = await base44.entities.Lead.list('-created_date');
      const myLeads = allLeads.filter(lead => 
        allBusinesses.some(b => b.id === lead.business_id)
      );
      setLeads(myLeads);
    } catch (e) {
      base44.auth.redirectToLogin();
    }
    setLoading(false);
  };

  const getBusinessTitle = (businessId) => {
    const business = businesses.find(b => b.id === businessId);
    return business ? business.title : 'Unknown Business';
  };

  const handleStatusChange = async (leadId, newStatus) => {
    await base44.entities.Lead.update(leadId, { status: newStatus });
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {t('leads')}
          </h1>
          <p className="text-gray-500">
            {leads.length} {language === 'fr' ? 'lead(s)' : 'lead(s)'}
          </p>
        </div>

        {leads.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucun lead' : 'No leads yet'}
              </h3>
              <p className="text-gray-500">
                {language === 'fr' ? 'Les acheteurs intéressés apparaîtront ici' : 'Interested buyers will appear here'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const statusInfo = LEAD_STATUS[lead.status] || LEAD_STATUS.new;
              const StatusIcon = statusInfo.icon;
              return (
                <Card key={lead.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {lead.buyer_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{lead.buyer_name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{lead.buyer_email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'fr' ? 'Annonce:' : 'Listing:'} 
                          <Link 
                            to={createPageUrl(`BusinessDetails?id=${lead.business_id}`)}
                            className="font-medium text-primary hover:underline ml-1"
                          >
                            {getBusinessTitle(lead.business_id)}
                          </Link>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${statusInfo.color} border-0 text-xs font-medium`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {language === 'fr' ? statusInfo.label : statusInfo.labelEn}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {Object.entries(LEAD_STATUS).map(([key, value]) => (
                            <DropdownMenuItem 
                              key={key} 
                              onClick={() => handleStatusChange(lead.id, key)}
                              className={lead.status === key ? 'bg-gray-100' : ''}
                            >
                              <value.icon className="w-4 h-4 mr-2" />
                              {language === 'fr' ? value.label : value.labelEn}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}