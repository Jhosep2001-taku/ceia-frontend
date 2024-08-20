import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return null;
  }
};
