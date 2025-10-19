import { TextStyle } from "react-native";

export const styleGuide = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
  palette: {
    main: {
      primaryColor: '#4953B8',
      secondColor: '#F57005',
      thirdColor: '#2B264D',
      fourthColor: '#F5F3F4',
      textPrimaryColor: '#0F172A',
      textSecondaryColor: '#64748B',
    },
    light: {
      primaryLightColor: '#6B73E6',
      secondLightColor: '#FF9833',
      thirdLightColor: '#3D3669',
      fourthLightColor: '#FFFFFF',
    },
    dark: {
      primaryColor: '#373E8C',
      secondColor: '#C75A00',
      thirdColor: '#1F1A3A',
      fourthColor: '#1E1E1E',
      textPrimaryColor: '#FFFFFF',
      textSecondaryColor: '#64748B',
    },
    error: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
  },
  typography: {
    h1: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: '700' as TextStyle['fontWeight'],
      fontSize: 48,                  
      lineHeight: 58,             
      color: '#0F172A',
    },
    h2: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight:  '700' as TextStyle['fontWeight'],
      fontSize: 32,
      color: '#0F172A',
    },
    h3: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight:  '600' as TextStyle['fontWeight'],
      fontSize: 24,
      color: '#0F172A',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontWeight:  '600' as TextStyle['fontWeight'],
      fontSize: 18,
      color: '#0F172A',
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontWeight:  '400' as TextStyle['fontWeight'],
      fontSize: 16,
      color: '#64748B',
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: '400' as TextStyle['fontWeight'],
      fontSize: 14,
      color: '#64748B',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: '600' as TextStyle['fontWeight'],
      fontSize: 16,
      color: '#fff',
    },
  },
};

export default styleGuide;