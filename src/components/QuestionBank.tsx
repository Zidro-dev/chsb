import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  FileDown, 
  Printer,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { Question, SubjectType } from '../utils/testLogic.ts';
import { CHSB_TOPICS, AVAILABLE_SUBJECTS } from '../data/chsbData.ts';
import { DiagramRenderer } from './DiagramRenderer.tsx';
import { MathView, FormattedMathText } from './MathView.tsx';

interface QuestionBankProps {
  questions: Question[];
  onPracticeTopic: (topicId: number) => void;
  onGoToGenerator: (topicId?: number) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  questions,
  onPracticeTopic,
  onGoToGenerator,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectType>('all');
  const [selectedTopic, setSelectedTopic] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = 
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.expression && q.expression.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || (q.subject || 'Matematika') === selectedSubject;
    const matchesTopic = selectedTopic === 'all' || q.topicId === selectedTopic;
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesTopic && matchesCategory && matchesDiff;
  });

  const toggleSolution = (id: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 mb-2">
            <Database className="w-3.5 h-3.5" />
            10-sinf CHSB-1 Savollar Bazasi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Rasmiy va AI Savollar Banki
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Jami <strong className="text-cyan-400 font-bold">{questions.length} ta</strong> topshiriq (200 ta CHSB-1 rasmiy misollari va generatsiya qilingan yangi variantlar)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onGoToGenerator(typeof selectedTopic === 'number' ? selectedTopic : 1)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Yangi savol yaratish (AI)
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition border border-slate-700"
          >
            <Printer className="w-4 h-4" /> Chop etish
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 mb-6 shadow-xl space-y-4">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-cyan-400" /> Fan:
          </span>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSelectedTopic('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSubject === 'all'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Barcha fanlar ({questions.length})
          </button>
          {AVAILABLE_SUBJECTS.map((s) => {
            const count = questions.filter((q) => (q.subject || 'Matematika') === s.id).length;
            const isSelected = selectedSubject === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSubject(s.id);
                  setSelectedTopic('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{s.id}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Matn, mavzu yoki formula bo'yicha qidirish..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Topic selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mavzu:</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">Barcha mavzular</option>
              {CHSB_TOPICS.filter((t) => selectedSubject === 'all' || (t.subject || 'Matematika') === selectedSubject).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.subject ? `[${t.subject}] ` : ''}{t.id}-mavzu: {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Fan bo'limi:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">Barcha bo'limlar</option>
              <option value="Algebra">Algebra</option>
              <option value="Funksiyalar">Funksiyalar</option>
              <option value="Geometriya">Geometriya & Stereometriya</option>
              <option value="Kinematika">Kinematika (Fizika)</option>
              <option value="Dinamika">Dinamika (Fizika)</option>
              <option value="Vocabulary">Vocabulary (English)</option>
              <option value="Grammar">Grammar (English)</option>
              <option value="Reading">Reading (English)</option>
            </select>
          </div>

          {/* Difficulty selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Qiyinlik darajasi:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">Barcha darajalar</option>
              <option value="demo_easy">DEMO oson</option>
              <option value="medium">O'rta (Standart CHSB)</option>
              <option value="hard">Murakkab topshiriqlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Topildi: <strong className="text-white">{filteredQuestions.length} ta</strong> topshiriq</span>
          {typeof selectedTopic === 'number' && (
            <button
              onClick={() => onPracticeTopic(selectedTopic)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Shu mavzuda trenajyorni boshlash
            </button>
          )}
        </div>

        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedSolutions[q.id];
          return (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-cyan-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    (q.subject || 'Matematika') === 'Fizika'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : (q.subject || 'Matematika') === 'Ingliz tili'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-blue-950 text-blue-300 border-blue-800'
                  }`}>
                    {q.subject || 'Matematika'}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {q.topicTitle}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {q.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {q.difficulty === 'demo_easy' ? 'DEMO oson' : q.difficulty === 'medium' ? 'O\'rta' : 'Murakkab'}
                  </span>
                  {q.isCustom && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                      AI GENERATSIYA
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onPracticeTopic(q.topicId)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" /> Mashq qilish
                </button>
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed mb-3 whitespace-pre-line">
                <FormattedMathText text={q.questionText} />
              </p>

              {/* Math Expression */}
              {q.expression && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30 text-cyan-200 text-center text-base sm:text-xl my-3 overflow-x-auto">
                  <MathView math={q.expression} block={true} className="font-serif tracking-wide text-cyan-300" />
                </div>
              )}

              {/* Diagram */}
              {q.diagramType && (
                <DiagramRenderer type={q.diagramType} points={q.graphPoints} />
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <div
                    key={opt}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      isExpanded && q.correctAnswer === opt
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>
                      <strong className="mr-1.5">{opt})</strong> <FormattedMathText text={q.options[opt]} />
                    </span>
                    {isExpanded && q.correctAnswer === opt && (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">To'g'ri kalit</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Solution Toggle */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => toggleSolution(q.id)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isExpanded ? 'Yechimni yashirish' : 'Yechim va tushuntirishni ko\'rish'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[11px] text-slate-500 font-mono">
                  To'g'ri javob: <strong className="text-emerald-400">{q.correctAnswer}</strong>
                </span>
              </div>

              {/* Solution Box */}
              {isExpanded && (
                <div className="mt-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  <div className="font-bold text-emerald-400 mb-1">
                    Batafsil yechim:
                  </div>
                  <FormattedMathText text={q.explanation} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
