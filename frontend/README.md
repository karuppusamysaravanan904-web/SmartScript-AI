# HANDWRITE AI
### Extreme Bad-Handwriting Digitizing & Multilingual Document Conversion Platform
**Problem Statement Reference: HNX26EPS04**

HANDWRITE AI is a production-grade, full-stack intelligence platform built to tackle the most demanding, illegible, cramped, crossed-out, and degraded handwriting documents, converting them into structured text, interactive tables, 23 Indian languages, and native Microsoft Word, PDF, and PowerPoint files.

---

## 🌟 Key Capabilities

### 1. Universal Document Upload
- **Images:** JPG, JPEG, PNG, WEBP, TIFF, BMP
- **Documents:** PDF, DOC, DOCX, PPT, PPTX
- Drag & Drop interface with multi-file support and preloaded real test datasets.

### 2. Multi-Script & 23 Indian Languages
- **Source Script:** Auto Detect + 23 Official Indian Languages:
  - English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, Sanskrit, Nepali, Konkani, Kashmiri, Sindhi, Manipuri, Bodo, Maithili, Dogri, Santali.
- **Script Analysis:** Real Unicode codepoint distribution detecting single and mixed-script documents (e.g. `Tamil: 72%, English: 28%`).
- **Dynamic Translation:** On-the-fly translation between Indian languages.

### 3. Anti-Hallucination Uncertainty Calibration
- Adheres strictly to the core principle: **Confidence Over Completeness**.
- Flags low-confidence strokes as `[uncertain]` or `[ILLEGIBLE REGION]` instead of guessing.
- Interactive **Uncertainty Region Inspector**:
  - Zoomed original handwriting stroke crop
  - Calibrated confidence metric (0–100%)
  - Top AI alternative candidates (e.g., `chest`, `stomach`, `????`)
  - Manual correction & illegibility flagging

### 4. Side-by-Side Workspace
- **Left:** Original Document Viewer with zoom in/out, pan, rotate, and interactive token bounding box overlays.
- **Right:** Text Editor with token badges, interactive structured tables (editable cells), undo/redo, and reset.
- **AI Re-Check:** Analyzes human corrections and offers grammar/context suggestions with explicit Accept/Reject controls.

### 5. Multilingual Output Panel
- Three responsive viewing modes:
  - **Show Original**
  - **Show Translation**
  - **Show Both**
- Instant target language switcher with one-click clipboard copy.

### 6. Production-Ready Export Pipeline
- **Microsoft Word (.docx):** Structured document with metadata headers, clean text, translated text, styled tables, and uncertainty audit trail.
- **Vector PDF (.pdf):** Styled document generated via ReportLab with tables and audit notes.
- **Microsoft PowerPoint (.pptx):** Auto-generated presentation with title slide, content slides, and native PowerPoint tables.
- **Plain Text (.txt) & Markdown (.md)**
- **Download All (.zip):** Single-click bundle containing all 5 formats.

### 7. Dashboard & History Archive
- Document queue, recent processed files, document rename, open, delete, and quick export.

---

## 🏗️ Architecture & Project Structure

```text
HackNex 2k26 1F/
├── backend/
│   ├── main.py                     # FastAPI REST API
│   ├── ocr_engine.py               # Forensic HTR, CLAHE, uncertainty calibration, stroke crops
│   ├── languages.py                # 23 Indian languages catalog, script detection & translation
│   ├── export_service.py           # Native DOCX, PDF, PPTX, TXT, MD, ZIP generator
│   └── samples/                    # Real challenging handwriting test files
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FileUploader/       # Drag & drop upload & sample loader
    │   │   ├── FileList/           # File queue with sizes, pages, status
    │   │   ├── LanguageSelector/   # 23 languages & live detection badge
    │   │   ├── ProcessingStatus/   # 9-stage live progress visualizer
    │   │   ├── DocumentViewer/     # Zoom, pan, rotate & bounding boxes
    │   │   ├── TextEditor/         # Clean text, tables, undo/redo, AI Re-Check
    │   │   ├── UncertaintyViewer/  # Crop zoom, candidates & manual edit
    │   │   ├── TranslationPanel/   # Show original / translation / both
    │   │   ├── ExportPanel/        # Multi-format exports & previews
    │   │   └── History/            # Archive list & quick actions
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.tsx       # Main hub
    │   │   ├── Workspace.tsx       # Side-by-side editing workspace
    │   │   ├── History.tsx         # Document archive
    │   │   └── Settings.tsx        # Calibration sliders & guardrails
    │   │
    │   ├── services/
    │   │   ├── api.ts              # Centralized typed API client
    │   │   └── export.ts           # Client-side download handler
    │   │
    │   ├── types/index.ts          # TypeScript interfaces
    │   ├── config/index.ts         # Environment settings
    │   └── index.css               # Modern dark theme design system
    │
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Running Locally

### 1. Start the Backend (Port 8000)
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`

### 2. Start the Frontend (Port 5173)
```powershell
cd frontend
npm run dev
```
Open `http://127.0.0.1:5173/` in your browser.
