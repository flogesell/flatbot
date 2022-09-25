import { Flat } from './flat.model';
import { Tag } from './tag.model';
import { User } from './user.model.ts';

export type Expense = {
  expenseId: string;
  date: Date;
  flatId: string;
  flat: Flat;
  paidBy: User;
  paidById: string;
  expenseFor: User[];
  amount: number;
  tag: Tag;
};

export type CreateExpense = {
  flatId: string;
  paidById: string;
  expenseFor: string[];
  amount: number;
  tag: Tag;
};
