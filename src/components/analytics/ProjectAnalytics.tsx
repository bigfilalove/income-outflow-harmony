
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Landmark } from 'lucide-react';

// Define the ProjectTotal interface
interface ProjectTotal {
  project: string;
  income: number;
  expense: number;
  total: number;
}

// Define the props interface for ProjectAnalytics
interface ProjectAnalyticsProps {
  projectTotals: ProjectTotal[];
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ projectTotals }) => {
  const hasProjects = projectTotals.some(p => p.project !== 'Не указан');

  if (!hasProjects) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Landmark className="mr-2 h-5 w-5" />
            Аналитика по проектам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Нет данных по проектам
          </div>
        </CardContent>
      </Card>
    );
  }

  // Подготовка данных для графика
  const chartData = projectTotals
    .filter(p => p.project !== 'Не указан')
    .slice(0, 5)
    .map(p => ({
      name: p.project,
      Доходы: p.income,
      Расходы: p.expense,
      Баланс: p.total
    }));

  // Цвета для баров
  const colors = {
    Доходы: '#22c55e',
    Расходы: '#ef4444',
    Баланс: '#3b82f6'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Landmark className="mr-2 h-5 w-5" />
          Аналитика по проектам
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {chartData.length > 0 && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), '']}
                    labelFormatter={(value) => `Проект: ${value}`}
                  />
                  <Legend />
                  <Bar dataKey="Доходы" fill={colors.Доходы} />
                  <Bar dataKey="Расходы" fill={colors.Расходы} />
                  <Bar dataKey="Баланс">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.Баланс >= 0 ? colors.Баланс : '#d946ef'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium mb-4">Детализация по проектам</h4>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Проект</TableHead>
                    <TableHead className="text-right">Доходы</TableHead>
                    <TableHead className="text-right">Расходы</TableHead>
                    <TableHead className="text-right">Баланс</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTotals.map((project) => (
                    <TableRow key={project.project}>
                      <TableCell>
                        {project.project === 'Не указан' ? (
                          <span className="text-muted-foreground">Не указан</span>
                        ) : (
                          project.project
                        )}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(project.income)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(project.expense)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={project.total >= 0 ? "outline" : "destructive"}>
                          {formatCurrency(project.total)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectAnalytics;
