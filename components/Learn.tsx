import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import { getTableTip } from '../services/geminiService';
import { ArrowLeft, BrainCircuit, Sparkles, PlayCircle } from 'lucide-react';

interface LearnProps {
  onBack: () => void;
  onPractice: (settings: GameSettings) => void;
}

export const Learn: React.FC<LearnProps> = ({ onBack, onPractice }) => {
  const [tableNum, setTableNum] = useState(7);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // Generate table data 1-12
  const tableData = Array.from({ length: 12 }, (_, i) => ({
    a: tableNum,
    b: i + 1,
    result: tableNum * (i + 1),
  }));

  const fetchTip = async () => {
    setLoadingTip(true);
    const tip = await getTableTip(tableNum);
    setAiTip(tip);
    setLoadingTip(false);
  };

  const handlePractice = () => {
    onPractice({
      minTable: tableNum,
      maxTable: tableNum,
      timerDuration: 5, // A bit more relaxed for specific table practice
      totalQuestions: 12, // One for each number
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="text-slate-400 w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white">Learn Tables</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Controls and Table Display */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Table Selector */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <label className="block text-slate-400 text-sm font-medium mb-2">Select Table</label>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-blue-400">×</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={tableNum}
                  onChange={(e) => {
                      setTableNum(Math.max(1, parseInt(e.target.value) || 1));
                      setAiTip(null); // Reset tip when number changes
                  }}
                  className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-3xl font-bold text-white w-24 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            
            <button
              onClick={handlePractice}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <PlayCircle className="w-6 h-6" />
              <span>Test Me on {tableNum}s</span>
            </button>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tableData.map((item) => (
              <div key={item.b} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-slate-800 transition-colors">
                <div className="text-slate-400 text-sm font-medium mb-1">{item.a} × {item.b}</div>
                <div className="text-2xl font-bold text-white">{item.result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 sticky top-6">
            <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold">
              <BrainCircuit className="w-6 h-6" />
              <span>AI Tutor</span>
            </div>
            
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Need help memorizing the table of <span className="text-white font-bold">{tableNum}</span>? I can explain the patterns and tricks!
            </p>

            {aiTip ? (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex gap-2 mb-2">
                   <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-1" />
                   <h4 className="font-bold text-indigo-200 text-sm">Secret Pattern</h4>
                </div>
                <p className="text-indigo-100 text-sm italic">
                  "{aiTip}"
                </p>
              </div>
            ) : (
              <button
                onClick={fetchTip}
                disabled={loadingTip}
                className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loadingTip ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   <>
                     <Sparkles className="w-5 h-5" />
                     <span>Reveal Secret Tricks</span>
                   </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};