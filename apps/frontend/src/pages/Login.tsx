import React, { useEffect, useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Logo from '../assets/images/logo/flatbot_logo.png';
import { LoginResponse } from '../models/user.model.ts';
import { useLoginMutation } from '../services/auth.service';
import { useAuthStore } from '../store';
import { Box, Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react';
import { CheckIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { InputAdornment } from '@mui/material';

interface LoginState {
  password: string;
  username: string;
  errorMessage: string;
  showPassword: boolean;
}

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

export const Login = () => {
  const [values, setValues] = useState<LoginState>({
    password: '',
    username: '',
    errorMessage: '',
    showPassword: false
  });
  const navigate = useNavigate();
  const { setAuth, isAuth, authToken } = useAuthStore();

  const { mutate: login } = useLoginMutation({
    onSuccess: (data: any) => {
      setAuth(data);
      navigate('/');
    }
  });

  const handleLogin = async (event_: React.FormEvent) => {
    event_.preventDefault();
    const { username, password } = values;
    if (!username) {
      setValues({ ...values, errorMessage: 'Username is required' });
      return;
    }
    if (!password) {
      setValues({ ...values, errorMessage: 'Passsword is required' });
      return;
    }

    if (username && password) {
      login({ username, password });
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  useEffect(() => {
    if (isAuth) navigate('/');
  });

  return (
    <div className="login-page">
      <Box className="login-grid">
        <Box className="login-container">
          <form className="form">
            <img src={Logo} className="auth-logo" />
            <Text className="auth-header">Login</Text>
            <Input id="email" type="text" onChange={(event) => setValues({ ...values, username: event.target.value })} className="auth-input" />
            <InputGroup>
              <Input
                id="password"
                type={values.showPassword ? 'text' : 'password'}
                onChange={(event) => setValues({ ...values, password: event.target.value })}
                className="auth-input"
              />
              <InputRightElement
                children={
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                    {values.showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </IconButton>
                }
              />
            </InputGroup>
            <div className="auth-options">
              <Link to={'/auth/register'}>Noch kein Konto? Jetzt registrieren</Link>
              <Link to={'/reset-password'}>Passwort vergessen?</Link>
            </div>
            <Button
              type="button"
              onClick={handleLogin}
              width="100%"
              disabled={values.errorMessage.length > 0 || !values.username || !values.password}
              className="auth-button"
            >
              Log in
            </Button>
          </form>
        </Box>
      </Box>
    </div>
  );
};
