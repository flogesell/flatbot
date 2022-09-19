export type User = {
  email: string;
  name: string;
  userId: string;
  defaultCompanyId: string;
  companies: Company[];
};

export type Company = {
  name: string;
  companyId: string;
};

export type RegisterUserDto = {
  email: string;
  name: string;
  password: string;
};

export type ChangePasswordDto = {
  password: string;
  new_password: string;
};

export type LoginResponse = {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  data: User;
};

export type HandleInviteDto = {
  inviteId: string;
  accept: boolean;
};
