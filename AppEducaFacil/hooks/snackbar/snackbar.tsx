import { SnackbarContextType, SnackbarOptions } from '@/types/snackBar';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Snackbar, Text } from 'react-native-paper';

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
    noHeader: false,
  });

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    setOptions({
      duration: opts.duration ?? 3000,
      message: opts.message,
      actionLabel: opts.actionLabel,
      top: opts.top ?? false,
      noHeader: opts.noHeader ?? false,
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
              options.noHeader ? { marginTop: 50 } : {},
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
            <View style={styles.snackbarContent}>
              <Text style={styles.snackbarText}>
                {options.message}
              </Text>
            </View>
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
    backgroundColor: "#313033"
  },
    snackbarContent: {
    minHeight: 24,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 8,
  },
    snackbarBase: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  snackbarText: {
    color: '#eee7e7ff',
  },
  snackbarTop: {
    top: 0,
  },
  snackbarBottom: {
    bottom: 0,
  },
});
