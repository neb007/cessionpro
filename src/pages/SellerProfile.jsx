import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { getSellerProfile, updateSellerProfile } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const TRANSACTION_SIZES = [
  { value: 'less_1m', label: 'Moins d\'1M€' },
  { value: '1_5m', label: '1M€ - 5M€' },
  { value: '5_10m', label: '5M€ - 10M€' },
  { value: 'more_10m', label: 'Plus de 10M€' }
];

export default function SellerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    profileType: '',
    transactionSize: ''
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user?.id) return;
      const data = await getSellerProfile(user.id);
      setProfile(data);
      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        companyName: data.company_name || '',
        phone: data.phone || '',
        profileType: data.profile_type || '',
        transactionSize: data.transaction_size || ''
      });
    } catch (err) {
      setError('Erreur lors du chargement du profil');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      await updateSellerProfile(user.id, formData);
      await loadProfile();
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-charcoal">Mon Profil Vendeur</h1>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isLoading}
          className="w-32"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isEditing ? 'Enregistrer' : 'Modifier'}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Informations Personnelles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-charcoal">Informations Personnelles</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Prénom</Label>
            {isEditing ? (
              <Input
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Votre prénom"
              />
            ) : (
              <p className="text-gray-700 p-2">{profile?.first_name || 'Non renseigné'}</p>
            )}
          </div>
          <div>
            <Label>Nom</Label>
            {isEditing ? (
              <Input
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Votre nom"
              />
            ) : (
              <p className="text-gray-700 p-2">{profile?.last_name || 'Non renseigné'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label>Téléphone</Label>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                type="tel"
              />
            ) : (
              <p className="text-gray-700 p-2">{profile?.phone || 'Non renseigné'}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Section 2: Informations Entreprise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-charcoal">Informations Entreprise</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Nom de l'Entreprise</Label>
            {isEditing ? (
              <Input
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Nom de votre entreprise"
              />
            ) : (
              <p className="text-gray-700 p-2">{profile?.company_name || 'Non renseigné'}</p>
            )}
          </div>
          <div>
            <Label>Type de Profil</Label>
            {isEditing ? (
              <select
                value={formData.profileType}
                onChange={e => setFormData({ ...formData, profileType: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="professional">Professionnel / Indépendant</option>
                <option value="consulting">Cabinet de Conseil</option>
                <option value="investment_fund">Fonds d'Investissement</option>
              </select>
            ) : (
              <p className="text-gray-700 p-2">{profile?.profile_type || 'Non renseigné'}</p>
            )}
          </div>
          <div>
            <Label>Taille de Transaction Envisagée</Label>
            {isEditing ? (
              <select
                value={formData.transactionSize}
                onChange={e => setFormData({ ...formData, transactionSize: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner</option>
                {TRANSACTION_SIZES.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-700 p-2">
                {TRANSACTION_SIZES.find(s => s.value === profile?.transaction_size)?.label || 'Non renseigné'}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isLoading} className="flex-1">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Enregistrer les modifications
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex-1">
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}
