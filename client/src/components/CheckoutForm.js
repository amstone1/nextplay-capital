import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AccessibleButton from './AccessibleButton';

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
        disabled={!stripe || processing}
        className="btn btn-primary mt-4"
        ariaLabel="Complete Payment"
      >
        {processing ? 'Processing...' : 'Pay'}
      </AccessibleButton>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CheckoutForm;