import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { utrApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius} 0 0 ${props => props.theme.borderRadius};
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0 ${props => props.theme.borderRadius} ${props => props.theme.borderRadius} 0;
  cursor: pointer;
`;

const PlayerInfo = styled.div`
  margin-bottom: 2rem;
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

const MatchList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MatchItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
`;

const UTRPlayerSearch = () => {
    const [utrId, setUtrId] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(false);
  
    const { data: playerData, isLoading, error, isFetched } = useQuery(
      ['utrPlayer', utrId],
      async () => {
        const [profileResponse, resultsResponse] = await Promise.all([
          utrApi.get(`/player/${utrId}/profile`),
          utrApi.get(`/player/${utrId}/results`)
        ]);
        return {
          profile: profileResponse.data,
          results: resultsResponse.data
        };
      },
      {
        enabled: searchTrigger && utrId !== '',
        onSettled: () => setSearchTrigger(false)
      }
    );
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setSearchTrigger(true);
    };
  
    const renderMatches = (results, type) => {
      if (!results || !Array.isArray(results.events)) {
        return <p>No recent {type} matches available</p>;
      }
  
      const recentMatches = results.events
        .flatMap(event => 
          event.draws.flatMap(draw => 
            draw.results
              .filter(match => type === 'singles' ? draw.teamType === 'Singles' : draw.teamType === 'Doubles')
              .map(match => {
                const isWinner = match.players.winner1.id === utrId || match.players.winner2?.id === utrId;
                let playerTeam, opponentTeam;
  
                if (type === 'singles') {
                  playerTeam = isWinner ? match.players.winner1 : match.players.loser1;
                  opponentTeam = isWinner ? match.players.loser1 : match.players.winner1;
                } else {
                  playerTeam = isWinner 
                    ? [match.players.winner1, match.players.winner2] 
                    : [match.players.loser1, match.players.loser2];
                  opponentTeam = isWinner 
                    ? [match.players.loser1, match.players.loser2] 
                    : [match.players.winner1, match.players.winner2];
                }
  
                return {
                  id: match.id,
                  date: match.date,
                  isWinner: isWinner,
                  playerTeam: playerTeam,
                  opponentTeam: opponentTeam,
                  score: match.score,
                  eventName: event.name
                };
              })
          )
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);  // Changed from 5 to 10
  
      if (recentMatches.length === 0) {
        return <p>No recent {type} matches available</p>;
      }
  
      return (
        <MatchList>
          {recentMatches.map(match => (
            <MatchItem key={match.id}>
              {new Date(match.date).toLocaleDateString()}: 
              {type === 'singles' 
                ? `${match.playerTeam.firstName} ${match.playerTeam.lastName}`
                : `${match.playerTeam[0].firstName} ${match.playerTeam[0].lastName} / ${match.playerTeam[1]?.firstName || ''} ${match.playerTeam[1]?.lastName || ''}`
              }
              {' '}{match.isWinner ? 'won against' : 'lost to'}{' '}
              {type === 'singles'
                ? `${match.opponentTeam.firstName} ${match.opponentTeam.lastName}`
                : `${match.opponentTeam[0].firstName} ${match.opponentTeam[0].lastName} / ${match.opponentTeam[1]?.firstName || ''} ${match.opponentTeam[1]?.lastName || ''}`
              }
              {match.score && Object.keys(match.score).length > 0
                ? ` (Score: ${Object.values(match.score).map(set => `${set.winner}-${set.loser}`).join(', ')})`
                : ''
              } 
              - {match.eventName}
            </MatchItem>
          ))}
        </MatchList>
      );
    };
  
    const calculateStats = (results, type) => {
      if (!results || !Array.isArray(results.events)) {
        return { totalMatches: 0, winLossString: 'N/A', winPercentage: 'N/A' };
      }
  
      let wins = 0;
      let losses = 0;
      let withdrawals = 0;
  
      results.events.forEach(event => 
        event.draws
          .filter(draw => type === 'singles' ? draw.teamType === 'Singles' : draw.teamType === 'Doubles')
          .forEach(draw => 
            draw.results.forEach(match => {
              if (match.players.winner1.id === utrId) wins++;
              else if (match.players.loser1.id === utrId) losses++;
              if (match.outcome === 'walkover') withdrawals++;
            })
          )
      );
  
      const totalMatches = wins + losses;
      const winLossString = `${wins} - ${losses}${withdrawals > 0 ? ` (${withdrawals} Walkovers)` : ''}`;
      const winPercentage = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(2) + '%' : 'N/A';
  
      return { totalMatches, winLossString, winPercentage };
    };
  
    return (
        <SearchContainer>
          <h1>UTR Player Search</h1>
          <SearchForm onSubmit={handleSubmit}>
            <SearchInput
              type="text"
              value={utrId}
              onChange={(e) => setUtrId(e.target.value)}
              placeholder="Enter UTR ID"
            />
            <SearchButton type="submit">Search</SearchButton>
          </SearchForm>
    
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={`Failed to fetch player data: ${error.message}`} />}
          
          {isFetched && !playerData?.results && <ErrorMessage message="No results data available" />}
    
          {playerData && playerData.results && (
            <>
              <PlayerInfo>
                <h2>{playerData.profile.displayName || 'Unknown Player'}</h2>
                <p>Nationality: {playerData.profile.nationality || 'Unknown'}</p>
              </PlayerInfo>
    
              <StatGrid>
                <StatCard>
                  <StatTitle>Singles UTR</StatTitle>
                  <StatValue>{playerData.profile.singlesUtr || 'N/A'}</StatValue>
                </StatCard>
                <StatCard>
                  <StatTitle>Doubles UTR</StatTitle>
                  <StatValue>{playerData.profile.doublesUtr || 'N/A'}</StatValue>
                </StatCard>
              </StatGrid>
    
              <h3>Singles Results</h3>
              {(() => {
                const stats = calculateStats(playerData.results, 'singles');
                return (
                  <StatGrid>
                    <StatCard>
                      <StatTitle>Total Matches</StatTitle>
                      <StatValue>{stats.totalMatches}</StatValue>
                    </StatCard>
                    <StatCard>
                      <StatTitle>Win-Loss Record</StatTitle>
                      <StatValue>{stats.winLossString}</StatValue>
                    </StatCard>
                    <StatCard>
                      <StatTitle>Win Percentage</StatTitle>
                      <StatValue>{stats.winPercentage}</StatValue>
                    </StatCard>
                  </StatGrid>
                );
              })()}
    
              <h4>Recent Singles Matches</h4>
              {renderMatches(playerData.results, 'singles')}
    
              <h3>Doubles Results</h3>
              {(() => {
                const stats = calculateStats(playerData.results, 'doubles');
                return (
                  <StatGrid>
                    <StatCard>
                      <StatTitle>Total Matches</StatTitle>
                      <StatValue>{stats.totalMatches}</StatValue>
                    </StatCard>
                    <StatCard>
                      <StatTitle>Win-Loss Record</StatTitle>
                      <StatValue>{stats.winLossString}</StatValue>
                    </StatCard>
                    <StatCard>
                      <StatTitle>Win Percentage</StatTitle>
                      <StatValue>{stats.winPercentage}</StatValue>
                    </StatCard>
                  </StatGrid>
                );
              })()}
    
              <h4>Recent Doubles Matches</h4>
              {renderMatches(playerData.results, 'doubles')}
            </>
          )}
        </SearchContainer>
      );
    };
    
    export default UTRPlayerSearch;