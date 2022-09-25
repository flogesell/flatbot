import { Expense } from './expenses.model';
import { User, UserInfo } from './user.model.ts';

export type GenericFlat = {
  flatId: string;
  name: string;
  owner: User;
  flatmates: User[];
  expenses: Expense[];
};

export type Flat = {
  flatId: string;
  name: string;
  owner: UserInfo;
  flatmates: UserInfo[];
  expenses: Expense[];
};

export type UpdateFlat = {
  flatId: string;
  name: string;
  owner: User;
  flatmates: User[];
  expenses: Expense[];
};
