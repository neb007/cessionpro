import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function FinancialChart({ financialYears, language }) {
  if (!financialYears || financialYears.length === 0) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  const chartData = financialYears.map(year => ({
    year: year.year.toString(),
    [language === 'fr' ? 'CA' : 'Revenue']: year.revenue,
    'EBITDA': year.ebitda,
    'EBIT': year.ebit,
    [language === 'fr' ? 'Résultat net' : 'Net Result']: year.net_result,
    [language === 'fr' ? 'Effectifs' : 'Employees']: year.employees_count
  }));

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'fr' ? 'Évolution financière' : 'Financial Evolution'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="revenue">{language === 'fr' ? 'CA' : 'Revenue'}</TabsTrigger>
            <TabsTrigger value="profitability">{language === 'fr' ? 'Rentabilité' : 'Profitability'}</TabsTrigger>
            <TabsTrigger value="results">{language === 'fr' ? 'Résultats' : 'Results'}</TabsTrigger>
            <TabsTrigger value="employees">{language === 'fr' ? 'Effectifs' : 'Employees'}</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#111827" />
                <YAxis stroke="#111827" tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={language === 'fr' ? 'CA' : 'Revenue'}
                  stroke="#FF6B4A"
                  strokeWidth={3}
                  dot={{ fill: '#FF6B4A', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="profitability" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#111827" />
                <YAxis stroke="#111827" tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="EBITDA"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="EBIT"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="results" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#111827" />
                <YAxis stroke="#111827" tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={language === 'fr' ? 'Résultat net' : 'Net Result'}
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="employees" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#111827" />
                <YAxis stroke="#111827" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={language === 'fr' ? 'Effectifs' : 'Employees'}
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        {/* Data Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-500">{language === 'fr' ? 'Année' : 'Year'}</th>
                <th className="text-right py-2 font-medium text-gray-500">{language === 'fr' ? 'CA' : 'Revenue'}</th>
                <th className="text-right py-2 font-medium text-gray-500">EBITDA</th>
                <th className="text-right py-2 font-medium text-gray-500">EBIT</th>
                <th className="text-right py-2 font-medium text-gray-500">{language === 'fr' ? 'Résultat net' : 'Net'}</th>
                <th className="text-right py-2 font-medium text-gray-500">{language === 'fr' ? 'Effectifs' : 'Staff'}</th>
              </tr>
            </thead>
            <tbody>
              {financialYears.map((year, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 font-mono font-semibold">{year.year}</td>
                  <td className="text-right py-2 font-mono">{formatCurrency(year.revenue)}</td>
                  <td className="text-right py-2 font-mono">{year.ebitda ? formatCurrency(year.ebitda) : '-'}</td>
                  <td className="text-right py-2 font-mono">{year.ebit ? formatCurrency(year.ebit) : '-'}</td>
                  <td className="text-right py-2 font-mono">{year.net_result ? formatCurrency(year.net_result) : '-'}</td>
                  <td className="text-right py-2 font-mono">{year.employees_count || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}