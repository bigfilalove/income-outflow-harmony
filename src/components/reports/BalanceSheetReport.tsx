
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BalanceSheetReportProps {
  startDate?: Date;
  endDate?: Date;
}

const BalanceSheetReport: React.FC<BalanceSheetReportProps> = ({ startDate, endDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Балансовый отчет</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Здесь будет отображаться балансовый отчет за выбранный период.</p>
        {startDate && endDate && (
          <p className="text-muted-foreground mt-2">
            Период: {startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceSheetReport;
