import { DefinedUseQueryResult, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ChangePasswordDto, HandleInviteDto, User } from '../models/user.model.ts';
import useAxiosClient from '../utils/axios';

export const useGetProfileQuery = (options?: UseQueryOptions): DefinedUseQueryResult<any> => {
  const client = useAxiosClient();
  const query = useQuery<User, any, any>(
    [`getProfileQuery`],
    async () => {
      const response = await client({
        method: 'get',
        url: `/v1/user/`
      });
      return response.data;
    },
    {
      initialData: {
        userId: '',
        email: '',
        firstName: '',
        lastName: '',
        flat: {
          flatId: '',
          name: '',
          expenses: [],
          owner: {
            userId: '',
            email: '',
            firstName: '',
            lastName: ''
          },
          flatmates: []
        }
      }
    }
  );
  return query;
};

const useChangePassswordMutation = (options: UseMutationOptions) => {
  const client = useAxiosClient();
  const mutation = useMutation<any, any, any>(
    ({ changePasswordDto }: { changePasswordDto: ChangePasswordDto }) =>
      client({
        method: 'post',
        url: `/v1/user/change-password`
      }),
    options
  );
  return mutation;
};

export { useChangePassswordMutation };
