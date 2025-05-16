
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { InvestmentSummary, CompanySpendingSummary } from './types';
import { generateExcelData } from './utils';

interface ExportButtonProps {
  investmentsByInvestor: InvestmentSummary[];
  spendingByCompany: CompanySpendingSummary[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  investmentsByInvestor, 
  spendingByCompany 
}) => {
  const handleExportToExcel = () => {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Get data for Excel export
    const { investmentsData, spendingData } = generateExcelData(
      investmentsByInvestor,
      spendingByCompany
    );
    
    // Add sheets to workbook
    const investmentsSheet = XLSX.utils.json_to_sheet(investmentsData);
    XLSX.utils.book_append_sheet(wb, investmentsSheet, "Инвестиции");
    
    const spendingSheet = XLSX.utils.json_to_sheet(spendingData);
    XLSX.utils.book_append_sheet(wb, spendingSheet, "Расходы");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save file
    const fileName = `Отчет_по_инвестициям_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    saveAs(blob, fileName);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExportToExcel}>
      <Download className="mr-2 h-4 w-4" />
      Экспорт в Excel
    </Button>
  );
};

export default ExportButton;
