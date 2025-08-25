import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  KeyboardArrowDown,
  Logout,
  Search,
} from '@mui/icons-material';
import './Header.scss';
import type { HeaderProps } from '../../types/header';
import {
  NAVIGATION_ITEMS,
  HEADER_TEXTS
} from '../../constants/headerConstants';

const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn = false, 
  user,
  onLogin,
  onLogout,
  onSearch,
  onNavigate
}) => {
  const [navigationAnchor, setNavigationAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [logoError, setLogoError] = useState(false);
  const navigationOpen = Boolean(navigationAnchor);
  const userMenuOpen = Boolean(userMenuAnchor);

  const handleNavigationClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setNavigationAnchor(event.currentTarget);
  }, []);

  const handleNavigationClose = useCallback(() => {
    setNavigationAnchor(null);
  }, []);

  const handleNavigationItemClick = useCallback((path: string) => {
    handleNavigationClose();
    onNavigate?.(path);
  }, [handleNavigationClose, onNavigate]);

  const handleUserMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  }, []);

  const handleUserMenuClose = useCallback(() => {
    setUserMenuAnchor(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleUserMenuClose();
    onLogout?.();
  }, [handleUserMenuClose, onLogout]);

  const handleLogin = useCallback(() => {
    onLogin?.();
  }, [onLogin]);

  const handleSearch = useCallback(() => {
    onSearch?.('');
  }, [onSearch]);

  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setLogoError(true);
    e.currentTarget.style.display = 'none';
  }, []);

  return (
    <AppBar 
      position="fixed" 
      className="header"
    >
      <Toolbar className="header__toolbar">
        <Box className="header__logo">
          {!logoError ? (
            <img
              src="/logo.png"
              alt={HEADER_TEXTS.logoAlt}
              className="header__logo-image"
              onError={handleLogoError}
            />
          ) : (
            <Box className="header__logo-fallback">
              E
            </Box>
          )}
          <Typography 
            variant="h1" 
            className="header__logo-text"
          >
            {HEADER_TEXTS.logoText}
          </Typography>
        </Box>

        <Box className="header__navigation">
          <Button
            className="header__nav-button"
            onClick={handleNavigationClick}
            endIcon={<KeyboardArrowDown />}
            aria-controls={navigationOpen ? 'navigation-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={navigationOpen ? 'true' : undefined}
          >
            {HEADER_TEXTS.navigationButton}
          </Button>
          <Menu
            id="navigation-menu"
            anchorEl={navigationAnchor}
            open={navigationOpen}
            onClose={handleNavigationClose}
            className="header__navigation-menu"
            MenuListProps={{
              'aria-labelledby': 'navigation-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {NAVIGATION_ITEMS.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => handleNavigationItemClick(item.path)}
                className="header__navigation-item"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box className="header__search">
          <Button
            id="search"
            className="header__search-button"
            onClick={handleSearch}
            aria-label={HEADER_TEXTS.searchButton}
            title={HEADER_TEXTS.searchButton}
          >
            <Search />
          </Button>
        </Box>

        <Box className="header__user-section">
          {isLoggedIn ? (
            <Box className="header__user-logged">
              <Button
                className="header__user-button"
                onClick={handleUserMenuClick}
                startIcon={
                  <Avatar
                    src={user?.avatar}
                    alt={`Avatar de ${user?.name || 'usuário'}`}
                    className="header__user-avatar"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                }
                endIcon={<KeyboardArrowDown />}
                aria-controls={userMenuOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? 'true' : undefined}
                aria-label={`Menu do usuário ${user?.name || ''}`}
              >
                <Box className="header__user-info">
                  <Typography 
                    variant="body2" 
                    className="header__user-name"
                  >
                    {user?.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className="header__user-email"
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Button>

              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                className="header__user-menu"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  onClick={handleLogout} 
                  className="header__logout-item"
                >
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary={HEADER_TEXTS.logoutButton} />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box className="header__user-not-logged">
              <Button
                variant="outlined"
                onClick={handleLogin}
                className="header__login-button"
                aria-label="Fazer login na plataforma"
              >
                {HEADER_TEXTS.loginButton}
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
