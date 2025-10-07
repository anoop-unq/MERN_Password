export const generatePassword = (options) => {
  const {
    length = 12,
    includeNumbers = true,
    includeLetters = true,
    includeSymbols = true,
    excludeLookAlikes = true
  } = options;

  const numbers = '0123456789';
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const lookAlikes = '0Oo1lI';

  let charset = '';
  let password = '';

  if (includeNumbers) charset += numbers;
  if (includeLetters) charset += letters;
  if (includeSymbols) charset += symbols;

  if (charset.length === 0) {
    charset = letters + numbers;
  }

  if (excludeLookAlikes) {
    charset = charset.split('').filter(char => !lookAlikes.includes(char)).join('');
  }

  // Ensure at least one character from each selected category
  if (includeLetters) {
    const letterChars = excludeLookAlikes 
      ? letters.split('').filter(char => !lookAlikes.includes(char)).join('')
      : letters;
    password += letterChars.charAt(Math.floor(Math.random() * letterChars.length));
  }

  if (includeNumbers) {
    const numberChars = excludeLookAlikes 
      ? numbers.split('').filter(char => !lookAlikes.includes(char)).join('')
      : numbers;
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
  }

  if (includeSymbols) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Shuffle the password
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  return password;
};

export const calculatePasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { strength: 'Weak', color: 'red' };
  if (score <= 4) return { strength: 'Medium', color: 'yellow' };
  return { strength: 'Strong', color: 'green' };
};