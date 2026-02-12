import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PriceCalculator({
  formData,
  language = 'fr'
}) {
  const getBenchmarkBySector = (sector) => {
    const benchmarks = {
      technology: { minPER: 3, maxPER: 8, avgMargin: 20 },
      retail: { minPER: 1.5, maxPER: 4, avgMargin: 8 },
      hospitality: { minPER: 2, maxPER: 5, avgMargin: 15 },
      manufacturing: { minPER: 2, maxPER: 6, avgMargin: 12 },
      services: { minPER: 1.5, maxPER: 5, avgMargin: 18 },
      healthcare: { minPER: 4, maxPER: 9, avgMargin: 22 },
      construction: { minPER: 1, maxPER: 3, avgMargin: 10 },
      transport: { minPER: 1.5, maxPER: 4, avgMargin: 12 },
      agriculture: { minPER: 1, maxPER: 3, avgMargin: 8 },
      other: { minPER: 2, maxPER: 5, avgMargin: 15 }
    };
    return benchmarks[sector] || benchmarks.other;
  }

  const calculations = useMemo(() => {
    const price = parseFloat(formData.asking_price) || 0;
    const revenue = parseFloat(formData.annual_revenue) || 0;
    const ebitda = parseFloat(formData.ebitda) || 0;

    return {
      // Ratio Prix/Revenue (PER)
      per: revenue > 0 ? (price / revenue).toFixed(2) : null,
      
      // Ratio Prix/EBITDA
      priceToEbitda: ebitda > 0 ? (price / ebitda).toFixed(2) : null,

      // Margé EBITDA
      ebitdaMargin: revenue > 0 ? ((ebitda / revenue) * 100).toFixed(1) : null,

      // Benchmark (basé sur le secteur - valeurs moyennes)
      benchmark: getBenchmarkBySector(formData.sector)
    };
  }, [formData.asking_price, formData.annual_revenue, formData.ebitda, formData.sector]);

  const getPerStatus = () => {
    if (!calculations.per) return null;
    const per = parseFloat(calculations.per);
    const bench = calculations.benchmark;
    
    if (per < bench.minPER) return { status: 'good', label: language === 'fr' ? 'Bon prix' : 'Good price' };
    if (per <= bench.maxPER) return { status: 'fair', label: language === 'fr' ? 'Prix normal' : 'Fair price' };
    return { status: 'high', label: language === 'fr' ? 'Prix élevé' : 'High price' };
  };

  const getMarginStatus = () => {
    if (!calculations.ebitdaMargin) return null;
    const margin = parseFloat(calculations.ebitdaMargin);
    const bench = calculations.benchmark;

    if (margin > bench.avgMargin) return { status: 'excellent', label: '✓ Excellent' };
    if (margin >= bench.avgMargin * 0.8) return { status: 'good', label: '✓ Bon' };
    return { status: 'warning', label: '⚠ À améliorer' };
  };

  const perStatus = getPerStatus();
  const marginStatus = getMarginStatus();

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-primary text-white pb-2 sm:pb-3">
          <CardTitle className="font-display text-base sm:text-lg flex items-center gap-2">
            <Calculator className="w-4 sm:w-5 h-4 sm:h-5" />
            {language === 'fr' ? 'Analyse financière' : 'Financial Analysis'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          {/* PER (Price to Earnings Ratio) */}
          {calculations.per && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    {language === 'fr' ? 'Multiple prix/chiffre affaires' : 'Price-to-Revenue Multiple'}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {calculations.per}x
                  </p>
                </div>
                {perStatus && (
                  <Badge
                    className={`${
                      perStatus.status === 'good'
                        ? 'bg-green-500'
                        : perStatus.status === 'fair'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    } text-white`}
                  >
                    {perStatus.label}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {language === 'fr'
                  ? `Benchmark: ${calculations.benchmark.minPER}x - ${calculations.benchmark.maxPER}x`
                  : `Benchmark: ${calculations.benchmark.minPER}x - ${calculations.benchmark.maxPER}x`}
              </p>
            </div>
          )}

          {/* Price to EBITDA */}
          {calculations.priceToEbitda && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">
                {language === 'fr' ? 'Multiple prix/EBITDA' : 'Price-to-EBITDA Multiple'}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {calculations.priceToEbitda}x
              </p>
            </div>
          )}

          {/* EBITDA Margin */}
          {calculations.ebitdaMargin && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    {language === 'fr' ? 'Marge EBITDA' : 'EBITDA Margin'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {calculations.ebitdaMargin}%
                  </p>
                </div>
                {marginStatus && (
                  <span className="text-sm font-semibold text-green-700">
                    {marginStatus.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {language === 'fr'
                  ? `Moyenne du secteur: ${calculations.benchmark.avgMargin}%`
                  : `Industry average: ${calculations.benchmark.avgMargin}%`}
              </p>
            </div>
          )}

          {/* Summary Box */}
          {(calculations.per || calculations.priceToEbitda) && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <p className="text-xs font-semibold text-gray-900">
                {language === 'fr' ? '📊 Résumé de valorisation' : '📊 Valuation Summary'}
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-600">{language === 'fr' ? 'Prix' : 'Price'}</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(formData.asking_price)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">CA</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(formData.annual_revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">EBITDA</p>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(formData.ebitda)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          {!calculations.per && !calculations.priceToEbitda && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 {language === 'fr'
                  ? 'Complétez le prix, le CA et l\'EBITDA pour voir l\'analyse'
                  : 'Complete price, revenue and EBITDA to see analysis'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
