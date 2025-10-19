export type TxInput = {
  description: string;
  amount: number; // positive income, negative expense
  date: string; // ISO or yyyy-mm-dd
  type: 'income' | 'expense';
};

const keywordMap: Record<string, string> = {
  uber: 'Transport',
  ola: 'Transport',
  fuel: 'Transport',
  petrol: 'Transport',
  amazon: 'Shopping',
  flipkart: 'Shopping',
  swiggy: 'Food & Drinks',
  zomato: 'Food & Drinks',
  starbucks: 'Food & Drinks',
  cafe: 'Food & Drinks',
  rent: 'Housing',
  electricity: 'Utilities',
  water: 'Utilities',
  internet: 'Utilities',
  recharge: 'Utilities',
  salary: 'Income',
  payout: 'Income',
  freelance: 'Income',
  upi: 'Transfers',
  transfer: 'Transfers',
  medical: 'Healthcare',
  pharmacy: 'Healthcare',
};

export function categorize(tx: TxInput): string {
  const d = tx.description.toLowerCase();
  for (const k of Object.keys(keywordMap)) {
    if (d.includes(k)) return keywordMap[k];
  }
  if (tx.type === 'income') return 'Income';
  // Simple heuristics by amount bands (demo)
  if (Math.abs(tx.amount) < 200) return 'Misc';
  if (Math.abs(tx.amount) < 1000) return 'Food & Drinks';
  return 'Shopping';
}
