import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CreateExpense, Expense } from '../models/expenses.model';
import { Flat, UpdateFlat } from '../models/flat.model';
import useAxiosClient from '../utils/axios';

export const useGetExpensesQuery = (options?: UseQueryOptions) => {
  const client = useAxiosClient();
  const query = useQuery<Expense[], any>(
    ['getExpensesQuery'],
    async () => {
      const response = await client({
        method: 'get',
        url: `/v1/expense`
      });
      return response.data;
    },
    {
      initialData: []
    }
  );
  return query;
};

export const useCreateExpenseMutation = (options: UseMutationOptions) => {
  const client = useAxiosClient();
  const mutation = useMutation<Flat, any, any>(async (createExpense: CreateExpense) => {
    const response = await client({
      method: 'post',
      url: `/v1/expense`,
      data: { createExpense }
    });
    return response.data;
  }, options);
  return mutation;
};
