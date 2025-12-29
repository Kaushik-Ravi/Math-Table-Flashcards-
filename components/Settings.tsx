import React from 'react';
import { GameSettings } from '../types';
import { Play, Settings2, BookOpen } from 'lucide-react';

interface SettingsProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onStart: () => void;
  onOpenLearnMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onStart, onOpenLearnMode }) => {
  const handleChange = (field: keyof GameSettings, value: number) => {
    onUpdateSettings({ ...settings, [field]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 shadow-lg shadow-blue-500/30">
          <Settings2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Configure Drill</h1>
        <p className="text-slate-400">Customize your flashcard session</p>
      </div>

      <div className="w-full space-y-8">
        {/* Table Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Table Range</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">From</label>
              <input
                type="number"
                min={1}
                max={20}
                value={settings.minTable}
                onChange={(e) => handleChange('minTable', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-xl text-center text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <span className="text-slate-500 font-bold pt-6 text-xl">-</span>
            <div className="flex-1">
              <label className="text-xs text-slate-500 mb-1 block">To</label>
              <input
                type="number"
                min={1}
                max={20}
                value={settings.maxTable}
                onChange={(e) => handleChange('maxTable', parseInt(e.target.value) || 12)}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-xl text-center text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Timer Duration */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Timer (seconds)</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={60}
              value={settings.timerDuration}
              onChange={(e) => handleChange('timerDuration', parseInt(e.target.value) || 3)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-xl text-center text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* Total Questions */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Total Questions</label>
          <input
            type="number"
            min={5}
            max={100}
            step={5}
            value={settings.totalQuestions}
            onChange={(e) => handleChange('totalQuestions', parseInt(e.target.value) || 20)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-xl text-center text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="pt-4 space-y-4">
            <button
            onClick={onStart}
            className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25 active:shadow-none active:translate-y-1"
            >
            <Play className="w-6 h-6 fill-current" />
            <span className="text-lg">Start Practice</span>
            </button>

            <button
            onClick={onOpenLearnMode}
            className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.98]"
            >
            <BookOpen className="w-6 h-6" />
            <span>Learn Tables</span>
            </button>
        </div>
      </div>
    </div>
  );
};