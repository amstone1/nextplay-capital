import React from 'react';
import styled from 'styled-components';

const Spinner = styled.div`
  border: 4px solid ${props => props.theme.colors.light};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner = () => <Spinner />;

export default LoadingSpinner;