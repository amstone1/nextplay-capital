import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalState } from '../context/GlobalState';
import AccessibleButton from '../components/AccessibleButton';

const HomeContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xlarge};
`;

const HeroSection = styled.section`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.light};
  padding: ${props => props.theme.spacing.xlarge} 0;
  margin-bottom: ${props => props.theme.spacing.xlarge};
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: ${props => props.theme.spacing.xlarge};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.medium};
`;

const FeatureSection = styled.section`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${props => props.theme.spacing.xlarge};
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  width: 30%;
  box-shadow: ${props => props.theme.boxShadow};
  transition: ${props => props.theme.transition};

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.light};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius};
  transition: ${props => props.theme.transition};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const Home = () => {
  const { token } = useGlobalState();

  return (
    <HomeContainer>
      <HeroSection>
        <Title>Welcome to NextPlay Capital</Title>
        <Subtitle>Invest in the future of sports. Support athletes. Grow your wealth.</Subtitle>
        <ButtonContainer>
          {token ? (
            <StyledLink to="/athletes">
              Browse Athletes
            </StyledLink>
          ) : (
            <>
              <StyledLink to="/register">
                Get Started
              </StyledLink>
              <StyledLink to="/login">
                Login
              </StyledLink>
            </>
          )}
        </ButtonContainer>
      </HeroSection>

      <FeatureSection>
        <FeatureCard>
          <h2>Smart Investments</h2>
          <p>Access a diverse portfolio of promising athletes across various sports.</p>
        </FeatureCard>
        <FeatureCard>
          <h2>Athlete Support</h2>
          <p>Empower athletes to reach their full potential with your investment.</p>
        </FeatureCard>
        <FeatureCard>
          <h2>Win-Win Partnerships</h2>
          <p>Create mutually beneficial relationships between investors and athletes.</p>
        </FeatureCard>
      </FeatureSection>
    </HomeContainer>
  );
};

export default React.memo(Home);