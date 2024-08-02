import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { useGlobalDispatch } from '../../context/GlobalState';
import api from '../../api';
import AccessibleButton from '../../components/AccessibleButton';
import FormField from '../../components/FormField';
import AthleteForm from './AthleteForm';
import InvestorForm from './InvestorForm';
import ErrorMessage from '../../components/ErrorMessage';

const RegisterContainer = styled.div`
  max-width: 600px;
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

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Step = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
  margin: 0 5px;
`;

const baseSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  userType: Yup.string().oneOf(['athlete', 'investor'], 'Invalid user type').required('User type is required')
});

const athleteSchema = Yup.object().shape({
  athleteInfo: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    sport: Yup.string().required('Sport is required'),
    fundingGoal: Yup.number()
      .positive('Funding goal must be positive')
      .max(1000000, 'Funding goal cannot exceed $1,000,000')
      .required('Funding goal is required'),
    earningsOption: Yup.string()
      .oneOf(['percentage', 'fixed'], 'Invalid earnings option')
      .required('Earnings option is required'),
    earningsPercentage: Yup.number().when('earningsOption', {
      is: 'percentage',
      then: (schema) => schema
        .positive('Must be positive')
        .max(20, 'Cannot exceed 20%')
        .required('Earnings percentage is required'),
      otherwise: (schema) => schema.nullable()
    }),
    durationYears: Yup.number().when('earningsOption', {
      is: 'percentage',
      then: (schema) => schema
        .positive('Must be positive')
        .max(8, 'Cannot exceed 8 years')
        .required('Duration is required'),
      otherwise: (schema) => schema.nullable()
    }),
    firstXPercentage: Yup.number().when('earningsOption', {
      is: 'fixed',
      then: (schema) => schema
        .positive('Must be positive')
        .max(50, 'Cannot exceed 50%')
        .required('First X percentage is required'),
      otherwise: (schema) => schema.nullable()
    }),
    firstYDollars: Yup.number().when('earningsOption', {
      is: 'fixed',
      then: (schema) => schema
        .positive('Must be positive')
        .test('is-greater-than-funding-goal', 'Must be at least 25% more than the funding goal', function (value) {
          const fundingGoal = this.parent.fundingGoal;
          return value > fundingGoal * 1.25;
        })
        .required('First Y dollars is required'),
      otherwise: (schema) => schema.nullable()
    }),
    contractActivation: Yup.number()
      .positive('Must be positive')
      .max(100, 'Cannot exceed 100%')
      .required('Contract activation is required'),
    utrUserId: Yup.string().when('sport', {
      is: 'Tennis',
      then: (schema) => schema.required('UTR User ID is required for Tennis players'),
      otherwise: (schema) => schema.nullable()
    }),
<<<<<<< HEAD
    tennisAbstractId: Yup.string().when('sport', {
      is: 'Tennis',
      then: (schema) => schema
        .test('tennis-abstract-id', 'Tennis Abstract ID is required', function(value) {
          return this.parent.noTennisAbstractProfile || (value && value.trim().length > 0);
        }),
      otherwise: (schema) => schema.nullable()
    }),
    noTennisAbstractProfile: Yup.boolean()
=======
    tennisAbstractId: Yup.string().when(['sport', 'noTennisAbstractProfile'], {
      is: (sport, noTennisAbstractProfile) => sport === 'Tennis' && !noTennisAbstractProfile,
      then: (schema) => schema.required('Tennis Abstract ID is required for Tennis players with a profile'),
      otherwise: (schema) => schema.nullable()
    })
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
  })
});

const investorSchema = Yup.object().shape({
  investorInfo: Yup.object().shape({
    investmentCapacity: Yup.number()
      .positive('Investment capacity must be positive')
      .required('Investment capacity is required'),
    riskTolerance: Yup.string()
      .oneOf(['low', 'medium', 'high'], 'Invalid risk tolerance')
      .required('Risk tolerance is required'),
    preferredSports: Yup.array()
      .of(Yup.string())
      .min(1, 'Select at least one preferred sport')
      .required('Preferred sports are required')
  })
});

const getValidationSchema = (step, userType) => {
  if (step === 1) {
    return baseSchema;
  } else if (step === 2) {
    return userType === 'athlete' 
      ? baseSchema.concat(athleteSchema)
      : baseSchema.concat(investorSchema);
  }
  return Yup.object();
};

const Register = () => {
  const dispatch = useGlobalDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');

  const registerMutation = useMutation(
    (userData) => api.post('/api/auth/register', userData),
    {
      onSuccess: (response) => {
        console.log('Registration successful:', response.data);
        if (response.data && response.data.token && response.data.user) {
          dispatch({ type: 'SET_TOKEN', payload: response.data.token });
          dispatch({ type: 'SET_USER', payload: response.data.user });
          navigate('/profile');
        } else {
          console.error('Invalid response from registration');
          throw new Error('Registration successful, but received invalid data. Please try logging in.');
        }
      },
      onError: (error) => {
        console.error('Registration error:', error.response || error.message);
        throw error;
      }
    }
  );
  
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (step === 1) {
      setStep(2);
      setUserType(values.userType);
      setSubmitting(false);
    } else {
      try {
        await registerMutation.mutateAsync(values);
      } catch (err) {
        console.error('Registration error:', err);
        setErrors({ server: err.response?.data?.message || err.message || 'An error occurred during registration' });
      }
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    userType: '',
    athleteInfo: {
      name: '',
      sport: '',
      fundingGoal: '',
      earningsOption: 'percentage',
      earningsPercentage: '',
      durationYears: '',
      firstXPercentage: '',
      firstYDollars: '',
      contractActivation: '',
      utrUserId: '',
      tennisAbstractId: '',
      noTennisAbstractProfile: false
    },
    investorInfo: {
      investmentCapacity: '',
      riskTolerance: '',
      preferredSports: []
    }
  };

  return (
    <RegisterContainer>
      <Title>Register</Title>
      <StepIndicator>
        <Step $active={step === 1} />
        <Step $active={step === 2} />
      </StepIndicator>
      <Formik
        initialValues={initialValues}
        validationSchema={() => getValidationSchema(step, userType)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form noValidate>
            {step === 1 && (
              <>
                <FormField name="email" type="email" label="Email" />
                <FormField name="username" type="text" label="Username" />
                <FormField name="password" type="password" label="Password" />
                <FormField name="confirmPassword" type="password" label="Confirm Password" />
                <FormField name="phoneNumber" type="tel" label="Phone Number" />
                <FormField 
                  name="userType" 
                  as="select" 
                  label="User Type"
                  onChange={(e) => {
                    setFieldValue('userType', e.target.value);
                    setUserType(e.target.value);
                  }}
                >
                  <option value="">Select user type</option>
                  <option value="athlete">Athlete</option>
                  <option value="investor">Investor</option>
                </FormField>
              </>
            )}

            {step === 2 && values.userType === 'athlete' && <AthleteForm />}
            {step === 2 && values.userType === 'investor' && <InvestorForm />}

            {errors.server && <ErrorMessage message={errors.server} />}

            <AccessibleButton 
              type="submit" 
              className="btn btn-primary btn-block mt-4" 
              ariaLabel={step === 1 ? "Continue" : "Register"}
              disabled={isSubmitting}
            >
              {step === 1 ? "Continue" : "Register"}
            </AccessibleButton>

            {step === 2 && (
              <AccessibleButton 
                type="button" 
                className="btn btn-secondary btn-block mt-2" 
                ariaLabel="Back"
                onClick={() => setStep(1)}
              >
                Back
              </AccessibleButton>
            )}
          </Form>
        )}
      </Formik>
    </RegisterContainer>
  );
};

export default Register;