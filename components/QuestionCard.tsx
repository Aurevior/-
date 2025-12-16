import React from 'react';
import { Question, AnswerHistoryItem } from '../types';
import { CheckCircle, XCircle, HelpCircle, Lightbulb, BookOpen, AlertCircle, Bookmark, Circle, History, Clock, Trash2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  userAnswer?: string;
  onAnswer: (answer: string) => void;
  showExplanation: boolean;
  onToggleExplanation: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isMockMode?: boolean;
  history?: AnswerHistoryItem[];
  onRemoveWrongAnswer?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  onAnswer,
  showExplanation,
  onToggleExplanation,
  isBookmarked,
  onToggleBookmark,
  isMockMode = false,
  history = [],
  onRemoveWrongAnswer
}) => {
  const getOptionLetter = (opt: string) => opt.substring(0, 1);
  const isAnswered = !!userAnswer;
  const isCorrect = isAnswered && userAnswer === question.answer;

  // Format date for history
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            题目 {questionIndex + 1} / {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleBookmark}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${isBookmarked 
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
              `}
              title={isBookmarked ? "取消收藏" : "加入收藏"}
            >
              <Bookmark 
                size={14} 
                className={isBookmarked ? "fill-yellow-500 text-yellow-500" : "text-slate-400"} 
              />
              {isBookmarked ? "已收藏" : "收藏"}
            </button>
            <div className="hidden sm:flex gap-2">
              <span className={`text-xs px-2 py-1 rounded-full border ${question.difficulty === '较易' ? 'bg-green-50 text-green-700 border-green-200' : question.difficulty === '适中' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {question.difficulty}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {question.category}
              </span>
            </div>
          </div>
        </div>

        {/* Question Text */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-relaxed mb-8">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt) => {
              const letter = getOptionLetter(opt);
              const isSelected = userAnswer === letter;
              const isOptionCorrect = question.answer === letter;
              
              let btnClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
              let icon = <div className="w-5 h-5 rounded-full border border-slate-300 mr-3"></div>;

              if (isAnswered) {
                if (isMockMode) {
                  // Mock Mode: Blue for selected, others normal. No correctness check.
                  if (isSelected) {
                    btnClass = "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500";
                    icon = <div className="w-5 h-5 rounded-full border-[6px] border-indigo-600 mr-3 bg-white"></div>;
                  } else {
                    // Unselected options in mock mode should look clickable/normal
                    btnClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                  }
                } else {
                  // Practice Mode: Green/Red correctness
                  if (isSelected && isOptionCorrect) {
                    btnClass = "bg-green-50 border-green-500 ring-1 ring-green-500";
                    icon = <CheckCircle className="w-5 h-5 text-green-600 mr-3" />;
                  } else if (isSelected && !isOptionCorrect) {
                    btnClass = "bg-red-50 border-red-500 ring-1 ring-red-500";
                    icon = <XCircle className="w-5 h-5 text-red-600 mr-3" />;
                  } else if (!isSelected && isOptionCorrect) {
                    btnClass = "bg-green-50 border-green-500 border-dashed";
                    icon = <CheckCircle className="w-5 h-5 text-green-600 mr-3" />;
                  } else {
                    btnClass = "opacity-50 border-slate-100";
                  }
                }
              } else if (isSelected) {
                 btnClass = "bg-blue-50 border-blue-500 ring-1 ring-blue-500";
              }

              return (
                <button
                  key={letter}
                  onClick={() => (isMockMode || !isAnswered) && onAnswer(letter)}
                  disabled={isAnswered && !isMockMode} // Only disable in practice mode after answering
                  className={`
                    w-full text-left p-4 rounded-xl border flex items-center transition-all duration-200
                    ${btnClass}
                  `}
                >
                  <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold ${isAnswered && isSelected && isMockMode ? 'text-indigo-600 border-indigo-200' : 'text-slate-600'} mr-4 shadow-sm`}>
                    {letter}
                  </div>
                  <span className={`text-base ${isAnswered && isOptionCorrect && !isMockMode ? 'font-semibold text-green-900' : isAnswered && isSelected && isMockMode ? 'font-semibold text-indigo-900' : 'text-slate-700'}`}>
                    {opt.substring(2)} {/* Remove "A. " */}
                  </span>
                  <div className="ml-auto">
                    {/* Only show icons in practice mode */}
                    {!isMockMode && isAnswered && isSelected && !isOptionCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    {!isMockMode && isAnswered && isOptionCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {/* Mock mode specific indicator if needed, currently just the border */}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
           <div className="text-sm text-slate-500">
             {isAnswered ? (
               isMockMode ? (
                 <span className="text-indigo-600 font-medium flex items-center gap-1"><Circle size={12} className="fill-indigo-600"/> 已作答 (可修改)</span>
               ) : (
                 userAnswer === question.answer ? 
                 <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle size={16}/> 回答正确</span> : 
                 <span className="text-red-600 font-medium flex items-center gap-1"><AlertCircle size={16}/> 回答错误</span>
               )
             ) : (
               <span className="flex items-center gap-1"><HelpCircle size={16}/> 请选择一个选项</span>
             )}
           </div>
           
           <div className="flex items-center gap-4">
             {/* Remove from Incorrect Button - Only show if wrong and answered in practice mode */}
             {isAnswered && !isMockMode && !isCorrect && onRemoveWrongAnswer && (
               <button
                 onClick={() => {
                   if(window.confirm('确定要将此题移出错题集吗？(这会清除该题的作答记录)')) {
                     onRemoveWrongAnswer();
                   }
                 }}
                 className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                 title="清除作答记录，移出错题集"
               >
                 <Trash2 size={16} />
                 移出错题
               </button>
             )}

             {isAnswered && !isMockMode && (
               <button 
                 onClick={onToggleExplanation}
                 className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1 transition-colors"
               >
                 <Lightbulb size={16} />
                 {showExplanation ? '隐藏解析' : '查看解析'}
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Explanation Section - Only show if explanation is toggled AND not in mock mode */}
      {showExplanation && !isMockMode && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Standard Explanation */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h4 className="flex items-center gap-2 font-bold text-blue-900 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              参考解析
            </h4>
            <div className="text-blue-800 text-sm leading-relaxed">
              <p className="font-semibold mb-2">正确答案: {question.answer}</p>
              <p>{question.explanation}</p>
            </div>
          </div>

          {/* Answer History */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <History className="w-5 h-5 text-slate-500" />
                历史作答记录
              </h4>
              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-500">时间</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-500">选项</th>
                      <th className="px-4 py-3 text-center font-medium text-slate-500">结果</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-500">模式</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...history].reverse().map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-600 flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          {formatDate(item.timestamp)}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-800">
                          {item.selectedOption}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                              <CheckCircle size={12} /> 正确
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
                              <XCircle size={12} /> 错误
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-500">
                          {item.mode === 'mock' ? '模拟测试' : '练习模式'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;