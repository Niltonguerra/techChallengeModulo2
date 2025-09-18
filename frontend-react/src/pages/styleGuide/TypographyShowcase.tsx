import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCustomStyles } from '../../styles/scss/themes/theme';

const TypographyShowcase: React.FC = () => {
  const theme = useTheme();
  const customStyles = useCustomStyles();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        {/* 1. Títulos Principais - Montserrat */}
        <Typography variant="h1" sx={{ mb: 2 }}>
          Sistema de Design - Educa Fácil
        </Typography>
        <Typography variant="h2" sx={{ mb: 4, color: theme.palette.tertiary.main }}>
          Demonstração de Tipografia e Cores
        </Typography>

        {/* 2. Destaques Técnicos - Inter Bold */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Destaques Técnicos
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={customStyles.statBox}>
              <Typography variant="h3" component="div">5+</Typography>
              <Typography variant="body2">anos de experiência</Typography>
            </Box>
            <Box sx={customStyles.statBox}>
              <Typography variant="h4" component="div">12</Typography>
              <Typography variant="body2">projetos completos</Typography>
            </Box>
            <Box sx={customStyles.statBox}>
              <Typography variant="overline" component="div">Top 1%</Typography>
              <Typography variant="body2">no GitHub</Typography>
            </Box>
          </Stack>
        </Box>

        {/* 3. Cards de Projeto */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Cards de Projeto
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {[1, 2].map((item) => (
              <Card key={item} sx={{ ...customStyles.cardShadow, flex: 1 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Sistema de E-commerce {item}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                    Plataforma completa de vendas online
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Desenvolvimento full-stack com React, Node.js e PostgreSQL.
                  </Typography>
                  
                  {/* Tags de Tecnologia */}
                  <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
                    {['React', 'Node.js', 'TypeScript', 'PostgreSQL'].map((tech) => (
                      <Chip 
                        key={tech} 
                        label={tech} 
                        size="small"
                        sx={customStyles.techChip}
                      />
                    ))}
                  </Stack>
                  
                  {/* Botões de Ação */}
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      sx={customStyles.primaryGradient}
                    >
                      Ver Projeto
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                    >
                      Código
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* 4. Botões & Links de Ação */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Botões & Ações
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button variant="contained" color="primary">
              Download CV
            </Button>
            <Button variant="contained" color="secondary">
              Entre em Contato
            </Button>
            <Button variant="outlined" color="primary">
              Ver Projetos
            </Button>
            <Button variant="contained" color="success">
              Sucesso
            </Button>
            <Button variant="contained" color="info">
              Informação
            </Button>
            <Button variant="contained" color="error">
              Alerta
            </Button>
          </Stack>
        </Box>

        {/* 5. Texto Secundário */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Hierarquia de Texto
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Data: Janeiro 2024
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
                Última atualização: 15 de agosto, 2024
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              <strong>Texto Principal (Inter Regular 16px):</strong> Este é um exemplo de texto principal. 
              Ideal para descrições de projetos, conteúdo de artigos e informações detalhadas.
            </Typography>
            
            <Typography variant="body2" paragraph>
              <strong>Texto Secundário (Inter Regular 14px):</strong> Este texto é usado para 
              informações complementares, descrições breves e conteúdo de apoio.
            </Typography>
            
            <Typography variant="caption">
              <strong>Texto de Legenda (Inter Regular 12px):</strong> Para datas, tags, 
              informações auxiliares e metadados.
            </Typography>
          </Stack>
        </Box>

        {/* Paleta de Cores */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Paleta de Cores
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            {[
              { name: 'Primária', color: theme.palette.primary.main, label: '#4953B8' },
              { name: 'Secundária', color: theme.palette.secondary.main, label: '#F57005' },
              { name: 'Terciária', color: theme.palette.tertiary.main, label: '#2B264D' },
              { name: 'Sucesso', color: theme.palette.success.main, label: '#4CAF50' },
              { name: 'Erro', color: theme.palette.error.main, label: '#DC2626' },
              { name: 'Info', color: theme.palette.info.main, label: '#2196F3' },
            ].map((colorItem) => (
              <Box key={colorItem.name} sx={{ textAlign: 'center', minWidth: 120 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 80,
                    backgroundColor: colorItem.color,
                    borderRadius: 2,
                    mb: 1,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {colorItem.name}
                </Typography>
                <Typography variant="caption">
                  {colorItem.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Resumo do Sistema de Design */}
        <Card sx={{ ...customStyles.cardShadow, p: 3 }}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            📋 Resumo do Sistema de Design
          </Typography>
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                🎨 Fontes
              </Typography>
              <Typography variant="body2">
                • <strong>Montserrat:</strong> Títulos principais (Semi-Bold 600, Bold 700, 28-32px)<br/>
                • <strong>Inter:</strong> Corpo do texto, botões, números (Regular 400, Medium 500, Semi-Bold 600, Bold 700)
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                🎯 Hierarquia Visual
              </Typography>
              <Typography variant="body2">
                • <strong>H1-H2:</strong> Títulos de seção (Montserrat)<br/>
                • <strong>H3-H4:</strong> Destaques numéricos (Inter Bold)<br/>
                • <strong>H5-H6:</strong> Títulos de card (Inter Semi-Bold)<br/>
                • <strong>Body1-Body2:</strong> Texto corrido (Inter Regular)<br/>
                • <strong>Caption:</strong> Metadados e tags (Inter Regular 12px)
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                🌈 Paleta de Cores
              </Typography>
              <Typography variant="body2">
                Sistema baseado em Material Design com cores específicas para diferentes contextos:
                ações primárias, destaques, alertas, sucessos e informações.
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>
    </Container>
  );
};

export default TypographyShowcase;
