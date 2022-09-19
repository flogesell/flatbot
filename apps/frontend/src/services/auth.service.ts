import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { LoginResponse, RegisterUserDto } from '../models/user.model.ts';
import useAxiosClient from '../utils/axios';

const useLoginMutation = (options: UseMutationOptions) => {
  const client = useAxiosClient();
  const mutation = useMutation<LoginResponse, any, any, any>(async ({ username, password }) => {
    const response = await client({
      method: 'post',
      url: `/v1/auth/login`,
      data: { username, password }
    });
    return response.data as LoginResponse;
  }, options);
  return mutation;
};

const useRegisterMutation = (options: UseMutationOptions) => {
  const client = useAxiosClient();
  const mutation = useMutation<any, any, any>(
    (registerUserDto: RegisterUserDto) =>
      client({
        method: 'post',
        url: `/v1/auth/register`,
        data: registerUserDto
      }),
    options
  );
  return mutation;
};

export { useLoginMutation, useRegisterMutation };
