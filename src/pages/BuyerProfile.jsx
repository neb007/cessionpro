import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { 
  getBuyerProfile, 
  updateBuyerProfile, 
  uploadProfileDocument, 
  deleteProfileDocument 
} from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Download, X, Upload } from 'lucide-react';

const SECTORS = [
  'Technology', 'Industrie', 'Santé', 'Construction', 'Retail',
  'Logistique', 'Services', 'Hospitality', 'Manufacturing', 'Agriculture'
];

const TRANSACTION_SIZES = [
  { value: 'less_1m', label: 'Moins d\'1M€' },
  { value: '1_5m', label: '1M€ - 5M€' },
  { value: '5_10m', label: '5M€ - 10M€' },
  { value: 'more_10m', label: 'Plus de 10M€' }
];

export default function BuyerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    sectors: [],
    profileType: '',
    transactionSize: '',
    motivationReprise: '',
    experienceProfessionnelle: '',
    linkedinUrl: '',
    aideVendeurDescription: ''
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user?.id) return;
      const data = await getBuyerProfile(user.id);
      setProfile(data);
      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone || '',
        sectors: data.sectors || [],
        profileType: data.profile_type || '',
        transactionSize: data.transaction_size || '',
        motivationReprise: data.motivation_reprise || '',
        experienceProfessionnelle: data.experience_professionnelle || '',
        linkedinUrl: data.linkedin_url || '',
        aideVendeurDescription: data.aide_vendeur_description || ''
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

      await updateBuyerProfile(user.id, formData);
      await loadProfile();
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (e, docType) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setError('');
      setSuccess('');
      setUploading(prev => ({ ...prev, [docType]: true }));

      await uploadProfileDocument(user.id, docType, file);
      await loadProfile();
      setSuccess(`${docType === 'cv' ? 'CV' : 'Document'} téléchargé avec succès !`);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const handleDeleteDocument = async (docType) => {
    try {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

      setError('');
      setSuccess('');
      await deleteProfileDocument(user.id, docType);
      await loadProfile();
      setSuccess('Document supprimé avec succès !');
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
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
        <h1 className="text-3xl font-bold text-charcoal">Mon Profil Acheteur</h1>
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

      {/* Section 2: Profil d'Acquisition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-charcoal">Votre Profil d'Acquisition</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
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
            <Label>Taille de Transaction Recherchée</Label>
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

        {/* Secteurs */}
        <div>
          <Label>Secteurs d'Intérêt (max 3)</Label>
          {isEditing ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {SECTORS.map(sector => (
                <button
                  key={sector}
                  onClick={() => {
                    const newSectors = formData.sectors.includes(sector)
                      ? formData.sectors.filter(s => s !== sector)
                      : [...formData.sectors.slice(0, 2), sector].slice(0, 3);
                    setFormData({ ...formData, sectors: newSectors });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.sectors.includes(sector)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-charcoal'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 p-2">
              {profile?.sectors?.length > 0 ? profile.sectors.join(', ') : 'Non renseigné'}
            </p>
          )}
        </div>
      </motion.div>

      {/* Section 3: Informations Complémentaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-charcoal">Informations Complémentaires</h2>

        <div>
          <Label>Motivation pour la Reprise</Label>
          {isEditing ? (
            <textarea
              value={formData.motivationReprise}
              onChange={e => setFormData({ ...formData, motivationReprise: e.target.value })}
              placeholder="Décrivez votre motivation pour reprendre une entreprise..."
              className="w-full p-3 border rounded h-24"
            />
          ) : (
            <p className="text-gray-700 p-2 whitespace-pre-wrap">
              {profile?.motivation_reprise || 'Non renseigné'}
            </p>
          )}
        </div>

        <div>
          <Label>Expérience Professionnelle</Label>
          {isEditing ? (
            <textarea
              value={formData.experienceProfessionnelle}
              onChange={e => setFormData({ ...formData, experienceProfessionnelle: e.target.value })}
              placeholder="Décrivez votre parcours et expertise..."
              className="w-full p-3 border rounded h-24"
            />
          ) : (
            <p className="text-gray-700 p-2 whitespace-pre-wrap">
              {profile?.experience_professionnelle || 'Non renseigné'}
            </p>
          )}
        </div>

        <div>
          <Label>Profil LinkedIn (URL)</Label>
          {isEditing ? (
            <Input
              value={formData.linkedinUrl}
              onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              type="url"
            />
          ) : (
            <a
              href={profile?.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile?.linkedin_url || 'Non renseigné'}
            </a>
          )}
        </div>

        <div>
          <Label>Présentation pour les Vendeurs</Label>
          {isEditing ? (
            <textarea
              value={formData.aideVendeurDescription}
              onChange={e => setFormData({ ...formData, aideVendeurDescription: e.target.value })}
              placeholder="Aidez les vendeurs à mieux comprendre votre projet..."
              className="w-full p-3 border rounded h-24"
            />
          ) : (
            <p className="text-gray-700 p-2 whitespace-pre-wrap">
              {profile?.aide_vendeur_description || 'Non renseigné'}
            </p>
          )}
        </div>
      </motion.div>

      {/* Section 4: Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-charcoal">Documents</h2>

        {/* CV */}
        <div className="border rounded-lg p-4">
          <Label className="text-lg font-medium">CV</Label>
          {profile?.cv_document_url ? (
            <div className="mt-2 flex items-center justify-between">
              <a
                href={profile.cv_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Download className="w-4 h-4" />
                {profile.cv_document_name}
              </a>
              {isEditing && (
                <button
                  onClick={() => handleDeleteDocument('cv')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">Aucun CV uploadé</p>
          )}

          {isEditing && (
            <label className="mt-3 flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80">
              <Upload className="w-4 h-4" />
              <span>Remplacer le CV</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => handleDocumentUpload(e, 'cv')}
                disabled={uploading.cv}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Financing Document */}
        <div className="border rounded-lg p-4">
          <Label className="text-lg font-medium">Document de Financement</Label>
          {profile?.financing_document_url ? (
            <div className="mt-2 flex items-center justify-between">
              <a
                href={profile.financing_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Download className="w-4 h-4" />
                {profile.financing_document_name}
              </a>
              {isEditing && (
                <button
                  onClick={() => handleDeleteDocument('financing')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">Aucun document uploadé</p>
          )}

          {isEditing && (
            <label className="mt-3 flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80">
              <Upload className="w-4 h-4" />
              <span>Remplacer le document</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => handleDocumentUpload(e, 'financing')}
                disabled={uploading.financing}
                className="hidden"
              />
            </label>
          )}
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
