import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Alert, Button, Divider, Grid, Snackbar, OutlinedInput, Typography, IconButton, InputAdornment, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Logo from '../assets/images/logo/flatbot_logo.png';
import { RegisterUserDto } from '../models/user.model.ts';
import { useRegisterMutation } from '../services/auth.service';
import { useAuthStore } from '../store';

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

export const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    showPassword: false
  });
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const { mutate: register } = useRegisterMutation({
    onSuccess: () => {
      navigate('/auth/login');
    }
  });
  const [errorMessage, setErrorMessage] = useState('');
  if (isAuth) navigate('/');
  const handleRegister = async (event_: React.FormEvent) => {
    event_.preventDefault();
    if (!values.email) {
      setErrorMessage('Email is required');
      return;
    }
    if (!values.name) {
      setErrorMessage('Name is required');
      return;
    }
    if (!values.password) {
      setErrorMessage('Passsword is required');
      return;
    }
    if (!values.password) {
      setErrorMessage('Repeat Password is required');
      return;
    }
    if (values.password !== values.repeatPassword) {
      setErrorMessage('Passwords must match');
      return;
    }
    const { repeatPassword, showPassword, ...userData } = values;
    register(userData);
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  useEffect(() => {
    setErrorMessage('');
    if (values.password !== values.repeatPassword) {
      setErrorMessage('Passwords must match');
    }
  }, [values]);

  return (
    <div className="login-page">
      <Grid container spacing={2} className="login-grid">
        <Grid item md={4}></Grid>
        <Grid item md={4} className="login-container">
          <form className="form">
            <img src={Logo} className="auth-logo" />
            <Typography className="auth-header">Register</Typography>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              fullWidth
              type="text"
              onChange={(event) => setValues({ ...values, email: event.target.value })}
              className="auth-input"
            />
            <InputLabel htmlFor="name">Full name</InputLabel>
            <OutlinedInput
              id="name"
              fullWidth
              type="text"
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              className="auth-input"
            />
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              fullWidth
              type={values.showPassword ? 'text' : 'password'}
              color={values.password !== values.repeatPassword ? 'error' : 'success'}
              onChange={(event) => setValues({ ...values, password: event.target.value })}
              className="auth-input"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <InputLabel htmlFor="repeatPassword">Repeat password</InputLabel>
            <OutlinedInput
              id="repeatPassword"
              color={values.password !== values.repeatPassword ? 'error' : 'success'}
              fullWidth
              type={values.showPassword ? 'text' : 'password'}
              onChange={(event) => setValues({ ...values, repeatPassword: event.target.value })}
              className="auth-input"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <div className="auth-options">
              <Link to={'/auth/login'}>Du besitzt bereits ein Konto? Melde dich hier an</Link>
              <Link to={'/reset-password'}>Passwort vergessen?</Link>
            </div>
            <Button
              type="button"
              color="primary"
              size="large"
              onClick={handleRegister}
              variant="contained"
              fullWidth
              disabled={
                errorMessage.length > 0 || !values.email || !values.password || !values.repeatPassword || values.password !== values.repeatPassword
              }
              className="auth-button"
            >
              Register
            </Button>
            <Snackbar open={errorMessage.length > 0}>
              <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};
