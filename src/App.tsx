/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header.tsx';
import { TestRunner } from './components/TestRunner.tsx';
import { ResultAnalytics } from './components/ResultAnalytics.tsx';
import { StudyPlanView } from './components/StudyPlanView.tsx';
import { QuestionBank } from './components/QuestionBank.tsx';
import { AIGeneratorView } from './components/AIGeneratorView.tsx';
import { FormulasHandbook } from './components/FormulasHandbook.tsx';
import { CHSB_QUESTIONS } from './data/chsbData.ts';
import { Question, TestResultSummary, evaluateTestSession } from './utils/testLogic.ts';

const STORAGE_KEY_CUSTOM_QUESTIONS = 'chsb10_custom_questions_v1';
const STORAGE_KEY_TEST_HISTORY = 'chsb10_test_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('exam');
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS);
      if (saved) {
        const parsed: Question[] = JSON.parse(saved);
        return [...CHSB_QUESTIONS, ...parsed];
      }
    } catch (e) {
      console.error('Error loading custom questions:', e);
    }
    return CHSB_QUESTIONS;
  });

  // Latest test session results
  const [lastSummary, setLastSummary] = useState<TestResultSummary | null>(() => {
    // Generate an initial diagnostic demo summary so analytics and study plan are immediately populated and interactive
    const initialAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | null> = {};
    const initialTime: Record<string, number> = {};
    const sample = CHSB_QUESTIONS.slice(0, 15);
    sample.forEach((q, idx) => {
      // simulate 10 correct, 5 wrong
      initialAnswers[q.id] = idx % 3 === 0 ? 'D' : q.correctAnswer;
      initialTime[q.id] = 45 + (idx * 5);
    });
    return evaluateTestSession(initialAnswers, initialTime, sample);
  });

  const [lastAnswers, setLastAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [lastTimePerQuestion, setLastTimePerQuestion] = useState<Record<string, number>>({});
  const [lastExamQuestions, setLastExamQuestions] = useState<Question[]>(CHSB_QUESTIONS.slice(0, 15));

  const [presetTopicId, setPresetTopicId] = useState<number | null>(null);
  const [generatorTopicId, setGeneratorTopicId] = useState<number>(1);
  const [testHistory, setTestHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEST_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading test history:', e);
    }
    return [];
  });

  // Handle test completion
  const handleFinishTest = (
    answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>,
    timePerQuestion: Record<string, number>,
    questions: Question[]
  ) => {
    const summary = evaluateTestSession(answers, timePerQuestion, questions);
    setLastSummary(summary);
    setLastAnswers(answers);
    setLastTimePerQuestion(timePerQuestion);
    setLastExamQuestions(questions);

    // Save to history
    const historyItem = {
      date: new Date().toISOString(),
      scorePercentage: summary.scorePercentage,
      correctCount: summary.correctCount,
      totalQuestions: summary.totalQuestions,
      gradeLabel: summary.gradeLabel,
      totalTimeSeconds: summary.totalTimeSeconds,
    };
    const updatedHistory = [historyItem, ...testHistory].slice(0, 20);
    setTestHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY_TEST_HISTORY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Error saving history:', e);
    }

    // Switch to analytics tab to show diagnostic results
    setActiveTab('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add question to bank
  const handleAddQuestionToBank = (q: Question) => {
    setAllQuestions((prev) => {
      const exists = prev.some((item) => item.id === q.id);
      if (exists) return prev;
      const updated = [q, ...prev];
      try {
        const customOnly = updated.filter((item) => item.isCustom);
        localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(customOnly));
      } catch (e) {
        console.error('Error storing custom question:', e);
      }
      return updated;
    });
  };

  const handlePracticeTopic = (topicId: number) => {
    setPresetTopicId(topicId);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeQuestionNow = (q: Question) => {
    handleAddQuestionToBank(q);
    setPresetTopicId(q.topicId);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToGenerator = (topicId?: number) => {
    if (topicId) setGeneratorTopicId(topicId);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        examInProgress={false}
        totalSavedQuestions={allQuestions.length}
        testHistoryCount={testHistory.length}
      />

      {/* Main Container Views */}
      <main className="flex-1 pb-16">
        {activeTab === 'exam' && (
          <TestRunner
            allQuestions={allQuestions}
            onFinishTest={handleFinishTest}
            presetTopicId={presetTopicId}
            onClearPresetTopic={() => setPresetTopicId(null)}
          />
        )}

        {activeTab === 'analytics' && lastSummary && (
          <ResultAnalytics
            summary={lastSummary}
            questions={lastExamQuestions}
            userAnswers={lastAnswers}
            timePerQuestion={lastTimePerQuestion}
            onGoToStudyPlan={() => setActiveTab('study_plan')}
            onRetakeExam={() => setActiveTab('exam')}
            onPracticeTopic={handlePracticeTopic}
          />
        )}

        {activeTab === 'study_plan' && (
          <StudyPlanView
            lastSummary={lastSummary}
            onPracticeTopic={handlePracticeTopic}
            onGoToBank={(topicId) => {
              if (topicId) setPresetTopicId(topicId);
              setActiveTab('bank');
            }}
          />
        )}

        {activeTab === 'bank' && (
          <QuestionBank
            questions={allQuestions}
            onPracticeTopic={handlePracticeTopic}
            onGoToGenerator={handleGoToGenerator}
          />
        )}

        {activeTab === 'generator' && (
          <AIGeneratorView
            onAddQuestionToBank={handleAddQuestionToBank}
            onPracticeQuestionNow={handlePracticeQuestionNow}
            initialTopicId={generatorTopicId}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulasHandbook onPracticeTopic={handlePracticeTopic} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            10-SINF CHSB-1 ALGEBRA VA GEOMETRIYA • O'zbekiston Respublikasi Xalq ta'limi standarti
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>20 ta Rasmiy Mavzu</span>
            <span>•</span>
            <span>Real Taymer</span>
            <span>•</span>
            <span>AI Xatolar Diagnostikasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
