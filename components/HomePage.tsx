import React, { useState } from 'react';
import { BookOpen, BrainCircuit, XCircle, Bookmark, Trophy, Activity, Trash2, AlertTriangle } from 'lucide-react';

interface HomePageProps {
  onNavigate: (type: 'bank' | 'mock' | 'incorrect' | 'bookmarks') => void;
  onResetProgress: () => void;
  stats: {
    totalQuestions: number;
    totalAnswered: number;
    totalCorrect: number;
    totalBookmarks: number;
    totalIncorrect: number;
  };
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onResetProgress, stats }) => {
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  const accuracy = stats.totalAnswered > 0 
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) 
    : 0;

  const handleConfirmReset = () => {
    onResetProgress();
    setIsResetConfirming(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            证券从业资格习题练习
          </h1>
          <p className="text-slate-500 text-lg">
            全方位备考助手，助你轻松通关
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">总题库</span>
            <span className="text-2xl font-bold text-slate-800">{stats.totalQuestions}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">已练习</span>
            <span className="text-2xl font-bold text-blue-600">{stats.totalAnswered}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">正确率</span>
            <span className={`text-2xl font-bold ${accuracy >= 60 ? 'text-green-600' : 'text-amber-500'}`}>
              {accuracy}%
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">错题数</span>
            <span className="text-2xl font-bold text-red-500">{stats.totalIncorrect}</span>
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Question Bank */}
          <button
            onClick={() => onNavigate('bank')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 text-left flex items-start gap-6 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-blue-100 p-4 rounded-2xl z-10 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">全真题库</h3>
              <p className="text-slate-500 leading-relaxed">
                浏览全部习题，支持按章节和知识点专项练习。
              </p>
            </div>
          </button>

          {/* Mock Test */}
          <button
            onClick={() => onNavigate('mock')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-left flex items-start gap-6 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-indigo-100 p-4 rounded-2xl z-10 group-hover:scale-110 transition-transform duration-300">
              <BrainCircuit className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">模拟测试</h3>
              <p className="text-slate-500 leading-relaxed">
                随机抽取100题进行全真模拟，检测学习成果。
              </p>
            </div>
          </button>

          {/* Incorrect Review */}
          <button
            onClick={() => onNavigate('incorrect')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-red-300 transition-all duration-300 text-left flex items-start gap-6 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-red-100 p-4 rounded-2xl z-10 group-hover:scale-110 transition-transform duration-300">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-red-700 transition-colors">错题回顾</h3>
              <p className="text-slate-500 leading-relaxed">
                集中攻克历史错题，查漏补缺，巩固薄弱点。
              </p>
            </div>
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => onNavigate('bookmarks')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-300 transition-all duration-300 text-left flex items-start gap-6 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="bg-amber-100 p-4 rounded-2xl z-10 group-hover:scale-110 transition-transform duration-300">
              <Bookmark className="w-8 h-8 text-amber-600" />
            </div>
            <div className="z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">我的收藏</h3>
              <p className="text-slate-500 leading-relaxed">
                查看已收藏的重点、难点题目，随时回顾。
              </p>
            </div>
          </button>

        </div>
        
        {/* Reset Progress Button Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-center relative z-50 pointer-events-auto min-h-[80px]">
          {!isResetConfirming ? (
            <button
              type="button"
              onClick={() => setIsResetConfirming(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200 text-sm font-medium px-6 py-3 rounded-xl cursor-pointer active:scale-95"
            >
              <Trash2 size={16} />
              重置所有练习进度
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <AlertTriangle size={16} />
                    确定要清空所有历史记录吗？
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleConfirmReset}
                        className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 active:scale-95 transition-all shadow-sm flex items-center gap-1"
                    >
                        确认重置
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsResetConfirming(false)}
                        className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 active:scale-95 transition-all"
                    >
                        取消
                    </button>
                </div>
            </div>
          )}
        </div>

        <div className="text-center text-slate-400 text-sm">
          &copy; 2024 Securities Law Mastery
        </div>
      </div>
    </div>
  );
};

export default HomePage;