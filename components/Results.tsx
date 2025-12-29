import React, { useEffect, useState } from 'react';
import { QuestionResult } from '../types';
import { getAICoachingTip } from '../services/geminiService';
import { RefreshCw, Home, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';

interface ResultsProps {
  results: QuestionResult[];
  onRestart: () => void;
  onHome: () => void;
}

export const Results: React.FC<ResultsProps> = ({ results, onRestart, onHome }) => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(true);

  const correctCount = results.filter(r => r.isCorrect).length;
  const totalCount = results.length;
  const scorePercentage = Math.round((correctCount / totalCount) * 100);
  const avgTime = results.reduce((acc, curr) => acc + curr.timeTaken, 0) / totalCount;

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getAICoachingTip(results);
      setAiTip(tip);
      setLoadingAi(false);
    };
    fetchTip();
  }, [results]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 min-h-[80vh] flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">Session Complete!</h2>
        <p className="text-slate-400">Here is how you performed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="text-slate-400 mb-2 font-medium">Score</div>
          <div className={`text-5xl font-black ${scorePercentage >= 90 ? 'text-green-400' : scorePercentage >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
            {scorePercentage}%
          </div>
          <div className="text-sm text-slate-500 mt-2">{correctCount} / {totalCount} Correct</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="text-slate-400 mb-2 font-medium">Avg Speed</div>
          <div className="text-5xl font-black text-blue-400">
            {avgTime.toFixed(1)}<span className="text-2xl text-slate-500 ml-1">s</span>
          </div>
          <div className="text-sm text-slate-500 mt-2">Per Question</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
           <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold">
             <BrainCircuit className="w-5 h-5" />
             <span>AI Coach</span>
           </div>
           {loadingAi ? (
             <div className="flex-1 flex items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
             </div>
           ) : (
             <p className="text-slate-300 text-sm leading-relaxed italic">
               "{aiTip}"
             </p>
           )}
        </div>
      </div>

      {/* Detailed Breakdown - Only show if there are mistakes or just a few entries */}
      <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-8">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 font-semibold text-slate-300 flex justify-between items-center">
          <span>Question History</span>
          <span className="text-xs font-normal text-slate-500">Scroll for more</span>
        </div>
        <div className="overflow-y-auto max-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase sticky top-0">
              <tr>
                <th className="p-4">Question</th>
                <th className="p-4">Your Answer</th>
                <th className="p-4">Correct Answer</th>
                <th className="p-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {results.map((res, idx) => (
                <tr key={idx} className={`hover:bg-slate-700/50 transition-colors ${!res.isCorrect ? 'bg-red-500/5' : ''}`}>
                  <td className="p-4 font-bold text-white">
                    {res.question.factorA} × {res.question.factorB}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {res.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={res.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {res.userAnswer === null ? 'Time Out' : res.userAnswer}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {res.question.answer}
                  </td>
                  <td className="p-4 text-right text-slate-400 font-mono text-sm">
                    {res.timeTaken.toFixed(1)}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
        >
          <Home className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 font-bold"
        >
          <RefreshCw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};