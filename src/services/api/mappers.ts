
import { ServerTransaction, Transaction } from '@/types/transaction';

// Helper to convert server transaction to client transaction
export const mapServerToClient = (serverTx: ServerTransaction): Transaction => {
  return {
    ...serverTx,
    date: new Date(serverTx.date),
    createdAt: serverTx.createdAt ? new Date(serverTx.createdAt) : undefined
  };
};

// Helper to convert client transaction to server transaction
export const mapClientToServer = (clientTx: Omit<Transaction, 'id'>): Omit<ServerTransaction, 'id' | 'createdAt'> => {
  return {
    amount: clientTx.amount,
    description: clientTx.description,
    category: clientTx.category,
    date: clientTx.date.toISOString(),
    type: clientTx.type,
    isReimbursement: clientTx.isReimbursement ?? false,
    reimbursedTo: clientTx.reimbursedTo ?? null,
    reimbursementStatus: clientTx.reimbursementStatus ?? null,
    createdBy: clientTx.createdBy ?? null,
    company: clientTx.company ?? null,
  };
};
