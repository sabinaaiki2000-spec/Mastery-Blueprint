import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, Target, Calendar } from 'lucide-react';

interface WorkbookGeneratorProps {
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
}

export const WorkbookGenerator: React.FC<WorkbookGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  const suggestions = [
    "Waking up at 5 AM",
    "Learning Python",
    "Running 5k",
    "Daily Meditation",
    "Writing a Novel"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Mastery Blueprint
          </h1>
          <p className="text-xl text-slate-600 max-w-lg mx-auto">
            A personalized, AI-powered 30-day workbook to master any habit or skill.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
                What do you want to achieve in the next 30 days?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Learn Spanish, Start a Business, Yoga..."
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-lg transition-all"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={!topic.trim() || isGenerating}
                  className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Crafting...
                    </>
                  ) : (
                    <>
                      Start
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  disabled={isGenerating}
                  className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-8">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <Target className="w-6 h-6 text-brand-500 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Clear Goals</h3>
            <p className="text-sm text-slate-500">Break down big ambitions into 30 actionable milestones.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <Calendar className="w-6 h-6 text-brand-500 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Daily Plan</h3>
            <p className="text-sm text-slate-500">Morning and evening prompts tailored to your specific journey.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <Sparkles className="w-6 h-6 text-brand-500 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">AI Coach</h3>
            <p className="text-sm text-slate-500">Smart advice generated specifically for your chosen topic.</p>
          </div>
        </div>

      </div>
    </div>
  );
};