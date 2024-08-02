import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AccessibleButton from '../components/AccessibleButton';

const DetailContainer = styled.div`
  padding: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.large};
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: ${props => props.theme.spacing.large};
`;

const ProgressBar = styled.div`
  background-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  height: 20px;
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const ProgressFill = styled.div`
  background-color: ${props => props.theme.colors.primary};
  height: 100%;
  border-radius: ${props => props.theme.borderRadius};
  width: ${props => `${props.$progress}%`};
  transition: width 0.5s ease-in-out;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.medium};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
`;

const StatTitle = styled.h4`
  margin-bottom: ${props => props.theme.spacing.small};
  color: ${props => props.theme.colors.secondary};
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AthleteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: athlete, isLoading, error } = useQuery(['athlete', id], async () => {
    const response = await api.get(`/api/athletes/${id}`);
    return response.data;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!athlete) return <ErrorMessage message="Athlete not found" />;

  const { utrData, tennisAnalytics } = athlete;
  const handleInvestClick = () => {
    navigate(`/invest/${athlete._id}`);
  };

  const progress = (athlete.amountInvested / athlete.fundingGoal) * 100;

  return (
    <DetailContainer>
      <h1>{athlete.name}</h1>
      <Section>
        <h2>Basic Information</h2>
        <p>Sport: {athlete.sport}</p>
        <p>Funding Goal: ${athlete.fundingGoal?.toLocaleString()}</p>
        <p>Amount Invested: ${athlete.amountInvested?.toLocaleString()}</p>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>
        <p>Progress: {progress.toFixed(2)}%</p>
      </Section>
      
      <Section>
        <h2>Earnings Option: {athlete.earningsOption}</h2>
        {athlete.earningsOption === 'percentage' ? (
          <>
            <p>Earnings Percentage: {athlete.earningsPercentage}%</p>
            <p>Duration: {athlete.durationYears} years</p>
          </>
        ) : (
          <>
            <p>First X Percentage: {athlete.firstXPercentage}%</p>
            <p>Of First Y Dollars: ${athlete.firstYDollars?.toLocaleString()}</p>
          </>
        )}
        <p>Contract Activation: {athlete.contractActivation}%</p>
      </Section>
      
      {athlete.sport === 'Tennis' && (
        <>
          {utrData && (
            <Section>
              <h2>UTR Data</h2>
              <StatGrid>
                <StatCard>
                  <StatTitle>Singles UTR</StatTitle>
                  <StatValue>{utrData.currentRatings?.singlesUtr} ({utrData.currentRatings?.singlesStatus})</StatValue>
                </StatCard>
                <StatCard>
                  <StatTitle>Doubles UTR</StatTitle>
                  <StatValue>{utrData.currentRatings?.doublesUtr} ({utrData.currentRatings?.doublesStatus})</StatValue>
                </StatCard>
              </StatGrid>

              {utrData.overallStats && (
                <>
                  <h3>Overall Stats</h3>
                  <StatGrid>
                    <StatCard>
                      <StatTitle>Total Matches</StatTitle>
                      <StatValue>{utrData.overallStats.totalMatches}</StatValue>
                    </StatCard>
                    <StatCard>
                      <StatTitle>Win-Loss Record</StatTitle>
                      <StatValue>{utrData.overallStats.wins}-{utrData.overallStats.losses}</StatValue>
                    </StatCard>
                    <StatCard>
                      <StatTitle>Win Percentage</StatTitle>
                      <StatValue>{utrData.overallStats.winPercentage}%</StatValue>
                    </StatCard>
                  </StatGrid>
                </>
              )}

              {utrData.performanceTrend?.utrProgression && (
                <>
                  <h3>UTR Progression</h3>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={utrData.performanceTrend.utrProgression}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="utr" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </>
              )}

              {utrData.winPercentageByUTRRange && (
                <>
                  <h3>Win Percentage by Opponent UTR Range</h3>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(utrData.winPercentageByUTRRange).map(([key, value]) => ({ range: key, percentage: value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="percentage" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </>
              )}
            </Section>
          )}

          {tennisAnalytics && (
            <Section>
              <h2>Tennis Abstract Data</h2>
              <p>Current Rank: {tennisAnalytics.currentRank}</p>
              <p>Career High Rank: {tennisAnalytics.careerHighRank}</p>

              <h3>Overall Stats</h3>
              <StatGrid>
                <StatCard>
                  <StatTitle>Matches</StatTitle>
                  <StatValue>{tennisAnalytics.overallStats.matches}</StatValue>
                </StatCard>
                <StatCard>
                  <StatTitle>Won-Lost</StatTitle>
                  <StatValue>{tennisAnalytics.overallStats.wonLost}</StatValue>
                </StatCard>
                <StatCard>
                  <StatTitle>Win Percentage</StatTitle>
                  <StatValue>{tennisAnalytics.overallStats.winPercentage}%</StatValue>
                </StatCard>
              </StatGrid>

              <h3>Surface Performance</h3>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tennisAnalytics.surfacePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="surface" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="winPercentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Section>
          )}
        </>
      )}

      <AccessibleButton
        onClick={handleInvestClick}
        className="btn btn-primary"
        ariaLabel={`Invest in ${athlete.name}`}
      >
        Invest in this Athlete
      </AccessibleButton>
    </DetailContainer>
  );
};

export default AthleteDetail;