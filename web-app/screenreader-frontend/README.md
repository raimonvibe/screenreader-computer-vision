# 🎨 Screen Reader Frontend

> 🚀 **Modern React interface for real-time screen content analysis and OCR visualization**

![Frontend UI Screenshot](https://via.placeholder.com/800x400/1e293b/ffffff?text=React+Frontend+UI+%F0%9F%8E%A8)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Available-brightgreen)](https://screenreader-frontend.netlify.app)
[![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178c6.svg)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff.svg)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4+-06b6d4.svg)](https://tailwindcss.com)

## 🎯 Overview

The Screen Reader Frontend is a sophisticated React application that provides an intuitive interface for real-time screen content analysis. Built with modern technologies including TypeScript, Vite, and Tailwind CSS, it offers a seamless user experience for OCR processing and text extraction visualization.

## ✨ Key Features

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live processing status and results display
- **Interactive Components**: Modern UI elements with smooth animations

### 🔍 OCR Visualization
- **Live Results Display**: Real-time text extraction visualization
- **Bounding Box Overlay**: Interactive text region highlighting
- **Confidence Metrics**: Visual confidence scoring for extracted text
- **Processing Statistics**: Performance metrics and timing information

### ⚙️ Advanced Configuration
- **OCR Engine Selection**: Toggle between Tesseract and EasyOCR
- **Region Capture Mode**: Define custom screen capture areas
- **Real-time Settings**: Dynamic configuration without page refresh
- **Visual Feedback**: Immediate response to user interactions

### 📊 Data Visualization
- **Results Dashboard**: Comprehensive OCR results display
- **Text Region Analysis**: Detailed bounding box information
- **Performance Metrics**: Processing time and accuracy statistics
- **Export Capabilities**: Copy and save extracted text

## 🛠️ Technology Stack

### 🏗️ Core Framework
- **React 18.3+**: Modern React with hooks and concurrent features
- **TypeScript 5.6+**: Type-safe development with advanced TypeScript features
- **Vite 6.0+**: Lightning-fast build tool and development server

### 🎨 Styling & UI
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI components
- **Lucide React**: Beautiful, customizable icons
- **Class Variance Authority**: Type-safe component variants

### 🔧 Development Tools
- **ESLint**: Code linting and quality enforcement
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic CSS vendor prefixing

## 🚀 Quick Start

### 📦 Installation

```bash
# Navigate to frontend directory
cd web-app/screenreader-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🌐 Environment Setup

Create a `.env` file in the frontend directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Optional: Custom configuration
VITE_APP_TITLE=Screen Reader CV
VITE_APP_VERSION=1.0.0
```

### 🏃‍♂️ Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎨 UI Components & Features

### 🏠 Main Interface

The application features a clean, intuitive interface with several key sections:

#### 🎛️ Configuration Panel
- **OCR Engine Toggles**: Enable/disable Tesseract and EasyOCR
- **Region Capture Mode**: Switch between full screen and custom region
- **Coordinate Inputs**: Precise region definition (X, Y, Width, Height)
- **Real-time Validation**: Immediate feedback on configuration changes

#### 🖱️ Capture Controls
- **Smart Capture Button**: Context-aware capture functionality
- **Loading States**: Visual feedback during processing
- **Error Handling**: User-friendly error messages
- **Keyboard Shortcuts**: Quick access to common actions

#### 📊 Results Display
- **Statistics Cards**: Processing time, confidence, character count, regions
- **Text Output**: Formatted, copyable extracted text
- **Bounding Box Viewer**: Interactive text region explorer
- **Engine Information**: Primary engine and combination details

### 🌙 Theme System

```typescript
// Automatic theme detection and switching
const [darkMode, setDarkMode] = useState(true);

useEffect(() => {
  document.documentElement.classList.toggle('dark', darkMode);
}, [darkMode]);
```

### 📱 Responsive Design

The interface adapts seamlessly across different screen sizes:

- **Desktop**: Full-featured interface with side-by-side panels
- **Tablet**: Stacked layout with touch-optimized controls
- **Mobile**: Compact interface with collapsible sections

## 🔧 Configuration

### 🌐 API Integration

The frontend communicates with the backend through RESTful API calls:

```typescript
// Screen capture API call
const captureScreen = async () => {
  const endpoint = regionMode ? '/api/capture/region' : '/api/capture/screen';
  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: regionMode ? JSON.stringify(region) : undefined
  });
  const data = await response.json();
  setResult(data);
};
```

### ⚙️ Component Configuration

Key configurable aspects of the application:

```typescript
interface AppConfig {
  // OCR Engine Settings
  useEasyOCR: boolean;
  useTesseract: boolean;
  
  // Capture Settings
  regionMode: boolean;
  region: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  // UI Settings
  darkMode: boolean;
  showBoundingBoxes: boolean;
}
```

## 📁 Project Structure

```
screenreader-frontend/
├── 📄 README.md                    # This documentation
├── 📦 package.json                # Dependencies and scripts
├── ⚙️ vite.config.ts              # Vite configuration
├── 🎨 tailwind.config.js          # Tailwind CSS configuration
├── 📋 tsconfig.json               # TypeScript configuration
├── 🔧 eslint.config.js            # ESLint configuration
├── 🌐 index.html                  # HTML entry point
├── 📁 public/                     # Static assets
├── 📁 src/                        # Source code
│   ├── 🎨 App.tsx                 # Main application component
│   ├── 🚀 main.tsx                # Application entry point
│   ├── 🎨 App.css                 # Application styles
│   ├── 🎨 index.css               # Global styles
│   ├── 📁 components/             # Reusable UI components
│   │   └── 📁 ui/                 # Base UI components (Radix UI)
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 lib/                    # Utility functions
│   └── 📁 assets/                 # Images and icons
└── 📁 dist/                       # Production build output
```

## 🎨 UI Component Library

### 🧩 Base Components (Radix UI)

The application uses a comprehensive set of accessible UI components:

```typescript
// Available UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
```

### 🎯 Custom Hooks

```typescript
// Mobile detection hook
const isMobile = useMobile();

// Toast notifications
const { toast } = useToast();
```

## 🧪 Testing & Development

### 🔍 Development Server

```bash
# Start with hot reload
npm run dev

# Custom port
npm run dev -- --port 3000

# Network access
npm run dev -- --host 0.0.0.0
```

### 🏗️ Build Process

```bash
# Production build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Preview production build
npm run preview
```

### 🧪 Quality Assurance

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write src/
```

## 🚀 Deployment

### 📦 Static Hosting

The application builds to static files suitable for any hosting service:

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - AWS S3
# - Any static hosting service
```

### 🌐 Environment Variables

Configure for different environments:

```bash
# Development
VITE_API_URL=http://localhost:8000

# Staging
VITE_API_URL=https://staging-api.example.com

# Production
VITE_API_URL=https://api.example.com
```

### ☁️ Deployment Examples

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_API_URL=https://your-backend-url.com
```

#### Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://your-backend-url.com"
  }
}
```

## 🎯 Features in Detail

### 🔍 OCR Results Visualization

The application provides comprehensive visualization of OCR results:

```typescript
interface OCRResult {
  text: string;                    // Extracted text content
  confidence: number;              // Overall confidence score
  bounding_boxes: BoundingBox[];   // Text region locations
  processing_time: number;         // Processing duration
  engine?: string;                 // OCR engine used
  primary_engine?: string;         // Primary engine in combined mode
  combined?: boolean;              // Whether results are combined
}
```

### 📊 Interactive Bounding Boxes

Each detected text region includes detailed information:

```typescript
interface BoundingBox {
  x: number;          // X coordinate
  y: number;          // Y coordinate  
  width: number;      // Region width
  height: number;     // Region height
  text: string;       // Extracted text
  confidence: number; // Region confidence
}
```

### ⚙️ Real-time Configuration

Users can adjust settings without page refresh:

- **OCR Engine Selection**: Toggle Tesseract and/or EasyOCR
- **Capture Mode**: Full screen vs. custom region
- **Region Definition**: Precise coordinate input
- **Display Options**: Show/hide bounding box details

## 🌐 Live Demo

🔗 **[Try the Live Demo](https://screenreader-frontend.netlify.app)** - Experience the full interface

The live demo showcases:
- Real-time OCR processing interface
- Interactive configuration options
- Visual results display with bounding boxes
- Dark/light mode switching
- Responsive design across devices

## 🔗 Related Components

- **[🏠 Main Project](../../README.md)** - Project overview and setup
- **[⚡ Backend API](../screenreader-backend/README.md)** - FastAPI service documentation
- **[🐍 Core Library](../../screen_reader.py)** - OCR processing engine

## 🤝 Contributing

### 🛠️ Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/screenreader-computer-vision.git`
3. Navigate to frontend: `cd web-app/screenreader-frontend`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`
6. Make your changes and test thoroughly
7. Submit a pull request

### 📝 Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Format code
npx prettier --write src/
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

<div align="center">

**🎨 Built with React, TypeScript, and modern web technologies**

[🌐 Live Demo](https://screenreader-frontend.netlify.app) • [🐛 Report Issue](https://github.com/raimonvibe/screenreader-computer-vision/issues) • [💡 Request Feature](https://github.com/raimonvibe/screenreader-computer-vision/issues)

</div>
