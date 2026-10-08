import { API_BASE_URL } from '../config';
import {
  DocumentResult,
  LanguageInfo,
  DemoSample,
  ProcessingStatusResponse,
  RecheckSuggestion
} from '../types';

class ApiService {
  private baseUrl = API_BASE_URL;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          ...(options?.headers || {})
        },
        ...options
      });

      if (!response.ok) {
        let errorDetail = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson.detail) errorDetail = errJson.detail;
        } catch {
          // ignore parsing error
        }
        throw new Error(errorDetail);
      }

      return await response.json();
    } catch (err: any) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  async getHealth() {
    return this.request<{ status: string; service: string; version: string }>('/api/health');
  }

  async getLanguages(): Promise<{ languages: LanguageInfo[] }> {
    return this.request<{ languages: LanguageInfo[] }>('/api/languages');
  }

  async getSamples(): Promise<{ samples: DemoSample[] }> {
    return this.request<{ samples: DemoSample[] }>('/api/samples');
  }

  async uploadFiles(files: File[]): Promise<{ status: string; uploaded: any[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.request<{ status: string; uploaded: any[] }>('/api/documents/upload', {
      method: 'POST',
      body: formData
    });
  }

  async processDocument(
    documentId: string,
    sourceLanguage = 'Auto Detect',
    targetLanguage = 'English'
  ): Promise<DocumentResult> {
    return this.request<DocumentResult>('/api/documents/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document_id: documentId,
        source_language: sourceLanguage,
        target_language: targetLanguage
      })
    });
  }

  async getDocumentStatus(documentId: string): Promise<ProcessingStatusResponse> {
    return this.request<ProcessingStatusResponse>(`/api/documents/${documentId}/status`);
  }

  async getDocumentResult(documentId: string): Promise<DocumentResult> {
    return this.request<DocumentResult>(`/api/documents/${documentId}/result`);
  }

  async correctToken(
    documentId: string,
    tokenId: string,
    action: 'accept' | 'edit' | 'mark_illegible',
    correctedText?: string
  ): Promise<{ status: string; doc: DocumentResult }> {
    return this.request<{ status: string; doc: DocumentResult }>(`/api/documents/${documentId}/correct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token_id: tokenId,
        action,
        corrected_text: correctedText
      })
    });
  }

  async correctFullText(
    documentId: string,
    fullText: string
  ): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>(`/api/documents/${documentId}/correct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'full_text',
        corrected_text: fullText
      })
    });
  }

  async aiRecheck(documentId: string): Promise<{ status: string; suggestions: RecheckSuggestion[] }> {
    return this.request<{ status: string; suggestions: RecheckSuggestion[] }>(`/api/documents/${documentId}/recheck`, {
      method: 'POST'
    });
  }

  async translateDocument(
    documentId: string,
    targetLanguage: string
  ): Promise<{ status: string; target_language: string; translated_text: string }> {
    return this.request<{ status: string; target_language: string; translated_text: string }>(`/api/documents/${documentId}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target_language: targetLanguage
      })
    });
  }

  async getDocuments(): Promise<{ documents: any[] }> {
    return this.request<{ documents: any[] }>('/api/documents');
  }

  async renameDocument(documentId: string, title: string): Promise<{ status: string; new_title: string }> {
    return this.request<{ status: string; new_title: string }>(`/api/documents/${documentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });
  }

  async deleteDocument(documentId: string): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>(`/api/documents/${documentId}`, {
      method: 'DELETE'
    });
  }

  getExportUrl(documentId: string, format: string): string {
    return `${this.baseUrl}/api/documents/${documentId}/export?format=${format}`;
  }
}

export const api = new ApiService();
