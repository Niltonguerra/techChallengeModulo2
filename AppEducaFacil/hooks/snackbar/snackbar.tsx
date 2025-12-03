import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';

interface SnackbarOptions {
  message: string;
  duration?: number; // milissegundos
  actionLabel?: string;
  onAction?: () => void;
  top?: boolean;
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
    top: false,
  });

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    setOptions({
      duration: opts.duration ?? 3000,
      message: opts.message,
      actionLabel: opts.actionLabel,
      top: opts.top ?? false,
      onAction: opts.onAction,
    });
    setVisible(true);
  }, []);

  const onDismiss = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <View style={styles.snackbarContainer}>
        <Portal>
          <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={options.duration}
            wrapperStyle={[
              styles.snackbarBase,
              options.top ? styles.snackbarTop : styles.snackbarBottom,
            ]}
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
        </Portal>
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
    snackbarBase: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  snackbarTop: {
    top: 0,
  },
  snackbarBottom: {
    bottom: 0,
  },
});
