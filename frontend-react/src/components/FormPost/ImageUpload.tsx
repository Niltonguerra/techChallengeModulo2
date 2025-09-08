import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import type { ImageUploadProps } from '../../types/form-post-components';

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, preview, setPreview, error }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    } else {
      onChange(null);
      setPreview(null);
    }
  };
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Imagem do post</Typography>
      <Button variant="outlined" component="label">
        Selecionar imagem
        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
      </Button>
      {preview && (
        <Box mt={2}>
          <img src={preview} alt="Pré-visualização" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
        </Box>
      )}
      {error && <Typography color="error" variant="body2">{error}</Typography>}
    </Box>
  );
};

export default ImageUpload;
