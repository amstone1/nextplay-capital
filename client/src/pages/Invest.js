import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import FormField from '../components/FormField';
import AccessibleButton from '../components/AccessibleButton';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const InvestContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ProgressBar = styled.div`
  background-color: ${props => props.theme.colors.lightGrey};
  border-radius: 10px;
  height: 20px;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  background-color: ${props => props.theme.colors.primary};
  height: 100%;
  border-radius: 10px;
  width: ${props => `${props.$progress}%`};
`;

const ConfirmationMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
`;

const Invest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const [updatedAthleteData, setUpdatedAthleteData] = useState(null);
  const queryClient = useQueryClient();

  const addLog = useCallback((message) => {
    console.log(message);
    setLogMessages(prev => [...prev, message]);
  }, []);

  const { data: athlete, isLoading, error, refetch } = useQuery(['athlete', id], async () => {
    const response = await api.get(`/api/athletes/${id}`);
    addLog(`Fetched athlete data: ${JSON.stringify(response.data)}`);
    return response.data;
  });

  const createPaymentIntent = useMutation(
    async (amount) => {
      addLog(`Creating payment intent for amount: ${amount}`);
      const response = await api.post('/api/create-payment-intent', {
        amount: Math.round(amount * 100),
        athleteId: id,
      });
      addLog(`Payment intent created: ${JSON.stringify(response.data)}`);
      return response.data.clientSecret;
    },
    {
      onSuccess: (data) => {
        addLog(`Setting client secret: ${data}`);
        setClientSecret(data);
      },
      onError: (error) => {
        addLog(`Error creating payment intent: ${error.message}`);
      },
    }
  );

  const investmentMutation = useMutation(
    async ({ amount, paymentIntentId }) => {
      addLog(`Processing investment: amount=${amount}, paymentIntentId=${paymentIntentId}`);
      const response = await api.post('/api/investments', {
        athleteId: id,
        amount: parseFloat(amount),
        paymentIntentId,
      });
      addLog(`Investment processed: ${JSON.stringify(response.data)}`);
      return response.data;
    },
    {
      onSuccess: async (data, variables) => {
        addLog(`Investment successful: ${JSON.stringify(data)}`);
        setShowConfirmation(true);
        setInvestedAmount(parseFloat(variables.amount));
        setUpdatedAthleteData(data.updatedAthlete);
        await refetch();
        queryClient.invalidateQueries(['athlete', id]);
      },
      onError: (error) => {
        addLog(`Error processing investment: ${error.message}`);
        setPaymentProcessing(false);
      },
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to fetch athlete data" />;

  const remainingFunding = Math.max(0, athlete.fundingGoal - athlete.amountInvested);
  const progress = (athlete.amountInvested / athlete.fundingGoal) * 100;

  const investmentValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .positive('Amount must be positive')
      .max(remainingFunding, `Amount cannot exceed remaining funding of $${remainingFunding.toLocaleString()}`)
      .required('Investment amount is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    addLog(`Handling submit with values: ${JSON.stringify(values)}`);
    try {
      const clientSecret = await createPaymentIntent.mutateAsync(values.amount);
      addLog(`Client secret received: ${clientSecret}`);
      setClientSecret(clientSecret);
      setInvestedAmount(parseFloat(values.amount));
    } catch (error) {
      addLog(`Error in handleSubmit: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    addLog(`Payment success received with paymentIntentId: ${paymentIntentId}`);
    setPaymentProcessing(true);
    
    try {
      await investmentMutation.mutateAsync({ amount: investedAmount, paymentIntentId });
      addLog('Investment recorded successfully');
    } catch (error) {
      addLog('Investment failed to record. Showing error message.');
      setShowConfirmation(false);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <InvestContainer>
      <h1>Invest in {athlete.name}</h1>
      <p>Sport: {athlete.sport}</p>
      <p>Funding Goal: ${athlete.fundingGoal.toLocaleString()}</p>
      <p>Amount Invested: ${athlete.amountInvested.toLocaleString()}</p>
      <p>Remaining Funding: ${remainingFunding.toLocaleString()}</p>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>

      {showConfirmation ? (
        <ConfirmationMessage>
          <h2>Investment Successful!</h2>
          <p>You have successfully invested ${investedAmount.toLocaleString()} in {athlete.name}.</p>
          <p>New Amount Invested: ${updatedAthleteData ? updatedAthleteData.amountInvested.toLocaleString() : (athlete.amountInvested + investedAmount).toLocaleString()}</p>
          <p>New Remaining Funding: ${updatedAthleteData ? (athlete.fundingGoal - updatedAthleteData.amountInvested).toLocaleString() : (remainingFunding - investedAmount).toLocaleString()}</p>
          <AccessibleButton
            onClick={() => navigate(`/athletes/${id}`)}
            className="btn btn-primary mt-4"
            ariaLabel="Return to Athlete Profile"
          >
            Return to Athlete Profile
          </AccessibleButton>
        </ConfirmationMessage>
      ) : (
        <>
          {!clientSecret ? (
            <Formik
              initialValues={{ amount: '' }}
              validationSchema={investmentValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <FormField
                    name="amount"
                    type="number"
                    label="Investment Amount ($)"
                    min="1"
                    max={remainingFunding}
                  />
                  {errors.amount && touched.amount && <div className="error">{errors.amount}</div>}
                  <AccessibleButton 
                    type="submit" 
                    className="btn btn-primary mt-4"
                    ariaLabel="Proceed to payment"
                    disabled={isSubmitting || createPaymentIntent.isLoading}
                  >
                    {createPaymentIntent.isLoading ? 'Processing...' : 'Proceed to Payment'}
                  </AccessibleButton>
                </Form>
              )}
            </Formik>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </>
      )}

      {paymentProcessing && <p>Processing your investment...</p>}

      {(createPaymentIntent.isError || investmentMutation.isError) && (
        <ErrorMessage 
          message={
            "Your payment was processed successfully, but there was an error recording the investment. " +
            "Please contact support with your payment details. " +
            ((createPaymentIntent.error || investmentMutation.error)?.message || 
            'An error occurred during the investment process.')
          }
        />
      )}
    </InvestContainer>
  );
};

export default Invest;