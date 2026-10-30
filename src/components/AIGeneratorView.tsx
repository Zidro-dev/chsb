import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  PlusCircle, 
  Check, 
  Play, 
  BookOpen, 
  RefreshCw, 
  Sliders, 
  HelpCircle,
  Copy,
  Zap,
  ListPlus
} from 'lucide-react';
import { Question, SubjectType } from '../utils/testLogic.ts';
import { CHSB_TOPICS, AVAILABLE_SUBJECTS } from '../data/chsbData.ts';
import { MathView, FormattedMathText } from './MathView.tsx';

interface AIGeneratorViewProps {
  onAddQuestionToBank: (q: Question) => void;
  onPracticeQuestionNow: (q: Question) => void;
  initialTopicId?: number;
}

export const AIGeneratorView: React.FC<AIGeneratorViewProps> = ({
  onAddQuestionToBank,
  onPracticeQuestionNow,
  initialTopicId,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>(() => {
    if (initialTopicId && initialTopicId >= 200) return 'Ingliz tili';
    if (initialTopicId && initialTopicId >= 100) return 'Fizika';
    return 'Matematika';
  });
  const [topicId, setTopicId] = useState<number>(initialTopicId || 1);
  const [difficulty, setDifficulty] = useState<'demo_easy' | 'medium' | 'hard'>('medium');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [batchCount, setBatchCount] = useState<number>(1);

  const handleSubjectChange = (subj: SubjectType) => {
    setSelectedSubject(subj);
    const firstMatching = CHSB_TOPICS.find((t) => (t.subject || 'Matematika') === subj);
    if (firstMatching) {
      setTopicId(firstMatching.id);
    }
  };

  const selectedTopic = CHSB_TOPICS.find((t) => t.id === topicId) || CHSB_TOPICS[0];

  const handleGenerate = async () => {
    setLoading(true);
    const newQuestions: Question[] = [];

    try {
      for (let i = 0; i < batchCount; i++) {
        const res = await fetch('/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: selectedSubject,
            topicId,
            difficulty,
            promptSuffix: customPrompt,
          }),
        });

        const data = await res.json();
        if (data.question) {
          newQuestions.push(data.question);
        }
      }

      setGeneratedQuestions((prev) => [...newQuestions, ...prev]);
    } catch (err) {
      console.error('Error generating questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBank = (q: Question) => {
    onAddQuestionToBank(q);
    setSavedStatus((prev) => ({ ...prev, [q.id]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini 3.8 Flash bilan Savollar Bazasi Generatori
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Avtomatik Test Generatori
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            10-sinf CHSB-1 spetsifikatsiyasi va ta'lim standartlariga mos ravishda istalgan mavzudan cheksiz yangi test topshiriqlarini yarating, yechimlari bilan tahlil qiling va o'quv bazangizga saqlang.
          </p>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl mb-8">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          Generatsiya parametrlarini tanlang
        </h2>

        {/* Subject Selection Buttons */}
        <div className="mb-5 pb-4 border-b border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            1. Qaysi fan uchun test savollari generatsiya qilinadi?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AVAILABLE_SUBJECTS.map((s) => {
              const isSelected = selectedSubject === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSubjectChange(s.id)}
                  type="button"
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-600/20 border-cyan-400 text-white ring-2 ring-cyan-500/40 shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-sm block">{s.id}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 truncate">{s.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Topic Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              2. {selectedSubject} mavzusini tanlang
            </label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {CHSB_TOPICS.filter((t) => (t.subject || 'Matematika') === selectedSubject).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}-mavzu: {t.title} ({t.category})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1 italic">
              {selectedTopic.description}
            </p>
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              2. Qiyinlik darajasi
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="demo_easy">1–3. DEMO darajasiga yaqin (Asosiy formulalar)</option>
              <option value="medium">4–7. Murakkabroq topshiriqlar (Standart CHSB)</option>
              <option value="hard">8–10. Yuqori darajadagi topshiriqlar (Kengaytirilgan)</option>
            </select>

            <div className="flex items-center gap-3 mt-2">
              <label className="text-xs text-slate-400">Nechta savol:</label>
              <div className="flex items-center gap-1.5">
                {[1, 3, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setBatchCount(cnt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      batchCount === cnt
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cnt} ta
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Prompt Instructions */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Qo'shimcha talab yoki shart (Ixtiyoriy)
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Masalan: Ikki sonning kublari ayirmasi shaklida bo'lsin, yoki butun koeffitsiyentlar qatnashsin..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 text-base transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Yangi test shakllantirilmoqda...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              Yangi test savolini yaratish ({batchCount} ta)
            </>
          )}
        </button>
      </div>

      {/* Generated Questions Stream */}
      {generatedQuestions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Yaratilgan yangi savollar ({generatedQuestions.length} ta)
            </h3>
            <button
              onClick={() => {
                generatedQuestions.forEach((q) => handleSaveToBank(q));
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <ListPlus className="w-4 h-4" /> Hammasini bazaga qo'shish
            </button>
          </div>

          <div className="space-y-5">
            {generatedQuestions.map((q) => {
              const isSaved = savedStatus[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-cyan-900/60 rounded-2xl p-5 sm:p-6 shadow-xl relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {q.topicId}-mavzu: {q.topicTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                        {q.difficulty === 'demo_easy' ? 'Oson' : q.difficulty === 'medium' ? 'O\'rta' : 'Murakkab'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToBank(q)}
                        disabled={isSaved}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                          isSaved
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Bazaga saqlandi
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" /> Bazaga saqlash
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onPracticeQuestionNow(q)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition border border-slate-700"
                      >
                        <Play className="w-3 h-3 fill-current" /> Yechish
                      </button>
                    </div>
                  </div>

                  <p className="text-base text-slate-100 font-medium leading-relaxed mb-3 whitespace-pre-line">
                    <FormattedMathText text={q.questionText} />
                  </p>

                  {q.expression && (
                    <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30 text-cyan-200 text-center text-base sm:text-xl my-3 overflow-x-auto">
                      <MathView math={q.expression} block={true} className="font-serif tracking-wide text-cyan-300" />
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4 text-xs sm:text-sm">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <div
                        key={opt}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          q.correctAnswer === opt
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span>
                          <strong className="mr-2">{opt})</strong> <FormattedMathText text={q.options[opt]} />
                        </span>
                        {q.correctAnswer === opt && (
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">To'g'ri kalit</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Batafsil yechimi va tahlili:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      <FormattedMathText text={q.explanation} />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
