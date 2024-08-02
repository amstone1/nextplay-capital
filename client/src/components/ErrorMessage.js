import React from 'react';
import styled from 'styled-components';

const ErrorText = styled.p`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ErrorMessage = ({ message }) => (
  <ErrorText>{message}</ErrorText>
);

export default ErrorMessage;