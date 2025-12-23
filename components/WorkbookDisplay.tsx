import React, { useState, useEffect } from 'react';
import { WorkbookData, UserProgress } from '../types';
import { Card } from './Card';
import { 
  CheckCircle2, 
  Circle, 
  Square,
  Trophy, 
  CalendarDays, 
  Layout, 
  ListTodo, 
  ChevronLeft,
  Target,
  BookOpen
} from 'lucide-react';

interface WorkbookDisplayProps {
  data: WorkbookData;
  onReset: () => void;
}

type Tab = 'overview' | 'goals' | 'daily' | 'review';

// Helper component for rendering interactive checklists from string content
interface InteractiveListProps {
  content: string;
  sectionId: string;
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
}

const InteractiveList: React.FC<InteractiveListProps> = ({ content, sectionId, checkedItems, onToggle }) => {
  if (!content) return null;
  const lines = content.split('\n');
  return (
    <div className="space-y-2 mt-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;
        
        // Detect bullet points (-, *, or •)
        const isListItem = /^[-\u2022*]\s/.test(trimmed);
        
        if (isListItem) {
           const text = trimmed.replace(/^[-\u2022*]\s*/, '');
           const itemId = `${sectionId}-${idx}`;
           const isChecked = checkedItems[itemId] || false;
           
           return (
             <div 
               key={idx}
               onClick={() => onToggle(itemId)}
               className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all border border-transparent ${isChecked ? 'bg-green-50 border-green-100' : 'hover:bg-slate-50 hover:border-slate-100'}`}
             >
               <div className={`mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'text-green-600' : 'text-slate-400'}`}>
                 {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Square className="w-5 h-5" />}
               </div>
               <span className={`text-sm leading-relaxed transition-colors ${isChecked ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                 {text}
               </span>
             </div>
           );
        }
        
        return <p key={idx} className="text-sm text-slate-700 leading-relaxed pl-2 font-medium">{trimmed}</p>;
      })}
    </div>
  );
};

export const WorkbookDisplay: React.FC<WorkbookDisplayProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [progress, setProgress] = useState<UserProgress>(() => {
    // Load from local storage if available for this specific workbook title
    // For simplicity in this demo, we reset if title changes or just start fresh
    return {
      entries: {},
      goalNotes: '',
      checkedItems: {}
    };
  });

  // Persist progress (mock implementation)
  useEffect(() => {
    // In a real app, save 'progress' to localStorage keyed by data.WorkbookTitle
  }, [progress, data.WorkbookTitle]);

  const handleGoalNoteChange = (text: string) => {
    setProgress(prev => ({ ...prev, goalNotes: text }));
  };

  const handleItemCheck = (itemId: string) => {
    setProgress(prev => ({
      ...prev,
      checkedItems: {
        ...prev.checkedItems,
        [itemId]: !prev.checkedItems[itemId]
      }
    }));
  };

  const handleDayCheck = (day: number, habitIndex: number) => {
    const dayKey = `day-${day}`;
    const currentEntry = progress.entries[dayKey] || { 
      date: new Date().toISOString(), 
      morningReflection: '', 
      eveningReflection: '', 
      habitsChecked: [] 
    };

    const newHabits = [...(currentEntry.habitsChecked || [])];
    newHabits[habitIndex] = !newHabits[habitIndex];

    setProgress(prev => ({
      ...prev,
      entries: {
        ...prev.entries,
        [dayKey]: {
          ...currentEntry,
          habitsChecked: newHabits
        }
      }
    }));
  };

  const handleReflection = (day: number, type: 'morning' | 'evening', text: string) => {
    const dayKey = `day-${day}`;
    const currentEntry = progress.entries[dayKey] || { 
      date: new Date().toISOString(), 
      morningReflection: '', 
      eveningReflection: '', 
      habitsChecked: [] 
    };

    setProgress(prev => ({
      ...prev,
      entries: {
        ...prev.entries,
        [dayKey]: {
          ...currentEntry,
          [type === 'morning' ? 'morningReflection' : 'eveningReflection']: text
        }
      }
    }));
  };

  // --- Views ---

  const renderOverview = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{data.WorkbookTitle}</h2>
        <p className="opacity-90 max-w-2xl">{data.Introduction}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="How to Use" icon={<BookOpenIcon />}>
          <div className="prose prose-sm prose-slate">
            <p className="whitespace-pre-line">{data.HowToUse}</p>
          </div>
        </Card>
        <Card title="Your 30-Day Mission Objectives" icon={<Trophy className="w-5 h-5" />}>
           <InteractiveList 
             content={data.GoalSettingSection.thirty_day_objectives} 
             sectionId="objectives" 
             checkedItems={progress.checkedItems} 
             onToggle={handleItemCheck} 
           />
        </Card>
      </div>

      <Card title="Challenges" icon={<ListTodo className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <h4 className="font-bold text-orange-800 mb-2">7-Day Sprint</h4>
            <InteractiveList 
              content={data.Challenges.seven_day_challenge}
              sectionId="challenge-7"
              checkedItems={progress.checkedItems}
              onToggle={handleItemCheck}
            />
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-indigo-800 mb-2">21-Day Habit Lock</h4>
            <InteractiveList 
              content={data.Challenges.twenty_one_day_challenge}
              sectionId="challenge-21"
              checkedItems={progress.checkedItems}
              onToggle={handleItemCheck}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6 animate-fadeIn">
      <Card title="Big Vision" icon={<TargetIcon />}>
        <p className="whitespace-pre-line text-lg font-medium text-slate-800 mb-4">
          {data.GoalSettingSection.big_goals}
        </p>
        <div className="mt-6">
           <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">My Personal Commitment</label>
           <textarea
             className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
             rows={4}
             placeholder="I commit to this goal because..."
             value={progress.goalNotes}
             onChange={(e) => handleGoalNoteChange(e.target.value)}
           />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Milestones Checklist" icon={<FlagIcon />}>
          <InteractiveList 
            content={data.GoalSettingSection.milestones}
            sectionId="milestones"
            checkedItems={progress.checkedItems}
            onToggle={handleItemCheck}
          />
        </Card>
        <Card title="Habit Templates & Activities" icon={<Layout className="w-5 h-5" />}>
          <InteractiveList 
            content={data.MonthlyPlanner.habit_list_templates}
            sectionId="habit-templates"
            checkedItems={progress.checkedItems}
            onToggle={handleItemCheck}
          />
        </Card>
      </div>
    </div>
  );

  const renderDaily = () => {
    const dayData = progress.entries[`day-${selectedDay}`] || {};
    const habits = data.DailyPages.habit_checklist.split('\n').filter(h => h.trim().length > 0);
    const quoteIndex = (selectedDay - 1) % data.DailyPages.motivation_quotes.length;

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Day Selector */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                selectedDay === day 
                  ? 'bg-brand-600 text-white shadow-md transform scale-105' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Daily View Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Daily Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card title={`Day ${selectedDay} • Daily Plan`}>
               {/* Habits */}
               <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-brand-500"/>
                  Core Habits
                </h4>
                {habits.map((habit, idx) => {
                  const isChecked = dayData.habitsChecked?.[idx] || false;
                  // Handle bullet points in string if they exist
                  const cleanHabit = habit.replace(/^[-*•]\s*/, '');
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleDayCheck(selectedDay, idx)}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-green-50 border-green-100 border' : 'bg-slate-50 border border-transparent hover:border-slate-200'}`}
                    >
                      <div className={`mt-0.5 ${isChecked ? 'text-green-600' : 'text-slate-300'}`}>
                        {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </div>
                      <span className={`text-sm ${isChecked ? 'text-green-800 line-through' : 'text-slate-700'}`}>
                        {cleanHabit}
                      </span>
                    </div>
                  );
                })}
               </div>

               {/* Reflections */}
               <div className="grid grid-cols-1 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                     <SunIcon />
                     Morning Intentions
                   </label>
                   <p className="text-xs text-slate-500 mb-2">{data.DailyPages.morning_prompt}</p>
                   <textarea
                     className="w-full p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                     rows={3}
                     placeholder="Today I will focus on..."
                     value={dayData.morningReflection || ''}
                     onChange={(e) => handleReflection(selectedDay, 'morning', e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                     <MoonIcon />
                     Evening Reflection
                   </label>
                   <p className="text-xs text-slate-500 mb-2">{data.DailyPages.evening_prompt}</p>
                   <textarea
                     className="w-full p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                     rows={3}
                     placeholder="What went well today?"
                     value={dayData.eveningReflection || ''}
                     onChange={(e) => handleReflection(selectedDay, 'evening', e.target.value)}
                   />
                 </div>
               </div>
            </Card>
          </div>

          {/* Sidebar / Motivation */}
          <div className="space-y-6">
             <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-100">
               <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                 <SparklesIcon />
                 Daily Wisdom
               </h3>
               <p className="italic text-orange-800 font-medium">
                 "{data.DailyPages.motivation_quotes[quoteIndex] || data.DailyPages.motivation_quotes[0]}"
               </p>
             </Card>

             <Card title="Weekly Focus">
               <div className="text-sm text-slate-600">
                  <InteractiveList 
                    content={data.WeeklyPlanner.week_template}
                    sectionId={`weekly-focus-${selectedDay}`} // Unique per day to avoid conflicts if used multiple times? Actually standard ID is better if shared.
                    // But here it renders the same template. Let's treating it as a reference list.
                    // To make it interactive per week, we'd need week logic. For now, let's just make it a list.
                    checkedItems={progress.checkedItems}
                    onToggle={handleItemCheck}
                  />
               </div>
             </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderReview = () => (
    <div className="space-y-6 animate-fadeIn">
       <Card title="Monthly Review" icon={<Trophy className="w-5 h-5"/>}>
          <div className="prose prose-sm prose-slate mb-8">
            <h4 className="text-lg font-semibold text-slate-800">Progress Summary</h4>
            <p className="whitespace-pre-line">{data.ReviewSection.progress_summary}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
             <h4 className="text-lg font-bold text-purple-900 mb-2">Reward System</h4>
             <InteractiveList 
               content={data.ReviewSection.reward_system}
               sectionId="rewards"
               checkedItems={progress.checkedItems}
               onToggle={handleItemCheck}
             />
          </div>
       </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onReset}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              title="Start Over"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">Mastery Blueprint</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: Layout },
              { id: 'goals', label: 'Goals', icon: TargetIcon },
              { id: 'daily', label: 'Daily', icon: CalendarDays },
              { id: 'review', label: 'Review', icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden"><Icon className="w-5 h-5"/></span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'daily' && renderDaily()}
        {activeTab === 'review' && renderReview()}
      </main>
    </div>
  );
};

// Simple Icon Wrappers to avoid clutter in main component
const BookOpenIcon = () => <BookOpen className="w-5 h-5" />;
const TargetIcon = () => <Target className="w-5 h-5" />;
const FlagIcon = () => <Target className="w-5 h-5 text-red-500" />;
const SparklesIcon = () => <CheckCircle2 className="w-5 h-5 text-orange-500" />;
const SunIcon = () => <div className="w-4 h-4 rounded-full bg-yellow-400" />;
const MoonIcon = () => <div className="w-4 h-4 rounded-full bg-indigo-900" />;