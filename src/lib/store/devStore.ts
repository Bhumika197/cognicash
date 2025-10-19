// Simple in-memory store for demo/dev only. Not for production use.
export type StoredTransaction = {
  id: string;
  userId?: string;
  amount: number;
  description: string;
  category?: string;
  date: string; // ISO
  type: 'income' | 'expense';
};

let transactions: StoredTransaction[] = [];

export function addTransactions(rows: StoredTransaction[]) {
  transactions.push(...rows);
}

export function getTransactions() {
  return transactions;
}

export function clearTransactions() {
  transactions = [];
}
