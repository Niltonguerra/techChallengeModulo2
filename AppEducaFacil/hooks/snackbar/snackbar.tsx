import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

interface SnackbarOptions {
  message: string;
  duration?: number; // milissegundos
  actionLabel?: string;
  onAction?: () => void;
}

interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar deve ser usado dentro de SnackbarProvider');
  return ctx;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<SnackbarOptions>({
    message: '',
    duration: 3000,
  });

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    setOptions({
      duration: opts.duration ?? 3000,
      message: opts.message,
      actionLabel: opts.actionLabel,
      onAction: opts.onAction,
    });
    setVisible(true);
  }, []);

  const onDismiss = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={visible}
          onDismiss={onDismiss}
          duration={options.duration}
          action={
            options.actionLabel
              ? {
                  label: options.actionLabel,
                  onPress: options.onAction,
                }
              : undefined
          }
        >
          {options.message}
        </Snackbar>
      </View>
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
