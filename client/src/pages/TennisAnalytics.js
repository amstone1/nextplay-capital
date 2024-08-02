import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnalyticsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-bottom: 2rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
`;

const StatTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.secondary};
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const TennisAnalytics = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
  
    const { data: searchResults, isLoading: isSearching, error: searchError } = useQuery(
      ['playerSearch', searchTerm],
      async () => {
        if (searchTerm.length < 3) return [];
        console.log('Sending search request for:', searchTerm);
        try {
          const response = await axios.get(`/api/tennis/search?q=${searchTerm}`);
          console.log('Search response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Search error:', error.response ? error.response.data : error.message);
          console.error('Error details:', error);
          throw error;
        }
      },
      { 
        enabled: searchTerm.length >= 3,
        retry: false,
        onError: (error) => {
          console.error('Search error in onError:', error);
        }
      }
    );

  const { data: playerData, isLoading: isLoadingStats, error: statsError } = useQuery(
    ['playerStats', selectedPlayer],
    async () => {
      if (!selectedPlayer) return null;
      console.log('Fetching stats for player:', selectedPlayer.id);
      try {
        const response = await axios.get(`/api/tennis/search?q=${searchTerm}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
                  console.log('Player stats response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Stats error:', error.response ? error.response.data : error.message);
        throw error;
      }
    },
    { 
      enabled: !!selectedPlayer,
      retry: false,
      onError: (error) => {
        console.error('Stats error in onError:', error);
      }
    }
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePlayerSelect = (e) => {
    const player = JSON.parse(e.target.value);
    setSelectedPlayer(player);
    setSearchTerm('');
  };

  return (
    <AnalyticsContainer>
      <h1>Tennis Player Analytics</h1>
      <SearchContainer>
        <Input
          type="text"
          placeholder="Search for a player"
          value={searchTerm}
          onChange={handleSearch}
        />
        {isSearching && <p>Searching...</p>}
        {searchError && (
          <ErrorMessage>
            An error occurred: {searchError.message}
            {searchError.response && (
              <div>
                Status: {searchError.response.status}
                Data: {JSON.stringify(searchError.response.data)}
              </div>
            )}
          </ErrorMessage>
        )}
        {searchResults && searchResults.length > 0 && (
          <Select onChange={handlePlayerSelect} value={selectedPlayer ? JSON.stringify(selectedPlayer) : ''}>
            <option value="">Select a player</option>
            {searchResults.map((player) => (
              <option key={player.id} value={JSON.stringify(player)}>
                {player.name}
              </option>
            ))}
          </Select>
        )}
      </SearchContainer>

      {isLoadingStats ? (
        <p>Loading player statistics...</p>
      ) : statsError ? (
        <ErrorMessage>
          An error occurred while fetching player statistics: {statsError.message}
        </ErrorMessage>
      ) : playerData ? (
        <>
          <h2>{playerData.name} Analytics</h2>
          
          <StatGrid>
            {Object.entries(playerData.basicInfo || {}).map(([key, value]) => (
              <StatCard key={key}>
                <StatTitle>{key}</StatTitle>
                <StatValue>{value}</StatValue>
              </StatCard>
            ))}
          </StatGrid>

          {playerData.surfaceStats && (
            <ChartContainer>
              <h3>Surface Performance</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(playerData.surfaceStats).map(([surface, stats]) => ({
                  surface,
                  winPercentage: parseFloat(stats.winPercentage)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="surface" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="winPercentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          {playerData.rankingHistory && playerData.rankingHistory.length > 0 && (
            <ChartContainer>
              <h3>Ranking History</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={playerData.rankingHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis reversed />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ranking" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          {playerData.recentMatches && playerData.recentMatches.length > 0 && (
            <>
              <h3>Recent Matches</h3>
              <ul>
                {playerData.recentMatches.map((match, index) => (
                  <li key={index}>
                    {match.date} - {match.tournament}: {match.result} vs {match.opponent} ({match.score})
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : null}
    </AnalyticsContainer>
  );
};

export default TennisAnalytics;