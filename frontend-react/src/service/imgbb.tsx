import axios from 'axios';
import type { Foto } from '../types/form-post';


export async function imgbbUmaImagem(file: Blob) {
    return new Promise<Foto>((resolve, reject) => {
      const url = import.meta.env.VITE_URL_IMGBB;
      const apiKey = import.meta.env.VITE_KEY_IMGBB;

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
            console.log('Imagem enviada com sucesso para o ImgBB! URL: ' + data.url);
  
            // Pega os links da imagem e o link para excluir a imagem e coloca em um obj

            // const imagemReceita: Foto = {
            //     imagem_grande: data.image,
            //     imagem_media: data.medium,
            //     imagem_pequena: data.thumb,
            //     excluir: data.delete_url,
            // };
  
            resolve(data.url);
          } else {
            console.log('Erro ao enviar a imagem para o ImgBB.');
            reject(new Error('Erro ao enviar a imagem para o ImgBB.'));
          }
        })
        .catch((error) => {
          console.error('Erro de rede: ' + error);
          reject(error);
        });
    });
  }