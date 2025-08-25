import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { KeyboardArrowDown, Logout } from '@mui/icons-material';
import { useDropdownMenu } from '../../hooks/useDropdownMenu';
import { createUserMenuItems, MENU_CONFIG, HEADER_TEXTS, DEFAULT_USER } from '../../constants/headerConstants';
import type { User } from '../../types/header-types';

interface UserSectionProps {
  isLoggedIn?: boolean;
  user?: User;
  onLogout?: () => void;
  onLogin?: () => void;
  className?: string;
}

const UserSection: React.FC<UserSectionProps> = ({
  isLoggedIn = false,
  user = DEFAULT_USER,
  onLogout,
  onLogin,
  className = 'header__user-section'
}) => {
  const { anchorEl, isOpen, handleClick, handleClose } = useDropdownMenu();

  // Handlers para ações do menu do usuário
  const handleProfileClick = useCallback(() => {
    console.log('Perfil clicado');
  }, []);

  const handleSettingsClick = useCallback(() => {
    console.log('Configurações clicadas');
  }, []);

  const handleLogout = useCallback(() => {
    handleClose();
    onLogout?.();
  }, [handleClose, onLogout]);

  const handleLogin = useCallback(() => {
    onLogin?.();
  }, [onLogin]);

  // Criar itens do menu do usuário
  const userMenuItems = createUserMenuItems(handleProfileClick, handleSettingsClick);

  // Definir classes CSS de forma mais limpa
  const classes = {
    userSection: className,
    userNotLogged: 'header__user-not-logged',
    loginButton: 'header__login-button',
    userLogged: 'header__user-logged',
    userButton: 'header__user-button',
    userAvatar: 'header__user-avatar',
    userInfo: 'header__user-info',
    userName: 'header__user-name',
    userEmail: 'header__user-email',
    userMenu: 'header__user-menu',
    userMenuItem: 'header__user-menu-item',
    logoutItem: 'header__logout-item'
  };

  // Renderizar estado não logado
  if (!isLoggedIn) {
    return (
      <Box className={classes.userSection}>
        <Box className={classes.userNotLogged}>
          <Button
            variant="outlined"
            onClick={handleLogin}
            className={classes.loginButton}
          >
            {HEADER_TEXTS.loginButton}
          </Button>
        </Box>
      </Box>
    );
  }

  // Renderizar estado logado
  return (
    <Box className={classes.userSection}>
      <Box className={classes.userLogged}>
        <Button
          className={classes.userButton}
          onClick={handleClick}
          startIcon={
            <Avatar
              src={user?.avatar}
              alt={user.name}
              className={classes.userAvatar}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          endIcon={<KeyboardArrowDown />}
          aria-controls={isOpen ? MENU_CONFIG.user.menuId : undefined}
          aria-haspopup="true"
          aria-expanded={isOpen ? 'true' : undefined}
          id={MENU_CONFIG.user.buttonId}
        >
          <Box className={classes.userInfo}>
            <Typography variant="body2" className={classes.userName}>
              {user.name}
            </Typography>
            <Typography variant="caption" className={classes.userEmail}>
              {user.email}
            </Typography>
          </Box>
        </Button>

        <Menu
          id={MENU_CONFIG.user.menuId}
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          className={classes.userMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {userMenuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                item.action();
                handleClose();
              }}
              className={classes.userMenuItem}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
          <Divider />
          <MenuItem 
            onClick={handleLogout} 
            className={classes.logoutItem}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={HEADER_TEXTS.logoutButton} />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default UserSection;
