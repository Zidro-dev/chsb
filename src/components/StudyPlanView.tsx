import React, { useState } from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  AlertCircle, 
  RefreshCw,
  Printer,
  ChevronRight,
  Flame,
  FileCheck
} from 'lucide-react';
import { TestResultSummary, generateSmartStudySchedule } from '../utils/testLogic.ts';
import { CHSB_TOPICS } from '../data/chsbData.ts';

interface StudyPlanViewProps {
  lastSummary: TestResultSummary | null;
  onPracticeTopic: (topicId: number) => void;
  onGoToBank: (topicId?: number) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  lastSummary,
  onPracticeTopic,
  onGoToBank,
}) => {
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiCustomPlan, setAiCustomPlan] = useState<any | null>(null);

  // Derive initial plan
  const weakTopics = lastSummary
    ? lastSummary.topicStats
        .filter((t) => t.needsReview)
        .map((t) => ({
          topicId: t.topicId,
          topicTitle: t.topicTitle,
          category: t.category,
        }))
    : [];

  const defaultSchedule = generateSmartStudySchedule(weakTopics);

  const toggleDayCompletion = (dayNum: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const handleGenerateAIPlan = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: lastSummary || {
            totalQuestions: 20,
            correctCount: 12,
            incorrectCount: 8,
            scorePercentage: 60,
            gradeLabel: 'Qoniqarli',
            totalTimeSeconds: 3200,
            criticalWeaknesses: [
              "5-mavzu: Gorner sxemasi",
              "15-mavzu: Muntazam tetraedr",
              "17-mavzu: Silindr o'qidan kesmagacha eng qisqa masofa"
            ],
            topicStats: [
              { topicId: 5, topicTitle: "Gorner sxemasi", percentage: 30, needsReview: true },
              { topicId: 15, topicTitle: "Muntazam tetraedr", percentage: 40, needsReview: true },
              { topicId: 17, topicTitle: "Silindr o'qidan kesmagacha masofa", percentage: 50, needsReview: true }
            ]
          },
        }),
      });
      const data = await res.json();
      if (data.plan) {
        setAiCustomPlan(data.plan);
      }
    } catch (e) {
      console.error('Failed to generate AI plan:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const activePlan = aiCustomPlan || {
    diagnosis: weakTopics.length > 0
      ? `Oxirgi test natijalariga ko'ra, sizda asosan ${weakTopics.map(w => `${w.topicId}-mavzu (${w.topicTitle})`).slice(0, 3).join(', ')} bo'yicha xatolar ko'p uchragan. Ushbu mavzularda formulalarni eslash va ifodalarni bosqichma-bosqich soddalashtirishga urg'u berish lozim.`
      : "Hozircha test topshirilmagan yoki barcha mavzular yaxshi o'zlashtirilgan. Quyida 10-sinf CHSB-1 bo'yicha to'liq 7 kunlik namunaviy tayyorgarlik rejasi keltirilgan.",
    tips: [
      "Gorner sxemasida manfiy sonlarga ko'paytirishda ishoralarni alohida tekshiring.",
      "Stereometriya masalalarida (tetraedr, silindr, aylanma jism) yon sirt va to'la sirt formulalarini chalkashtirmang.",
      "Funksiyalar grafigida eng katta/kichik qiymatni topishda berilgan oraliq [0; 9] dagi barcha butun argumentlarni sanab chiqing.",
      "Haqiqiy ildizlar yig'indisi so'ralganda kompleks ildizlarni (D < 0) yig'indiga qo'shmang."
    ],
    schedule: defaultSchedule.map((s, idx) => {
      const topicInfo = s.topicId ? CHSB_TOPICS.find(t => t.id === s.topicId) : null;
      return {
        day: s.day,
        title: s.title,
        focus: s.focus,
        keyFormula: topicInfo ? topicInfo.keyFormulas[0] : 'Asosiy nazariy formulalar',
        task: s.description,
        topicId: s.topicId,
      };
    }),
  };

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const totalDays = activePlan.schedule?.length || 7;
  const planProgress = Math.round((completedCount / totalDays) * 100);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Shaxsiy Pedagogik Diagnostika va Takrorlash Rejasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Moslashtirilgan Takrorlash Rejasi
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Xatolaringiz chuqur tahlil qilinib, aynan siz zaif bo'lgan misol turlarini bartaraf etishga qaratilgan 7 kunlik o'quv yo'l xaritasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleGenerateAIPlan}
              disabled={isGeneratingAI}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI Reja tuzmoqda...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  AI bilan qayta yangilash
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Chop etish
            </button>
          </div>
        </div>

        {/* Plan Progress Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-900/40">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Reja bajarilishi: <strong className="text-cyan-400">{completedCount} / {totalDays} kun</strong></span>
            <span className="font-mono text-cyan-300 font-bold">{planProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${planProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Diagnosis & Teacher Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Diagnosis Box */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            Xatolar tahlili va sabablari
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {activePlan.diagnosis}
          </p>
        </div>

        {/* Tips Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            Imtihon sirlari
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {activePlan.tips?.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7-Day Interactive Schedule */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-cyan-400" />
          7 Kunlik Rejali Dastur
        </h2>

        <div className="space-y-4">
          {activePlan.schedule?.map((item: any) => {
            const isDone = completedDays[item.day];
            return (
              <div
                key={item.day}
                className={`border rounded-2xl p-4 sm:p-5 transition-all ${
                  isDone
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleDayCompletion(item.day)}
                      className="mt-0.5 text-slate-400 hover:text-cyan-400 transition shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {item.day}-kun
                        </span>
                        <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-cyan-300 font-medium mt-1">
                        🎯 Fokus mavzu: {item.focus}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {item.task}
                      </p>

                      {item.keyFormula && (
                        <div className="mt-2.5 inline-block bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-purple-300">
                          📐 {item.keyFormula}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Practice CTA */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        if (item.topicId) {
                          onPracticeTopic(item.topicId);
                        } else {
                          onPracticeTopic(1);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
                    >
                      <Flame className="w-3.5 h-3.5" /> Mashq qilish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
