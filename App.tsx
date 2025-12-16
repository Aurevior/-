import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import QuestionCard from './components/QuestionCard';
import MockResultCard from './components/MockResultCard';
import HomePage from './components/HomePage';
import { allQuestions as questions, categories } from './dataIndex';
import { Menu, ChevronLeft, ChevronRight, BarChart2, BrainCircuit, Home } from 'lucide-react';
import { Question, AnswerHistoryItem } from './types';

// Helper to shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function App() {
  const [view, setView] = useState<'home' | 'app'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Mode state
  const [mode, setMode] = useState<'practice' | 'mock' | 'mock-results'>('practice');
  
  // Practice Mode State - Persisted
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('securities-law-answers');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Answer History State - Persisted
  const [answerHistory, setAnswerHistory] = useState<Record<string, AnswerHistoryItem[]>>(() => {
    try {
      const saved = localStorage.getItem('securities-law-history');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Mock Mode State
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});

  const [showExplanation, setShowExplanation] = useState(false);
  
  // Bookmark state with localStorage initialization
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('securities-law-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist states
  useEffect(() => {
    localStorage.setItem('securities-law-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('securities-law-answers', JSON.stringify(practiceAnswers));
  }, [practiceAnswers]);

  useEffect(() => {
    localStorage.setItem('securities-law-history', JSON.stringify(answerHistory));
  }, [answerHistory]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const removeAnswer = (id: string) => {
    setPracticeAnswers(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // Removing the answer will naturally remove it from "Incorrect" filtered list in the next render cycle
  };

  const resetProgress = () => {
    // 1. Clear LocalStorage directly
    try {
      localStorage.removeItem('securities-law-answers');
      localStorage.removeItem('securities-law-history');
      localStorage.removeItem('securities-law-bookmarks');
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }

    // 2. Soft Reset: Clear all React states to initial values immediately
    setPracticeAnswers({});
    setAnswerHistory({});
    setBookmarks([]);
    
    // Reset transient states
    setMode('practice');
    setMockQuestions([]);
    setMockAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedCategory('All');
    setShowExplanation(false);
  };

  // Logic for Mock Test
  const startMockTest = () => {
    const shuffled = shuffleArray(questions);
    const selected = shuffled.slice(0, 100);
    setMockQuestions(selected);
    setMockAnswers({});
    setMode('mock');
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setView('app');
  };

  const finishMockTest = () => {
    const timestamp = Date.now();
    
    // Update History with Mock Results
    const newHistory = { ...answerHistory };
    
    Object.entries(mockAnswers).forEach(([qId, answer]) => {
      const q = questions.find(q => q.id === qId);
      if (q) {
        if (!newHistory[qId]) newHistory[qId] = [];
        newHistory[qId].push({
          timestamp,
          selectedOption: answer,
          isCorrect: answer === q.answer,
          mode: 'mock'
        });
      }
    });
    setAnswerHistory(newHistory);

    // Merge mock answers into practice answers to record correctness history (latest answer wins for "Incorrect" filter)
    setPracticeAnswers(prev => ({ ...prev, ...mockAnswers }));
    setMode('mock-results');
  };

  const quitMockTest = () => {
    // Revert to practice mode completely
    setMode('practice');
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
  };

  const goHome = () => {
    // If quitting from a mock test in progress, reset
    if (mode === 'mock') {
       if(confirm('正在进行模拟测试，返回主页将丢失当前进度，确定离开吗？')) {
          quitMockTest();
          setView('home');
       }
    } else {
        // If in results mode or practice mode, just go home
        if (mode === 'mock-results') {
            quitMockTest(); // Reset mock state
        }
        setView('home');
    }
  };

  // Derived state for incorrect answers (Practice Mode only)
  const incorrectQuestionIds = useMemo(() => {
    return Object.keys(practiceAnswers).filter(id => {
      const q = questions.find(question => question.id === id);
      return q && practiceAnswers[id] !== q.answer;
    });
  }, [practiceAnswers]);

  // Determine active questions based on mode
  const activeQuestions = useMemo(() => {
    if (mode === 'mock' || mode === 'mock-results') {
      return mockQuestions;
    }

    // Practice Mode Filtering
    if (selectedCategory === 'Bookmarks') {
      return questions.filter(q => bookmarks.includes(q.id));
    }
    if (selectedCategory === 'Incorrect') {
      return questions.filter(q => incorrectQuestionIds.includes(q.id));
    }
    if (selectedCategory === 'All') return questions;
    return questions.filter(q => q.category === selectedCategory);
  }, [mode, mockQuestions, selectedCategory, bookmarks, incorrectQuestionIds]);

  const currentAnswers = (mode === 'mock' || mode === 'mock-results') ? mockAnswers : practiceAnswers;
  const currentQuestion = activeQuestions[currentQuestionIndex];

  // If filter changes in practice mode, reset index
  useEffect(() => {
    if (mode === 'practice') {
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
    }
  }, [selectedCategory, mode]);

  // Safety check
  useEffect(() => {
    if (activeQuestions.length > 0 && currentQuestionIndex >= activeQuestions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [activeQuestions.length, currentQuestionIndex]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    if (mode === 'mock') {
      setMockAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
      // Do NOT show explanation in mock mode
    } else {
      setPracticeAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
      
      // Add to history
      setAnswerHistory(prev => {
        const history = prev[currentQuestion.id] || [];
        return {
          ...prev,
          [currentQuestion.id]: [
            ...history,
            {
              timestamp: Date.now(),
              selectedOption: answer,
              isCorrect: answer === currentQuestion.answer,
              mode: 'practice'
            }
          ]
        };
      });

      setShowExplanation(true); 
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      if (mode === 'mock') {
        setShowExplanation(false);
      } else {
        setShowExplanation(!!currentAnswers[activeQuestions[nextIdx].id]);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      if (mode === 'mock') {
        setShowExplanation(false);
      } else {
        setShowExplanation(!!currentAnswers[activeQuestions[prevIdx].id]);
      }
    }
  };

  const handleHomeNavigate = (type: 'bank' | 'mock' | 'incorrect' | 'bookmarks') => {
    if (type === 'mock') {
      startMockTest();
    } else {
      setMode('practice');
      if (type === 'bank') setSelectedCategory('All');
      if (type === 'incorrect') setSelectedCategory('Incorrect');
      if (type === 'bookmarks') setSelectedCategory('Bookmarks');
      setView('app');
    }
  };

  if (view === 'home') {
    const totalCorrect = Object.keys(practiceAnswers).filter(id => {
      const q = questions.find(q => q.id === id);
      return q && practiceAnswers[id] === q.answer;
    }).length;

    return (
      <HomePage 
        onNavigate={handleHomeNavigate}
        onResetProgress={resetProgress}
        stats={{
          totalQuestions: questions.length,
          totalAnswered: Object.keys(practiceAnswers).length,
          totalCorrect: totalCorrect,
          totalBookmarks: bookmarks.length,
          totalIncorrect: incorrectQuestionIds.length
        }}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        questions={activeQuestions}
        currentQuestionIndex={currentQuestionIndex}
        answers={currentAnswers}
        onSelectQuestion={(idx) => {
          setCurrentQuestionIndex(idx);
          if (mode === 'mock') {
            setShowExplanation(false);
          } else {
            setShowExplanation(!!currentAnswers[activeQuestions[idx].id]);
          }
        }}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalBookmarks={bookmarks.length}
        totalIncorrect={incorrectQuestionIds.length}
        mode={mode}
        onStartMockTest={startMockTest}
        onQuitMockTest={finishMockTest}
        onGoHome={goHome}
        onResetProgress={resetProgress}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between md:hidden z-10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-slate-800 truncate">
              {mode === 'practice' ? '证券从业资格习题' : '模拟测试'}
            </h1>
          </div>
          
          <button 
            onClick={goHome}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            title="返回主页"
          >
            <Home size={22} />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200 h-16 items-center px-8 justify-between shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {mode === 'practice' ? <BarChart2 className="text-blue-600" /> : <BrainCircuit className="text-indigo-600" />}
              {mode === 'practice' ? '证券从业资格习题练习' : mode === 'mock' ? '全真模拟测试 (100题)' : '模拟测试结果'}
            </h1>
            <div className="text-sm text-slate-500">
              {mode === 'mock' ? (
                <span className="text-indigo-600 font-medium">正在进行模拟测试...</span>
              ) : mode === 'mock-results' ? (
                <span className="text-indigo-600 font-medium">测试已完成</span>
              ) : (
                <>
                  {selectedCategory === 'Bookmarks' ? '我的收藏' : selectedCategory === 'Incorrect' ? '我的错题' : '总题数'}: <span className="font-mono font-bold text-slate-900">{activeQuestions.length}</span>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={goHome}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium border border-transparent hover:border-slate-200"
          >
            <Home size={18} />
            返回主页
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {mode === 'mock-results' ? (
            <MockResultCard 
              questions={mockQuestions}
              answers={mockAnswers}
              onGoHome={goHome}
              onRestart={startMockTest}
            />
          ) : activeQuestions.length > 0 && currentQuestion ? (
            <div className="max-w-3xl mx-auto pb-24">
              <QuestionCard 
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={activeQuestions.length}
                userAnswer={currentAnswers[currentQuestion.id]}
                onAnswer={handleAnswer}
                showExplanation={showExplanation}
                onToggleExplanation={() => setShowExplanation(!showExplanation)}
                isBookmarked={bookmarks.includes(currentQuestion.id)}
                onToggleBookmark={() => toggleBookmark(currentQuestion.id)}
                isMockMode={mode === 'mock'}
                history={answerHistory[currentQuestion.id]}
                onRemoveWrongAnswer={() => removeAnswer(currentQuestion.id)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              {mode === 'practice' && selectedCategory === 'Bookmarks' ? (
                 <>
                   <div className="mb-4 text-4xl">⭐</div>
                   <p className="font-medium text-lg">暂无收藏题目</p>
                   <p className="text-sm mt-2">在练习时点击题目右上角的“书签”按钮即可收藏。</p>
                 </>
              ) : mode === 'practice' && selectedCategory === 'Incorrect' ? (
                 <>
                   <div className="mb-4 text-4xl">🎉</div>
                   <p className="font-medium text-lg">太棒了！你目前还没有答错任何题目</p>
                   <p className="text-sm mt-2">或者你还没有开始答题，继续加油！</p>
                 </>
              ) : (
                "该分类下没有题目。"
              )}
            </div>
          )}
        </main>

        {/* Floating Action Bar / Footer Navigation */}
        {mode !== 'mock-results' && (
          <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0 || activeQuestions.length === 0}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                  ${currentQuestionIndex === 0 || activeQuestions.length === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}
                `}
              >
                <ChevronLeft size={18} /> 上一题
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === activeQuestions.length - 1 || activeQuestions.length === 0}
                className={`
                  flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                  ${currentQuestionIndex === activeQuestions.length - 1 || activeQuestions.length === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}
                `}
              >
                下一题 <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;