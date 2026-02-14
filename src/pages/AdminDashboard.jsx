import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import { Card } from '@/components/ui/card';
import { AlertTriangle, FileText, Users, ShieldCheck, Clock, TrendingUp } from 'lucide-react';

const ADMIN_EMAIL = 'nebil007@hotmail.fr';

export default function AdminDashboard() {
  const { user, isLoadingAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalListings: 0,
    cessionListings: 0,
    acquisitionListings: 0,
    pendingListings: 0,
    certifiedListings: 0,
    totalUsers: 0,
    buyers: 0,
    sellers: 0,
    hybrid: 0,
  });

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!isAdmin) return;
    loadStats();
  }, [isAdmin]);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listingsResponse, profilesResponse] = await Promise.all([
        supabase
          .from('businesses')
          .select('id, status, type, is_certified', { count: 'exact' }),
        supabase
          .from('profiles')
          .select('id, is_buyer, is_seller', { count: 'exact' })
      ]);

      if (listingsResponse.error) throw listingsResponse.error;
      if (profilesResponse.error) throw profilesResponse.error;

      const listings = listingsResponse.data || [];
      const profiles = profilesResponse.data || [];

      const cessionListings = listings.filter((item) => item.type === 'cession').length;
      const acquisitionListings = listings.filter((item) => item.type === 'acquisition').length;
      const pendingListings = listings.filter((item) => item.status === 'pending').length;
      const certifiedListings = listings.filter((item) => item.is_certified).length;

      const buyers = profiles.filter((item) => item.is_buyer && !item.is_seller).length;
      const sellers = profiles.filter((item) => item.is_seller && !item.is_buyer).length;
      const hybrid = profiles.filter((item) => item.is_buyer && item.is_seller).length;

      setStats({
        totalListings: listings.length,
        cessionListings,
        acquisitionListings,
        pendingListings,
        certifiedListings,
        totalUsers: profiles.length,
        buyers,
        sellers,
        hybrid,
      });
    } catch (err) {
      console.error('Erreur lors du chargement des stats admin:', err);
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin • Dashboard</h1>
            <p className="text-sm text-gray-500">Vue d’ensemble des statistiques de la plateforme.</p>
          </div>
        </header>

        {error && <div className="text-sm text-red-600">{error}</div>}

        {loading ? (
          <div className="text-sm text-gray-500">Chargement des statistiques...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Cessions publiées</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.cessionListings}</p>
                </div>
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Acquisitions publiées</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.acquisitionListings}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Annonces en attente</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingListings}</p>
                </div>
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Annonces certifiées</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.certifiedListings}</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Comptes créés</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <span className="mr-2">Acheteurs: {stats.buyers}</span>
                <span className="mr-2">Vendeurs: {stats.sellers}</span>
                <span>Hybrides: {stats.hybrid}</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total annonces</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalListings}</p>
                </div>
                <FileText className="w-6 h-6 text-gray-500" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}