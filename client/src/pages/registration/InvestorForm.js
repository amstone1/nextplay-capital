import React from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import FormField from '../../components/FormField';

const InvestorFormContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.secondary};
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const ErrorText = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const InvestorForm = () => {
  const { values, errors, touched, setFieldValue } = useFormikContext();

  const sports = ['Basketball', 'Football', 'Tennis', 'Golf', 'Formula 1', 'Nascar', 'Soccer'];

  return (
    <InvestorFormContainer>
      <SectionTitle>Investor Information</SectionTitle>
      
      <FormField
        name="investorInfo.investmentCapacity"
        type="number"
        label="Investment Capacity ($)"
      />
      
      <div>
        <label htmlFor="investorInfo.riskTolerance">Risk Tolerance</label>
        <select
          id="investorInfo.riskTolerance"
          name="investorInfo.riskTolerance"
          value={values.investorInfo.riskTolerance}
          onChange={(e) => setFieldValue('investorInfo.riskTolerance', e.target.value)}
        >
          <option value="">Select risk tolerance</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.investorInfo?.riskTolerance && touched.investorInfo?.riskTolerance && (
          <ErrorText>{errors.investorInfo.riskTolerance}</ErrorText>
        )}
      </div>

      <div>
        <label>Preferred Sports</label>
        {sports.map((sport) => (
          <div key={sport}>
            <input
              type="checkbox"
              id={`sport-${sport}`}
              name="investorInfo.preferredSports"
              value={sport}
              checked={values.investorInfo.preferredSports.includes(sport)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                const currentSports = values.investorInfo.preferredSports;
                if (isChecked) {
                  setFieldValue('investorInfo.preferredSports', [...currentSports, sport]);
                } else {
                  setFieldValue(
                    'investorInfo.preferredSports',
                    currentSports.filter((s) => s !== sport)
                  );
                }
              }}
            />
            <label htmlFor={`sport-${sport}`}>{sport}</label>
          </div>
        ))}
        {errors.investorInfo?.preferredSports && touched.investorInfo?.preferredSports && (
          <ErrorText>{errors.investorInfo.preferredSports}</ErrorText>
        )}
      </div>
    </InvestorFormContainer>
  );
};

export default InvestorForm;