import React from 'react';
import styled from 'styled-components';
import { Table } from '@/components/ui/shadcn';

const MatchHistoryContainer = styled.div`
  margin-bottom: 2rem;
`;

const MatchHistory = ({ matches }) => {
  return (
    <MatchHistoryContainer>
      <h3>Recent Match History</h3>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Tournament</th>
            <th>Opponent</th>
            <th>Result</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.date}</td>
              <td>{match.tournament}</td>
              <td>{match.opponent}</td>
              <td>{match.result}</td>
              <td>{match.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MatchHistoryContainer>
  );
};

export default MatchHistory;