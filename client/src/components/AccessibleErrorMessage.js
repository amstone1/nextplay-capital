import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.white};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  margin: 1rem 0;
`;

const AccessibleErrorMessage = ({ message }) => (
  <ErrorContainer role="alert">
    <p>{message}</p>
  </ErrorContainer>
);

export default AccessibleErrorMessage;