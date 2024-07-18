import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useGlobalState } from '../context/GlobalState';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';

const AthletesContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const FilterContainer = styled.div`
  background-color: ${props => props.theme.colors.light};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary};
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FilterCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const AthleteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const AthleteCard = styled.div`
  background-color: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.boxShadow};
  transition: ${props => props.theme.transition};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
`;

const AthleteName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const AthleteInfo = styled.p`
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  background-color: ${props => props.theme.colors.border};
  border-radius: 10px;
  height: 10px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background-color: ${props => props.theme.colors.primary};
  height: 100%;
  width: ${props => `${props.$progress}%`};
  transition: width 0.3s ease-in-out;
`;;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.light};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius};
  transition: ${props => props.theme.transition};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.light};
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const Athletes = () => {
  const { token } = useGlobalState();
  const [selectedSports, setSelectedSports] = useState([]);
  const [page, setPage] = useState(1);

  const fetchAthletes = async () => {
    const response = await api.get('/api/athletes', {
      params: {
        page,
        sports: selectedSports.join(','),
      }
    });
    return response.data;
  };

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useQuery(['athletes', page, selectedSports], fetchAthletes, {
    enabled: !!token,
    keepPreviousData: true,
  });

  const handleSportChange = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
    setPage(1);
  };

  const sports = useMemo(() => ['Basketball', 'Football', 'Tennis', 'Golf', 'Formula 1', 'Nascar'], []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <AthletesContainer>
      <Title>Browse Registered Athletes</Title>
      <FilterContainer>
        <FilterTitle>Filter by Sport:</FilterTitle>
        <FilterOptions>
          {sports.map((sport) => (
            <FilterLabel key={sport}>
              <FilterCheckbox
                type="checkbox"
                value={sport}
                onChange={() => handleSportChange(sport)}
                checked={selectedSports.includes(sport)}
              />
              {sport}
            </FilterLabel>
          ))}
        </FilterOptions>
      </FilterContainer>
      <AthleteGrid>
        {data?.athletes.map((athlete) => {
          const progress = athlete.fundingGoal > 0
            ? Math.min(100, Math.max(0, (athlete.amountInvested / athlete.fundingGoal) * 100))
            : 0;

          return (
            <ErrorBoundary key={athlete._id}>
              <AthleteCard>
                <AthleteName>{athlete.name || 'Unnamed Athlete'}</AthleteName>
                <AthleteInfo>Sport: {athlete.sport || 'Unknown'}</AthleteInfo>
                <AthleteInfo>Funding Goal: ${(athlete.fundingGoal || 0).toLocaleString()}</AthleteInfo>
                <AthleteInfo>Amount Invested: ${(athlete.amountInvested || 0).toLocaleString()}</AthleteInfo>
                <AthleteInfo>Progress: {progress.toFixed(2)}%</AthleteInfo>
                <ProgressBar>
                  <ProgressFill $progress={progress} />
                </ProgressBar>
                {athlete.sport === 'Tennis' && athlete.utrData && (
                  <>
                    <AthleteInfo>UTR Rating: {athlete.utrData.currentRatings?.singlesUtr || 'N/A'}</AthleteInfo>
                    <AthleteInfo>UTR Ranking: {athlete.utrData.currentRatings?.singlesStatus || 'N/A'}</AthleteInfo>
                  </>
                )}
                <StyledLink to={`/athletes/${athlete._id}`}>
                  See more details and invest
                </StyledLink>
              </AthleteCard>
            </ErrorBoundary>
          );
        })}
      </AthleteGrid>
      <PaginationContainer>
        <PaginationButton
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || isFetching}
        >
          Previous Page
        </PaginationButton>
        <PaginationButton
          onClick={() => setPage((old) => (data?.hasNextPage ? old + 1 : old))}
          disabled={!data?.hasNextPage || isFetching}
        >
          Next Page
        </PaginationButton>
      </PaginationContainer>
      {isFetching && <LoadingSpinner />}
    </AthletesContainer>
  );
};

export default React.memo(Athletes);