// crypto.ts
const CryptoJS = require('crypto-js');


const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // 簡易例。環境変数で管理推奨

export const encryptUserId = (userId: number): string => {
  return CryptoJS.AES.encrypt(userId.toString(), SECRET_KEY).toString();
};

export const decryptUserId = (cipherText: string): number | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decrypted, 10);
  } catch {
    return null;
  }
};
