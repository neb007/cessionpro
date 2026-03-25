import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { announcementService } from '@/services/announcementService';
import { emailNotificationService } from '@/services/emailNotificationService';
import { createBusinessDetailsUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Eye, RefreshCcw, ShieldCheck, XCircle } from 'lucide-react';

const PAGE_SIZE = 20;

const STATUS_LABELS = {
  pending: { label: 'En attente', className: 'bg-orange-100 text-orange-700' },
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  withdrawn: { label: 'Désactivée', className: 'bg-red-100 text-red-700' },
  draft: { label: 'Brouillon', className: 'bg-gray-100 text-gray-700' },
  rejected: { label: 'Refusée', className: 'bg-slate-200 text-slate-700' },
  flagged: { label: 'Signalée', className: 'bg-violet-100 text-violet-700' }
};

const SOURCE_FILTERS = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'NATIVE', label: 'Natives' },
  { value: 'SCRAPED', label: 'Importées' }
];

const completionFields = [
  'title', 'description', 'sector', 'asking_price', 'annual_revenue',
  'ebitda', 'employees', 'location', 'country', 'department', 'region',
  'year_founded', 'reason_for_sale', 'confidential', 'hide_location',
  'assets_included', 'images', 'legal_structure', 'registration_number',
  'lease_info', 'licenses', 'financial_years', 'market_position',
  'competitive_advantages', 'growth_opportunities', 'customer_base',
  'business_type', 'reference_number', 'buyer_budget_min', 'buyer_budget_max',
  'buyer_sectors_interested', 'buyer_locations', 'buyer_employees_min',
  'buyer_employees_max', 'buyer_revenue_min', 'buyer_revenue_max',
  'buyer_investment_available', 'buyer_profile_type', 'buyer_notes',
  'business_type_sought', 'seller_business_type', 'buyer_document_url',
  'buyer_document_name'
];

function calculateCompletionRate(announcement) {
  if (!announcement) return 0;
  const total = completionFields.length;
  if (!total) return 0;
  const filled = completionFields.reduce((count, field) => {
    const value = announcement[field];
    if (Array.isArray(value)) return value.length > 0 ? count + 1 : count;
    if (typeof value === 'boolean') return count + 1;
    if (typeof value === 'number') return Number.isFinite(value) ? count + 1 : count;
    if (typeof value === 'string') return value.trim().length > 0 ? count + 1 : count;
    return value ? count + 1 : count;
  }, 0);
  return Math.round((filled / total) * 100);
}

export default function AdminAnnonces() {
  const { user, isLoadingAuth } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sellerProfiles, setSellerProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [counts, setCounts] = useState({ pending: 0, active: 0, flagged: 0 });

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchText.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [statusFilter, sourceFilter]);

  useEffect(() => {
    if (!user?.id) return;
    const loadAdminFlag = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();
      if (!error) {
        setIsAdmin(!!data?.is_admin);
      }
      setIsCheckingAdmin(false);
    };
    loadAdminFlag();
  }, [user?.id]);

  const loadCounts = useCallback(async () => {
    const c = await announcementService.getAdminCounts();
    setCounts(c);
  }, []);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (statusFilter !== 'ALL') filters.status = statusFilter;
      if (sourceFilter !== 'ALL') filters.sourceType = sourceFilter;
      if (searchDebounced) filters.searchText = searchDebounced;

      const { data, totalCount: count } = await announcementService.listAdminAnnouncementsPaginated(filters, page, PAGE_SIZE);
      setAnnouncements(data);
      setTotalCount(count);
      await loadSellerProfiles(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement des annonces admin:', err);
      setError('Impossible de charger les annonces.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, searchDebounced, page]);

  const loadSellerProfiles = async (items) => {
    const sellerIds = Array.from(
      new Set((items || []).map((a) => a.seller_id).filter(Boolean))
    );
    if (!sellerIds.length) { setSellerProfiles({}); return; }
    try {
      const response = await announcementService.fetchSellerProfiles(sellerIds);
      if (response && 'error' in response && response.error) throw response.error;
      const profilesMap = (response?.data || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
      setSellerProfiles(profilesMap);
    } catch (profileError) {
      console.error('Erreur lors du chargement des profils vendeurs:', profileError);
      setSellerProfiles({});
    }
  };

  // Load data when admin is confirmed
  useEffect(() => {
    if (!isAdmin) return;
    loadCounts();
  }, [isAdmin, loadCounts]);

  // Load page data when filters/page change
  useEffect(() => {
    if (!isAdmin) return;
    loadAnnouncements();
  }, [isAdmin, loadAnnouncements]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleRefresh = async () => {
    await Promise.all([loadAnnouncements(), loadCounts()]);
  };

  const handleApprove = async (announcement) => {
    setActionLoading(announcement.id);
    setError(null);
    try {
      const response = await announcementService.approveAnnouncement(announcement.id);
      if (response?.error) throw response.error;
      if (response?.status === 'active') {
        const idempotencyKey = `listing:${response.id}:published`;
        await emailNotificationService.sendListingPublished({
          listingId: response.id, recipientId: response.seller_id,
          idempotencyKey, language: 'fr'
        });
        await emailNotificationService.sendSmartMatchNotification({
          listingId: response.id, idempotencyKey: `smartmatch:${response.id}`, language: 'fr'
        });
      }
      await handleRefresh();
    } finally { setActionLoading(null); }
  };

  const handleDisable = async (announcement) => {
    setActionLoading(announcement.id);
    setError(null);
    try {
      const response = await announcementService.disableAnnouncement(announcement.id);
      if (response?.error) throw response.error;
      await handleRefresh();
    } finally { setActionLoading(null); }
  };

  const handleToggleCertified = async (announcement) => {
    setActionLoading(announcement.id);
    setError(null);
    try {
      const response = await announcementService.toggleCertification(announcement.id, !announcement.is_certified);
      if (response?.error) throw response.error;
      await handleRefresh();
    } finally { setActionLoading(null); }
  };

  const handleRejectSubmit = async () => {
    if (!selectedAnnouncement || !rejectReason.trim()) return;
    setActionLoading(selectedAnnouncement.id);
    setError(null);
    try {
      const response = await announcementService.rejectAnnouncement(selectedAnnouncement.id, rejectReason.trim());
      if (response?.error) throw response.error;
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedAnnouncement(null);
      await handleRefresh();
    } finally { setActionLoading(null); }
  };

  if (isLoadingAuth) return <div className="p-8">Chargement...</div>;
  if (isCheckingAdmin) return <div className="p-8">Vérification des droits...</div>;

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center bg-[#FAF9F7] p-8">
        <Card className="p-6 max-w-lg text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Accès refusé</h2>
          <p className="text-sm text-gray-500 mt-2">Cette interface est réservée aux administrateurs.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F7] px-6 py-8">
      <div className="w-full space-y-6">
        <Card className="p-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Admin • Annonces</h1>
              <p className="text-sm text-gray-500">Modération et publication des annonces.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Rafraîchir
              </Button>
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  MAJ : {lastUpdated.toLocaleTimeString('fr-FR')}
                </span>
              )}
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <button type="button" onClick={() => setStatusFilter(statusFilter === 'pending' ? 'ALL' : 'pending')} className={`p-4 rounded-xl text-left transition-all ${statusFilter === 'pending' ? 'ring-2 ring-orange-400 bg-orange-100' : 'bg-orange-50 hover:bg-orange-100'} border border-orange-100`}>
              <p className="text-xs text-gray-500">En attente</p>
              <p className="text-2xl font-semibold text-orange-600">{counts.pending}</p>
            </button>
            <button type="button" onClick={() => setStatusFilter(statusFilter === 'flagged' ? 'ALL' : 'flagged')} className={`p-4 rounded-xl text-left transition-all ${statusFilter === 'flagged' ? 'ring-2 ring-violet-400 bg-violet-100' : 'bg-violet-50 hover:bg-violet-100'} border border-violet-100`}>
              <p className="text-xs text-gray-500">Signalées</p>
              <p className="text-2xl font-semibold text-violet-600">{counts.flagged}</p>
            </button>
            <button type="button" onClick={() => setStatusFilter(statusFilter === 'active' ? 'ALL' : 'active')} className={`p-4 rounded-xl text-left transition-all ${statusFilter === 'active' ? 'ring-2 ring-emerald-400 bg-emerald-100' : 'bg-emerald-50 hover:bg-emerald-100'} border border-emerald-100`}>
              <p className="text-xs text-gray-500">Actives</p>
              <p className="text-2xl font-semibold text-emerald-600">{counts.active}</p>
            </button>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Rechercher par titre"
                className="w-full sm:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="withdrawn">Désactivées</SelectItem>
                  <SelectItem value="rejected">Refusées</SelectItem>
                  <SelectItem value="flagged">Signalées</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_FILTERS.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm text-gray-500">
              {totalCount} annonce{totalCount > 1 ? 's' : ''}
            </span>
          </div>

          {error && <div className="p-4 text-sm text-red-600">{error}</div>}
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aperçu</TableHead>
                <TableHead>Titre & Catégorie</TableHead>
                <TableHead>Vendeur/Source</TableHead>
                <TableHead>Complétion</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                    Aucune annonce trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => {
                  const status = STATUS_LABELS[announcement.status] || {
                    label: announcement.status || 'Inconnu',
                    className: 'bg-slate-100 text-slate-700'
                  };
                  const profile = announcement.seller_id ? sellerProfiles[announcement.seller_id] : null;
                  const sellerDisplay =
                    profile?.company_name ||
                    profile?.full_name ||
                    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
                    announcement.seller_name ||
                    '—';
                  const completionRate = calculateCompletionRate(announcement);
                  return (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        {announcement.main_image ? (
                          <img
                            src={announcement.main_image}
                            alt={announcement.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-100" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{announcement.title || 'Sans titre'}</div>
                        <div className="text-xs text-gray-500">{announcement.category || '—'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">
                          {sellerDisplay || announcement.source_name}
                        </div>
                        <div className="text-xs text-gray-400">{announcement.source_type || 'NATIVE'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold text-gray-900">{completionRate}%</div>
                        <div className="text-xs text-gray-400">Champs remplis</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {announcement.created_at
                          ? new Date(announcement.created_at).toLocaleDateString('fr-FR')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.className}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(createBusinessDetailsUrl(announcement), '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleCertified(announcement)}
                            disabled={actionLoading === announcement.id}
                            title={announcement.is_certified ? 'Retirer la certification' : 'Certifier l\'annonce'}
                          >
                            <ShieldCheck className={`w-4 h-4 ${announcement.is_certified ? 'text-emerald-600' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(announcement)}
                            disabled={actionLoading === announcement.id}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setShowRejectDialog(true);
                            }}
                            disabled={actionLoading === announcement.id}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisable(announcement)}
                            disabled={actionLoading === announcement.id}
                          >
                            Désactiver
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <span className="text-sm text-gray-500">
                Page {page + 1} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1 || loading}
                  onClick={() => setPage(page + 1)}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser l'annonce</DialogTitle>
            <DialogDescription>
              Ajoute un message qui sera transmis à l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="Motif du refus (obligatoire)"
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRejectSubmit} disabled={!rejectReason.trim()}>
              Confirmer le refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
