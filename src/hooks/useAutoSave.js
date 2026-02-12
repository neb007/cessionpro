import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook pour sauvegarder automatiquement le formulaire en brouillon
 */
export function useAutoSave(formData, storageKey = 'formDraft', interval = 30000) {
  const { toast } = useToast();
  const timeoutRef = useRef(null);

  // Sauvegarder en localStorage
  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }, [formData, storageKey]);

  // Auto-save à intervalle régulier
  useEffect(() => {
    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Mettre en place nouveau timeout
    timeoutRef.current = setTimeout(() => {
      if (saveDraft()) {
        // Toast silencieux (optionnel)
        console.log('Draft auto-saved');
      }
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, interval, saveDraft]);

  // Charger le brouillon sauvegardé
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }, [storageKey]);

  // Supprimer le brouillon
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing draft:', error);
      return false;
    }
  }, [storageKey]);

  // Sauvegarder immédiatement
  const saveDraftNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return saveDraft();
  }, [saveDraft]);

  return {
    saveDraft: saveDraftNow,
    loadDraft,
    clearDraft,
    hasDraft: () => localStorage.getItem(storageKey) !== null
  };
}
