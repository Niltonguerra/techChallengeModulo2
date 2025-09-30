import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const RegisterBox: React.FC = () => {
  return (
    <Box sx={{ padding: { xs: '0', md: '0 32px' } }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
      >
        Faça o seu registo
      </Typography>

      <Link
        component={RouterLink}
        to="/aluno/create/user"
        underline="hover"
        sx={{ display: 'block', mb: 2 }}
      >
        <Typography color="primary">
          Não possui registo? Registe-se aqui
        </Typography>
      </Link>

      <Typography color="primary" sx={{ mb: 2 }}>
        Dúvidas ou precisa de alguma ajuda?
      </Typography>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PhoneIcon fontSize="small" color="primary" />
          <Link href="tel:932313383" underline="hover" color="primary">
            (11) 93231-3383
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon fontSize="small" color="primary" />
          <Link
            href="mailto:educacaofacilfiap@gmail.com"
            underline="hover"
            color="primary"
          >
            educacaofacilfiap@gmail.com
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterBox;
