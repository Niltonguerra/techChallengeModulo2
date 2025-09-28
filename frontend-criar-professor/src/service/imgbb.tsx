import axios from 'axios';

const url = import.meta.env.VITE_URL_IMGBB;
const apiKey = import.meta.env.VITE_KEY_IMGBB;

export async function imgbbUmaImagem(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    const params = new URLSearchParams({
      key: apiKey,
    });

    axios
      .post(`${url}?${params.toString()}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.data;
          resolve(data.url);
        } else {
          reject(new Error('Erro ao enviar a imagem para o ImgBB.'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}