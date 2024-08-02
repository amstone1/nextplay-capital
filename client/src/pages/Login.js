import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { useGlobalDispatch } from '../context/GlobalState';
import api from '../api';
import AccessibleButton from '../components/AccessibleButton';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const loginValidationSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required('Email or username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useGlobalDispatch();
  const [loginError, setLoginError] = useState(null);

  const loginMutation = useMutation(
    (credentials) => api.post('/api/auth/login', credentials),
    {
      onSuccess: (response) => {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        navigate('/profile');
      },
      onError: (error) => {
        console.error('Login error:', error);
        setLoginError(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
      }
    }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError(null);
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      // Error is handled in the mutation's onError
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <Title>Login</Title>
      <Formik
        initialValues={{ emailOrUsername: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate>
            <FormField
              label="Email or Username"
              name="emailOrUsername"
              type="text"
              autoComplete="username"
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <AccessibleButton 
              type="submit"
              className="btn btn-primary btn-block mt-4"
              disabled={isSubmitting || loginMutation.isLoading}
              ariaLabel="Login"
            >
              {loginMutation.isLoading ? 'Logging in...' : 'Login'}
            </AccessibleButton>
          </Form>
        )}
      </Formik>
      {loginError && <ErrorMessage message={loginError} />}
    </LoginContainer>
  );
};

export default Login;