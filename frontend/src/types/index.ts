export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  pageCount: number;
  uploadStatus: 'uploading' | 'uploaded' | 'error';
  processingStatus: 'ready' | 'processing' | 'completed' | 'error';
  rawFile?: File;
  previewUrl?: string;
  documentId?: string;
}

export interface WordToken {
  id: string;
  page: number;
  text: string;
  confidence: number;
  status: 'high' | 'needs_review' | 'unreadable';
  is_uncertain: boolean;
  is_illegible: boolean;
  bbox: [number, number, number, number]; // [x, y, w, h]
  candidates: string[];
  crop_base64: string;
  original_stroke?: string;
}

export interface DocumentTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface LanguageInfo {
  name: string;
  code: string;
  native_name: string;
  script: string;
  ocr_supported: boolean;
  translation_supported: boolean;
  family?: string;
}

export interface LanguageDetectionResult {
  detected_language: string;
  confidence: number;
  is_mixed: boolean;
  breakdown: Array<{
    language: string;
    percentage: number;
  }>;
}

export interface HandwritingAnalysis {
  pages_processed: number;
  recognized_words: number;
  high_confidence: number;
  needs_review: number;
  unreadable: number;
}

export interface RecheckSuggestion {
  token_id: string;
  original: string;
  suggested: string;
  confidence: number;
  reason: string;
}

export interface DocumentPage {
  page_number: number;
  image_base64: string;
  width: number;
  height: number;
}

export interface DocumentResult {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  created_at?: string;
  processed_at?: string;
  status: string;
  is_processed: boolean;
  source_language: string;
  target_language: string;
  language_detection: LanguageDetectionResult;
  pages: DocumentPage[];
  tokens: WordToken[];
  analysis: HandwritingAnalysis;
  headings: string[];
  paragraphs: string[];
  tables: DocumentTable[];
  clean_text: string;
  translated_text: string;
  recheck_suggestions: RecheckSuggestion[];
}

export interface ProcessingStage {
  name: string;
  completed: boolean;
  percent: number;
}

export interface ProcessingStatusResponse {
  status: string;
  current_stage: string;
  stages: ProcessingStage[];
}

export interface DemoSample {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  filename: string;
}
