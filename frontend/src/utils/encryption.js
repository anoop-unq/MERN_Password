import CryptoJS from 'crypto-js';

// Generate encryption key from master password
export const generateEncryptionKey = (masterPassword) => {
  return CryptoJS.PBKDF2(masterPassword, 'salt', {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
};

// Encrypt data
export const encryptData = (data, encryptionKey) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString()
  };
};

// Decrypt data
export const decryptData = (encryptedData, iv, encryptionKey) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};