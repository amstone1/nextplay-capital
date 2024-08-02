import React from 'react';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import FormField from '../../components/FormField';

const AthleteFormContainer = styled.div`
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

const HelpText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.secondary};
  margin-top: 0.5rem;
`;

const CheckboxContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const AthleteForm = () => {
  const { values, setFieldValue } = useFormikContext();

  console.log('AthleteForm rendered. Current values:', values);

  return (
    <AthleteFormContainer>
      <SectionTitle>Athlete Information</SectionTitle>
      
      <FormField name="athleteInfo.name" type="text" label="Name" />
      <FormField 
        name="athleteInfo.sport" 
        as="select" 
        label="Sport"
        onChange={(e) => {
          setFieldValue('athleteInfo.sport', e.target.value);
          console.log('Sport selected:', e.target.value);
        }}
      >
        <option value="">Select a sport</option>
        <option value="Basketball">Basketball</option>
        <option value="Football">Football</option>
        <option value="Tennis">Tennis</option>
        <option value="Golf">Golf</option>
        <option value="Formula 1">Formula 1</option>
        <option value="Nascar">Nascar</option>
      </FormField>
      <FormField name="athleteInfo.fundingGoal" type="number" label="Funding Goal ($)" />
      <FormField 
        name="athleteInfo.earningsOption" 
        as="select" 
        label="Earnings Option"
        onChange={(e) => {
          setFieldValue('athleteInfo.earningsOption', e.target.value);
          // Reset the values when switching between options
          if (e.target.value === 'percentage') {
            setFieldValue('athleteInfo.firstXPercentage', '');
            setFieldValue('athleteInfo.firstYDollars', '');
          } else {
            setFieldValue('athleteInfo.earningsPercentage', '');
            setFieldValue('athleteInfo.durationYears', '');
          }
        }}
      >
        <option value="percentage">Percentage of Earnings</option>
        <option value="fixed">X Percent of my First Y Dollars</option>
      </FormField>

      {values.athleteInfo.earningsOption === 'percentage' && (
        <>
          <FormField name="athleteInfo.earningsPercentage" type="number" label="Earnings Percentage (%)" />
          <FormField name="athleteInfo.durationYears" type="number" label="Duration (years)" />
        </>
      )}

      {values.athleteInfo.earningsOption === 'fixed' && (
        <>
          <FormField name="athleteInfo.firstXPercentage" type="number" label="X Percent (%)" />
          <FormField name="athleteInfo.firstYDollars" type="number" label="First Y Dollars ($)" />
        </>
      )}

      <FormField name="athleteInfo.contractActivation" type="number" label="Contract Activation (%)" />

      {values.athleteInfo.sport === 'Tennis' && (
        <>
          <FormField name="athleteInfo.utrUserId" type="text" label="UTR User ID" />
          
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="noTennisAbstractProfile"
              checked={values.athleteInfo.noTennisAbstractProfile}
              onChange={(e) => {
                setFieldValue('athleteInfo.noTennisAbstractProfile', e.target.checked);
                if (e.target.checked) {
                  setFieldValue('athleteInfo.tennisAbstractId', '');
                }
              }}
            />
            <label htmlFor="noTennisAbstractProfile">I don't have a Tennis Abstract profile</label>
          </CheckboxContainer>

          {!values.athleteInfo.noTennisAbstractProfile && (
            <>
              <FormField name="athleteInfo.tennisAbstractId" type="text" label="Tennis Abstract ID" />
              <HelpText>
                To find your Tennis Abstract ID, go to https://www.tennisabstract.com/ and search for your name. 
                Your ID will be the value after 'p=' in the URL of your profile page. For example, for Novak Djokovic, 
                the URL is https://www.tennisabstract.com/cgi-bin/player.cgi?p=NovakDjokovic, so his ID is "NovakDjokovic".
              </HelpText>
            </>
          )}
        </>
      )}
    </AthleteFormContainer>
  );
};

export default AthleteForm;