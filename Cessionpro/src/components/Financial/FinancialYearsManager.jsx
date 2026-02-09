import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, TrendingUp, Edit2, Check, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancialYearsManager({ financialYears, onChange, language, editingId }) {
  const [newYear, setNewYear] = useState({
    year: new Date().getFullYear() - 1,
    revenue: '',
    ebitda: '',
    ebit: '',
    net_result: '',
    employees_count: ''
  });

  const [editingYearIndex, setEditingYearIndex] = useState(null);
  const [editedYear, setEditedYear] = useState(null);

  const addYear = () => {
    if (!newYear.year) return;
    const yearData = {
      ...newYear,
      revenue: parseFloat(newYear.revenue) || 0,
      ebitda: parseFloat(newYear.ebitda) || null,
      ebit: parseFloat(newYear.ebit) || null,
      net_result: parseFloat(newYear.net_result) || null,
      employees_count: parseInt(newYear.employees_count) || null,
    };
    onChange([...financialYears, yearData].sort((a, b) => a.year - b.year));
    setNewYear({
      year: newYear.year + 1,
      revenue: '',
      ebitda: '',
      ebit: '',
      net_result: '',
      employees_count: ''
    });
  };

  const removeYear = (index) => {
    const updated = [...financialYears];
    updated.splice(index, 1);
    onChange(updated);
  };

  const startEditingYear = (index) => {
    setEditingYearIndex(index);
    setEditedYear({ ...financialYears[index] });
  };

  const saveEditedYear = (index) => {
    const updated = [...financialYears];
    updated[index] = {
      ...editedYear,
      revenue: parseFloat(editedYear.revenue) || 0,
      ebitda: parseFloat(editedYear.ebitda) || null,
      ebit: parseFloat(editedYear.ebit) || null,
      net_result: parseFloat(editedYear.net_result) || null,
      employees_count: parseInt(editedYear.employees_count) || null,
    };
    onChange(updated.sort((a, b) => a.year - b.year));
    setEditingYearIndex(null);
    setEditedYear(null);
  };

  const cancelEditingYear = () => {
    setEditingYearIndex(null);
    setEditedYear(null);
  };

  const formatNumber = (num) => {
    if (!num) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'fr' ? 'Historique financier détaillé' : 'Detailed Financial History'}
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          {language === 'fr' 
            ? 'Ajoutez les données financières des dernières années pour plus de transparence'
            : 'Add financial data from recent years for more transparency'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Years */}
        {financialYears.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {financialYears.map((year, idx) => (
                editingYearIndex === idx && editedYear ? (
                  // Edit Mode
                  <motion.div
                    key={year.year}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display text-lg font-bold text-primary">{editedYear.year}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEditedYear(idx)}
                          className="text-green-600 hover:text-green-700 transition-colors p-1"
                          title={language === 'fr' ? 'Valider' : 'Validate'}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditingYear}
                          className="text-red-600 hover:text-red-700 transition-colors p-1"
                          title={language === 'fr' ? 'Annuler' : 'Cancel'}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">{language === 'fr' ? 'CA (€)' : 'Revenue (€)'}</Label>
                        <Input
                          type="number"
                          value={editedYear.revenue}
                          onChange={(e) => setEditedYear({...editedYear, revenue: e.target.value})}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">EBITDA (€)</Label>
                        <Input
                          type="number"
                          value={editedYear.ebitda || ''}
                          onChange={(e) => setEditedYear({...editedYear, ebitda: e.target.value})}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">EBIT (€)</Label>
                        <Input
                          type="number"
                          value={editedYear.ebit || ''}
                          onChange={(e) => setEditedYear({...editedYear, ebit: e.target.value})}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{language === 'fr' ? 'Résultat net (€)' : 'Net Result (€)'}</Label>
                        <Input
                          type="number"
                          value={editedYear.net_result || ''}
                          onChange={(e) => setEditedYear({...editedYear, net_result: e.target.value})}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{language === 'fr' ? 'Effectifs' : 'Employees'}</Label>
                        <Input
                          type="number"
                          value={editedYear.employees_count || ''}
                          onChange={(e) => setEditedYear({...editedYear, employees_count: e.target.value})}
                          className="mt-1 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // View Mode
                  <motion.div
                    key={year.year}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-primary">{year.year}</span>
                        {idx === financialYears.length - 1 && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {language === 'fr' ? 'Plus récent' : 'Latest'}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingYear(idx)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title={language === 'fr' ? 'Modifier' : 'Edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeYear(idx)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title={language === 'fr' ? 'Supprimer' : 'Delete'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">{language === 'fr' ? 'CA' : 'Revenue'}</p>
                        <p className="font-mono font-medium">{formatNumber(year.revenue)}</p>
                      </div>
                      {year.ebitda && (
                        <div>
                          <p className="text-gray-500">EBITDA</p>
                          <p className="font-mono font-medium">{formatNumber(year.ebitda)}</p>
                        </div>
                      )}
                      {year.ebit && (
                        <div>
                          <p className="text-gray-500">EBIT</p>
                          <p className="font-mono font-medium">{formatNumber(year.ebit)}</p>
                        </div>
                      )}
                      {year.net_result && (
                        <div>
                          <p className="text-gray-500">{language === 'fr' ? 'Résultat net' : 'Net Result'}</p>
                          <p className="font-mono font-medium">{formatNumber(year.net_result)}</p>
                        </div>
                      )}
                      {year.employees_count && (
                        <div>
                          <p className="text-gray-500">{language === 'fr' ? 'Effectifs' : 'Employees'}</p>
                          <p className="font-mono font-medium">{year.employees_count}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add New Year Form */}
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">{language === 'fr' ? 'Année' : 'Year'} *</Label>
              <Input
                type="number"
                value={newYear.year}
                onChange={(e) => setNewYear({...newYear, year: parseInt(e.target.value)})}
                placeholder="2023"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs">{language === 'fr' ? 'Chiffre d\'affaires (€)' : 'Revenue (€)'} *</Label>
              <Input
                type="number"
                value={newYear.revenue}
                onChange={(e) => setNewYear({...newYear, revenue: e.target.value})}
                placeholder="1000000"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs">EBITDA (€)</Label>
              <Input
                type="number"
                value={newYear.ebitda}
                onChange={(e) => setNewYear({...newYear, ebitda: e.target.value})}
                placeholder="200000"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs">EBIT (€)</Label>
              <Input
                type="number"
                value={newYear.ebit}
                onChange={(e) => setNewYear({...newYear, ebit: e.target.value})}
                placeholder="180000"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs">{language === 'fr' ? 'Résultat net (€)' : 'Net Result (€)'}</Label>
              <Input
                type="number"
                value={newYear.net_result}
                onChange={(e) => setNewYear({...newYear, net_result: e.target.value})}
                placeholder="120000"
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs">{language === 'fr' ? 'Effectifs' : 'Employees'}</Label>
              <Input
                type="number"
                value={newYear.employees_count}
                onChange={(e) => setNewYear({...newYear, employees_count: e.target.value})}
                placeholder="10"
                className="mt-1 font-mono"
              />
            </div>
          </div>
          <Button
            onClick={addYear}
            variant="outline"
            className="w-full"
            disabled={!newYear.year || !newYear.revenue}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'fr' ? 'Ajouter l\'année' : 'Add Year'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
