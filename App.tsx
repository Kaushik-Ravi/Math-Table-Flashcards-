import React, { useState } from 'react';
import { GameSettings, GameState, QuestionResult } from './types';
import { Settings } from './components/Settings';
import { Game } from './components/Game';
import { Results } from './components/Results';
import { Learn } from './components/Learn';

const DEFAULT_SETTINGS: GameSettings = {
  minTable: 1,
  maxTable: 12,
  timerDuration: 3,
  totalQuestions: 20,
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [results, setResults] = useState<QuestionResult[]>([]);

  const handleStartGame = (customSettings?: GameSettings) => {
    if (customSettings) {
      setSettings(customSettings);
    }
    setGameState(GameState.PLAYING);
    setResults([]);
  };

  const handleGameFinish = (finalResults: QuestionResult[]) => {
    setResults(finalResults);
    setGameState(GameState.FINISHED);
  };

  const handleQuitGame = () => {
    setGameState(GameState.SETUP);
  };

  const handleRestart = () => {
    setGameState(GameState.PLAYING);
    setResults([]);
  };

  const handleOpenLearnMode = () => {
    setGameState(GameState.LEARNING);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header/Logo area could go here */}
      <header className="p-6 text-center">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent cursor-pointer" onClick={() => setGameState(GameState.SETUP)}>
          MATH FLASH
        </h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {gameState === GameState.SETUP && (
          <Settings 
            settings={settings} 
            onUpdateSettings={setSettings} 
            onStart={() => handleStartGame()}
            onOpenLearnMode={handleOpenLearnMode}
          />
        )}
        
        {gameState === GameState.LEARNING && (
          <Learn 
            onBack={handleQuitGame}
            onPractice={handleStartGame}
          />
        )}
        
        {gameState === GameState.PLAYING && (
          <Game 
            settings={settings} 
            onFinish={handleGameFinish} 
            onCancel={handleQuitGame}
          />
        )}
        
        {gameState === GameState.FINISHED && (
          <Results 
            results={results} 
            onRestart={handleRestart} 
            onHome={handleQuitGame} 
          />
        )}
      </main>
      
      <footer className="p-4 text-center text-slate-600 text-sm">
        <p>Master your tables • Powered by React & Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;