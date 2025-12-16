import React from 'react';
import { Question } from '../types';
import { LayoutList, CheckCircle, XCircle, Circle, PlayCircle, LogOut, FileCheck, Trash2 } from 'lucide-react';

interface SidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  onSelectQuestion: (index: number) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  totalBookmarks?: number;
  totalIncorrect?: number;
  mode: 'practice' | 'mock' | 'mock-results';
  onStartMockTest: () => void;
  onQuitMockTest: () => void;
  onGoHome: () => void;
  onResetProgress: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  onSelectQuestion,
  isOpen,
  toggleSidebar,
  categories,
  selectedCategory,
  onSelectCategory,
  totalBookmarks = 0,
  totalIncorrect = 0,
  mode,
  onStartMockTest,
  onQuitMockTest,
  onGoHome,
  onResetProgress
}) => {
  const correctCount = Object.keys(answers).filter(id => {
    const q = questions.find(q => q.id === id);
    return q && answers[id] === q.answer;
  }).length;

  const isMockResults = mode === 'mock-results';
  const isMockMode = mode === 'mock';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static flex flex-col
      `}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-blue-600" />
            {mode === 'practice' ? '题库导航' : isMockResults ? '测试结果' : '模拟测试中'}
          </h2>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">完成进度</span>
              <span className="font-medium">{Object.keys(answers).length} / {questions.length}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: questions.length > 0 ? `${(Object.keys(answers).length / questions.length) * 100}%` : '0%' }}
              ></div>
            </div>
            
            {/* Only show correct/incorrect stats if NOT in active mock mode */}
            {!isMockMode && (
              <div className="flex gap-4 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" /> 正确: {correctCount}
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" /> 错误: {Object.keys(answers).length - correctCount}
                </div>
              </div>
            )}
          </div>

          {/* Mock Test Controls */}
          {!isMockResults && (
            <div className="mt-4">
              {mode === 'practice' ? (
                <button
                  type="button"
                  onClick={() => {
                    onStartMockTest();
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm"
                >
                  <PlayCircle size={16} />
                  开始模拟测试 (100题)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onQuitMockTest();
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-semibold shadow-sm"
                >
                  <FileCheck size={16} />
                  交卷 / 结束测试
                </button>
              )}
            </div>
          )}
        </div>

        {mode === 'practice' && (
          <div className="p-4 border-b border-slate-100">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              题目筛选
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full p-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">全部题目</option>
              <option value="Bookmarks">⭐ 我的收藏 ({totalBookmarks})</option>
              <option value="Incorrect">❌ 错题回顾 ({totalIncorrect})</option>
              <hr />
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCorrect = isAnswered && answers[q.id] === q.answer;
              const isCurrent = currentQuestionIndex === idx;

              let bgClass = "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";
              
              if (isMockResults) {
                 // In results mode, show simple correct/incorrect status
                 if (isAnswered) {
                    bgClass = isCorrect 
                      ? "bg-green-100 border-green-200 text-green-700" 
                      : "bg-red-100 border-red-200 text-red-700";
                 }
              } else if (isMockMode) {
                 // In active Mock mode, do NOT show correctness
                 if (isCurrent) {
                    bgClass = "ring-2 ring-indigo-500 ring-offset-1 border-indigo-500 text-indigo-700 font-bold";
                 } else if (isAnswered) {
                    bgClass = "bg-indigo-50 border-indigo-200 text-indigo-700";
                 }
              } else {
                // Practice mode
                if (isCurrent) {
                  bgClass = "ring-2 ring-blue-500 ring-offset-1 border-blue-500 text-blue-700 font-bold";
                } else if (isAnswered) {
                  bgClass = isCorrect 
                    ? "bg-green-100 border-green-200 text-green-700" 
                    : "bg-red-100 border-red-200 text-red-700";
                }
              }

              return (
                <button
                  key={q.id}
                  disabled={isMockResults} // Disable navigation in results mode via grid for simplicity, or we could enable review
                  onClick={() => {
                    onSelectQuestion(idx);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className={`
                    w-10 h-10 rounded-lg text-sm font-medium border flex items-center justify-center transition-all
                    ${bgClass}
                    ${isMockResults ? 'cursor-default' : ''}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Reset Button */}
        {mode === 'practice' && (
          <div className="p-4 border-t border-slate-100">
             <button
                type="button"
                onClick={onResetProgress}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium"
             >
               <Trash2 size={14} />
               重置所有进度
             </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;