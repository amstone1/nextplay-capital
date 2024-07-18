import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  const handleInvestClick = () => {
    navigate(`/invest/${athlete._id}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!athlete) return <ErrorMessage message="Athlete not found" />;

  const { tennisAnalytics } = athlete;

  return (
    <DetailContainer>
      <h1>{athlete.name}</h1>
      <Section>
        <h2>Basic Information</h2>
        <p>Sport: {athlete.sport}</p>
        <p>Funding Goal: ${athlete.fundingGoal?.toLocaleString()}</p>
        <p>Amount Invested: ${athlete.amountInvested?.toLocaleString()}</p>
        <ProgressBar>
          <ProgressFill $progress={(athlete.amountInvested / athlete.fundingGoal) * 100} />
        </ProgressBar>
        <p>Progress: {((athlete.amountInvested / athlete.fundingGoal) * 100).toFixed(2)}%</p>
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
        <Section>
          <h2>Tennis Information</h2>
          <StatGrid>
            <StatCard>
              <StatTitle>Singles UTR</StatTitle>
              <StatValue>{athlete.utrData?.currentRatings?.singlesUtr || 'N/A'}</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Doubles UTR</StatTitle>
              <StatValue>{athlete.utrData?.currentRatings?.doublesUtr || 'N/A'}</StatValue>
            </StatCard>
          </StatGrid>

          {athlete.noTennisAbstractProfile ? (
            <p>This athlete doesn't have a Tennis Abstract profile.</p>
          ) : (
            athlete.tennisAbstractId ? (
              <>
                <h3>Tennis Abstract Data</h3>
                {tennisAnalytics ? (
                  <>
                    <StatGrid>
                      <StatCard>
                        <StatTitle>Matches</StatTitle>
                        <StatValue>{tennisAnalytics.matches}</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Win %</StatTitle>
                        <StatValue>{tennisAnalytics.winPercentage?.toFixed(2)}%</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Aces/Match</StatTitle>
                        <StatValue>{tennisAnalytics.aces?.toFixed(2)}</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Double Faults/Match</StatTitle>
                        <StatValue>{tennisAnalytics.doubleFaults?.toFixed(2)}</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>1st Serve %</StatTitle>
                        <StatValue>{tennisAnalytics.firstServePercentage?.toFixed(2)}%</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>2nd Serve %</StatTitle>
                        <StatValue>{tennisAnalytics.secondServePercentage?.toFixed(2)}%</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Break Points Saved</StatTitle>
                        <StatValue>{tennisAnalytics.breakPointsSaved?.toFixed(2)}%</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Break Points Converted</StatTitle>
                        <StatValue>{tennisAnalytics.breakPointsConverted?.toFixed(2)}%</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Total Points Won</StatTitle>
                        <StatValue>{tennisAnalytics.totalPointsWon?.toFixed(2)}%</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Win/Loss Ratio</StatTitle>
                        <StatValue>{tennisAnalytics.winLossRatio?.toFixed(2)}</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Avg Match Duration</StatTitle>
                        <StatValue>{tennisAnalytics.averageMatchDuration?.toFixed(0)} min</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>Tiebreaks W/L</StatTitle>
                        <StatValue>{tennisAnalytics.tiebreaksWon}/{tennisAnalytics.tiebreaksLost}</StatValue>
                      </StatCard>
                      <StatCard>
                        <StatTitle>5-Set Matches W/L</StatTitle>
                        <StatValue>{tennisAnalytics.fiveSetWins}/{tennisAnalytics.fiveSetMatches - tennisAnalytics.fiveSetWins}</StatValue>
                      </StatCard>
                    </StatGrid>

                    <ChartContainer>
                      <h3>Performance Over Time</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tennisAnalytics.performanceOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="winPercentage" stroke="#8884d8" name="Win %" />
                          <Line yAxisId="right" type="monotone" dataKey="aces" stroke="#82ca9d" name="Aces" />
                          <Line yAxisId="right" type="monotone" dataKey="doubleFaults" stroke="#ffc658" name="Double Faults" />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer>
                      <h3>Surface Performance</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tennisAnalytics.surfacePerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="surface" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="matches" fill="#8884d8" name="Matches Played" />
                          <Bar yAxisId="right" dataKey="winPercentage" fill="#82ca9d" name="Win %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer>
                      <h3>Shot Distribution</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tennisAnalytics.shotDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {tennisAnalytics.shotDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <ChartContainer>
                      <h3>Strengths and Weaknesses</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tennisAnalytics.strengthsWeaknesses}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="stat" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Player" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </>
                ) : (
                  <p>Tennis Abstract data is not available at the moment.</p>
                )}
              </>
            ) : (
              <p>Tennis Abstract ID not provided.</p>
            )
          )}
        </Section>
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