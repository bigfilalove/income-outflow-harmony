
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FilterBarProps {
  filterCompany: string;
  setFilterCompany: (value: string) => void;
  filterInvestor: string;
  setFilterInvestor: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterCompany,
  setFilterCompany,
  filterInvestor,
  setFilterInvestor
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="filterCompany">Фильтр по компании</Label>
        <Input
          id="filterCompany"
          placeholder="Введите название компании"
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="filterInvestor">Фильтр по инвестору</Label>
        <Input
          id="filterInvestor"
          placeholder="Введите имя инвестора"
          value={filterInvestor}
          onChange={(e) => setFilterInvestor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
