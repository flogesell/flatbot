export interface CreateExpenese {
  date: Date;
  amount: number;
  paidBy: string;
  expenseFor: string[];
  tag: string;
}
