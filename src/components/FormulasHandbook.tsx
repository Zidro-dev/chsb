import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  ChevronRight, 
  Lightbulb, 
  Play, 
  Layers,
  Sparkles 
} from 'lucide-react';
import { CHSB_TOPICS, TopicInfo } from '../data/chsbData.ts';
import { MathView } from './MathView.tsx';

interface FormulasHandbookProps {
  onPracticeTopic: (topicId: number) => void;
}

export const FormulasHandbook: React.FC<FormulasHandbookProps> = ({ onPracticeTopic }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTopicId, setActiveTopicId] = useState<number>(1);

  const filteredTopics = CHSB_TOPICS.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.keyFormulas.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeTopic = CHSB_TOPICS.find((t) => t.id === activeTopicId) || CHSB_TOPICS[0];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 mb-2">
          <BookOpenCheck className="w-3.5 h-3.5" />
          CHSB-1 Matematika Spravochnigi
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          20 Ta Asosiy Mavzu Nazariyasi va Formulalar
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Ko'phadlar algebrasi, Gorner sxemasi, ratsional ildizlar teoremasi, murakkab funksiyalar va barcha stereometriya (tetraedr, aylanma jismlar, yoyilmalar) qoidalari bitta joyda.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Formula yoki tushuncha qidirish (masalan: R^2 - r^2, Bezu, tetraedr, kabel uzunligi)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'Algebra', 'Funksiyalar', 'Geometriya'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Barcha fanlar' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Topic List + Active Topic Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Topic Selector List (Col 1) */}
        <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => {
            const isActive = topic.id === activeTopicId;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg ring-1 ring-cyan-500/50'
                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400">
                    {topic.id}-mavzu
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    topic.category === 'Algebra' ? 'bg-blue-900/60 text-blue-300' : topic.category === 'Geometriya' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-purple-900/60 text-purple-300'
                  }`}>
                    {topic.category}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 truncate">
                  {topic.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Topic View (Col 2-3) */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 block mb-1">
                  {activeTopic.id}-MAVZU SPRAVOCHNIGI ({activeTopic.demoType})
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeTopic.title}
                </h2>
              </div>

              <button
                onClick={() => onPracticeTopic(activeTopic.id)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Shu mavzuni yechish
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mavzu mohiyati va tavsifi
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {activeTopic.description}
              </p>
            </div>

            {/* Key Formulas */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Asosiy formulalar va teoremalar
              </h4>
              <div className="space-y-2">
                {activeTopic.keyFormulas.map((formula, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-cyan-900/50 rounded-xl text-cyan-200 text-sm sm:text-base flex items-center gap-2"
                  >
                    <span className="text-cyan-500 font-bold shrink-0">✓</span>
                    <MathView math={formula} block={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Important Tip */}
            <div className="p-4 bg-amber-950/20 border border-amber-800/50 rounded-2xl">
              <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> CHSB-1 Imtihon Tavsiyasi:
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {activeTopic.tips}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
