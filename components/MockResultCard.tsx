import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, AlertCircle, BarChart2, ArrowLeft, RefreshCw, Home } from 'lucide-react';

interface MockResultCardProps {
  questions: Question[];
  answers: Record<string, string>;
  onGoHome: () => void;
  onRestart: () => void;
}

const MockResultCard: React.FC<MockResultCardProps> = ({ 
  questions, 
  answers, 
  onGoHome,
  onRestart
}) => {
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  let correctCount = 0;
  
  // Category Analysis
  const categoryStats: Record<string, { total: number; correct: number }> = {};

  questions.forEach(q => {
    const isAnswered = !!answers[q.id];
    const isCorrect = isAnswered && answers[q.id] === q.answer;
    
    if (isCorrect) correctCount++;

    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0 };
    }
    categoryStats[q.category].total++;
    if (isCorrect) {
      categoryStats[q.category].correct++;
    }
  });

  const incorrectCount = Object.keys(answers).length - correctCount;
  const unAnsweredCount = total - answeredCount;
  const score = Math.round((correctCount / total) * 100);

  // Sort categories by accuracy (descending)
  const sortedCategories = Object.entries(categoryStats).sort(([, a], [, b]) => {
    const accA = a.total > 0 ? a.correct / a.total : 0;
    const accB = b.total > 0 ? b.correct / b.total : 0;
    return accB - accA;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="text-blue-600" />
            测试结果分析
          </h2>
          <span className="text-sm text-slate-500">{new Date().toLocaleString()}</span>
        </div>
        
        <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Score Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={score >= 60 ? "#16a34a" : "#dc2626"}
                strokeWidth="16"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-bold ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                {score}
              </span>
              <span className="text-sm text-slate-400 font-medium uppercase mt-1">总分</span>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full max-w-xs">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                <CheckCircle size={14} className="text-green-500" /> 正确
              </span>
              <span className="text-2xl font-bold text-slate-800">{correctCount}</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${(correctCount / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                <XCircle size={14} className="text-red-500" /> 错误
              </span>
              <span className="text-2xl font-bold text-slate-800">{incorrectCount}</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(incorrectCount / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                <AlertCircle size={14} className="text-amber-500" /> 未答
              </span>
              <span className="text-2xl font-bold text-slate-800">{unAnsweredCount}</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(unAnsweredCount / total) * 100}%` }}></div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-slate-500 mb-1">完成率</span>
              <span className="text-2xl font-bold text-slate-800">{Math.round((answeredCount / total) * 100)}%</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(answeredCount / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-6">知识点掌握情况</h3>
        <div className="space-y-5">
          {sortedCategories.map(([category, stats]) => {
            const accuracy = Math.round((stats.correct / stats.total) * 100);
            return (
              <div key={category}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{category}</span>
                  <span className="text-slate-500">
                    {stats.correct} / {stats.total} 正确 ({accuracy}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      accuracy >= 80 ? 'bg-green-500' :
                      accuracy >= 60 ? 'bg-blue-500' :
                      accuracy >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onGoHome}
          className="flex-1 py-3 px-6 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Home size={20} />
          返回主页
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <RefreshCw size={20} />
          再测一次
        </button>
      </div>
    </div>
  );
};

export default MockResultCard;