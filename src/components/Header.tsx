import React from 'react';
import { 
  GraduationCap, 
  Timer, 
  Database, 
  Sparkles, 
  BarChart3, 
  CalendarDays, 
  BookOpenCheck 
} from 'lucide-react';

export type ActiveTab = 'exam' | 'bank' | 'generator' | 'analytics' | 'study_plan' | 'formulas';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  examInProgress: boolean;
  totalSavedQuestions: number;
  testHistoryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  examInProgress,
  totalSavedQuestions,
  testHistoryCount,
}) => {
  const navItems = [
    { id: 'exam' as ActiveTab, label: 'Trenajyor & Imtihon', icon: Timer, badge: examInProgress ? 'FAOL' : undefined },
    { id: 'bank' as ActiveTab, label: 'Savollar Bazasi', icon: Database, count: totalSavedQuestions },
    { id: 'generator' as ActiveTab, label: 'AI Generator', icon: Sparkles, highlight: true },
    { id: 'analytics' as ActiveTab, label: 'Natijalar & Tahlil', icon: BarChart3, count: testHistoryCount || undefined },
    { id: 'study_plan' as ActiveTab, label: 'Takrorlash Rejasi', icon: CalendarDays },
    { id: 'formulas' as ActiveTab, label: 'Spravochnik', icon: BookOpenCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subject Info */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('exam')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  CHSB-1 Milliy Platforma
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  10-sinf
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Matematika • Fizika • Ingliz tili | Haqiqiy CHSB Imtihon Trenajyori
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-rose-500 text-white rounded-full font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.badge && (
                    <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-cyan-700 text-cyan-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
