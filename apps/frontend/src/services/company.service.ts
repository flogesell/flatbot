import { DefinedUseQueryResult, Query, useMutation, UseMutationOptions, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { InviteCancelDto, InviteUserDto } from '../models/company.type';
import useCompanyStore from '../store/company';
import useAxiosClient from '../utils/axios';

export const useGetCompaniesQuery = (options?: UseQueryOptions) => {
  const client = useAxiosClient();
  const mutation = useQuery(['getCompaniesQuery'], () =>
    client({
      method: 'get',
      url: `/v1/company`
    })
  );
  return mutation;
};

export const useGetCompanyQuery = (options?: UseQueryOptions): DefinedUseQueryResult<any> => {
  const { currentCompany } = useCompanyStore();
  const client = useAxiosClient();
  const query = useQuery(
    [`getCompanyQuery-${currentCompany}`],
    async () => {
      const response = await client({
        method: 'get',
        url: `/v1/company/${currentCompany}`
      });
      return response.data;
    },
    {
      initialData: []
    }
  );
  return query;
};

export const useGetCompanyInvitesQuery = (options?: UseQueryOptions): DefinedUseQueryResult<any> => {
  const { currentCompany } = useCompanyStore();
  const client = useAxiosClient();
  const query = useQuery(
    [`getCompanyInvitesQuery-${currentCompany}`],
    async () => {
      const response = await client({
        method: 'get',
        url: `/v1/company/invite/${currentCompany}`
      });
      return response.data;
    },
    {
      initialData: []
    }
  );
  return query;
};

export const useCreateInviteMutation = (options: UseMutationOptions) => {
  const { currentCompany } = useCompanyStore();
  const client = useAxiosClient();
  const mutation = useMutation<any, any, any>(async ({ email }: InviteUserDto) => {
    const response = await client({
      method: 'post',
      url: `/v1/company/invite/create`,
      data: { email, companyId: currentCompany }
    });
    return response.data;
  }, options);
  return mutation;
};

export const useCancelInviteMutation = (options: UseMutationOptions) => {
  const { currentCompany } = useCompanyStore();
  const client = useAxiosClient();
  const mutation = useMutation<any, any, any>(async ({ inviteId }: InviteCancelDto) => {
    const response = await client({
      method: 'post',
      url: `/v1/company/invite/cancel`,
      data: { inviteId, companyId: currentCompany }
    });
    return response.data;
  }, options);
  return mutation;
};
