export type SubjectType = 'Matematika' | 'Fizika' | 'Ingliz tili';

export interface Question {
  id: string;
  subject?: SubjectType;
  topicId: number;
  topicTitle: string;
  category: string;
  difficulty: 'demo_easy' | 'medium' | 'hard';
  questionText: string;
  expression?: string;
  matchingItems?: { label: string; text: string }[];
  matchingChoices?: { label: string; text: string }[];
  tableData?: { headers: string[]; rows: string[][] };
  graphPoints?: { x: number; y: number }[];
  diagramType?: 'graph' | 'cylinder' | 'tetrahedron' | 'box_unfolding' | 'sphere' | 'table' | 'vector' | 'inclined';
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  source?: string;
  isCustom?: boolean;
}

export interface UserAnswerRecord {
  questionId: string;
  subject: SubjectType;
  topicId: number;
  category: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface SubjectStat {
  subject: SubjectType;
  total: number;
  correct: number;
  percentage: number;
  timeSpentSeconds: number;
}

export interface TestResultSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  scorePercentage: number;
  totalTimeSeconds: number;
  gradeLabel: 'A\'lo' | 'Yaxshi' | 'Qoniqarli' | 'Qayta tayyorlanish kerak';
  subjectStats: SubjectStat[];
  categoryStats: {
    category: string;
    total: number;
    correct: number;
    percentage: number;
  }[];
  topicStats: {
    topicId: number;
    topicTitle: string;
    subject: SubjectType;
    category: string;
    total: number;
    correct: number;
    percentage: number;
    needsReview: boolean;
  }[];
  criticalWeaknesses: string[];
  recommendedTopicsForRevision: number[];
}

/**
 * Calculates complete test diagnostic summary from user answers and question metadata
 */
export function evaluateTestSession(
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>,
  timePerQuestion: Record<string, number>,
  questions: Question[]
): TestResultSummary {
  const records: UserAnswerRecord[] = questions.map((q) => {
    const selected = answers[q.id] || null;
    const isCorrect = selected === q.correctAnswer;
    const timeSpent = timePerQuestion[q.id] || 0;
    const subj: SubjectType = q.subject || 'Matematika';
    return {
      questionId: q.id,
      subject: subj,
      topicId: q.topicId,
      category: q.category,
      selectedOption: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      timeSpentSeconds: timeSpent,
    };
  });

  const totalQuestions = questions.length;
  const correctCount = records.filter((r) => r.isCorrect).length;
  const unansweredCount = records.filter((r) => r.selectedOption === null).length;
  const incorrectCount = totalQuestions - correctCount - unansweredCount;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const totalTimeSeconds = Object.values(timePerQuestion).reduce((acc, v) => acc + (v || 0), 0);

  let gradeLabel: TestResultSummary['gradeLabel'] = 'Qayta tayyorlanish kerak';
  if (scorePercentage >= 86) gradeLabel = 'A\'lo';
  else if (scorePercentage >= 71) gradeLabel = 'Yaxshi';
  else if (scorePercentage >= 56) gradeLabel = 'Qoniqarli';

  // Subject stats
  const subjects: SubjectType[] = ['Matematika', 'Fizika', 'Ingliz tili'];
  const subjectStats: SubjectStat[] = subjects.map((subj) => {
    const subjRecords = records.filter((r) => r.subject === subj);
    const total = subjRecords.length;
    const correct = subjRecords.filter((r) => r.isCorrect).length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpentSeconds = subjRecords.reduce((acc, r) => acc + r.timeSpentSeconds, 0);
    return {
      subject: subj,
      total,
      correct,
      percentage,
      timeSpentSeconds,
    };
  }).filter((s) => s.total > 0);

  // Category stats
  const categoryMap = new Map<string, { total: number; correct: number }>();
  for (const r of records) {
    if (!categoryMap.has(r.category)) {
      categoryMap.set(r.category, { total: 0, correct: 0 });
    }
    const c = categoryMap.get(r.category)!;
    c.total += 1;
    if (r.isCorrect) c.correct += 1;
  }
  const categoryStats = Array.from(categoryMap.entries()).map(([category, c]) => ({
    category,
    total: c.total,
    correct: c.correct,
    percentage: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
  }));

  // Topic stats
  const topicMap = new Map<string, {
    topicId: number;
    title: string;
    subject: SubjectType;
    category: string;
    total: number;
    correct: number;
  }>();

  for (const q of questions) {
    const key = `${q.subject || 'Matematika'}_${q.topicId}`;
    if (!topicMap.has(key)) {
      topicMap.set(key, {
        topicId: q.topicId,
        title: q.topicTitle,
        subject: q.subject || 'Matematika',
        category: q.category,
        total: 0,
        correct: 0,
      });
    }
  }

  for (const r of records) {
    const key = `${r.subject}_${r.topicId}`;
    const item = topicMap.get(key);
    if (item) {
      item.total += 1;
      if (r.isCorrect) item.correct += 1;
    }
  }

  const topicStats = Array.from(topicMap.values()).map((item) => {
    const percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    const needsReview = percentage < 70;
    return {
      topicId: item.topicId,
      topicTitle: item.title,
      subject: item.subject,
      category: item.category,
      total: item.total,
      correct: item.correct,
      percentage,
      needsReview,
    };
  }).sort((a, b) => a.percentage - b.percentage);

  const criticalWeaknesses: string[] = topicStats
    .filter((t) => t.percentage <= 50)
    .map((t) => `[${t.subject}] ${t.topicTitle} (${t.percentage}% natija)`);

  const recommendedTopicsForRevision = topicStats
    .filter((t) => t.needsReview)
    .map((t) => t.topicId);

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    scorePercentage,
    totalTimeSeconds,
    gradeLabel,
    subjectStats,
    categoryStats,
    topicStats,
    criticalWeaknesses,
    recommendedTopicsForRevision,
  };
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates an automated 7-day personalized study schedule based on weak topics
 */
export function generateSmartStudySchedule(weakTopics: { topicId: number; topicTitle: string; category?: string; subject?: SubjectType }[]): {
  day: number;
  title: string;
  description: string;
  focus: string;
  topicId?: number;
  subject?: SubjectType;
}[] {
  if (weakTopics.length === 0) {
    return [
      { day: 1, title: 'Umumiy mustahkamlash', description: 'Barcha fanlardan aralash test yechish va vaqtni tejash strategiyasi.', focus: 'Aralash testlar', topicId: 1, subject: 'Matematika' },
      { day: 2, title: 'Fizika va Geometriya formulalari', description: 'Kinematika va fazoviy geometriya formulalarini takrorlash.', focus: 'Formulalar', topicId: 1, subject: 'Fizika' },
      { day: 3, title: 'Ingliz tili grammatikasi', description: 'Gerund, Infinitive va zamonlar mosligini qayta ko\'rib chiqish.', focus: 'Grammar review', topicId: 5, subject: 'Ingliz tili' },
    ];
  }

  const days = [
    'Dushanba: Asosiy qoidalar va formulalar',
    'Seshanba: O\'rta darajadagi test savollari',
    'Chorshanba: Murakkabroq masalalar va matnlar',
    'Payshanba: Xatolar ustida mustaqil ishlash',
    'Juma: Tezkor hisob-kitob va vaqt nazorati',
    'Shanba: To\'liq CHSB sinov nazorati',
    'Yakshanba: Xulosalar va yakuniy tayyorgarlik',
  ];

  return days.slice(0, Math.max(3, Math.min(7, weakTopics.length + 2))).map((dayTitle, index) => {
    const assignedTopic = weakTopics[index % weakTopics.length];
    return {
      day: index + 1,
      title: dayTitle,
      topicId: assignedTopic.topicId,
      subject: assignedTopic.subject || 'Matematika',
      focus: `[${assignedTopic.subject || 'Fan'}] ${assignedTopic.topicTitle}`,
      description: `${assignedTopic.topicTitle} bo'yicha asosiy tushunchalarni takrorlash va 5 ta yangi misol yechish.`,
    };
  });
}
