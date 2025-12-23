
import React, { useState, useEffect } from 'react';
import { WorkbookGenerator } from './components/WorkbookGenerator';
import { WorkbookDisplay } from './components/WorkbookDisplay';
import { generateWorkbook } from './services/geminiService';
import { WorkbookData, AppState } from './types';
import { AlertCircle, Lock, ExternalLink, ShieldCheck } from 'lucide-react';

// Fix: Define the AIStudio interface and use it in the Window augmentation
// This ensures compatibility with the existing global 'AIStudio' type and avoids modifier/type mismatch errors.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio: AIStudio;
  }
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [workbookData, setWorkbookData] = useState<WorkbookData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setAppState(AppState.AUTH_REQUIRED);
      }
    };
    checkAuth();
  }, []);

  const handleOpenKeySelection = async () => {
    await window.aistudio.openSelectKey();
    // Proceed to IDLE after triggering the dialog as per instructions to avoid race conditions
    setAppState(AppState.IDLE);
  };

  const handleGenerate = async (topic: string) => {
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const data = await generateWorkbook(topic);
      setWorkbookData(data);
      setAppState(AppState.VIEWING);
    } catch (err: any) {
      console.error(err);
      if (err.message === "AUTH_INVALID") {
        setAppState(AppState.AUTH_REQUIRED);
      } else {
        setError("Failed to generate workbook. Please check your connection or try again.");
        setAppState(AppState.ERROR);
      }
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setWorkbookData(null);
    setError(null);
  };

  if (appState === AppState.AUTH_REQUIRED) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">Setup Required</h2>
          <p className="text-slate-600 mb-6 text-center leading-relaxed">
            To provide high-quality AI coaching, this app requires an API key from a paid GCP project.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={handleOpenKeySelection}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Select API Key
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-brand-600 transition-colors py-2"
            >
              <span>Learn about billing requirements</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (appState === AppState.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={handleReset}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (appState === AppState.VIEWING && workbookData) {
    return <WorkbookDisplay data={workbookData} onReset={handleReset} />;
  }

  return (
    <WorkbookGenerator 
      onGenerate={handleGenerate} 
      isGenerating={appState === AppState.GENERATING} 
    />
  );
}
