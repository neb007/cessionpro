import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, Edit2, Check } from 'lucide-react';
import PriceCalculator from '@/components/PriceCalculator';

export default function FinancialAnalysisModal({
  open,
  onOpenChange,
  formData,
  onDataChange,
  language = 'fr'
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleValidate = () => {
    setIsEditing(false);
    if (onDataChange) {
      onDataChange(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <DialogTitle className="font-display">
              {language === 'fr' ? 'Analyse financière' : 'Financial Analysis'}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="py-6">
          <PriceCalculator
            formData={formData}
            language={language}
            editable={isEditing}
            onFormChange={onDataChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          {!isEditing ? (
            <>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Éditer' : 'Edit'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </Button>
              <Button
                onClick={handleValidate}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Check className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Valider' : 'Validate'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
