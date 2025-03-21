
import { Transaction, ServerTransaction } from '@/types/transaction';
import { User, ServerUser } from '@/types/user';

// Convert server transaction to client transaction
export const mapServerToClient = (serverTransaction: ServerTransaction): Transaction => {
  return {
    id: serverTransaction._id || serverTransaction.id, // MongoDB uses _id
    amount: serverTransaction.amount,
    description: serverTransaction.description,
    category: serverTransaction.category,
    date: new Date(serverTransaction.date),
    type: serverTransaction.type,
    isReimbursement: serverTransaction.isReimbursement,
    reimbursedTo: serverTransaction.reimbursedTo || undefined,
    reimbursementStatus: serverTransaction.reimbursementStatus || undefined,
    createdBy: serverTransaction.createdBy || undefined,
    createdAt: serverTransaction.createdAt ? new Date(serverTransaction.createdAt) : undefined,
    company: serverTransaction.company || undefined
  };
};

// Convert client transaction to server transaction
export const mapClientToServer = (clientTransaction: Omit<Transaction, 'id'>): Omit<ServerTransaction, 'id'> => {
  return {
    amount: clientTransaction.amount,
    description: clientTransaction.description,
    category: clientTransaction.category,
    date: clientTransaction.date.toISOString(),
    type: clientTransaction.type,
    isReimbursement: clientTransaction.isReimbursement || false,
    reimbursedTo: clientTransaction.reimbursedTo || null,
    reimbursementStatus: clientTransaction.reimbursementStatus || null,
    createdBy: clientTransaction.createdBy || null,
    createdAt: clientTransaction.createdAt ? clientTransaction.createdAt.toISOString() : new Date().toISOString(),
    company: clientTransaction.company || null
  };
};

// Convert server user to client user
export const mapServerUserToClient = (serverUser: any): User => {
  return {
    id: serverUser._id || serverUser.id, // MongoDB uses _id
    name: serverUser.name,
    email: serverUser.email,
    username: serverUser.username,
    password: serverUser.password, // Note: normally you wouldn't send passwords to client
    role: serverUser.role,
    createdAt: new Date(serverUser.createdAt)
  };
};

// Convert client user to server user
export const mapClientUserToServer = (clientUser: Partial<User>): Partial<ServerUser> => {
  return {
    name: clientUser.name,
    email: clientUser.email,
    username: clientUser.username,
    password: clientUser.password,
    role: clientUser.role,
    createdAt: clientUser.createdAt ? clientUser.createdAt.toISOString() : new Date().toISOString()
  };
};
