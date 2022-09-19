import { DefinedUseQueryResult, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ChangePasswordDto, HandleInviteDto } from '../models/user.model.ts';
import useAxiosClient from '../utils/axios';

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
