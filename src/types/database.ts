
export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          amount: number;
          description: string;
          category: string;
          date: string;
          type: string;
          is_reimbursement: boolean;
          reimbursed_to: string | null;
          reimbursement_status: string | null;
          created_by: string | null;
          created_at: string;
          company: string | null;
          project: string | null;
          is_transfer: boolean;
          from_company: string | null;
          to_company: string | null;
          has_allocations: boolean;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          amount: number;
          period: string;
          category: string;
          type: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
        };
      };
    };
  };
};
