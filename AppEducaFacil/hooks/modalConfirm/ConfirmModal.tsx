// ConfirmModalProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import styleGuide from '@/constants/styleGuide';
import { ConfirmContextType, ConfirmOptions } from '@/types/ConfirmModal';

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm deve ser usado dentro de ConfirmModalProvider');
  return ctx;
};

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: '' });
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setVisible(true);
    return new Promise((resolve) => setResolver(() => resolve));
  };

  const handleConfirm = () => {
    setVisible(false);
    resolver?.(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resolver?.(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal isVisible={visible} onBackdropPress={handleCancel}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{options.message}</Text>
          <View style={styles.buttonRow}>
            <Button style={styles.btn1} labelStyle={styles.btnLabel} onPress={handleConfirm}>
              {options.TextButton2 || 'Confirmar'}
            </Button>
            <Button style={styles.btn2} labelStyle={styles.btnLabel} onPress={handleCancel}>
              {options.TextButton1 || 'Cancelar'}
            </Button>
          </View>
        </View>
      </Modal>
    </ConfirmContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  message: {
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 80,
  },
  btnLabel: {
    ...styleGuide.typography.button as TextStyle,
  },
  btn1: {
    backgroundColor: styleGuide.palette.error,
    borderWidth: 0,
  },
  btn2: {
    backgroundColor: styleGuide.palette.warning,
  },
});
