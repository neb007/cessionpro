import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { 
  getProfile, 
  updateBuyerProfile, 
  updateSellerProfile,
  uploadProfileDocument, 
  deleteProfileDocument,
  enableBuyerRole,
  enableSellerRole,
  disableBuyerRole,
  disableSellerRole
} from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Download, X, Upload, Toggle2 } from 'lucide-react';

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

export default function Profile() {
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
    companyName: '',
    sectors: [],
    profileType: '',
    transactionSize: '',
    motivationReprise: '',
    experienceProfessionnelle: '',
    linkedinUrl: '',
    aideVendeurDescription: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      if (!user?.id) {
        setError('Utilisateur non authentifié');
        return;
      }
      
      const data = await getProfile(user.id);
      console.log('Profile loaded:', data); // Debug log
      
      if (!data) {
        setError('Profil non trouvé');
        setIsLoading(false);
        return;
      }
      
      setProfile(data);
      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phone: data.phone || '',
        companyName: data.company_name || '',
        sectors: Array.isArray(data.sectors) ? data.sectors : [],
        profileType: data.profile_type || '',
        transactionSize: data.transaction_size || '',
        motivationReprise: data.motivation_reprise || '',
        experienceProfessionnelle: data.experience_professionnelle || '',
        linkedinUrl: data.linkedin_url || '',
        aideVendeurDescription: data.aide_vendeur_description || ''
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Erreur lors du chargement du profil');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      if (profile.is_buyer) {
        await updateBuyerProfile(user.id, formData);
      }
      if (profile.is_seller) {
        await updateSellerProfile(user.id, formData);
      }

      await loadProfile();
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBuyerRole = async () => {
    try {
      if (profile.is_buyer && !profile.is_seller) {
        setError('Impossible désactiver le rôle acheteur');
        return;
      }
      profile.is_buyer ? await disableBuyerRole(user.id) : await enableBuyerRole(user.id);
      await loadProfile();
      setSuccess(`Rôle acheteur ${profile.is_buyer ? 'désactivé' : 'activé'}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleSellerRole = async () => {
    try {
      if (profile.is_seller && !profile.is_buyer) {
        setError('Impossible désactiver le rôle vendeur');
        return;
      }
      profile.is_seller ? await disableSellerRole(user.id) : await enableSellerRole(user.id);
      await loadProfile();
      setSuccess(`Rôle vendeur ${profile.is_seller ? 'désactivé' : 'activé'}`);
    } catch (err) {
      setError(err.message);
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
      setSuccess(`${docType === 'cv' ? 'CV' : 'Document'} téléchargé !`);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const handleDeleteDocument = async (docType) => {
    if (!confirm('Supprimer ce document ?')) return;
    try {
      setError('');
      setSuccess('');
      await deleteProfileDocument(user.id, docType);
      await loadProfile();
      setSuccess('Document supprimé !');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">Mon Profil</h1>
          <p className="text-gray-600 mt-1">
            {profile.is_buyer && profile.is_seller ? 'Acheteur & Vendeur' : profile.is_buyer ? 'Acheteur' : 'Vendeur'}
          </p>
        </div>
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
      {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
      {success && <Alert className="border-green-200 bg-green-50"><CheckCircle2 className="h-4 w-4 text-green-600" /><AlertDescription className="text-green-700">{success}</AlertDescription></Alert>}

      {/* Role Toggle */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-4">
          <Button 
            variant={profile.is_buyer ? "default" : "outline"}
            onClick={handleToggleBuyerRole}
            size="sm"
          >
            <Toggle2 className="w-4 h-4 mr-2" />
            {profile.is_buyer ? 'Acheteur ✓' : 'Activer Acheteur'}
          </Button>
          <Button 
            variant={profile.is_seller ? "default" : "outline"}
            onClick={handleToggleSellerRole}
            size="sm"
          >
            <Toggle2 className="w-4 h-4 mr-2" />
            {profile.is_seller ? 'Vendeur ✓' : 'Activer Vendeur'}
          </Button>
        </div>
      )}

      {/* Infos Perso */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Informations Personnelles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Prénom</Label>
            {isEditing ? <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="Prénom" /> : <p className="text-gray-700 p-2">{profile?.first_name || '-'}</p>}
          </div>
          <div>
            <Label>Nom</Label>
            {isEditing ? <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Nom" /> : <p className="text-gray-700 p-2">{profile?.last_name || '-'}</p>}
          </div>
          <div className="md:col-span-2">
            <Label>Téléphone</Label>
            {isEditing ? <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Téléphone" type="tel" /> : <p className="text-gray-700 p-2">{profile?.phone || '-'}</p>}
          </div>
        </div>
      </motion.div>

      {/* BUYER SECTION */}
      {profile.is_buyer && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-blue-900">👤 Mon Profil Acheteur</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Type de Profil</Label>
              {isEditing ? (
                <select value={formData.profileType} onChange={e => setFormData({ ...formData, profileType: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Sélectionner</option>
                  <option value="professional">Professionnel</option>
                  <option value="consulting">Consulting</option>
                  <option value="investment_fund">Fonds</option>
                </select>
              ) : (
                <p className="text-gray-700 p-2">{profile?.profile_type || '-'}</p>
              )}
            </div>
            <div>
              <Label>Taille Transaction</Label>
              {isEditing ? (
                <select value={formData.transactionSize} onChange={e => setFormData({ ...formData, transactionSize: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Sélectionner</option>
                  {TRANSACTION_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              ) : (
                <p className="text-gray-700 p-2">{TRANSACTION_SIZES.find(s => s.value === profile?.transaction_size)?.label || '-'}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Secteurs</Label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {SECTORS.map(sector => (
                  <button key={sector} onClick={() => { const newSectors = formData.sectors.includes(sector) ? formData.sectors.filter(s => s !== sector) : [...formData.sectors.slice(0, 2), sector].slice(0, 3); setFormData({ ...formData, sectors: newSectors }); }} className={`px-4 py-2 rounded-full text-sm ${formData.sectors.includes(sector) ? 'bg-primary text-white' : 'bg-gray-100'}`}>{sector}</button>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 p-2">{profile?.sectors?.length > 0 ? profile.sectors.join(', ') : '-'}</p>
            )}
          </div>

          <div>
            <Label>Motivation pour la Reprise</Label>
            {isEditing ? <textarea value={formData.motivationReprise} onChange={e => setFormData({ ...formData, motivationReprise: e.target.value })} placeholder="..." className="w-full p-3 border rounded h-20" /> : <p className="text-gray-700 p-2 whitespace-pre-wrap">{profile?.motivation_reprise || '-'}</p>}
          </div>

          <div>
            <Label>Expérience Professionnelle</Label>
            {isEditing ? <textarea value={formData.experienceProfessionnelle} onChange={e => setFormData({ ...formData, experienceProfessionnelle: e.target.value })} placeholder="..." className="w-full p-3 border rounded h-20" /> : <p className="text-gray-700 p-2 whitespace-pre-wrap">{profile?.experience_professionnelle || '-'}</p>}
          </div>

          <div>
            <Label>LinkedIn</Label>
            {isEditing ? <Input value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." type="url" /> : <a href={profile?.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile?.linkedin_url || '-'}</a>}
          </div>

          <div>
            <Label>Message pour Vendeurs</Label>
            {isEditing ? <textarea value={formData.aideVendeurDescription} onChange={e => setFormData({ ...formData, aideVendeurDescription: e.target.value })} placeholder="..." className="w-full p-3 border rounded h-20" /> : <p className="text-gray-700 p-2 whitespace-pre-wrap">{profile?.aide_vendeur_description || '-'}</p>}
          </div>

          {/* Documents */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">CV</Label>
              {profile?.cv_document_url && isEditing && <button onClick={() => handleDeleteDocument('cv')} className="text-red-500"><X className="w-4 h-4" /></button>}
            </div>
            {profile?.cv_document_url ? (
              <a href={profile.cv_document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Download className="w-4 h-4" />{profile.cv_document_name}
              </a>
            ) : (
              <p className="text-gray-500">Aucun CV</p>
            )}
            {isEditing && (
              <label className="flex items-center gap-2 cursor-pointer text-primary">
                <Upload className="w-4 h-4" /><span>Upload CV</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleDocumentUpload(e, 'cv')} disabled={uploading.cv} className="hidden" />
              </label>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Document Financement</Label>
              {profile?.financing_document_url && isEditing && <button onClick={() => handleDeleteDocument('financing')} className="text-red-500"><X className="w-4 h-4" /></button>}
            </div>
            {profile?.financing_document_url ? (
              <a href={profile.financing_document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                <Download className="w-4 h-4" />{profile.financing_document_name}
              </a>
            ) : (
              <p className="text-gray-500">Aucun document</p>
            )}
            {isEditing && (
              <label className="flex items-center gap-2 cursor-pointer text-primary">
                <Upload className="w-4 h-4" /><span>Upload Document</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleDocumentUpload(e, 'financing')} disabled={uploading.financing} className="hidden" />
              </label>
            )}
          </div>
        </motion.div>
      )}

      {/* SELLER SECTION */}
      {profile.is_seller && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 rounded-lg border-2 border-green-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-green-900">🏢 Mon Profil Vendeur</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Entreprise</Label>
              {isEditing ? <Input value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} placeholder="Nom entreprise" /> : <p className="text-gray-700 p-2">{profile?.company_name || '-'}</p>}
            </div>
            <div>
              <Label>Type Profil</Label>
              {isEditing ? (
                <select value={formData.profileType} onChange={e => setFormData({ ...formData, profileType: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Sélectionner</option>
                  <option value="professional">Professionnel</option>
                  <option value="consulting">Consulting</option>
                  <option value="investment_fund">Fonds</option>
                </select>
              ) : (
                <p className="text-gray-700 p-2">{profile?.profile_type || '-'}</p>
              )}
            </div>
            <div>
              <Label>Taille Transaction</Label>
              {isEditing ? (
                <select value={formData.transactionSize} onChange={e => setFormData({ ...formData, transactionSize: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Sélectionner</option>
                  {TRANSACTION_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              ) : (
                <p className="text-gray-700 p-2">{TRANSACTION_SIZES.find(s => s.value === profile?.transaction_size)?.label || '-'}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Buttons */}
      {isEditing && (
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isLoading} className="flex-1">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex-1">Annuler</Button>
        </div>
      )}
    </div>
  );
}
