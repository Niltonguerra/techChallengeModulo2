import React from 'react';
import { Container, Paper, Grid, Divider, Box } from '@mui/material';
import LoginForm from '../components/Login/LoginForm';
import RegisterBox from '../components/Login/RegisterBox';
import type { User } from '../types/header-types';

interface LoginPageProps {
  onLogin: (userData: User, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 15,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 4, md: 6 },
          width: '100%',
          minHeight: '500px',
          alignContent: 'center',
        }}
      >
        <Grid
          container
          alignItems="flex-start"
          justifyContent="center"
          spacing={{ xs: 4, md: 2 }}
        >
          <Grid item xs={12} md={6}>
            <LoginForm onLogin={onLogin} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: 'none', md: 'block' },
                  mx: { md: 2 },
                  my: -5,
                }}
              />
              <RegisterBox />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
