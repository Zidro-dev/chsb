import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Calculator, 
  AlertCircle,
  SlidersHorizontal,
  Flame,
  Award,
  Layers,
  Check,
  Sparkles
} from 'lucide-react';
import { Question, SubjectType } from '../utils/testLogic.ts';
import { CHSB_TOPICS, AVAILABLE_SUBJECTS } from '../data/chsbData.ts';
import { DiagramRenderer } from './DiagramRenderer.tsx';
import { MathView, FormattedMathText } from './MathView.tsx';

interface TestRunnerProps {
  allQuestions: Question[];
  onFinishTest: (answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>, timePerQuestion: Record<string, number>, questions: Question[]) => void;
  presetTopicId?: number | null;
  onClearPresetTopic?: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  allQuestions,
  onFinishTest,
  presetTopicId,
  onClearPresetTopic,
}) => {
  // Test configuration states
  const [testMode, setTestMode] = useState<'real_chsb_multi' | 'topic_drill' | 'quick_10'>('real_chsb_multi');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>(['Matematika', 'Fizika', 'Ingliz tili']);
  const [selectedTopicId, setSelectedTopicId] = useState<number>(presetTopicId || 1);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerMinutes, setTimerMinutes] = useState<number>(130);

  // Active session states
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(130 * 60);
  const [timePerQuestion, setTimePerQuestion] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState<boolean>(false);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [scratchNotes, setScratchNotes] = useState<string>('');
  const [showConfirmFinish, setShowConfirmFinish] = useState<boolean>(false);
  const [activeNavSubject, setActiveNavSubject] = useState<'all' | SubjectType>('all');

  // Handle incoming preset topic from other tabs (e.g. from study plan or bank)
  useEffect(() => {
    if (presetTopicId) {
      setTestMode('topic_drill');
      setSelectedTopicId(presetTopicId);
      onClearPresetTopic?.();
    }
  }, [presetTopicId, onClearPresetTopic]);

  // Adjust timer when selected subjects change in multi-subject mode
  const toggleSubject = (subj: SubjectType) => {
    setSelectedSubjects((prev) => {
      const exists = prev.includes(subj);
      let next: SubjectType[];
      if (exists) {
        if (prev.length === 1) return prev; // keep at least 1
        next = prev.filter((s) => s !== subj);
      } else {
        next = [...prev, subj];
      }

      // calculate recommended minutes
      let mins = 0;
      if (next.includes('Matematika')) mins += 45;
      if (next.includes('Fizika')) mins += 40;
      if (next.includes('Ingliz tili')) mins += 45;
      setTimerMinutes(mins);

      return next;
    });
  };

  const applySubjectPreset = (preset: 'all' | 'exact' | 'math' | 'physics' | 'english') => {
    if (preset === 'all') {
      setSelectedSubjects(['Matematika', 'Fizika', 'Ingliz tili']);
      setTimerMinutes(130);
    } else if (preset === 'exact') {
      setSelectedSubjects(['Matematika', 'Fizika']);
      setTimerMinutes(85);
    } else if (preset === 'math') {
      setSelectedSubjects(['Matematika']);
      setTimerMinutes(45);
    } else if (preset === 'physics') {
      setSelectedSubjects(['Fizika']);
      setTimerMinutes(40);
    } else if (preset === 'english') {
      setSelectedSubjects(['Ingliz tili']);
      setTimerMinutes(45);
    }
  };

  // Main countdown timer
  useEffect(() => {
    if (!sessionActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // Track time spent on current question
      if (activeQuestions[currentIndex]) {
        const qId = activeQuestions[currentIndex].id;
        setTimePerQuestion((prev) => ({
          ...prev,
          [qId]: (prev[qId] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, isPaused, currentIndex, activeQuestions]);

  const startTest = () => {
    let pool: Question[] = [];

    if (testMode === 'real_chsb_multi') {
      // Assemble full CHSB exam based on selected subjects
      if (selectedSubjects.includes('Matematika')) {
        const mathQs: Question[] = [];
        for (let t = 1; t <= 20; t++) {
          const tQs = allQuestions.filter((q) => (q.subject === 'Matematika' || !q.subject) && q.topicId === t);
          if (tQs.length > 0) {
            mathQs.push(tQs[Math.floor(Math.random() * tQs.length)]);
          }
        }
        pool.push(...mathQs);
      }

      if (selectedSubjects.includes('Fizika')) {
        const physQs = allQuestions.filter((q) => q.subject === 'Fizika');
        const shuffled = [...physQs].sort(() => 0.5 - Math.random());
        pool.push(...shuffled.slice(0, 15));
      }

      if (selectedSubjects.includes('Ingliz tili')) {
        const engQs = allQuestions.filter((q) => q.subject === 'Ingliz tili');
        const shuffled = [...engQs].sort(() => 0.5 - Math.random());
        pool.push(...shuffled.slice(0, 15));
      }

      if (pool.length === 0) {
        pool = allQuestions.slice(0, 20);
      }
    } else if (testMode === 'quick_10') {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      pool = shuffled.slice(0, 10);
    } else {
      // topic_drill
      const topicQs = allQuestions.filter((q) => q.topicId === selectedTopicId);
      const shuffled = [...topicQs].sort(() => 0.5 - Math.random());
      pool = shuffled.slice(0, Math.min(questionCount, topicQs.length));
      if (pool.length === 0) {
        pool = allQuestions.slice(0, 5);
      }
    }

    setActiveQuestions(pool);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimePerQuestion({});
    setTimeRemaining(timerMinutes * 60);
    setIsPaused(false);
    setSessionActive(true);
    setShowConfirmFinish(false);
    setActiveNavSubject('all');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    const qId = activeQuestions[currentIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [qId]: prev[qId] === opt ? null : opt,
    }));
  };

  const toggleFlag = () => {
    const qId = activeQuestions[currentIndex].id;
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleAutoSubmit = () => {
    setSessionActive(false);
    onFinishTest(answers, timePerQuestion, activeQuestions);
  };

  const handleManualSubmit = () => {
    setSessionActive(false);
    setShowConfirmFinish(false);
    onFinishTest(answers, timePerQuestion, activeQuestions);
  };

  // Format timer
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isUrgent = timeRemaining < 300; // <5 mins
  const isWarning = timeRemaining < 600 && !isUrgent; // <10 mins

  // Current question data
  const currentQ = activeQuestions[currentIndex];
  const currentTopic = currentQ ? CHSB_TOPICS.find((t) => t.id === currentQ.topicId) : null;
  const answeredCount = Object.values(answers).filter(Boolean).length;

  // Jump to first question of selected subject
  const jumpToSubject = (subj: SubjectType) => {
    const idx = activeQuestions.findIndex((q) => (q.subject || 'Matematika') === subj);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  // Calculate estimated total metrics for real CHSB
  const estimatedQuestionsCount = useMemo(() => {
    let count = 0;
    if (selectedSubjects.includes('Matematika')) count += 20;
    if (selectedSubjects.includes('Fizika')) count += 15;
    if (selectedSubjects.includes('Ingliz tili')) count += 15;
    return count;
  }, [selectedSubjects]);

  const estimatedMaxScore = useMemo(() => {
    let score = 0;
    if (selectedSubjects.includes('Matematika')) score += 80;
    if (selectedSubjects.includes('Fizika')) score += 29;
    if (selectedSubjects.includes('Ingliz tili')) score += 40;
    return score;
  }, [selectedSubjects]);

  // Distinct subjects present in active session
  const sessionSubjects = useMemo(() => {
    const set = new Set<SubjectType>();
    activeQuestions.forEach((q) => {
      set.add(q.subject || 'Matematika');
    });
    return Array.from(set);
  }, [activeQuestions]);

  if (!sessionActive) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              10-sinf CHSB-1 Rasmiy Standarti (Matematika • Fizika • Ingliz tili)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Haqiqiy CHSB Imtihon Trenajyori
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
              Qaysi fanlardan CHSB topshirishingizni tanlang. Haqiqiy vaqt hisobi, rasmiy savollar spetsifikatsiyasi va imtihondan so'ng to'liq tahliliy diagnostika orqali tayyorgarlik darajangizni oshiring.
            </p>

            {/* Mode Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Option 1: Multi-Subject Real CHSB */}
              <div
                onClick={() => {
                  setTestMode('real_chsb_multi');
                  let mins = 0;
                  if (selectedSubjects.includes('Matematika')) mins += 45;
                  if (selectedSubjects.includes('Fizika')) mins += 40;
                  if (selectedSubjects.includes('Ingliz tili')) mins += 45;
                  setTimerMinutes(mins || 130);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  testMode === 'real_chsb_multi'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-xl ring-2 ring-cyan-500/50'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Haqiqiy CHSB
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-200 font-semibold">
                    {estimatedQuestionsCount} Savol
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Fanlarni tanlang (Matematika, Fizika, Ingliz tili). To'liq rasmiy imtihon formati.
                </p>
                <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {timerMinutes} daqiqa
                </div>
              </div>

              {/* Option 2: Topic Drill */}
              <div
                onClick={() => {
                  setTestMode('topic_drill');
                  setTimerMinutes(25);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  testMode === 'topic_drill'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-xl ring-2 ring-cyan-500/50'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-purple-400" />
                    Mavzuli Trenajyor
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 font-semibold">
                    Fokus
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Aynan o'zingiz zaif bo'lgan bitta mavzuni tanlab, chuqurlashtirilgan mashq qiling.
                </p>
                <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 25 daqiqa
                </div>
              </div>

              {/* Option 3: Quick 10 */}
              <div
                onClick={() => {
                  setTestMode('quick_10');
                  setTimerMinutes(20);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  testMode === 'quick_10'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-xl ring-2 ring-cyan-500/50'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Tezkor 10-lik
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 font-semibold">
                    Ekspress
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Barcha fanlardan aralash 10 ta savol. Vaqtingiz oz bo'lganda ideal sinov.
                </p>
                <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 20 daqiqa
                </div>
              </div>
            </div>

            {/* Subject Selection Box (For Real CHSB Mode) */}
            {testMode === 'real_chsb_multi' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Qaysi fanlardan CHSB topshirasiz?
                  </div>
                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => applySubjectPreset('all')}
                      className="text-[11px] px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                    >
                      Barchasi (3 ta fan)
                    </button>
                    <button
                      onClick={() => applySubjectPreset('exact')}
                      className="text-[11px] px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Aniq fanlar (Matem + Fizika)
                    </button>
                    <button
                      onClick={() => applySubjectPreset('math')}
                      className="text-[11px] px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Faqat Matematika
                    </button>
                  </div>
                </div>

                {/* Subject Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {AVAILABLE_SUBJECTS.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj.id);
                    return (
                      <div
                        key={subj.id}
                        onClick={() => toggleSubject(subj.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="font-bold text-sm block text-slate-100">{subj.title}</span>
                            <span className="text-[11px] text-cyan-400 font-medium">
                              {subj.defaultQuestions} ta savol • {subj.maxScore} ball
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                              isSelected ? 'bg-cyan-500 text-white' : 'border border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {subj.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Summary calculation pills */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Tanlangan fanlar:</span>
                    <div className="flex items-center gap-1">
                      {selectedSubjects.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <span>Jami savollar: <strong className="text-white font-bold">{estimatedQuestionsCount} ta</strong></span>
                    <span>Tavsiya etilgan vaqt: <strong className="text-cyan-400 font-bold">{timerMinutes} daqiqa</strong></span>
                    <span>Maksimal ball: <strong className="text-emerald-400 font-bold">{estimatedMaxScore} ball</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Fine Tuning Settings for Topic Drill */}
            {testMode === 'topic_drill' && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 mb-6">
                <div className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  Mavzuli mashq parametrlarini sozlash
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Qaysi mavzuni mustahkamlaysiz?
                    </label>
                    <select
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {CHSB_TOPICS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.subject ? `[${t.subject}] ` : ''}{t.id}-mavzu: {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Savollar soni
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value={5}>5 ta savol (15 daqiqa)</option>
                      <option value={10}>10 ta savol (25 daqiqa)</option>
                      <option value={15}>15 ta savol (40 daqiqa)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Launch Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Savollar bazasi: <span className="text-cyan-400 font-bold">{allQuestions.length} ta</span> topshiriq tayyor (Kimyo chiqarilgan)
              </div>
              <button
                onClick={startTest}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-base transition-all transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                Imtihonni boshlash ({testMode === 'real_chsb_multi' ? `${estimatedQuestionsCount} ta savol, ${timerMinutes} daqiqa` : testMode === 'quick_10' ? '10 ta savol' : `${questionCount} ta savol`})
              </button>
            </div>
          </div>
        </div>

        {/* Topics Overview Grid */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            CHSB-1 Dasturidagi Asosiy Fanlar va Mavzular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHSB_TOPICS.map((topic) => {
              const qCount = allQuestions.filter((q) => q.topicId === topic.id).length;
              const subjColor = topic.subject === 'Fizika' 
                ? 'bg-amber-900/40 text-amber-300 border-amber-800/60' 
                : topic.subject === 'Ingliz tili'
                ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/60'
                : 'bg-blue-900/40 text-blue-300 border-blue-800/60';

              return (
                <div
                  key={topic.id}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {topic.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-200 truncate">{topic.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${subjColor}`}>
                        {topic.subject || 'Matematika'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{topic.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setTestMode('topic_drill');
                      startTest();
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition shrink-0"
                  >
                    Mashq
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active Session View
  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-6">
      {/* HUD Header Bar */}
      <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:p-4 mb-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Progress & Subject Section Filter Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-slate-300">
              Savol: <span className="text-cyan-400 text-base">{currentIndex + 1}</span> / {activeQuestions.length}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{answeredCount} ta belgilandi</span>
            </div>

            {/* Subject Section Switcher */}
            {sessionSubjects.length > 1 && (
              <div className="flex items-center gap-1 ml-2">
                {sessionSubjects.map((subj) => {
                  const isCurrentSubj = (currentQ?.subject || 'Matematika') === subj;
                  return (
                    <button
                      key={subj}
                      onClick={() => jumpToSubject(subj)}
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition ${
                        isCurrentSubj
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Countdown Timer & Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono font-bold text-base sm:text-lg border ${
              isUrgent
                ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-pulse'
                : isWarning
                ? 'bg-amber-950/60 border-amber-500 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-cyan-300'
            }`}>
              <Clock className="w-4 h-4 sm:w-5 h-5" />
              <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
            </div>

            {/* Action Tools */}
            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition ${
                showScratchpad ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Qoralama / Hisob-kitob daftari"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden md:inline">Qoralama</span>
            </button>

            <button
              onClick={() => setShowFormulaDrawer(!showFormulaDrawer)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition ${
                showFormulaDrawer ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Mavzuga oid formulalar"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Formula</span>
            </button>

            {/* Finish Button */}
            <button
              onClick={() => setShowConfirmFinish(true)}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
            >
              Yakunlash
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Card (Cols 1-3) */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl relative">
            {/* Topic & Metadata pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  (currentQ.subject || 'Matematika') === 'Fizika'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : (currentQ.subject || 'Matematika') === 'Ingliz tili'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-blue-950 text-blue-300 border-blue-800'
                }`}>
                  {currentQ.subject || 'Matematika'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  {currentQ.topicTitle}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">
                  {currentQ.category}
                </span>
                <span className="text-xs text-slate-500">
                  {currentQ.source || 'CHSB-1 Rasmiy'}
                </span>
              </div>

              {/* Flag button */}
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition ${
                  flagged[currentQ.id]
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current' : ''}`} />
                <span>{flagged[currentQ.id] ? 'Belgilangan' : 'Eslab qolish'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line">
                <FormattedMathText text={currentQ.questionText} />
              </p>
            </div>

            {/* Math Expression Banner rendered like in the PDF (KaTeX / no carets) */}
            {currentQ.expression && (
              <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 my-4 text-cyan-200 text-center shadow-inner overflow-x-auto">
                <MathView math={currentQ.expression} block={true} className="text-lg sm:text-2xl font-serif text-cyan-300 tracking-wide" />
              </div>
            )}

            {/* Diagram (Graph, Vectors, Shapes) */}
            {currentQ.diagramType && (
              <DiagramRenderer
                type={currentQ.diagramType}
                points={currentQ.graphPoints}
              />
            )}

            {/* Answer Options A, B, C, D */}
            <div className="space-y-3 mt-6">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const optText = currentQ.options[optKey];
                const isSelected = answers[currentQ.id] === optKey;
                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-600/20 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-600/10'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700/80 text-slate-300'
                    }`}>
                      {optKey}
                    </span>
                    <span className="text-sm sm:text-base pt-0.5 break-words flex-1 font-serif sm:font-sans">
                      <FormattedMathText text={optText} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Oldingisi
              </button>

              <span className="text-xs text-slate-500 hidden sm:inline">
                Tanlash: [A, B, C, D]
              </span>

              {currentIndex < activeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition shadow-md shadow-cyan-600/20"
                >
                  Keyingisi <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmFinish(true)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition shadow-lg shadow-emerald-600/25"
                >
                  <CheckCircle2 className="w-4 h-4" /> Natijani ko'rish
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Navigator & Scratchpad & Formula drawer (Col 4) */}
        <div className="space-y-4">
          {/* Question Grid Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Savollar xaritasi
              </h3>
              <span className="text-xs font-semibold text-cyan-400">
                {answeredCount}/{activeQuestions.length}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
              {activeQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
                const isFlag = flagged[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-cyan-400 bg-cyan-950 text-cyan-200'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                    {isFlag && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> Belgilangan
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-800" /> Kutilmoqda
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Eslatma
              </div>
            </div>
          </div>

          {/* Quick Scratchpad */}
          {showScratchpad && (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" /> Qoralama / Hisob-kitob
                </span>
                <button
                  onClick={() => setScratchNotes('')}
                  className="text-slate-400 hover:text-rose-400 text-[10px]"
                >
                  Tozalash
                </button>
              </div>
              <textarea
                value={scratchNotes}
                onChange={(e) => setScratchNotes(e.target.value)}
                placeholder="Oraliq hisoblashlar yoki formulalarni bu yerda yozib boring..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>
          )}

          {/* Formula helper drawer */}
          {showFormulaDrawer && currentTopic && (
            <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {currentTopic.title}
                </span>
                <button
                  onClick={() => setShowFormulaDrawer(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                {currentTopic.keyFormulas.map((form, fIdx) => (
                  <div key={fIdx} className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[11px] text-purple-200">
                    <MathView math={form} block={false} />
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 italic pt-1">
                  💡 {currentTopic.tips}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Testni yakunlaysizmi?
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Jami <span className="font-bold text-cyan-400">{activeQuestions.length} ta</span> topshiriqdan{' '}
              <span className="font-bold text-emerald-400">{answeredCount} tasi</span> belgilandi.{' '}
              {activeQuestions.length - answeredCount > 0 && (
                <span className="text-amber-400 font-semibold block mt-1">
                  Diqqat: {activeQuestions.length - answeredCount} ta savol hali javobsiz qoldi!
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition"
              >
                Davom etish
              </button>
              <button
                onClick={handleManualSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg transition"
              >
                Ha, yakunlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
