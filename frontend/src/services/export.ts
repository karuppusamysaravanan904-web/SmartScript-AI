import { api } from './api';

export const downloadDocumentFile = async (
  documentId: string,
  format: 'docx' | 'pdf' | 'pptx' | 'txt' | 'md' | 'all',
  filename?: string
): Promise<void> => {
  const url = api.getExportUrl(documentId, format);
  const link = document.createElement('a');
  link.href = url;
  
  const ext = format === 'all' ? 'zip' : format;
  const cleanName = filename ? filename.replace(/\.[^/.]+$/, '') : `HandWriteAI_${documentId}`;
  link.setAttribute('download', `${cleanName}.${ext}`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
