import React from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';
import type { DynamicLinksInputProps } from '../../types/form-post-components';

const DynamicLinksInput: React.FC<DynamicLinksInputProps> = ({ links, onChange, error }) => {
  const handleKeyChange = (idx: number, newKey: string) => {
    const updated = [...links];
    updated[idx] = { ...updated[idx], key: newKey };
    onChange(updated);
  };
  const handleValueChange = (idx: number, newValue: string) => {
    const updated = [...links];
    updated[idx] = { ...updated[idx], value: newValue };
    onChange(updated);
  };
  const handleAdd = () => onChange([...links, { key: '', value: '' }]);
  const handleRemove = (idx: number) => onChange(links.filter((_, i) => i !== idx));
  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Links personalizados</Typography>
      <Stack spacing={2}>
        {links.map((link, idx) => (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} key={idx} alignItems="center">
            <TextField
              label="Nome do link (ex: github, documentacao)"
              value={link.key}
              onChange={e => handleKeyChange(idx, e.target.value)}
              required
              fullWidth
              error={!!(error && !link.key)}
            />
            <TextField
              label="URL"
              value={link.value}
              onChange={e => handleValueChange(idx, e.target.value)}
              required
              fullWidth
              error={!!(error && !link.value)}
              helperText={link.value && error}
            />
            <Button color="error" onClick={() => handleRemove(idx)} variant="outlined">Remover</Button>
          </Stack>
        ))}
        <Button onClick={handleAdd} variant="outlined" color="primary">Adicionar link</Button>
      </Stack>
    </>
  );
};

export default DynamicLinksInput;
