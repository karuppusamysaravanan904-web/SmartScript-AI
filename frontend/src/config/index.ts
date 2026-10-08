export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const APP_CONFIG = {
  name: 'HANDWRITE AI',
  tagline: 'Extreme Bad-Handwriting Digitizing & Multilingual Platform',
  version: '1.0.0',
  defaultSourceLanguage: 'Auto Detect',
  defaultTargetLanguage: 'English',
  maxUploadSizeBytes: 50 * 1024 * 1024, // 50MB
  supportedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'pdf', 'doc', 'docx', 'ppt', 'pptx']
};
