import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Users } from 'lucide-react';

const ADMIN_EMAIL = 'nebil007@hotmail.fr';

export default function AdminUsers() {
  const { user, isLoadingAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [profiles, setProfiles] = useState([]);
  const [listingCounts, setListingCounts] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!isAdmin) return;
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, company_name, full_name, first_name, last_name, is_buyer, is_seller, is_blocked, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: listingsData, error: listingsError } = await supabase
        .from('businesses')
        .select('id, seller_id, type')
        .eq('status', 'active');

      if (listingsError) throw listingsError;

      const counts = (listingsData || []).reduce((acc, listing) => {
        if (!listing.seller_id) return acc;
        if (!acc[listing.seller_id]) {
          acc[listing.seller_id] = { cession: 0, acquisition: 0 };
        }
        if (listing.type === 'cession') acc[listing.seller_id].cession += 1;
        if (listing.type === 'acquisition') acc[listing.seller_id].acquisition += 1;
        return acc;
      }, {});

      setProfiles(profilesData || []);
      setListingCounts(counts);
    } catch (err) {
      console.error('Erreur lors du chargement des comptes:', err);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesText = !query || [profile.email, profile.company_name, profile.full_name, profile.first_name, profile.last_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

      if (!matchesText) return false;

      if (roleFilter === 'BUYER') {
        return profile.is_buyer && !profile.is_seller;
      }
      if (roleFilter === 'SELLER') {
        return profile.is_seller && !profile.is_buyer;
      }
      if (roleFilter === 'HYBRID') {
        return profile.is_buyer && profile.is_seller;
      }

      return true;
    });
  }, [profiles, searchText, roleFilter]);

  const updateUserBlockStatus = async (profile) => {
    if (!profile?.id) return;
    const nextBlocked = !profile.is_blocked;
    setActionLoading(profile.id);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_blocked: nextBlocked })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      const statusToApply = nextBlocked ? 'withdrawn' : 'draft';
      const { error: listingError } = await supabase
        .from('businesses')
        .update({ status: statusToApply })
        .eq('seller_id', profile.id);

      if (listingError) throw listingError;

      await loadUsers();
    } catch (err) {
      console.error('Erreur lors du blocage utilisateur:', err);
      setError('Impossible de mettre à jour le statut utilisateur.');
    } finally {
      setActionLoading(null);
    }
  };

  const getDisplayName = (profile) => {
    return (
      profile.company_name ||
      profile.full_name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
      '—'
    );
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
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin • Utilisateurs</h1>
            <p className="text-sm text-gray-500">Gestion des comptes créés sur la plateforme.</p>
          </div>
        </header>

        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {profiles.length} comptes
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous</SelectItem>
                  <SelectItem value="BUYER">Acheteurs</SelectItem>
                  <SelectItem value="SELLER">Vendeurs</SelectItem>
                  <SelectItem value="HYBRID">Hybrides</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Rechercher par email ou nom"
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {error && <div className="p-4 text-sm text-red-600">{error}</div>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôles</TableHead>
                <TableHead>Offres Cession</TableHead>
                <TableHead>Offres Acquisition</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => {
                  const counts = listingCounts[profile.id] || { cession: 0, acquisition: 0 };
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">{getDisplayName(profile)}</div>
                        <div className="text-xs text-gray-500">{profile.company_name || 'Compte individuel'}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{profile.email || '—'}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {profile.is_buyer && profile.is_seller
                          ? 'Hybride'
                          : profile.is_seller
                            ? 'Vendeur'
                            : profile.is_buyer
                              ? 'Acheteur'
                              : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{counts.cession}</TableCell>
                      <TableCell className="text-sm text-gray-600">{counts.acquisition}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleDateString('fr-FR')
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={profile.is_blocked ? 'outline' : 'destructive'}
                          size="sm"
                          disabled={actionLoading === profile.id}
                          onClick={() => updateUserBlockStatus(profile)}
                        >
                          {profile.is_blocked ? 'Débloquer' : 'Bloquer'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}