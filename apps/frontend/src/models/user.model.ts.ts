import { Flat } from './flat.model';

export type User = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  flat: Flat;
};

export type UserInfo = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
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
