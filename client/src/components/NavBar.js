import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalState';

const NavBarContainer = styled.nav`
  background-color: ${props => props.theme.colors.dark};
  padding: ${props => props.theme.spacing.medium};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: ${props => props.theme.spacing.small};
`;

const NavBarBrand = styled(Link)`
  color: ${props => props.theme.colors.light};
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavBarLink = styled(Link)`
  color: ${props => props.theme.colors.light};
  text-decoration: none;
  padding: ${props => props.theme.spacing.small};
  margin-left: ${props => props.theme.spacing.small};
  transition: ${props => props.theme.transition};

  &:hover, &:focus {
    color: ${props => props.theme.colors.secondary};
  }

  &.active {
    color: ${props => props.theme.colors.accent};
  }
`;

const LogoutButton = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.light};
  border: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  margin-left: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const ThemeToggle = styled.button`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.light};
  border: none;
  padding: ${props => props.theme.spacing.small};
  margin-left: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: ${props => props.theme.transition};

  &:hover {
    background-color: ${props => props.theme.colors.primary};
  }
`;

const NavBar = ({ toggleTheme }) => {
  const { token, user } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('NavBar - Current token:', token);
  console.log('NavBar - Current user:', user);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const isInvestor = user && user.userType === 'investor';
  console.log('NavBar - Is user an investor?', isInvestor);

  const navItems = [
    { path: '/', label: 'Home' },
    ...(token
      ? [
          { path: '/profile', label: 'Profile' },
          ...(isInvestor ? [{ path: '/athletes', label: 'Browse Athletes' }] : []),
          { path: '/contracts', label: 'Contracts' },
        ]
      : [
          { path: '/login', label: 'Login' },
          { path: '/register', label: 'Register' },
        ]),
  ];

  console.log('NavBar - Nav items:', navItems);

  return (
    <NavBarContainer>
      <BrandContainer>
        <NavBarBrand to="/">
          <LogoImage src="/Next-Play-Logo2.PNG" alt="NextPlay Capital Logo" />
          NextPlay Capital
        </NavBarBrand>
      </BrandContainer>
      <NavLinks>
        {navItems.map((item) => (
          <NavBarLink
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </NavBarLink>
        ))}
        <ThemeToggle onClick={toggleTheme}>Toggle Theme</ThemeToggle>
        {token && (
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        )}
      </NavLinks>
    </NavBarContainer>
  );
};

export default NavBar;