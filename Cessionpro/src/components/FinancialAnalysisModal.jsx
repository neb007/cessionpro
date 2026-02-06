import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, TrendingUp } from 'lucide-react';
import PriceCalculator from '@/components/PriceCalculator';

export default function FinancialAnalysisModal({
  open,
  onOpenChange,
  formData,
  language = 'fr'
}) {
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
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
