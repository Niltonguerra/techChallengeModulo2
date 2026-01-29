import React, { useState, useCallback, useEffect } from 'react';
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
  IconButton,
  Badge,
} from '@mui/material';
import { KeyboardArrowDown, Logout, HelpOutline } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import type { HeaderProps } from '../../types/header-types';
import { HEADER_TEXTS } from '../../constants/headerConstants';
import { useAppSelector, useAppDispatch } from '../../store';
import { addNotification, markAsRead } from '../../store/notificationsSlice';
import { getNotifications, notificationClick } from '../../service/question';
import { nanoid } from '@reduxjs/toolkit';
import type { QuestionNotification } from '../../types/conversation';

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, user, onLogout }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
  if (!user) return;

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      const notifications = response;
      console.log('notifications',notifications)
      notifications.forEach((n: QuestionNotification) =>
        dispatch(addNotification({
          id: nanoid(),
          questionId: n.questionId,
          title: n.title,
          read: n.read,
          senderPhoto: n.senderPhoto,
          senderId: n.senderId,
        }))
      );
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
    }
  };

  fetchNotifications();
}, [user, dispatch]);


  const isUserMenuOpen = Boolean(userMenuAnchor);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchor);

  const notifications = useAppSelector(state => state.notifications.items);
  // Conta apenas notificações não lidas e que não foram enviadas por você
  const unreadCount = notifications.filter(n => n.read && n.senderId !== user?.id).length;

  // Marca a notificação como lida e navega para a questão
  const handleNotificationClick = async (questionId: string) => {
    try {
      // Marca todas as notificações da mesma questão como lidas no Redux
      const relatedNotifications = notifications.filter(n => n.questionId === questionId);
      relatedNotifications.forEach(n => dispatch(markAsRead(n.id)));

      // Atualiza no backend que o usuário visualizou a questão
      if (user) {
        await notificationClick(questionId);
      }

      // Fecha o menu de notificações
      handleNotificationMenuClose();

      // Navega para a questão
      navigate(`/question?id=${questionId}`);
    } catch (error) {
      console.error('Erro ao marcar questão como visualizada:', error);
    }
  };



  const handleNotificationMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
  };
  const handleNotificationMenuClose = () => setNotificationMenuAnchor(null);

  const handleUserMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  }, []);

  const handleUserMenuClose = useCallback(() => setUserMenuAnchor(null), []);

  const handleLogout = useCallback(() => {
    handleUserMenuClose();
    onLogout?.();
  }, [handleUserMenuClose, onLogout]);

  const handleAdmin = useCallback(() => {
    handleUserMenuClose();
    navigate('/admin');
  }, [handleUserMenuClose, navigate]);

  const handleFaq = useCallback(() => {
    handleUserMenuClose();
    navigate('/playground/socket-test');
  }, [handleUserMenuClose, navigate]);

  return (
    <AppBar position="static" className="header">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* LOGO */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo.png"
            alt={HEADER_TEXTS.logoAlt}
            className="header__logo-image"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <Typography variant="h6">{HEADER_TEXTS.logoText}</Typography>
        </Box>

        {/* AÇÕES À DIREITA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* NOTIFICAÇÕES */}
          {isLoggedIn && (
            <>
              <IconButton color="inherit" onClick={handleNotificationMenuClick}>
                <Badge color="error" badgeContent={unreadCount}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={notificationMenuAnchor}
                open={isNotificationMenuOpen}
                onClose={handleNotificationMenuClose}
              >
                {notifications
                  .filter(n => n.senderId !== user?.id)
                  .map(notification => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.questionId)}
                      sx={{ opacity: notification.read ? 0.6 : 1, maxWidth: 320 }}
                    >
                      <ListItemText
                        primary={notification.title}
                        secondary={notification.read ? 'Visualizada' : 'Nova resposta'}
                      />
                    </MenuItem>
                  ))
                }

                {notifications.filter(n => n.senderId !== user?.id).length === 0 && (
                  <MenuItem disabled>
                    <ListItemText primary="Nenhuma notificação" />
                  </MenuItem>
                )}
              </Menu>
            </>
          )}

          {/* USUÁRIO */}
          {isLoggedIn && user ? (
            <>
              <Button
                onClick={handleUserMenuClick}
                startIcon={
                  <Avatar src={user.photo} alt={user.name}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                }
                endIcon={<KeyboardArrowDown />}
              >
                <Box>
                  <Typography variant="body2">{user.name}</Typography>
                  <Typography variant="caption">{user.email}</Typography>
                </Box>
              </Button>

              <Menu
                anchorEl={userMenuAnchor}
                open={isUserMenuOpen}
                onClose={handleUserMenuClose}
              >
                {user.permission === 'admin' && (
                  <MenuItem onClick={handleAdmin}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary={HEADER_TEXTS.AdminButton} />
                  </MenuItem>
                )}

                <MenuItem onClick={handleFaq}>
                  <ListItemIcon>
                    <HelpOutline />
                  </ListItemIcon>
                  <ListItemText primary={HEADER_TEXTS.faqButton} />
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary={HEADER_TEXTS.logoutButton} />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="outlined">
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                {HEADER_TEXTS.loginButton}
              </Link>
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
