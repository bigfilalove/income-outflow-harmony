
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InvestmentReportDialogProps {
  className?: string;
}

const InvestmentReportDialog: React.FC<InvestmentReportDialogProps> = ({ className }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Coins className="h-4 w-4 mr-2" />
          Отчет по инвестициям
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Отчет по инвестициям собственников</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-center text-muted-foreground">
            Отчет по инвестициям собственников теперь доступен на отдельной странице для более удобного просмотра и анализа.
          </p>
          
          <Link to="/investment-report">
            <Button className="mt-4">
              <ExternalLink className="h-4 w-4 mr-2" />
              Открыть отчет на отдельной странице
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentReportDialog;
