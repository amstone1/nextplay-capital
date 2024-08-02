import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
<<<<<<< HEAD
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
import { GlobalProvider } from './context/GlobalState';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import AppContent from './AppContent';

const queryClient = new QueryClient();
<<<<<<< HEAD
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
=======
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <GlobalStyle />
<<<<<<< HEAD
          <Elements stripe={stripePromise}>
            <Router>
              <AppContent toggleTheme={toggleTheme} />
            </Router>
          </Elements>
=======
          <Router>
            <AppContent toggleTheme={toggleTheme} />
          </Router>
>>>>>>> 6a91e8f6251b8d186ad4ef942dd89a8d70954b5a
        </ThemeProvider>
      </GlobalProvider>
    </QueryClientProvider>
  );
}

export default App;