import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
<<<<<<< HEAD
import styled from 'styled-components';
import AccessibleButton from './AccessibleButton';

const FormContainer = styled.form`
  margin-top: 20px;
`;

const CardElementContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  background-color: white;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  margin-top: 10px;
`;

=======
import AccessibleButton from './AccessibleButton';

>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
const CheckoutForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
<<<<<<< HEAD
    setError(null);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Investor Name', // Replace with actual investor's name if available
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <CardElementContainer>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </CardElementContainer>
      <AccessibleButton 
        type="submit"
=======

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Investor Name', // Replace with actual investor's name if available
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    }
    setProcessing(false);
  };

  return (
    <div>
      <CardElement />
      <AccessibleButton 
        onClick={handleSubmit}
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
        disabled={!stripe || processing}
        className="btn btn-primary mt-4"
        ariaLabel="Complete Payment"
      >
        {processing ? 'Processing...' : 'Pay'}
      </AccessibleButton>
<<<<<<< HEAD
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
=======
      {error && <div className="error">{error}</div>}
    </div>
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
  );
};

export default CheckoutForm;