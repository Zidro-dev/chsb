import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTestSession, formatDuration, Question } from './testLogic.ts';

const mockQuestions: Question[] = [
  {
    id: 'm1',
    subject: 'Matematika',
    topicId: 1,
    topicTitle: 'Ko\'phad darajasi',
    category: 'Algebra',
    difficulty: 'demo_easy',
    questionText: 'P(x) darajasini toping',
    options: { A: '1', B: '2', C: '3', D: '4' },
    correctAnswer: 'B',
    explanation: 'Eng katta daraja 2',
  },
  {
    id: 'f1',
    subject: 'Fizika',
    topicId: 1,
    topicTitle: 'Kinematika',
    category: 'Kinematika',
    difficulty: 'demo_easy',
    questionText: 'Qaysi kattalik vektor?',
    options: { A: 'Vaqt', B: 'Ko\'chish', C: 'Massa', D: 'Yo\'l' },
    correctAnswer: 'B',
    explanation: 'Ko\'chish vektor kattalik',
  },
  {
    id: 'e1',
    subject: 'Ingliz tili',
    topicId: 1,
    topicTitle: 'Vocabulary',
    category: 'Vocabulary',
    difficulty: 'demo_easy',
    questionText: 'If a shop gives 10% off, you receive a...',
    options: { A: 'receipt', B: 'discount', C: 'refund', D: 'bill' },
    correctAnswer: 'B',
    explanation: '10% off is a discount',
  },
];

test('evaluateTestSession calculates multi-subject stats correctly', () => {
  const answers: Record<string, 'A' | 'B' | 'C' | 'D' | null> = {
    m1: 'B', // Math: correct
    f1: 'A', // Physics: wrong
    e1: 'B', // English: correct
  };
  const timePerQuestion = {
    m1: 30,
    f1: 45,
    e1: 20,
  };

  const summary = evaluateTestSession(answers, timePerQuestion, mockQuestions);

  assert.equal(summary.totalQuestions, 3);
  assert.equal(summary.correctCount, 2);
  assert.equal(summary.incorrectCount, 1);
  assert.equal(summary.scorePercentage, 67);

  // Subject Stats
  assert.equal(summary.subjectStats.length, 3);
  const mathStat = summary.subjectStats.find((s) => s.subject === 'Matematika');
  assert.ok(mathStat);
  assert.equal(mathStat.percentage, 100);

  const physStat = summary.subjectStats.find((s) => s.subject === 'Fizika');
  assert.ok(physStat);
  assert.equal(physStat.percentage, 0);

  const engStat = summary.subjectStats.find((s) => s.subject === 'Ingliz tili');
  assert.ok(engStat);
  assert.equal(engStat.percentage, 100);
});

test('formatDuration formats time cleanly', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(3665), '1:01:05');
});
