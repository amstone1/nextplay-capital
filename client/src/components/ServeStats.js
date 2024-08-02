import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ServeStatsContainer = styled.div`
  margin-bottom: 2rem;
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const ServeStats = ({ stats }) => {
  const data = [
    { name: 'First Serve %', value: stats.firstServePercentage },
    { name: 'First Serve Points Won %', value: stats.firstServePointsWonPercentage },
    { name: 'Second Serve Points Won %', value: stats.secondServePointsWonPercentage },
    { name: 'Break Points Saved %', value: stats.breakPointsSavedPercentage },
  ];

  return (
    <ServeStatsContainer>
      <h3>Serve Statistics</h3>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ServeStatsContainer>
  );
};

export default ServeStats;