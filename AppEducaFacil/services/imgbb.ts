import axios from 'axios';
import Constants from "expo-constants";

const URL_IMGBB = Constants.expoConfig?.extra.apiUrl;
const URL_KEY_IMGBB = Constants.expoConfig?.extra.imgBB;


export async function imgbbUmaImagem(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    const params = new URLSearchParams({
      key: URL_KEY_IMGBB,
    });

    axios
      .post(`${URL_IMGBB}?${params.toString()}`, formData, {
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