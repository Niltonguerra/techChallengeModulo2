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
import { KeyboardArrowDown, Logout, HelpOutline } from '@mui/icons-material';
import './Header.scss';
import type { HeaderProps } from '../../types/header-types';
import { HEADER_TEXTS } from '../../constants/headerConstants';
import { Link, useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { clearUnread } from '../../store/notificationSlice';

const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  user,
  onLogout,
}) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const userMenuOpen = Boolean(userMenuAnchor);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { unreadCount, items } = useSelector(
    (state: RootState) => state.notification
  );

  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const notificationMenuOpen = Boolean(notificationAnchor);

  const handleNotificationClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setNotificationAnchor(event.currentTarget);
    },
    []
  );
  const handleNotificationClose = useCallback(() => {
    setNotificationAnchor(null);
  }, []);

  const handleNotificationItemClick = useCallback(
    (notification: { questionId: string, type: string }) => {
      navigate(`/questions/${notification.questionId}/chat`);
      dispatch(clearUnread());
      handleNotificationClose();
    },
    [navigate, dispatch, handleNotificationClose]
  );


  const handleUserMenuClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setUserMenuAnchor(event.currentTarget);
    },
    []
  );

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

  const handleFaq = useCallback(() => {
    handleUserMenuClose();
    navigate('/question');
  }, [handleUserMenuClose, navigate]);
  return (
    <AppBar position="static" className="header">
      <Toolbar className="header__toolbar">
        {/* Logo */}
        <Box className="header__logo">
          <img
            src="/logo.png"
            alt={HEADER_TEXTS.logoAlt}
            className="header__logo-image"
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="h6" className="header__logo-text">
            {HEADER_TEXTS.logoText}
          </Typography>
        </Box>

        {/* Espaço entre logo e usuário */}
        <Box flexGrow={1} />

        {/* Notificações + avatar juntos */}
        {isLoggedIn && user && (
          <Box display="flex" alignItems="center" gap={1}>
            {/* Notificação */}
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
              className="header__notification-button"
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={notificationAnchor}
              open={notificationMenuOpen}
              onClose={handleNotificationClose}
            >
              {items.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2">{HEADER_TEXTS.NotNotification}</Typography>
                </MenuItem>
              ) : (
                items.map((notification, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleNotificationItemClick(notification)}
                  >
                    <ListItemText
                      primary={HEADER_TEXTS.checkQuestion}
                      secondary={HEADER_TEXTS.question + notification.questionTitle}
                    />
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* Avatar + menu de usuário */}
            <Button
              className="header__user-button"
              onClick={handleUserMenuClick}
              startIcon={
                <Avatar
                  src={user.photo}
                  alt={`Avatar de ${user.name}`}
                  className="header__user-avatar"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              }
              endIcon={<KeyboardArrowDown />}
            >
              <Box className="header__user-info">
                <Typography variant="body2" className="header__user-name">
                  {user.name}
                </Typography>
                <Typography variant="caption" className="header__user-email">
                  {user.email}
                </Typography>
              </Box>
            </Button>

            <Menu
              id="user-menu"
              anchorEl={userMenuAnchor}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
            >
              {user.permission === "admin" && (
                <MenuItem onClick={handleAdmin} className="header__admin-item">
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={HEADER_TEXTS.AdminButton} />
                </MenuItem>
              )}

              <MenuItem onClick={handleFaq} className="header__user-menu-item">
                <ListItemIcon>
                  <HelpOutline />
                </ListItemIcon>
                <ListItemText primary={HEADER_TEXTS.faqButton} />
              </MenuItem>

              <MenuItem onClick={handleLogout} className="header__logout-item">
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary={HEADER_TEXTS.logoutButton} />
              </MenuItem>
            </Menu>
          </Box>
        )}

        {/* Caso não logado */}
        {!isLoggedIn && (
          <Box className="header__user-not-logged">
            <Button variant="outlined" className="header__login-button">
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {HEADER_TEXTS.loginButton}
              </Link>
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>

  );
};

export default Header;
