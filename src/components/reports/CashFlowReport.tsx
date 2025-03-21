
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CashFlowReportProps {
  startDate?: Date;
  endDate?: Date;
}

const CashFlowReport: React.FC<CashFlowReportProps> = ({ startDate, endDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Отчет о движении денежных средств</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Здесь будет отображаться отчет о движении денежных средств за выбранный период.</p>
        {startDate && endDate && (
          <p className="text-muted-foreground mt-2">
            Период: {startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowReport;
