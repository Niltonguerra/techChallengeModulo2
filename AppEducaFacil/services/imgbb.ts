import Constants from "expo-constants";
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const URL_IMGBB = Constants?.expoConfig?.extra?.apiUrl || 'https://api.imgbb.com/1/upload';
const URL_KEY_IMGBB = Constants?.expoConfig?.extra?.imgBB;
// const URL_IMGBB = 'https://api.imgbb.com/1/upload';
// const URL_KEY_IMGBB = '676c0bd4e17dba1ee3c06b04c599f085';

const fileNameFrom = (uri: string) => uri.split('/').pop() || `image_${Date.now()}.jpg`;

const guessMime = (uri: string) => {
  const ext = uri.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  return 'application/octet-stream';
};

// aux function to convert ImagePickerAsset for upload
async function toFormDataImagePart(asset: ImagePicker.ImagePickerAsset) {
  if (asset?.file && typeof File !== 'undefined') {
    return new File([asset.file], fileNameFrom(asset.uri), {
      type: asset.file.type || asset.mimeType || guessMime(asset.uri),
    });
  }

  if (typeof File !== 'undefined' && !!asset.uri && asset.uri.startsWith('blob:')) {
    const r = await fetch(asset.uri);
    const blob = await r.blob();
    return new File([blob], fileNameFrom(asset.uri), {
      type: blob.type || asset.mimeType || guessMime(asset.uri),
    });
  }

  return {
    uri: asset.uri,
    name: fileNameFrom(asset.uri),
    type: asset.mimeType || guessMime(asset.uri),
  } as any;
}

export async function imgbbUmaImagem(
  asset: ImagePicker.ImagePickerAsset
) {
  if (!asset?.uri) {
    console.log('no asset.uri found', asset);
    throw new Error('No image asset provided for upload');
  }

  const form = new FormData();

  const part = await toFormDataImagePart(asset);
  form.append('image', part);

  const url = `${URL_IMGBB}?key=${encodeURIComponent(URL_KEY_IMGBB)}`;
  const res = await fetch(url, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || 'Upload failed');
  return json;
}
