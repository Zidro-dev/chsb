import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  CalendarDays, 
  ArrowRight, 
  RotateCcw, 
  BarChart, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Zap
} from 'lucide-react';
import { Question, TestResultSummary, formatDuration } from '../utils/testLogic.ts';
import { DiagramRenderer } from './DiagramRenderer.tsx';
import { MathView, FormattedMathText } from './MathView.tsx';

interface ResultAnalyticsProps {
  summary: TestResultSummary;
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  timePerQuestion: Record<string, number>;
  onGoToStudyPlan: () => void;
  onRetakeExam: () => void;
  onPracticeTopic: (topicId: number) => void;
}

export const ResultAnalytics: React.FC<ResultAnalyticsProps> = ({
  summary,
  questions,
  userAnswers,
  timePerQuestion,
  onGoToStudyPlan,
  onRetakeExam,
  onPracticeTopic,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'errors_only' | 'correct_only'>('errors_only');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = questions.filter((q) => {
    const isCorrect = userAnswers[q.id] === q.correctAnswer;
    if (filterMode === 'errors_only') return !isCorrect;
    if (filterMode === 'correct_only') return isCorrect;
    return true;
  });

  const avgTimePerQuestion = questions.length > 0 
    ? Math.round(summary.totalTimeSeconds / questions.length) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Score Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Grade & Score */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-700"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${
                    summary.scorePercentage >= 80
                      ? 'stroke-emerald-400'
                      : summary.scorePercentage >= 60
                      ? 'stroke-amber-400'
                      : 'stroke-rose-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={`${(summary.scorePercentage / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">{summary.scorePercentage}%</span>
                <span className="text-[11px] font-semibold text-slate-400">NATIJA</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-slate-800 border border-slate-700 text-cyan-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Baholash: {summary.gradeLabel}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                CHSB-1 Test Diagnostikasi
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Jami <span className="font-bold text-white">{summary.totalQuestions} ta</span> savoldan:{' '}
                <span className="font-bold text-emerald-400">{summary.correctCount} ta to'g'ri</span>,{' '}
                <span className="font-bold text-rose-400">{summary.incorrectCount} ta xato</span>
                {summary.unansweredCount > 0 && (
                  <span className="text-amber-400">, {summary.unansweredCount} ta belgilanmagan</span>
                )}.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block mb-0.5">Umumiy vaqt</span>
              <span className="text-lg font-bold text-white flex items-center justify-center gap-1 font-mono">
                <Clock className="w-4 h-4 text-cyan-400" />
                {formatDuration(summary.totalTimeSeconds)}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block mb-0.5">O'rtacha vaqt</span>
              <span className="text-lg font-bold text-cyan-300 font-mono">
                {avgTimePerQuestion} sek/savol
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block mb-0.5">Tavsiya</span>
              <button
                onClick={onGoToStudyPlan}
                className="w-full py-1 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <CalendarDays className="w-3.5 h-3.5" /> Rejani ko'rish
              </button>
            </div>
          </div>
        </div>

        {/* Critical Weakness Alert Banner */}
        {summary.criticalWeaknesses.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-700/80 bg-rose-950/30 -mx-6 -mb-6 p-6 rounded-b-3xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">
                  Diqqat talab qiladigan asosiy bo'shliqlar aniqlandi:
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {summary.criticalWeaknesses.map((weak, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-rose-900/60 text-rose-200 border border-rose-800 font-medium"
                    >
                      {weak}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Subject Performance Breakdown */}
      {summary.subjectStats && summary.subjectStats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Fanlar kesimida o'zlashtirish tahlili
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.subjectStats.map((subj) => {
              const badgeColor = subj.subject === 'Fizika'
                ? 'from-amber-950/60 to-slate-900 border-amber-800/60 text-amber-300'
                : subj.subject === 'Ingliz tili'
                ? 'from-emerald-950/60 to-slate-900 border-emerald-800/60 text-emerald-300'
                : 'from-blue-950/60 to-slate-900 border-blue-800/60 text-blue-300';

              const barColor = subj.percentage >= 75
                ? 'bg-emerald-500'
                : subj.percentage >= 50
                ? 'bg-amber-500'
                : 'bg-rose-500';

              return (
                <div
                  key={subj.subject}
                  className={`bg-gradient-to-br ${badgeColor} border rounded-3xl p-5 shadow-xl relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-white">{subj.subject}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                      {formatDuration(subj.timeSpentSeconds)}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-white">{subj.percentage}%</span>
                    <span className="text-xs text-slate-300">
                      ({subj.correct} / {subj.total} to'g'ri)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${subj.percentage}%` }}
                    />
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>
                      {subj.percentage >= 80 ? '🌟 A\'lo natija' : subj.percentage >= 60 ? '👍 Yaxshi' : '⚠️ Qo\'shimcha mashq zarur'}
                    </span>
                    <span>
                      Xatolar: <strong className="text-rose-400">{subj.total - subj.correct} ta</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Analytics Sections: Category & Topic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            Bo'limlar bo'yicha taqsimot
          </h3>
          <div className="space-y-4">
            {summary.categoryStats.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300 font-semibold">{cat.category}</span>
                  <span className="text-cyan-400 font-bold">{cat.correct} / {cat.total} ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.percentage >= 75
                        ? 'bg-emerald-500'
                        : cat.percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onRetakeExam}
              className="text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Qayta topshirish
            </button>
            <button
              onClick={onGoToStudyPlan}
              className="text-xs px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center gap-1.5 transition shadow-md shadow-cyan-500/20"
            >
              <CalendarDays className="w-3.5 h-3.5" /> Takrorlash rejasi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 20 Topics Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart className="w-4 h-4 text-cyan-400" />
              Mavzular bo'yicha o'zlashtirish tahlili (20 ta mavzu)
            </h3>
            <span className="text-xs text-slate-400">Kam foizli mavzular qizil rangda</span>
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-2">
            {summary.topicStats.map((t) => (
              <div key={t.topicId} className="flex items-center gap-3 text-xs">
                <span className="w-6 text-slate-400 font-mono text-right">{t.topicId}.</span>
                <span className="w-48 truncate text-slate-200" title={t.topicTitle}>{t.topicTitle}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      t.percentage >= 70
                        ? 'bg-emerald-500'
                        : t.percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(5, t.percentage)}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono font-semibold text-slate-300">
                  {t.percentage}%
                </span>
                <button
                  onClick={() => onPracticeTopic(t.topicId)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-600 text-cyan-300 hover:text-white transition"
                >
                  Mashq
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mistakes & Solutions Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Batafsil Savollar va Yechimlar Tahlili
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Har bir savolning to'liq matematik yechimi va xatolik sababi
            </p>
          </div>

          {/* Filter toggle */}
          <div className="flex items-center p-1 bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode('errors_only')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'errors_only'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Faqat xatolar ({summary.incorrectCount + summary.unansweredCount})
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'all'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barchasi ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct_only')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'correct_only'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              To'g'rilar ({summary.correctCount})
            </button>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Hech qanday xato topilmadi!</h4>
            <p className="text-xs text-slate-400">Barcha tanlangan savollar to'g'ri ishlangan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const userOpt = userAnswers[q.id];
              const isCorrect = userOpt === q.correctAnswer;
              const isExpanded = expandedId === q.id;
              const timeSpent = timePerQuestion[q.id] || 0;

              return (
                <div
                  key={q.id}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    isCorrect
                      ? 'border-emerald-900/60 bg-emerald-950/10'
                      : 'border-rose-900/60 bg-rose-950/15'
                  }`}
                >
                  {/* Question Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">
                            {q.topicId}-savol: {q.topicTitle}
                          </span>
                          <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                            isCorrect ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                          }`}>
                            {isCorrect ? "TO'G'RI" : userOpt ? "XATO JAVOB" : "JAVOB BERILMAGAN"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          <FormattedMathText text={q.questionText} />
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {timeSpent}s
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Solution Details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                      <div className="text-sm font-medium text-slate-100 mb-3 whitespace-pre-line">
                        <FormattedMathText text={q.questionText} />
                      </div>

                      {q.expression && (
                        <div className="bg-slate-900 p-3 rounded-2xl border border-cyan-500/30 text-cyan-200 text-center text-base sm:text-xl my-3 overflow-x-auto">
                          <MathView math={q.expression} block={true} className="font-serif tracking-wide text-cyan-300" />
                        </div>
                      )}

                      {q.diagramType && (
                        <DiagramRenderer type={q.diagramType} points={q.graphPoints} />
                      )}

                      {/* Options comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                          const isUser = userOpt === opt;
                          const isRight = q.correctAnswer === opt;
                          return (
                            <div
                              key={opt}
                              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                isRight
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold'
                                  : isUser
                                  ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-semibold'
                                  : 'bg-slate-900 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span>
                                <strong className="mr-1.5">{opt})</strong> <FormattedMathText text={q.options[opt]} />
                              </span>
                              {isRight && <span className="text-[10px] text-emerald-400 font-bold uppercase">To'g'ri</span>}
                              {isUser && !isRight && <span className="text-[10px] text-rose-400 font-bold uppercase">Sizning javobingiz</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Step by step solution */}
                      <div className="mt-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                        <div className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> To'liq bosqichma-bosqich yechimi:
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                          <FormattedMathText text={q.explanation} />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
