import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, FileSpreadsheet, Download } from 'lucide-react';
import { File } from 'lucide-react'; // Use 'File' instead of 'FilePdf'
import { useTransactions } from '@/context/transaction';
import * as XLSX from 'xlsx'; // Import XLSX properly
import { saveAs } from 'file-saver'; // Import saveAs properly
import {
  filterTransactionsByDateRange,
  generateExcelReport,
  generatePdfReport,
  prepareTransactionDataForExcel,
  prepareTransactionDataForPdf,
  prepareReimbursementDataForExcel,
  prepareReimbursementDataForPdf,
  prepareAnalyticsDataForExcel,
  prepareAnalyticsDataForPdf
} from '@/utils/reportUtils';

type ReportType = 'transactions' | 'reimbursements' | 'analytics' | 'period';

interface ReportDownloadDialogProps {
  reportType: ReportType;
}

const ReportDownloadDialog: React.FC<ReportDownloadDialogProps> = ({ reportType }) => {
  const { transactions } = useTransactions();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  
  const getTitleByType = (type: ReportType) => {
    switch (type) {
      case 'transactions':
        return 'Скачать список транзакций';
      case 'reimbursements':
        return 'Скачать отчет по возмещениям';
      case 'analytics':
        return 'Скачать аналитический отчет';
      case 'period':
        return 'Скачать отчет за период';
      default:
        return 'Скачать отчет';
    }
  };
  
  const handleExcelDownload = () => {
    switch (reportType) {
      case 'transactions':
        const transactionData = prepareTransactionDataForExcel(transactions);
        generateExcelReport(transactionData, 'Транзакции', 'transactions-report');
        break;
      case 'reimbursements':
        const reimbursementData = prepareReimbursementDataForExcel(transactions);
        generateExcelReport(reimbursementData, 'Возмещения', 'reimbursements-report');
        break;
      case 'analytics':
        const { summary, categoryBreakdown, companyBreakdown } = prepareAnalyticsDataForExcel(transactions);
        const workbook = XLSX.utils.book_new();
        
        // Summary sheet
        const summaryWs = XLSX.utils.json_to_sheet(summary);
        XLSX.utils.book_append_sheet(workbook, summaryWs, 'Сводка');
        
        // Category breakdown sheet
        const categoryWs = XLSX.utils.json_to_sheet(categoryBreakdown);
        XLSX.utils.book_append_sheet(workbook, categoryWs, 'Категории');
        
        // Company breakdown sheet
        const companyWs = XLSX.utils.json_to_sheet(companyBreakdown);
        XLSX.utils.book_append_sheet(workbook, companyWs, 'Компании');
        
        // Save file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(blob, 'analytics-report.xlsx');
        break;
      case 'period':
        if (startDate && endDate) {
          const filteredTransactions = filterTransactionsByDateRange(
            transactions,
            startDate,
            endDate
          );
          const periodData = prepareTransactionDataForExcel(filteredTransactions);
          const periodName = `${format(startDate, 'dd.MM.yyyy')}-${format(endDate, 'dd.MM.yyyy')}`;
          generateExcelReport(periodData, 'Транзакции за период', `period-report-${periodName}`);
        }
        break;
    }
  };
  
  const handlePdfDownload = () => {
    switch (reportType) {
      case 'transactions':
        const transactionData = prepareTransactionDataForPdf(transactions);
        const transactionHeaders = [
          'Описание', 'Категория', 'Сумма', 'Дата', 'Тип', 'Сотрудник', 'Статус', 'Компания'
        ];
        generatePdfReport(
          'Отчет по транзакциям',
          transactionHeaders,
          transactionData,
          'transactions-report'
        );
        break;
      case 'reimbursements':
        const reimbursementData = prepareReimbursementDataForPdf(transactions);
        const reimbursementHeaders = [
          'Описание', 'Категория', 'Сумма', 'Дата', 'Сотрудник', 'Статус', 'Компания'
        ];
        generatePdfReport(
          'Отчет по возмещениям',
          reimbursementHeaders,
          reimbursementData,
          'reimbursements-report'
        );
        break;
      case 'analytics':
        const analyticsData = prepareAnalyticsDataForPdf(transactions);
        const analyticsHeaders = ['Показатель', 'Значение'];
        generatePdfReport(
          'Аналитический отчет',
          analyticsHeaders,
          analyticsData,
          'analytics-report'
        );
        
        // Create an additional PDF for companies
        const { companyBreakdown } = prepareAnalyticsDataForExcel(transactions);
        const companyData = companyBreakdown.map(item => [
          item['Компания'],
          item['Доходы'],
          item['Расходы'],
          item['Баланс']
        ]);
        
        const companyHeaders = ['Компания', 'Доходы', 'Расходы', 'Баланс'];
        generatePdfReport(
          'Отчет по компаниям',
          companyHeaders,
          companyData,
          'companies-report'
        );
        break;
      case 'period':
        if (startDate && endDate) {
          const filteredTransactions = filterTransactionsByDateRange(
            transactions,
            startDate,
            endDate
          );
          const periodData = prepareTransactionDataForPdf(filteredTransactions);
          const periodHeaders = [
            'Описание', 'Категория', 'Сумма', 'Дата', 'Тип', 'Сотрудник', 'Статус', 'Компания'
          ];
          const periodName = `${format(startDate, 'dd.MM.yyyy')}-${format(endDate, 'dd.MM.yyyy')}`;
          generatePdfReport(
            `Отчет по транзакциям за период: ${periodName}`,
            periodHeaders,
            periodData,
            `period-report-${periodName}`
          );
        }
        break;
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {reportType === 'transactions' && 'Скачать транзакции'}
          {reportType === 'reimbursements' && 'Скачать возмещения'}
          {reportType === 'analytics' && 'Скачать аналитику'}
          {reportType === 'period' && 'Отчет за период'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitleByType(reportType)}</DialogTitle>
        </DialogHeader>
        
        {reportType === 'period' && (
          <div className="flex flex-col gap-4 mb-4">
            <div className="grid gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate && endDate ? (
                      <>
                        {format(startDate, 'PP', { locale: ru })} - {format(endDate, 'PP', { locale: ru })}
                      </>
                    ) : (
                      <span>Выберите период</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={startDate}
                    selected={{
                      from: startDate,
                      to: endDate,
                    }}
                    onSelect={(range) => {
                      setStartDate(range?.from);
                      setEndDate(range?.to);
                      if (range?.to) {
                        setIsCalendarOpen(false);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-4">
          <Button 
            className="flex-1"
            variant="outline" 
            onClick={handleExcelDownload}
            disabled={reportType === 'period' && (!startDate || !endDate)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button 
            className="flex-1"
            variant="outline" 
            onClick={handlePdfDownload}
            disabled={reportType === 'period' && (!startDate || !endDate)}
          >
            <File className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDownloadDialog;
