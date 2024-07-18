import React from 'react';
import { Field, ErrorMessage } from 'formik';
import styled from 'styled-components';

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
`;

const ErrorText = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const FormField = ({ name, label, ...props }) => {
  return (
    <FormGroup>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
      <ErrorMessage name={name} component={ErrorText} />
    </FormGroup>
  );
};

export default FormField;