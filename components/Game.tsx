import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, Question, QuestionResult } from '../types';
import { Timer, XCircle, CheckCircle2, Delete, ArrowRight } from 'lucide-react';

interface GameProps {
  settings: GameSettings;
  onFinish: (results: QuestionResult[]) => void;
  onCancel: () => void;
}

export const Game: React.FC<GameProps> = ({ settings, onFinish, onCancel }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  // Initialize questions
  useEffect(() => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < settings.totalQuestions; i++) {
      const factorA = Math.floor(Math.random() * (settings.maxTable - settings.minTable + 1)) + settings.minTable;
      const factorB = Math.floor(Math.random() * 12) + 1; // Standard 1-12 multiplier
      newQuestions.push({
        id: `${i}-${Date.now()}`,
        factorA,
        factorB,
        answer: factorA * factorB,
      });
    }
    setQuestions(newQuestions);
  }, [settings]);

  const handleNextQuestion = useCallback((lastResult: QuestionResult) => {
    setResults(prev => [...prev, lastResult]);
    
    // Brief delay to show feedback
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setInputValue('');
        setTimeLeft(settings.timerDuration);
        setFeedback('idle');
        setIsPaused(false);
      } else {
        onFinish([...results, lastResult]);
      }
    }, 500);
  }, [currentIndex, questions.length, results, onFinish, settings.timerDuration]);

  // Timer Logic
  useEffect(() => {
    if (questions.length === 0 || isPaused || feedback !== 'idle') return;

    if (timeLeft <= 0) {
      setFeedback('incorrect');
      setIsPaused(true);
      handleNextQuestion({
        question: questions[currentIndex],
        userAnswer: null,
        isCorrect: false,
        timeTaken: settings.timerDuration,
      });
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, questions.length, currentIndex, isPaused, feedback, handleNextQuestion, questions, settings.timerDuration]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (feedback !== 'idle' || !inputValue) return;

    const val = parseInt(inputValue);
    const currentQ = questions[currentIndex];
    const isCorrect = val === currentQ.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setIsPaused(true);

    handleNextQuestion({
      question: currentQ,
      userAnswer: isNaN(val) ? null : val,
      isCorrect,
      timeTaken: settings.timerDuration - timeLeft,
    });
  };

  const handleNumpadInput = (num: number) => {
    if (feedback !== 'idle') return;
    if (inputValue.length < 5) {
      setInputValue(prev => prev + num.toString());
    }
  };

  const handleBackspace = () => {
    if (feedback !== 'idle') return;
    setInputValue(prev => prev.slice(0, -1));
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIndex];
  const progressPercent = (timeLeft / settings.timerDuration) * 100;
  const progressColor = timeLeft < settings.timerDuration * 0.3 ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center min-h-[calc(100vh-2rem)]">
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-4 text-slate-400 font-medium">
        <span>{currentIndex + 1} / {settings.totalQuestions}</span>
        <button onClick={onCancel} className="hover:text-white transition-colors p-2">Quit</button>
      </div>

      {/* Flashcard Area */}
      <div className={`relative w-full aspect-[4/3] flex flex-col items-center justify-center bg-slate-800 rounded-3xl border-4 shadow-xl transition-all duration-300 mb-6 flex-1 max-h-[300px] ${
        feedback === 'correct' ? 'border-green-500 bg-green-500/10' : 
        feedback === 'incorrect' ? 'border-red-500 bg-red-500/10 animate-shake' : 'border-slate-700'
      }`}>
        
        {/* Timer Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-700 rounded-t-2xl overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${progressColor}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question */}
        <div className="flex items-center gap-3 mb-4 select-none">
          <span className="text-7xl sm:text-8xl font-black text-white">{currentQ.factorA}</span>
          <span className="text-4xl sm:text-6xl font-bold text-slate-500">×</span>
          <span className="text-7xl sm:text-8xl font-black text-white">{currentQ.factorB}</span>
        </div>

        {/* Display Input */}
        <div className="w-full flex justify-center relative h-16">
          <div className={`text-5xl font-bold border-b-4 px-4 min-w-[100px] text-center transition-colors ${
             feedback === 'correct' ? 'border-green-500 text-green-400' :
             feedback === 'incorrect' ? 'border-red-500 text-red-400' :
             'border-slate-600 text-white'
          }`}>
             {inputValue || '?'}
          </div>

          {/* Feedback Icon Overlay */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
             {feedback === 'correct' && <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />}
             {feedback === 'incorrect' && <XCircle className="w-10 h-10 text-red-500" />}
          </div>
        </div>

        {/* Correct Answer Reveal (Only on incorrect) */}
        {feedback === 'incorrect' && (
          <div className="absolute bottom-4 text-slate-400 font-medium animate-pulse">
            Answer: {currentQ.answer}
          </div>
        )}
      </div>
      
      {/* Timer Text */}
      <div className="flex gap-2 text-slate-500 mb-4 items-center">
         <Timer className="w-4 h-4" />
         <span>{timeLeft.toFixed(1)}s</span>
      </div>

      {/* Mobile Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] select-none">
         {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
           <button
             key={num}
             onClick={() => handleNumpadInput(num)}
             className="h-16 rounded-2xl bg-slate-800 shadow-[0_4px_0_0_rgba(15,23,42,0.5)] active:shadow-none active:translate-y-[4px] border-t border-slate-700 text-2xl font-bold text-white transition-all flex items-center justify-center"
             disabled={feedback !== 'idle'}
           >
             {num}
           </button>
         ))}
         
         {/* Bottom Row */}
         <button
           onClick={handleBackspace}
           className="h-16 rounded-2xl bg-slate-700 shadow-[0_4px_0_0_rgba(15,23,42,0.5)] active:shadow-none active:translate-y-[4px] text-red-400 flex items-center justify-center transition-all"
           disabled={feedback !== 'idle'}
         >
           <Delete className="w-8 h-8" />
         </button>
         
         <button
           onClick={() => handleNumpadInput(0)}
           className="h-16 rounded-2xl bg-slate-800 shadow-[0_4px_0_0_rgba(15,23,42,0.5)] active:shadow-none active:translate-y-[4px] border-t border-slate-700 text-2xl font-bold text-white transition-all flex items-center justify-center"
           disabled={feedback !== 'idle'}
         >
           0
         </button>

         <button
           onClick={handleSubmit}
           className="h-16 rounded-2xl bg-blue-600 shadow-[0_4px_0_0_rgba(30,64,175,0.5)] active:shadow-none active:translate-y-[4px] text-white flex items-center justify-center transition-all"
           disabled={feedback !== 'idle'}
         >
           <ArrowRight className="w-8 h-8" />
         </button>
      </div>
    </div>
  );
};