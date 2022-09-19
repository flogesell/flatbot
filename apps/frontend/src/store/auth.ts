import create from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse, User } from '../models/user.model.ts';

type AuthStore = {
  authToken: string;
  isAuth: boolean;
  user: User | undefined;
  setAuth: (loginResponse: LoginResponse) => void;
  logout: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authToken: '',
      isAuth: false,
      user: undefined,
      setAuth: (loginResponse: LoginResponse) => {
        set(() => ({
          authToken: loginResponse.tokens.access_token,
          user: loginResponse.data,
          isAuth: true
        }));
      },
      logout: () =>
        set(() => ({
          authToken: '',
          user: undefined,
          isAuth: false
        }))
    }),
    {
      name: 'auth-storage'
    }
  )
);

export default useAuthStore;
