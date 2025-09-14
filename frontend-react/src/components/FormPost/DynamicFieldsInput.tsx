import React from 'react';
import { Stack, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DynamicFieldsInputProps } from '../../types/form-post';

function DynamicFieldsInput<T extends { key: string; value: string }>({
  items,
  onChange,
  keyLabel = 'Chave',
  valueLabel = 'Valor',
  error,
  allowKeyEdit = true,
  addButtonLabel = 'Adicionar',
  keyPlaceholder,
  valuePlaceholder,
  renderExtraFields,
}: DynamicFieldsInputProps<T>) {
  const handleKeyChange = (idx: number, newKey: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], key: newKey };
    onChange(updated);
  };
  const handleValueChange = (idx: number, newValue: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], value: newValue };
    onChange(updated);
  };
  const handleAdd = () => onChange([...items, { key: '', value: '' } as T]);
  const handleRemove = (idx: number) => {
    if (items.length > 1) {
      onChange(items.filter((_, i) => i !== idx));
    }
  };

  return (
    <>
      <Stack spacing={2}>
        {items.map((item, idx) => (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} key={idx} alignItems="center">
            {allowKeyEdit && (
            <TextField
              label={keyLabel}
              value={item.key}
              onChange={e => handleKeyChange(idx, e.target.value)}
              required
              fullWidth
              error={!!(error && !item.key)}
              placeholder={keyPlaceholder}
            />
            )}
            <TextField
              label={valueLabel}
              value={item.value}
              onChange={e => handleValueChange(idx, e.target.value)}
              required
              fullWidth
              error={!!(error && !item.value)}
              helperText={item.value && error}
              placeholder={valuePlaceholder}
            />
            {renderExtraFields && renderExtraFields(item, idx, items, onChange)}
            <IconButton
              color="error"
              onClick={() => handleRemove(idx)}
              aria-label="Remover campo"
              disabled={items.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        <Button onClick={handleAdd} variant="outlined" color="primary">{addButtonLabel}</Button>
      </Stack>
    </>
  );
}

export default DynamicFieldsInput;
