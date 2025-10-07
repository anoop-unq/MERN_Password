export const copyToClipboard = async (text, onClear) => {
  try {
    await navigator.clipboard.writeText(text);
    
    // Auto clear after 15 seconds
    if (onClear) {
      setTimeout(() => {
        onClear();
      }, 15000);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};