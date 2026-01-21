import React, { useState, useCallback } from 'react';
import {
  AppBar, Toolbar, Button, Menu, MenuItem, Avatar, Box, Typography, ListItemIcon, ListItemText,
} from '@mui/material';
import { KeyboardArrowDown, Logout } from '@mui/icons-material';
import './Header.scss';
import type { HeaderProps } from '../../types/header-types';
import { HEADER_TEXTS } from '../../constants/headerConstants';
import { Link, useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  user,
  onLogout
}) => {

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userMenuAnchor);
  const navigate = useNavigate();


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

  const handleAdmin = useCallback(() => {
    handleUserMenuClose();
    navigate('/admin');
  }, [handleUserMenuClose]);


  return (
    <AppBar position="static" className="header">
      <Toolbar className="header__toolbar">

        <Box className="header__logo">
          <img src="/logo.png" alt={HEADER_TEXTS.logoAlt} className="header__logo-image" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <Typography variant="h6" className="header__logo-text">{HEADER_TEXTS.logoText}</Typography>
        </Box>

        <Box className="header__user-section">

          {isLoggedIn && user ? (
            <Box className="header__user-logged">
              <Button className="header__user-button" onClick={handleUserMenuClick} startIcon={
                <Avatar src={user.photo} alt={`Avatar de ${user.name}`} className="header__user-avatar">

                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              } endIcon={<KeyboardArrowDown />}>
                <Box className="header__user-info">

                  <Typography variant="body2" className="header__user-name">{user.name}</Typography>
                  <Typography variant="caption" className="header__user-email">{user.email}</Typography>
                </Box>
              </Button>
              <Menu id="user-menu" anchorEl={userMenuAnchor} open={userMenuOpen} onClose={handleUserMenuClose}>
                {user.permission === "admin" && (
                  <MenuItem onClick={handleAdmin} className="header__admin-item">
                    <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                    <ListItemText primary={HEADER_TEXTS.AdminButton} />
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} className="header__logout-item">
                  <ListItemIcon><Logout /></ListItemIcon>
                  <ListItemText primary={HEADER_TEXTS.logoutButton} />
                </MenuItem>

              </Menu>
            </Box>
          ) : (
            <Box className="header__user-not-logged">

              <Button variant="outlined" className="header__login-button">
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {HEADER_TEXTS.loginButton}
                </Link>
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;