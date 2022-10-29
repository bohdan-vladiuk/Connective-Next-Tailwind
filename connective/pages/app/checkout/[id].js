import React from 'react';
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from '../../../components/checkoutform/index';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ client_secret }) => {
  const options = {
    clientSecret: client_secret,
    appearance: {/*...*/}, // edit the appearance from here
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}; 
 
export const getServerSideProps = async (context) => {
  // const referer = context.req.headers.referer;
  // const host = context.req.headers.host;
  // const protocol = referer.split('/')[0];
  // console.log(host)
  const { id } = context.params;
  const clientData = await axios.get(`http://localhost:3000/api/stripe/verify-client/${id}`);
  if (clientData.data.client_secret === null) {
    // handler if wrong input
  } else {
    return {
      props: {
        client_secret: clientData.data.client_secret
      }
    }
  }
};

export default Checkout;
