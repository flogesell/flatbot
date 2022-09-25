import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Flat, UpdateFlat } from '../models/flat.model';
import useAxiosClient from '../utils/axios';

export const useGetFlatQuery = (options?: UseQueryOptions) => {
  const client = useAxiosClient();
  const mutation = useQuery<Flat, any>(
    ['getFlatQuery'],
    async () => {
      const response = await client({
        method: 'get',
        url: `/v1/flat`
      });
      return response.data;
    },
    {
      initialData: { flatId: '', name: '', flatmates: [], owner: { userId: '', email: '', firstName: '', lastName: '' }, expenses: [] }
    }
  );
  return mutation;
};

export const useUpdateFlatMutation = (options: UseMutationOptions) => {
  const client = useAxiosClient();

  const mutation = useMutation<Flat, any, any>(async (updateFlat: UpdateFlat) => {
    const response = await client({
      method: 'put',
      url: `/v1/flat`,
      data: { updateFlat }
    });
    return response.data;
  }, options);
  return mutation;
};
