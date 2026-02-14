import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { announcementService } from '@/services/announcementService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Check, Eye, RefreshCcw, ShieldCheck, XCircle } from 'lucide-react';

const ADMIN_EMAIL = 'nebil007@hotmail.fr';
const STATUS_LABELS = {
  pending: { label: 'En attente', className: 'bg-orange-100 text-orange-700' },
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  withdrawn: { label: 'Désactivée', className: 'bg-red-100 text-red-700' },
  rejected: { label: 'Refusée', className: 'bg-slate-200 text-slate-700' },
  flagged: { label: 'Signalée', className: 'bg-violet-100 text-violet-700' }
};

const SOURCE_FILTERS = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'NATIVE', label: 'Natives' },
  { value: 'SCRAPED', label: 'Importées' }
];

export default function AdminAnnonces() {
  const { user, isLoadingAuth } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [sellerProfiles, setSellerProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const completionFields = useMemo(
    () => [
      'title',
      'description',
      'sector',
      'asking_price',
      'annual_revenue',
      'ebitda',
      'employees',
      'location',
      'country',
      'department',
      'region',
      'year_founded',
      'reason_for_sale',
      'confidential',
      'hide_location',
      'assets_included',
      'images',
      'legal_structure',
      'registration_number',
      'lease_info',
      'licenses',
      'financial_years',
      'market_position',
      'competitive_advantages',
      'growth_opportunities',
      'customer_base',
      'business_type',
      'reference_number',
      'buyer_budget_min',
      'buyer_budget_max',
      'buyer_sectors_interested',
      'buyer_locations',
      'buyer_employees_min',
      'buyer_employees_max',
      'buyer_revenue_min',
      'buyer_revenue_max',
      'buyer_investment_available',
      'buyer_profile_type',
      'buyer_notes',
      'business_type_sought',
      'buyer_document_url',
      'buyer_document_name'
    ],
    []
  );

  const calculateCompletionRate = (announcement) => {
    if (!announcement) return 0;
    const total = completionFields.length;
    if (!total) return 0;

    const filled = completionFields.reduce((count, field) => {
      const value = announcement[field];
      if (Array.isArray(value)) {
        return value.length > 0 ? count + 1 : count;
      }
      if (typeof value === 'boolean') {
        return count + 1;
      }
      if (typeof value === 'number') {
        return Number.isFinite(value) ? count + 1 : count;
      }
      if (typeof value === 'string') {
        return value.trim().length > 0 ? count + 1 : count;
      }
      return value ? count + 1 : count;
    }, 0);

    return Math.round((filled / total) * 100);
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const loadAnnouncements = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        status: statusFilter !== 'ALL' ? statusFilter.toLowerCase() : undefined,
        sourceType: sourceFilter !== 'ALL' ? sourceFilter : undefined,
        searchText: searchText.trim() || undefined
      };

      const data = await announcementService.listAdminAnnouncements(filters);
      setAnnouncements(data || []);
      await loadSellerProfiles(data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement des annonces admin:', err);
      setError('Impossible de charger les annonces.');
    } finally {
      setLoading(false);
    }
  };

  const loadSellerProfiles = async (items) => {
    const sellerIds = Array.from(
      new Set((items || []).map((announcement) => announcement.seller_id).filter(Boolean))
    );

    if (!sellerIds.length) {
      setSellerProfiles({});
      return;
    }

    try {
      const response = await announcementService.fetchSellerProfiles(sellerIds);
      if (response && 'error' in response && response.error) throw response.error;
      const profilesData = response?.data || [];

      const profilesMap = profilesData.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      setSellerProfiles(profilesMap);
    } catch (profileError) {
      console.error('Erreur lors du chargement des profils vendeurs:', profileError);
      setSellerProfiles({});
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadAnnouncements();
  }, [statusFilter, sourceFilter]);

  const filteredAnnouncements = useMemo(() => {
    if (!searchText.trim()) return announcements;
    const query = searchText.toLowerCase();
    return announcements.filter((announcement) =>
      announcement.title?.toLowerCase().includes(query)
    );
  }, [announcements, searchText]);

  const counts = useMemo(() => {
    const total = { pending: 0, active: 0, flagged: 0 };
    announcements.forEach((announcement) => {
      if (announcement.status === 'pending') total.pending += 1;
      if (announcement.status === 'active') total.active += 1;
      if (announcement.status === 'flagged') total.flagged += 1;
    });
    return total;
  }, [announcements]);

  const handleApprove = async (announcement) => {
    setActionLoading(announcement.id);
    setError(null);
    try {
      const response = await announcementService.approveAnnouncement(announcement.id);
      if (response?.error) throw response.error;
      await loadAnnouncements();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisable = async (announcement) => {
    setActionLoading(announcement.id);
    setError(null);
    try {
      const response = await announcementService.disableAnnouncement(announcement.id);
      if (response?.error) throw response.error;
      await loadAnnouncements();
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleCertified = async (announcement) => {
    setActionLoading(announcement.id);
    setError(null);
    try {
      const response = await announcementService.toggleCertification(announcement.id, !announcement.is_certified);
      if (response?.error) throw response.error;
      await loadAnnouncements();
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedAnnouncement) return;
    if (!rejectReason.trim()) return;

    setActionLoading(selectedAnnouncement.id);
    setError(null);
    try {
      const response = await announcementService.rejectAnnouncement(selectedAnnouncement.id, rejectReason.trim());
      if (response?.error) throw response.error;
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedAnnouncement(null);
      await loadAnnouncements();
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoadingAuth) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7] p-8">
        <Card className="p-6 max-w-lg text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Accès refusé</h2>
          <p className="text-sm text-gray-500 mt-2">
            Cette interface est réservée aux administrateurs.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin • Annonces</h1>
            <p className="text-sm text-gray-500">Modération et publication des annonces.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={loadAnnouncements} disabled={loading}>
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

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-gray-500">En attente</p>
            <p className="text-2xl font-semibold text-orange-600">{counts.pending}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Signalées</p>
            <p className="text-2xl font-semibold text-violet-600">{counts.flagged}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Actives</p>
            <p className="text-2xl font-semibold text-emerald-600">{counts.active}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
          </div>
        </Card>

        <Card className="overflow-hidden">
          {error && <div className="p-4 text-sm text-red-600">{error}</div>}
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
              ) : filteredAnnouncements.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                    Aucune annonce trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAnnouncements.map((announcement) => {
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
                            onClick={() => window.open(`/BusinessDetails?id=${announcement.id}`, '_blank')}
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
        </Card>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser l’annonce</DialogTitle>
            <DialogDescription>
              Ajoute un message qui sera transmis à l’utilisateur.
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