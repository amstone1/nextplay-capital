import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ContractsContainer = styled.div`
  padding: 2rem;
`;

const ContractsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ContractCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.background};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContractTitle = styled.h2`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ContractDetail = styled.p`
  margin-bottom: 0.5rem;
`;

const Contracts = () => {
  const { data: contracts, isLoading, error } = useQuery('contracts', async () => {
    const res = await api.get('/api/contracts');
    return res.data;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to fetch contracts. Please try again later." />;

  return (
    <ContractsContainer>
      <h1>Contracts</h1>
      {contracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        <ContractsGrid>
          {contracts.map(contract => (
            <ContractCard key={contract._id}>
              <ContractTitle>Contract Details</ContractTitle>
              <ContractDetail><strong>Athlete:</strong> {contract.athlete.name}</ContractDetail>
              <ContractDetail><strong>Investor:</strong> {contract.investor.name}</ContractDetail>
              <ContractDetail><strong>Amount:</strong> ${contract.amount.toLocaleString()}</ContractDetail>
              <ContractDetail><strong>Date:</strong> {new Date(contract.date).toLocaleDateString()}</ContractDetail>
            </ContractCard>
          ))}
        </ContractsGrid>
      )}
    </ContractsContainer>
  );
};

export default Contracts;