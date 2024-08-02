// src/styles/theme.js
export const lightTheme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: '#F5A623',
    dark: '#2C3E50',
    light: '#F8F9FA',
    text: '#333333',
    error: '#E74C3C',
    background: '#FFFFFF',
    border: '#DEE2E6',
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Roboto', sans-serif",
    monospace: "'Roboto Mono', monospace",
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
    xlarge: '2rem',
  },
  borderRadius: '0.25rem',
  boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
  transition: '0.3s ease',
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#2C3E50',
    text: '#F8F9FA',
    dark: '#ECF0F1',
    light: '#34495E',
    border: '#4A5568',
  },
};