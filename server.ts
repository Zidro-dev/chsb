import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry User-Agent
const rawApiKey = process.env.GEMINI_API_KEY || '';
const apiKey = rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' ? rawApiKey : '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Timeout helper to keep UI responsive
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

/**
 * 20 Topics metadata for fallback generation and grounding
 */
const TOPIC_SPECS: Record<number, { title: string; category: string; description: string }> = {
  1: { title: "Ko'phadning darajasi va bosh koeffitsiyenti", category: "Algebra", description: "Ko'phadlarni soddalashtirish, eng katta darajali hadni aniqlash va bosh koeffitsiyentini topish" },
  2: { title: "Ko'phadlar va ularning xossalari (Ozod had, qoldiq, daraja)", category: "Algebra", description: "P(0) ozod had, Bezu teoremasi, qoldiq topish, moslashtirish" },
  3: { title: "Ko'phadning karrali ildizlari", category: "Algebra", description: "Ko'paytuvchilarga ajratish, karrali ildizlarni aniqlash" },
  4: { title: "Yevklid algoritmi va ko'phadlarning EKUBi", category: "Algebra", description: "Ko'phadlarni burchakli bo'lish, eng katta umumiy bo'luvchi (EKUB)" },
  5: { title: "Gorner sxemasi", category: "Algebra", description: "Gorner jadvalini to'ldirish, bo'linma va qoldiqni aniqlash" },
  6: { title: "Ratsional ildizlar haqidagi teorema", category: "Algebra", description: "p/q ko'rinishidagi ratsional ildizlarni topish va tekshirish" },
  7: { title: "Haqiqiy ildizlar yig'indisi", category: "Algebra", description: "To'rtinchi darajali yoki kvadratga keltiriladigan tenglamalarning faqat haqiqiy ildizlari yig'indisi" },
  8: { title: "Bir tenglamaning ildizlari ikkinchisining ham ildizlari", category: "Algebra", description: "Kvadrat tenglama kub tenglamaning bo'luvchisi bo'lish sharti va parametrlar" },
  9: { title: "Haqiqiy ildizlar ko'paytmasi", category: "Algebra", description: "Simmetrik va almashtirish kiritiladigan 4- va 6-darajali tenglamalar haqiqiy ildizlari ko'paytmasi" },
  10: { title: "Funksiyaning qiymatlar sohasi", category: "Funksiyalar", description: "Kasr-ratsional, kvadrat ildizli funksiyalarning E(y) qiymatlar to'plamini topish" },
  11: { title: "Funksiya grafigi va ekstremal qiymatlar", category: "Funksiyalar", description: "[0;9] oraliqda berilgan siniq chiziqli grafik asosida algebraik ifodalarni maksimallashtirish/minimallashtirish" },
  12: { title: "Murakkab va teskari funksiyalar", category: "Funksiyalar", description: "y = f(g(kx+b)) grafigi va f^-1, g^-1 teskari funksiya qiymatlarini topish" },
  13: { title: "Kub, parallelepiped, prizma va piramida", category: "Geometriya", description: "To'rtta geometrik tasdiqning To'g'ri (T) yoki Noto'g'ri (N) ekanini tekshirish" },
  14: { title: "Muntazam ko'pburchak va ichki-tashqi radiuslar", category: "Geometriya", description: "a, R, r orasidagi munosabatlar (R^2 - r^2 = a^2/4), perimetr va yuzalar" },
  15: { title: "Muntazam tetraedr", category: "Geometriya", description: "Balandlik TG, qirra a, to'la sirt yuzi S=a^2*sqrt(3), hajm V=a^3*sqrt(2)/12, kesimlar" },
  16: { title: "Aylanish jismlari formulalarini moslashtirish", category: "Geometriya", description: "Silindr, konus va sharning sirt yuzi, o'q kesimi, hajmi formulalarini moslashtirish" },
  17: { title: "Silindr o'qidan kesmagacha eng qisqa masofa", category: "Geometriya", description: "Silindr yon sirtidagi A va B nuqtalar kesmasidan silindr o'qigacha eng qisqa masofani topish (d = sqrt(R^2 - c^2/4))" },
  18: { title: "Uchburchakni yon tomoni atrofida aylantirish", category: "Geometriya", description: "Teng yonli ABC uchburchakni AB yon tomoni atrofida 360 gradusga aylantirishdan hosil bo'lgan qo'sh konus sirti va hajmi" },
  19: { title: "Sharni parallel tekisliklar bilan kesish", category: "Geometriya", description: "Doiraviy kesimlar yuzlari S1, S2, tekisliklar orasidagi masofa va shar radiusi R" },
  20: { title: "Parallelepiped sirtlari bo'ylab eng qisqa yo'l", category: "Geometriya", description: "Old, yon va orqa 3 ta sirtni tekislikka yoyish va Pifagor teoremasi orqali kabelning eng qisqa uzunligi" },
  101: { title: "To'g'ri chiziqli harakat va vektorlar", category: "Kinematika", description: "Vektor va skalyar kattaliklar, teng ta'sir etuvchi vektor" },
  102: { title: "Kontakt va maydon kuchlari", category: "Dinamika", description: "Kontakt va maydon kuchlari xossalari" },
  103: { title: "Tezlik-vaqt grafigi va ko'chish", category: "Kinematika", description: "v(t) grafigi ostidagi sohalar yuzasi orqali ko'chish" },
  104: { title: "Egri chiziqli harakat va aylanada tezlik", category: "Kinematika", description: "Aylana bo'ylab o'rtacha tezlik va ko'chish vektori" },
  105: { title: "Burchak ostida va gorizontal otilgan jism", category: "Kinematika", description: "H_max, t_uchish va masofani hisoblash" },
  106: { title: "Nyuton qonunlari va tajribaviy xatoliklar", category: "Dinamika", description: "Nyuton qonunlari va tajriba tahlili" },
  201: { title: "Vocabulary: Shopping & Money", category: "Vocabulary", description: "discount, receipt, refund, bargain, promotion" },
  202: { title: "Character Traits & Personality Adjectives", category: "Vocabulary", description: "reliable, sensitive, anxious, modest, stubborn" },
  203: { title: "Countable vs Uncountable Nouns & Quantifiers", category: "Grammar", description: "much, many, a lot of, a few, advice, furniture" },
  204: { title: "Gerund vs Infinitive & Used to", category: "Grammar", description: "mind + ing, enjoy + ing, decide + to, used to + V1" },
  205: { title: "Reading Comprehension & Detail Analysis", category: "Reading", description: "Analyzing short texts and extracting main ideas" },
};

/**
 * Endpoint: POST /api/generate-question
 * Generates brand new questions matching 10-sinf CHSB standard for selected subject
 */
app.post('/api/generate-question', async (req: Request, res: Response) => {
  const { topicId = 1, difficulty = 'medium', promptSuffix = '', subject = 'Matematika' } = req.body;
  const spec = TOPIC_SPECS[topicId] || TOPIC_SPECS[1];

  if (!ai) {
    const fallbackQ = generateOfflineFallbackQuestion(topicId, difficulty, subject);
    return res.json({ question: fallbackQ, note: 'Offlayn rejimda shakllantirildi' });
  }

  try {
    const prompt = `Siz O'zbekiston Respublikasi umumta'lim maktablari 10-sinf CHSB-1 (Choraklik Hujjatlashtirilgan Sinov Baholash) ekspertisiz.
Fan: ${subject}.
Mavzu raqami: ${topicId}.
Mavzu nomi: "${spec.title}"
Kategoriya: ${spec.category}
Qiyinlik darajasi: ${difficulty} (demo_easy, medium, hard)
Tavsif: ${spec.description}
${promptSuffix ? `Qo'shimcha talab: ${promptSuffix}` : ''}

TALABLAR:
1. Agar fan Ingliz tili bo'lsa, savol va variantlar ingliz tilida bo'lsin, tushuntirish esa o'zbek tilida berilsin. Boshqa fanlarda savol va yechim o'zbek tilida bo'lsin.
2. Matematik/fizik ifodalarda darajalar uchun ^ belgisidan foydalanmang yoki KaTeX formatida toza yozing.
3. Aniq 4 ta variant (A, B, C, D) taqdim etilsin. Faqat bittasi to'g'ri bo'lsin.
4. To'liq, bosqichma-bosqich yechim (explanation) berilsin.
5. JSON formatda qaytaring.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING, description: 'Savolning to\'liq matni' },
              expression: { type: Type.STRING, description: 'Asosiy formula yoki tenglama (mavjud bo\'lsa)' },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ['A', 'B', 'C', 'D'],
              },
              correctAnswer: { type: Type.STRING, description: 'Faqat "A", "B", "C" yoki "D"' },
              explanation: { type: Type.STRING, description: 'Savolning batafsil yechimi va tushuntirishi' },
            },
            required: ['questionText', 'options', 'correctAnswer', 'explanation'],
          },
        },
      }),
      4000
    );

    const parsed = JSON.parse(response.text || '{}');
    const validAnswer = ['A', 'B', 'C', 'D'].includes(parsed.correctAnswer) ? parsed.correctAnswer : 'A';

    const question = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      subject: (subject as any) || 'Matematika',
      topicId,
      topicTitle: spec.title,
      category: spec.category,
      difficulty: difficulty as 'demo_easy' | 'medium' | 'hard',
      questionText: parsed.questionText,
      expression: parsed.expression || '',
      options: parsed.options,
      correctAnswer: validAnswer as 'A' | 'B' | 'C' | 'D',
      explanation: parsed.explanation,
      source: `AI Generator (${subject})`,
      isCustom: true,
    };

    return res.json({ question });
  } catch (error: any) {
    console.error('Gemini generation error, falling back:', error?.message);
    const fallbackQ = generateOfflineFallbackQuestion(topicId, difficulty, subject);
    return res.json({ question: fallbackQ, note: 'Avtomatik zaxira generatori orqali yaratildi' });
  }
});

/**
 * Endpoint: POST /api/generate-study-plan
 * Provides deep AI analysis of user mistakes and generates customized study plan
 */
app.post('/api/generate-study-plan', async (req: Request, res: Response) => {
  const { summary, userErrors } = req.body;

  if (!ai) {
    return res.json({
      plan: getFallbackStudyPlan(summary),
    });
  }

  try {
    const prompt = `Foydalanuvchi 10-sinf matematika CHSB-1 (Algebra va Geometriya) bo'yicha test topshirdi.
Natija umumiy xulosasi:
- Umumiy savollar: ${summary.totalQuestions}
- To'g'ri javoblar: ${summary.correctCount}
- Xatolar soni: ${summary.incorrectCount}
- Foiz: ${summary.scorePercentage}%
- Baho: ${summary.gradeLabel}
- Sarflangan vaqt: ${Math.round(summary.totalTimeSeconds / 60)} daqiqa.

Xatolik yuz bergan asosiy mavzular:
${summary.criticalWeaknesses?.join('\n') || 'Barcha mavzularda yuqori natija'}

Iltimos, o'quvchiga 100% o'zbek tilida moslashtirilgan, motivatsion va amaliy 7 kunlik takrorlash rejasi va tavsiyalarni tuzib bering.
Format:
- diagnosis: O'quvchining asosiy xatolari nima sababdan bo'lgani tahlili (qaysi teoremalar, formulalar yoki hisob-kitoblar e'tibordan chetda qolgan).
- tips: Imtihonda vaqtni tejash va test yechish bo'yicha 3-4 ta amaliy maslahat.
- days: 7 kunlik aniq jadval (har bir kun uchun mavzu nomi, asosiy formulalar eslatmasi va qancha misol yechish kerakligi).`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING, description: 'Xatolar sababi va bilimlardagi bo\'shliqlar tahlili' },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Amaliy maslahatlar ro\'yxati',
              },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    focus: { type: Type.STRING },
                    keyFormula: { type: Type.STRING },
                    task: { type: Type.STRING },
                  },
                  required: ['day', 'title', 'focus', 'task'],
                },
              },
            },
            required: ['diagnosis', 'tips', 'schedule'],
          },
        },
      }),
      4000
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ plan: parsed });
  } catch (err: any) {
    console.error('Study plan generation error:', err?.message);
    return res.json({ plan: getFallbackStudyPlan(summary) });
  }
});

function getFallbackStudyPlan(summary: any) {
  const weakTopics = summary.topicStats?.filter((t: any) => t.needsReview) || [];
  return {
    diagnosis: weakTopics.length > 0
      ? `Sizda asosan ${weakTopics.map((w: any) => w.topicTitle).slice(0, 3).join(', ')} mavzularida xatoliklar ko'zatildi. Ushbu mavzularda formulalarni eslash va ifodalarni soddalashtirishda ehtiyotkor bo'lish tavsiya etiladi.`
      : 'Siz ajoyib natija ko\'rsatdingiz! Mavzular bo\'yicha asosiy tushunchalarni yaxshi o\'zlashtirgansiz.',
    tips: [
      'Har bir savolga 2.5 daqiqadan oshiq vaqt sarflamang, qiyin misolni bayroqcha (flag) bilan belgilab keyinroq qayting.',
      'Gorner sxemasi va ko\'phadlar bo\'linishida manfiy ishoralarni qayta-qayta tekshiring.',
      'Fazoviy geometriyada (tetraedr, aylanma jismlar) albatta sodda chizma chizib oling.',
      'To\'rtinchi darajali tenglamalarni yechishda o\'zgaruvchi almashtirish usulini (t = x^2 + ax) esda tuting.',
    ],
    schedule: [
      { day: 1, title: '1-kun: Ko\'phadlar algebrai', focus: 'Gorner sxemasi va ratsional ildizlar', keyFormula: 'P(x) = Q(x)(x-a) + R', task: 'Har bir turdan 5 tadan misol ishlab tahlil qilish' },
      { day: 2, title: '2-kun: Yuqori darajali tenglamalar', focus: 'Haqiqiy ildizlar yig\'indisi va ko\'paytmasi', keyFormula: 'y = x^2 - 4x almashtirish', task: 'Simmetrik va bikvadrat tenglamalarni yechish' },
      { day: 3, title: '3-kun: Funksiyalar va grafiklar', focus: 'E(y) qiymatlar sohasi va kompozitsiya', keyFormula: 'f(g(x)) va f^-1(x)', task: 'Grafikdan f^-1 qiymatlarini aniqlash' },
      { day: 4, title: '4-kun: Fazoviy jismlar (Stereometriya)', focus: 'Prizma, piramida va tetraedr', keyFormula: 'H = a*sqrt(6)/3, V = a^3*sqrt(2)/12', task: 'Tetraedr va piramida balandliklari bo\'yicha masalalar' },
      { day: 5, title: '5-kun: Aylanish jismlari', focus: 'Silindr, konus, shar', keyFormula: 'S_sil = 2*pi*r*(r+h), S_shar = 4*pi*R^2', task: 'Qo\'sh konus va sirtlar yuzalarini solishtirish' },
      { day: 6, title: '6-kun: Eng qisqa masofalar va yoyilmalar', focus: 'Parallelepiped sirtini tekislikka yoyish', keyFormula: 'L = sqrt((w+d+w)^2 + h^2)', task: 'Yoyilma orqali kabel uzunligini hisoblash' },
      { day: 7, title: '7-kun: To\'liq CHSB-1 sinov imtihoni', focus: 'Barcha 20 ta mavzuni qamrab olgan 20 talik test', keyFormula: 'Taymer bilan 60 daqiqa', task: 'Haqiqiy imtihon muhitida test yechish' },
    ],
  };
}

function generateOfflineFallbackQuestion(topicId: number, difficulty: string, subject: string = 'Matematika') {
  const seed = Math.floor(Math.random() * 10) + 1;
  const spec = TOPIC_SPECS[topicId] || TOPIC_SPECS[1];

  if (subject === 'Fizika') {
    const v0 = 20 + 10 * (seed % 4);
    const h = (v0 * v0) / 20;
    return {
      id: `gen_f_${Date.now()}_${seed}`,
      subject: 'Fizika' as const,
      topicId: topicId || 105,
      topicTitle: spec.title || "Vertikal otilgan jism harakati",
      category: "Kinematika",
      difficulty: difficulty as any,
      questionText: `Jism vertikal yuqoriga ${v0} m/s boshlang'ich tezlik bilan otildi. Havo qarshiligi hisobga olinmasa, jismning maksimal ko'tarilish balandligi necha metrga teng? (g = 10 m/s^2)`,
      expression: `v_0 = ${v0} \\text{ m/s}, \\quad g = 10 \\text{ m/s}^2`,
      options: {
        A: `${h} m`,
        B: `${h + 15} m`,
        C: `${h * 2} m`,
        D: `${Math.round(h * 0.75)} m`,
      },
      correctAnswer: 'A' as const,
      explanation: `Maksimal ko'tarilish balandligi: H_max = v0^2 / (2g) = (${v0})^2 / (2 * 10) = ${v0 * v0} / 20 = ${h} m.`,
      source: 'CHSB-1 Fizika Trenajyor',
    };
  }

  if (subject === 'Ingliz tili') {
    return {
      id: `gen_e_${Date.now()}_${seed}`,
      subject: 'Ingliz tili' as const,
      topicId: topicId || 204,
      topicTitle: spec.title || "Grammar: Gerund & Infinitive",
      category: "Grammar",
      difficulty: difficulty as any,
      questionText: `Choose the correct form of the verb:\nMy sister enjoys ______ foreign languages in her free time.`,
      options: {
        A: 'learning',
        B: 'to learn',
        C: 'learned',
        D: 'learn',
      },
      correctAnswer: 'A' as const,
      explanation: `'Enjoy' fe'lidan keyin doimo Gerund (V-ing) ishlatiladi: enjoy learning.`,
      source: 'CHSB-1 English Summative Assessment',
    };
  }

  if (topicId === 1) {
    const deg = 5 + seed;
    const coeff = 2 + seed;
    return {
      id: `gen_${Date.now()}_${seed}`,
      subject: 'Matematika' as const,
      topicId: 1,
      topicTitle: spec.title,
      category: 'Algebra',
      difficulty: difficulty as any,
      questionText: `Quyidagi ko'phadning eng katta darajasi va bosh koeffitsiyenti yig'indisini toping:`,
      expression: `P(x) = ${coeff}x^{${deg}} - 7x^3 + 4x^{${deg - 2}} - 12`,
      options: {
        A: `${deg + coeff}`,
        B: `${deg + coeff + 2}`,
        C: `${deg + coeff - 1}`,
        D: `${deg * coeff}`,
      },
      correctAnswer: 'A' as const,
      explanation: `Eng katta daraja n = ${deg}, uning koeffitsiyenti a = ${coeff}. Ularning yig'indisi: ${deg} + ${coeff} = ${deg + coeff}.`,
      source: 'CHSB-1 Avtomatik Trenajyor',
    };
  }

  if (topicId === 14) {
    const a = 6 + 2 * (seed % 4);
    const rDiff = (a * a) / 4;
    return {
      id: `gen_${Date.now()}_${seed}`,
      subject: 'Matematika' as const,
      topicId: 14,
      topicTitle: spec.title,
      category: 'Geometriya',
      difficulty: difficulty as any,
      questionText: `Muntazam ko'pburchakning har bir tomoni ${a} cm ga teng. Unga tashqi chizilgan aylananing radiusi R, ichki chizilgan aylananing radiusi esa r bo'lsa, R^2 - r^2 ifodaning qiymatini toping.`,
      options: {
        A: `${rDiff} cm^2`,
        B: `${rDiff * 2} cm^2`,
        C: `${rDiff - 4} cm^2`,
        D: `${a * 2} cm^2`,
      },
      correctAnswer: 'A' as const,
      explanation: `Muntazam ko'pburchak uchun har doim R^2 - r^2 = (a/2)^2 bajariladi. Demak, (${a}/2)^2 = ${a / 2}^2 = ${rDiff} cm^2.`,
      source: 'CHSB-1 Avtomatik Trenajyor',
    };
  }

  // Generic fallback
  return {
    id: `gen_${Date.now()}_${seed}`,
    subject: (subject as any) || 'Matematika',
    topicId,
    topicTitle: spec.title,
    category: spec.category || 'Algebra',
    difficulty: difficulty as any,
    questionText: `${spec.title} bo'yicha namunaviy topshiriq:`,
    expression: `Quyidagi ma'lumotlarni tahlil qiling va to'g'ri natijani belgilang.`,
    options: {
      A: `To'g'ri javob varianti (${spec.category})`,
      B: `Chalg'ituvchi variant 1`,
      C: `Chalg'ituvchi variant 2`,
      D: `Chalg'ituvchi variant 3`,
    },
    correctAnswer: 'A' as const,
    explanation: `Mavzu nazariyasi: ${spec.description}. Formulalarni bevosita qo'llash orqali natijaga erishiladi.`,
    source: 'CHSB-1 Avtomatik Trenajyor',
  };
}

// Vite integration or static file serve
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
