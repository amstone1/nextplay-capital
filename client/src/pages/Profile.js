import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useGlobalState } from '../context/GlobalState';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ProfileInfo = styled.p`
  margin-bottom: 0.5rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
  margin-top: 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const PlayerName = styled.h1`
  margin: 0;
`;

const formatScore = (score) => {
  if (!score || typeof score !== 'object') return 'N/A';
  return Object.entries(score)
    .map(([set, values]) => `${values.winner}-${values.loser}`)
    .join(', ');
};

const Profile = () => {
  const navigate = useNavigate();
  const { token } = useGlobalState();

  const { data: profile, isLoading, error } = useQuery(
    ['profile', token],
    async () => {
      const res = await api.get('/api/auth/me');
      return res.data;
    },
    {
      enabled: !!token,
      retry: 1,
      retryDelay: 1000,
      onError: (err) => {
        console.error('Failed to fetch profile:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      },
      staleTime: 300000, // 5 minutes
      cacheTime: 3600000, // 1 hour
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load profile. Please try again later." />;
  if (!profile || !profile.user) return <ErrorMessage message="No profile data available" />;

  const athleteData = profile.athlete;
  const utrData = athleteData?.utrData;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfilePicture 
          src={utrData?.profileData?.profilePictureUrl || '/default-profile-picture.png'} 
          alt={`${utrData?.profileData?.name || profile.user.username}'s profile`} 
        />
        <PlayerName>{utrData?.profileData?.name || profile.user.username}</PlayerName>
      </ProfileHeader>
      
      <Section>
        <SectionTitle>Basic Information</SectionTitle>
        <ProfileInfo>Email: {profile.user.email}</ProfileInfo>
        <ProfileInfo>Username: {profile.user.username}</ProfileInfo>
      </Section>
      
      {profile.user.userType === 'athlete' && athleteData && (
        <Section>
          <SectionTitle>Athlete Information</SectionTitle>
          <ProfileInfo>Sport: {athleteData.sport}</ProfileInfo>
          <ProfileInfo>Funding Goal: ${athleteData.fundingGoal?.toLocaleString()}</ProfileInfo>
          <ProfileInfo>Committed Earnings Option: {athleteData.earningsOption}</ProfileInfo>
          {athleteData.earningsOption === 'percentage' && (
            <>
              <ProfileInfo>Committed Percentage of Earnings: {athleteData.earningsPercentage}%</ProfileInfo>
              <ProfileInfo>Duration (years): {athleteData.durationYears}</ProfileInfo>
            </>
          )}
          {athleteData.earningsOption === 'fixed' && (
            <>
              <ProfileInfo>First X Percentage: {athleteData.firstXPercentage}%</ProfileInfo>
              <ProfileInfo>Of My First Y Dollars: ${athleteData.firstYDollars?.toLocaleString()}</ProfileInfo>
            </>
          )}
          <ProfileInfo>Contract Activation Amount: {athleteData.contractActivation}%</ProfileInfo>
          
          {athleteData.sport === 'Tennis' && utrData && (
            <Section>
              <SectionTitle>Universal Tennis Rating (UTR) Information</SectionTitle>
              <ProfileInfo>UTR ID: {utrData.profileData?.id || 'N/A'}</ProfileInfo>
              <ProfileInfo>Current Singles UTR: {utrData.currentRatings?.singlesUtr || 'N/A'}</ProfileInfo>
              <ProfileInfo>Current Doubles UTR: {utrData.currentRatings?.doublesUtr || 'N/A'}</ProfileInfo>
              
              <SectionTitle>Overall Statistics</SectionTitle>
              <ProfileInfo>Total Matches: {utrData.overallStats?.totalMatches || 'N/A'}</ProfileInfo>
              <ProfileInfo>Wins: {utrData.overallStats?.wins || 'N/A'}</ProfileInfo>
              <ProfileInfo>Losses: {utrData.overallStats?.losses || 'N/A'}</ProfileInfo>
              <ProfileInfo>Win Percentage: {utrData.overallStats?.winPercentage || 'N/A'}%</ProfileInfo>

              {utrData.performanceTrend?.utrProgression && (
                <>
                  <SectionTitle>Performance Trend (Last 12 Months)</SectionTitle>
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={utrData.performanceTrend.utrProgression}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="utr" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </>
              )}

              <SectionTitle>Strength of Schedule</SectionTitle>
              <ProfileInfo>Average Opponent UTR: {utrData.strengthOfSchedule?.average?.toFixed(2) || 'N/A'}</ProfileInfo>
              <ProfileInfo>Highest Opponent UTR: {utrData.strengthOfSchedule?.highest || 'N/A'}</ProfileInfo>
              <ProfileInfo>Lowest Opponent UTR: {utrData.strengthOfSchedule?.lowest || 'N/A'}</ProfileInfo>

              <SectionTitle>Recent Matches</SectionTitle>
              {utrData.recentMatches?.map((match, index) => (
                <ProfileInfo key={index}>
                  {new Date(match.date).toLocaleDateString()}: {match.outcome.toUpperCase()} vs {match.opponent}
                  (Score: {formatScore(match.score)})
                </ProfileInfo>
              ))}

              <SectionTitle>Win Percentage by Opponent UTR Range</SectionTitle>
              <ProfileInfo>vs Lower UTR: {utrData.winPercentageByUTRRange?.lower || 'N/A'}%</ProfileInfo>
              <ProfileInfo>vs Similar UTR: {utrData.winPercentageByUTRRange?.similar || 'N/A'}%</ProfileInfo>
              <ProfileInfo>vs Higher UTR: {utrData.winPercentageByUTRRange?.higher || 'N/A'}%</ProfileInfo>
            </Section>
          )}
        </Section>
      )}
      
      {profile.user.userType === 'investor' && profile.investor && (
        <Section>
          <SectionTitle>Investor Information</SectionTitle>
          <ProfileInfo>Total Investment: ${profile.investor.totalInvestment?.toLocaleString() || '0'}</ProfileInfo>
        </Section>
      )}
    </ProfileContainer>
  );
};

export default Profile;