import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle } from 'lucide-react';

export default function CompletionChecklist({
  open,
  onOpenChange,
  formData,
  onPublish,
  language = 'fr'
}) {
  const requiredChecks = [
    {
      id: 'title',
      label: language === 'fr' ? 'Titre de l\'annonce' : 'Announcement title',
      completed: !!formData.title,
      critical: true
    },
    {
      id: 'sector',
      label: language === 'fr' ? 'Secteur d\'activité' : 'Business sector',
      completed: !!formData.sector,
      critical: true
    },
    {
      id: 'location',
      label: language === 'fr' ? 'Localisation' : 'Location',
      completed: !!formData.location,
      critical: true
    },
    {
      id: 'price',
      label: language === 'fr' ? 'Prix de vente' : 'Asking price',
      completed: !!formData.asking_price,
      critical: true
    },
    {
      id: 'description',
      label: language === 'fr' ? 'Description complète' : 'Detailed description',
      completed: formData.description && formData.description.length >= 50,
      critical: false
    },
    {
      id: 'images',
      label: language === 'fr' ? 'Au moins une photo' : 'At least one photo',
      completed: formData.images && formData.images.length > 0,
      critical: false
    },
    {
      id: 'financial',
      label: language === 'fr' ? 'Données financières' : 'Financial data',
      completed: formData.annual_revenue && formData.ebitda,
      critical: false
    },
    {
      id: 'market',
      label: language === 'fr' ? 'Positionnement marché' : 'Market position',
      completed: formData.market_position && formData.competitive_advantages,
      critical: false
    }
  ];

  const criticalChecks = requiredChecks.filter(c => c.critical);
  const recommendedChecks = requiredChecks.filter(c => !c.critical);

  const allCriticalComplete = criticalChecks.every(c => c.completed);
  const criticalCompletedCount = criticalChecks.filter(c => c.completed).length;
  const recommendedCompletedCount = recommendedChecks.filter(c => c.completed).length;

  const CheckItemRow = ({ check, isCritical }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      check.completed ? 'bg-green-50' : isCritical ? 'bg-red-50' : 'bg-gray-50'
    }`}>
      {check.completed ? (
        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : isCritical ? (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{check.label}</p>
      </div>
      <span className={`text-xs font-semibold ${
        check.completed ? 'text-green-700' : isCritical ? 'text-red-700' : 'text-gray-500'
      }`}>
        {check.completed ? '✓' : '✗'}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {language === 'fr' ? 'Vérification finale' : 'Final Check'}
          </DialogTitle>
          <DialogDescription>
            {language === 'fr'
              ? 'Assurez-vous que tous les champs obligatoires sont complétés'
              : 'Make sure all required fields are completed'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Critical Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                *
              </span>
              {language === 'fr' ? 'Champs obligatoires' : 'Required fields'} ({criticalCompletedCount}/{criticalChecks.length})
            </h3>
            <div className="space-y-2">
              {criticalChecks.map(check => (
                <CheckItemRow key={check.id} check={check} isCritical={true} />
              ))}
            </div>
          </div>

          {/* Recommended Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                +
              </span>
              {language === 'fr' ? 'Recommandé' : 'Recommended'} ({recommendedCompletedCount}/{recommendedChecks.length})
            </h3>
            <div className="space-y-2">
              {recommendedChecks.map(check => (
                <CheckItemRow key={check.id} check={check} isCritical={false} />
              ))}
            </div>
          </div>

          {/* Warning if critical incomplete */}
          {!allCriticalComplete && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ {language === 'fr'
                  ? 'Complétez tous les champs obligatoires avant de publier'
                  : 'Complete all required fields before publishing'}
              </p>
            </div>
          )}

          {/* Info if all complete */}
          {allCriticalComplete && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✓ {language === 'fr'
                  ? 'Prêt à publier! Vous pouvez toujours ajouter des détails recommandés'
                  : 'Ready to publish! You can still add recommended details'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {language === 'fr' ? 'Retour' : 'Back'}
          </Button>
          <Button
            onClick={onPublish}
            disabled={!allCriticalComplete}
            className="bg-gradient-to-r from-primary to-blue-600"
          >
            {language === 'fr' ? 'Publier' : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
