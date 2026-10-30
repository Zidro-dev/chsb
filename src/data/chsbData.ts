import { Question, SubjectType } from '../utils/testLogic.ts';

export interface SubjectMeta {
  id: SubjectType;
  title: string;
  defaultQuestions: number;
  durationMinutes: number;
  maxScore: number;
  badgeColor: string;
  description: string;
}

export const AVAILABLE_SUBJECTS: SubjectMeta[] = [
  {
    id: 'Matematika',
    title: 'Matematika (Algebra va Geometriya)',
    defaultQuestions: 20,
    durationMinutes: 45,
    maxScore: 80,
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    description: "20 ta asosiy mavzu: Ko'phadlar, Gorner, ratsional ildizlar, simmetrik tenglamalar, funksiyalar va stereometriya.",
  },
  {
    id: 'Fizika',
    title: 'Fizika (CHSB-1)',
    defaultQuestions: 15,
    durationMinutes: 40,
    maxScore: 29,
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    description: "Kinematika, to'g'ri chiziqli harakat, vektorlar, Nyuton qonunlari, otilgan jism harakati va tajribaviy xatoliklar tahlili.",
  },
  {
    id: 'Ingliz tili',
    title: 'English (Summative Assessment)',
    defaultQuestions: 15,
    durationMinutes: 45,
    maxScore: 40,
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    description: "Shopping & money vocabulary, character traits, sports collocations, natural disasters, gerund/infinitive, used to, and reading texts.",
  },
];

export interface TopicInfo {
  id: number;
  title: string;
  subject?: SubjectType;
  category: string;
  demoType: string;
  description: string;
  keyFormulas: string[];
  tips: string;
}

export const CHSB_TOPICS: TopicInfo[] = [
  // --- Matematika (1 - 20) ---
  {
    id: 1,
    subject: 'Matematika',
    title: "Ko'phadning darajasi va bosh koeffitsiyenti",
    category: "Algebra",
    demoType: "B-2",
    description: "Ko'phadni soddalashtirib, eng katta darajali x^n hadi ko'rsatkichi (deg P) va uning koeffitsiyenti (a_n) yig'indisini topish.",
    keyFormulas: [
      "deg(P * Q) = deg(P) + deg(Q)",
      "deg(P ± Q) ≤ max(deg(P), deg(Q))",
      "Bosh koeffitsiyent — eng katta darajali had oldidagi ko'paytuvchi"
    ],
    tips: "Qavslarni ochishda faqat eng katta darajali hadlarni kuzating, agar ular qisqarib ketmasa butun ko'phadni yoyish shart emas!"
  },
  {
    id: 2,
    subject: 'Matematika',
    title: "Ko'phadlar va ularning xossalari",
    category: "Algebra",
    demoType: "Q-3,5 (Moslashtirish)",
    description: "Ozod had P(0), ko'phadlar bo'linishi qoldig'i (Bezu teoremasi) va butun ko'rsatkichli darajalarni aniqlash.",
    keyFormulas: [
      "P(x) ning ozod hadi: P(0)",
      "P(x) ni (x - a) ga bo'lgandagi qoldiq: r = P(a)",
      "Ko'phad bo'lishi uchun x ning darajalari nomanfiy butun son bo'lishi shart"
    ],
    tips: "I-IV bandlarni hisoblab, A-F javoblardan mosini tanlang. P(0) ni topish uchun x o'rniga darhol 0 qo'ying."
  },
  {
    id: 3,
    subject: 'Matematika',
    title: "Ko'phadning karrali ildizlari",
    category: "Algebra",
    demoType: "B-2",
    description: "Ko'phad yoyilmasidagi (x - a)^k (k ≥ 2) ko'paytuvchilarni va karrali ildizlarni topish.",
    keyFormulas: [
      "Agar P(x) = (x - a)^k * Q(x) bo'lsa, x = a ildiz k-karrali ildiz deyiladi",
      "Karrali ildizda P(a) = 0 va P'(a) = 0 bo'ladi"
    ],
    tips: "Kvadrat uchhadlarni ko'paytuvchilarga ajratib, umumiy qavslarni darajaga ko'taring."
  },
  {
    id: 4,
    subject: 'Matematika',
    title: "Yevklid algoritmi va ko'phadlarning EKUBi",
    category: "Algebra",
    demoType: "Q-3,5",
    description: "Ikki ko'phadni ketma-ket burchakli bo'lish orqali ularning eng katta umumiy bo'luvchisini aniqlash.",
    keyFormulas: [
      "P(x) = Q(x) * M(x) + R(x) bo'lsa, EKUB(P, Q) = EKUB(Q, R)",
      "EKUB ning bosh koeffitsiyenti odatda 1 ga tenglashtiriladi"
    ],
    tips: "Agar ko'phadlar ildizlarini osongina topish mumkin bo'lsa, umumiy ildizga mos (x - x0) ko'paytuvchini ajratib oling."
  },
  {
    id: 5,
    subject: 'Matematika',
    title: "Gorner sxemasi",
    category: "Algebra",
    demoType: "Q-3,5 (Jadval)",
    description: "Gorner jadvali orqali ko'phadni (x - c) ga bo'lish, bo'linma koeffitsiyentlari va qoldiqni topish.",
    keyFormulas: [
      "b_0 = a_0",
      "b_k = c * b_{k-1} + a_k",
      "Oxirgi son qoldiq r = P(c) ga teng",
      "Agar bo'luvchi (kx - c) bo'lsa, bo'linma k ga bo'linadi"
    ],
    tips: "Gorner sxemasida tushirib qoldirilgan darajalar uchun koeffitsiyentga 0 yozishni unutmang!"
  },
  {
    id: 6,
    subject: 'Matematika',
    title: "Ratsional ildizlar haqidagi teorema",
    category: "Algebra",
    demoType: "Q-3,5",
    description: "Butun koeffitsiyentli ko'phadning ratsional ildizi p/q ko'rinishida bo'lib, p ozod had bo'luvchisi, q bosh koeffitsiyent bo'luvchisi bo'ladi.",
    keyFormulas: [
      "p | a_0 (ozod had bo'luvchilari)",
      "q | a_n (bosh koeffitsiyent bo'luvchilari)",
      "Ratsional ildizlar p/q to'plamidan tekshiriladi"
    ],
    tips: "Agar barcha koeffitsiyentlar yig'indisi 0 bo'lsa, x = 1 aniq ildizdir!"
  },
  {
    id: 7,
    subject: 'Matematika',
    title: "Haqiqiy ildizlar yig'indisi",
    category: "Algebra",
    demoType: "Q-3,5",
    description: "Yuqori darajali tenglamalarni guruhlash, yangi o'zgaruvchi (t) kiritish va faqat haqiqiy ildizlari yig'indisini aniqlash.",
    keyFormulas: [
      "(x+a)(x+b)(x+c)(x+d) da a+d = b+c bo'lsa, t = x^2 + (a+d)x almashtiriladi",
      "Haqiqiy ildizlar uchun D ≥ 0 bo'lishi shart"
    ],
    tips: "Haqiqiy ildizlar so'ralganda D < 0 bo'lgan qismning ildizlari yig'indiga olinmaydi!"
  },
  {
    id: 8,
    subject: 'Matematika',
    title: "Bir tenglamaning ildizlari ikkinchisining ham ildizlari",
    category: "Algebra",
    demoType: "Q-3,5",
    description: "Kvadrat tenglama ildizlari kub tenglama ildizlari bilan mos tushganda parametrlar (a, b) ni topish.",
    keyFormulas: [
      "x^3 + bx + c = (x^2 - px + q)(x - x_3)",
      "Vyet: x_1 + x_2 + x_3 = 0 (agar x^2 hadi bo'lmasa)"
    ],
    tips: "Kub tenglamada x^2 bo'lmasa, ildizlar yig'indisi 0 bo'ladi: x3 = -(x1+x2)."
  },
  {
    id: 9,
    subject: 'Matematika',
    title: "Haqiqiy ildizlar ko'paytmasi",
    category: "Algebra",
    demoType: "Q-3,5",
    description: "Qaytma (simmetrik) va almashtirish kiritiladigan 4- va 6-darajali tenglamalarning faqat haqiqiy ildizlari ko'paytmasini topish.",
    keyFormulas: [
      "t = x + 1/x almashtirish: x^2 + 1/x^2 = t^2 - 2",
      "Haqiqiy x bo'lishi uchun |t| ≥ 2 shart zarur"
    ],
    tips: "Tenglamaning ozod hadiga qarab shoshilmang, avval ildizlarning haqiqiyligini tekshiring."
  },
  {
    id: 10,
    subject: 'Matematika',
    title: "Funksiyaning qiymatlar sohasi",
    category: "Funksiyalar",
    demoType: "B-2",
    description: "Kasr-chiziqli, kvadrat ildizli va kasr-kvadrat funksiyalarning E(y) qiymatlar to'plami.",
    keyFormulas: [
      "y = (ax+b)/(cx+d) uchun E(y) = R \\ {a/c}",
      "y = c + sqrt(R^2 - (x-a)^2) uchun E(y) = [c; c + R]"
    ],
    tips: "Kasr surat va maxraji qisqarsa, chiqarib tashlangan nuqtani hisobga oling."
  },
  {
    id: 11,
    subject: 'Matematika',
    title: "Funksiya grafigi va ekstremal qiymatlar",
    category: "Funksiyalar",
    demoType: "M-6",
    description: "[0;9] oraliqda aniqlangan siniq chiziqli grafik asosida teng qiymatli nuqtalar va algebraik ifodani optimallashtirish.",
    keyFormulas: [
      "f(a) = f(b) = f(c) gorizontal chiziq kesishmalari",
      "Yig'indini maksimallashtirish uchun musbat hadlarga eng katta butun koordinatalar olinadi"
    ],
    tips: "Grafikdagi butun nuqtalarni y koordinatasi bo'yicha guruhlab oling."
  },
  {
    id: 12,
    subject: 'Matematika',
    title: "Murakkab va teskari funksiyalar",
    category: "Funksiyalar",
    demoType: "Q-3,5",
    description: "y = f(g(kx+b)) kompozitsiya grafigi berilganda, f^-1 va g^-1 teskari funksiya qiymatlarini aniqlash.",
    keyFormulas: [
      "f(u) = v <=> f^-1(v) = u",
      "g^-1(a) = b <=> g(b) = a"
    ],
    tips: "Grafikdagi (x0, y0) nuqta: f(g(kx0 + b)) = y0."
  },
  {
    id: 13,
    subject: 'Matematika',
    title: "Kub, parallelepiped, prizma va piramida",
    category: "Geometriya",
    demoType: "B-4 (T/N)",
    description: "Fazoviy ko'pyoqlar: diagonal, sirt yuzasi va apofema bo'yicha tasdiqlarni baholash.",
    keyFormulas: [
      "Kub: d = a*sqrt(3), S_yon = 4a^2, S_tola = 6a^2",
      "Parallelepiped: d^2 = a^2 + b^2 + c^2"
    ],
    tips: "I-IV bandlarni hisoblab, to'g'ri/noto'g'ri ketma-ketligini variantlardan toping."
  },
  {
    id: 14,
    subject: 'Matematika',
    title: "Muntazam ko'pburchak va ichki-tashqi radiuslar",
    category: "Geometriya",
    demoType: "Q-5,2",
    description: "Muntazam ko'pburchak tomoni a, R va r radiuslar orasidagi bog'lanishlar.",
    keyFormulas: [
      "R^2 - r^2 = (a/2)^2 = a^2 / 4 (barcha muntazam ko'pburchaklar uchun)",
      "(a^2 + 4r^2)/R^2 = 4"
    ],
    tips: "R^2 - r^2 ifoda burchaklar soniga bog'liq emas, faqat a/2 ning kvadratiga teng!"
  },
  {
    id: 15,
    subject: 'Matematika',
    title: "Muntazam tetraedr",
    category: "Geometriya",
    demoType: "Q-5,2",
    description: "Hamma qirralari teng bo'lgan muntazam tetraedr balandligi, sirt yuzi va hajmi.",
    keyFormulas: [
      "H = a*sqrt(6)/3",
      "S_tola = a^2 * sqrt(3)",
      "V = a^3 * sqrt(2)/12"
    ],
    tips: "Balandlik berilsa: a^2 = 3*H^2 / 2."
  },
  {
    id: 16,
    subject: 'Matematika',
    title: "Aylanish jismlari formulalarini moslashtirish",
    category: "Geometriya",
    demoType: "B-4",
    description: "Silindr, konus va sharning sirt yuzlari, o'q kesimlari va hajmi formulalarini moslashtirish.",
    keyFormulas: [
      "S_sil = 2*pi*r*(r+h), S_oq = 2*r*h",
      "S_kon = pi*r*(r+l), S_oq = r*h",
      "S_shar = 4*pi*R^2, V_shar = (4/3)*pi*R^3"
    ],
    tips: "Konus o'q kesimi uchburchak: yuzi r*h."
  },
  {
    id: 17,
    subject: 'Matematika',
    title: "Silindr o'qidan kesmagacha eng qisqa masofa",
    category: "Geometriya",
    demoType: "Q-5,2",
    description: "Silindr yon sirtidagi A va B nuqtalar kesmasidan silindr o'qigacha bo'lgan masofani topish.",
    keyFormulas: [
      "c = sqrt(AB^2 - (h2-h1)^2)",
      "d = sqrt(R^2 - (c/2)^2)"
    ],
    tips: "Avval balandliklar farqi delta_h ni toping, so'ng vatar uzunligini hisoblang."
  },
  {
    id: 18,
    subject: 'Matematika',
    title: "Uchburchakni yon tomoni atrofida aylantirish",
    category: "Geometriya",
    demoType: "Q-5,2",
    description: "Teng yonli uchburchakni AB yon tomoni atrofida 360 gradusga aylantirishdan hosil bo'lgan qo'sh konus.",
    keyFormulas: [
      "r = 2S / AB",
      "S_tola = pi * r * (AB + BC)"
    ],
    tips: "Ikkala konus yasovchilari AB va BC bo'ladi."
  },
  {
    id: 19,
    subject: 'Matematika',
    title: "Sharni parallel tekisliklar bilan kesish",
    category: "Geometriya",
    demoType: "Q-5,2",
    description: "Parallel tekisliklar hosil qilgan doiraviy kesimlar yuzlari va shar radiusi.",
    keyFormulas: [
      "r1^2 = R^2 - d1^2, r2^2 = R^2 - d2^2",
      "S1 - S2 = pi * (d2^2 - d1^2)"
    ],
    tips: "Doiralar yuzlaridan r1^2 va r2^2 ni toping."
  },
  {
    id: 20,
    subject: 'Matematika',
    title: "Parallelepiped sirtlari bo'ylab eng qisqa yo'l",
    category: "Geometriya",
    demoType: "M-6",
    description: "Old, yon va orqa 3 ta sirtni tekislikka yoyish va Pifagor teoremasi orqali kabel uzunligi.",
    keyFormulas: [
      "W = AB + BC + CD = w + d + w",
      "L_min = sqrt(W^2 + H^2)"
    ],
    tips: "Uchta yon devor to'g'ri to'rtburchak kabi yoyiladi."
  },

  // --- Fizika (101 - 106) ---
  {
    id: 101,
    subject: 'Fizika',
    title: "To'g'ri chiziqli harakat va vektorlar",
    category: "Kinematika",
    demoType: "B-1",
    description: "Vektor va skalyar kattaliklar (koordinata, ko'chish, yo'l, kuch) va bir to'g'ri chiziqdagi vektorlar teng ta'sir etuvchisi.",
    keyFormulas: [
      "Ko'chish va tezlik — vektor kattaliklar",
      "Yo'l va vaqt — skalyar kattaliklar",
      "R_vektor = sum(F_i)"
    ],
    tips: "O'ngga yo'nalgan vektorlarni musbat, chapga yo'nalganlarni manfiy deb oling."
  },
  {
    id: 102,
    subject: 'Fizika',
    title: "Kontakt va maydon kuchlari",
    category: "Dinamika",
    demoType: "B-1 (Moslashtirish)",
    description: "Kontakt kuchlari (taranglik, ishqalanish, tayanch reaksiyasi) va maydon kuchlari (gravitatsiya, elektr, magnit) xossalari.",
    keyFormulas: [
      "Maydon kuchlari jismga kontaktsiz (masofadan) ta'sir qiladi",
      "Kontakt kuchi jismni tortishi ham, itarishi ham mumkin"
    ],
    tips: "Og'irlik kuchi maydon kuchi bo'lib, havoda uchayotgan jismga ham uzluksiz ta'sir qiladi."
  },
  {
    id: 103,
    subject: 'Fizika',
    title: "Tezlik-vaqt grafigi va ko'chish",
    category: "Kinematika",
    demoType: "Q-2",
    description: "v(t) grafigi ostidagi figuralar yuzasi orqali jismning ko'chishi va yo'lini aniqlash.",
    keyFormulas: [
      "Ko'chish = v(t) grafigi ostidagi yuzalarning algebraik yig'indisi",
      "Bosib o'tilgan yo'l = yuzalar modullari yig'indisi"
    ],
    tips: "Vaqt o'qidan pastdagi yuzalar manfiy ko'chishni bildiradi!"
  },
  {
    id: 104,
    subject: 'Fizika',
    title: "Egri chiziqli harakat va aylanada o'rtacha tezlik",
    category: "Kinematika",
    demoType: "Q-2",
    description: "Aylana bo'ylab harakatda o'rtacha tezlik moduli v_o'rt = s/t va o'rtacha tezlik vektori moduli |v_vec| = |r_ko'chish|/t.",
    keyFormulas: [
      "v_o'rt = s / t (yo'l bo'yicha)",
      "|v_vektor| = |Delta r| / t (vatar bo'yicha ko'chish)"
    ],
    tips: "Aylananing yarmini bosib o'tganda ko'chish vatar uzunligi 2R ga teng bo'ladi!"
  },
  {
    id: 105,
    subject: 'Fizika',
    title: "Burchak ostida va gorizontal otilgan jism",
    category: "Kinematika",
    demoType: "Q-2",
    description: "Gorizontga burchak ostida otilgan jismning maksimal ko'tarilish balandligi H = (v0*sin alfa)^2 / (2g) va uchish uzoqligi.",
    keyFormulas: [
      "H_max = (v0 * sin(alfa))^2 / (2g)",
      "t_uchish = 2 * v0 * sin(alfa) / g",
      "x_max = v0 * cos(alfa) * t_uchish"
    ],
    tips: "sin 37° = 0.6, cos 37° = 0.8 kabi qiymatlarni hisoblashda adashmang."
  },
  {
    id: 106,
    subject: 'Fizika',
    title: "Nyuton qonunlari va tajribaviy xatoliklar",
    category: "Dinamika",
    demoType: "M-3",
    description: "Nyutonning II va III qonunlari, ta'sir va aks ta'sir, tajriba jadvallaridagi o'lchash xatoliklari (T/N).",
    keyFormulas: [
      "F_natijaviy = m * a",
      "F_12 = -F_21 (ta'sir va aks ta'sir turli jismlarga qo'yiladi)",
      "Ipning og'ish burchagi: tg(alfa) = a / g (massaga bog'liq emas!)"
    ],
    tips: "Ta'sir va aks ta'sir kuchlari turli jismlarga qo'yilgani sababli bir-birini hech qachon muvozanatlamaydi!"
  },

  // --- Ingliz tili (201 - 205) ---
  {
    id: 201,
    subject: 'Ingliz tili',
    title: "Vocabulary: Shopping & Money",
    category: "Vocabulary",
    demoType: "B-2b",
    description: "discount (10% off), receipt (paper), refund (money back), bargain (low price), promotion (special offer), loyalty card.",
    keyFormulas: [
      "10% off = discount",
      "money back = refund",
      "payment proof = receipt",
      "pay in small amounts = in instalments"
    ],
    tips: "Remember: discount is price reduction, refund is returning the money, receipt is the paper."
  },
  {
    id: 202,
    subject: 'Ingliz tili',
    title: "Character Traits & Personality Adjectives",
    category: "Vocabulary",
    demoType: "B-2b",
    description: "reliable/trustworthy (can be trusted), sensitive (easily hurt), anxious (worries a lot), modest (doesn't boast), stubborn (doesn't change mind).",
    keyFormulas: [
      "trusted => reliable / trustworthy",
      "worries a lot => anxious",
      "easily hurt => sensitive",
      "hard-working <=> lazy"
    ],
    tips: "Do not confuse sensitive (ta'sirchan) with sensible (oqilona)!"
  },
  {
    id: 203,
    subject: 'Ingliz tili',
    title: "Countable vs Uncountable Nouns & Quantifiers",
    category: "Grammar",
    demoType: "Q-2.8",
    description: "Uncountable nouns: advice, furniture, information, luggage, traffic, news, homework, money (no -s, takes much/some/a lot of).",
    keyFormulas: [
      "Uncountable: much, a little, little (information, advice, furniture)",
      "Countable: many, a few, several (students, books, stores)",
      "Both: a lot of, some, any"
    ],
    tips: "In English, 'advice' and 'furniture' never take plural -s and never take 'a/an'!"
  },
  {
    id: 204,
    subject: 'Ingliz tili',
    title: "Gerund (-ing) vs Infinitive (to do) & Used to",
    category: "Grammar",
    demoType: "Q-2.8",
    description: "Verbs followed by -ing: enjoy, mind, finish, can't stand, avoid, suggest. Followed by to+V: decide, promise, want, hope, plan.",
    keyFormulas: [
      "Gerund: enjoy / mind / avoid / finish / suggest + V-ing",
      "Infinitive: decide / promise / want / plan + to + V",
      "used to + V1: past habit or state that is no longer true"
    ],
    tips: "used to is followed by base form of verb: 'used to live', not 'used to lived'!"
  },
  {
    id: 205,
    subject: 'Ingliz tili',
    title: "Reading Comprehension & Detail Analysis",
    category: "Reading",
    demoType: "M-3b",
    description: "Analyzing short texts (Shopping Smart, Team Project, Train vs Plane, Moving House, Class Newspaper) and drawing supported conclusions.",
    keyFormulas: [
      "Identify key factual details (prices, times, reasons)",
      "Main idea of team projects: clear roles and cooperation"
    ],
    tips: "Always check prices and details in the text: $45 vs $60 = saved money + free gift!"
  }
];

export const CHSB_QUESTIONS: Question[] = [
  // ==========================================
  // MATEMATIKA (PDF: 10_sinf_CHSB1_200_ta_test)
  // ==========================================
  {
    id: 'chsb_m_1',
    subject: 'Matematika',
    topicId: 1,
    topicTitle: "Ko'phadning darajasi va bosh koeffitsiyenti",
    category: 'Algebra',
    difficulty: 'demo_easy',
    questionText: "Quyidagi ko'phadning eng katta darajasi va bosh koeffitsiyenti yig'indisini toping.",
    expression: "P(x) = -3x^4 + 5x^7 - 2x^3 + 8x^9",
    options: { A: '15', B: '16', C: '17', D: '13' },
    correctAnswer: 'C',
    explanation: "Eng katta darajali had: 8x^9. Darajasi n = 9, bosh koeffitsiyenti a = 8. Yig'indisi: 9 + 8 = 17.",
    source: '1-test, 1-savol',
  },
  {
    id: 'chsb_m_2',
    subject: 'Matematika',
    topicId: 1,
    topicTitle: "Ko'phadning darajasi va bosh koeffitsiyenti",
    category: 'Algebra',
    difficulty: 'demo_easy',
    questionText: "Quyidagi ko'phadning eng katta darajasi va bosh koeffitsiyenti yig'indisini toping.",
    expression: "P(x) = 6x^8 - 4x^6 + 3x^5 - 6x^8 + 5x^7 - x^2",
    options: { A: '12', B: '13', C: '14', D: '15' },
    correctAnswer: 'A',
    explanation: "6x^8 va -6x^8 hadlar qisqaradi. Qolgan eng katta darajali had: 5x^7. Darajasi 7, bosh koeffitsiyenti 5. Yig'indi: 7 + 5 = 12.",
    source: '1-test, 2-savol',
  },
  {
    id: 'chsb_m_3',
    subject: 'Matematika',
    topicId: 2,
    topicTitle: "Ko'phadlar va ularning xossalari",
    category: 'Algebra',
    difficulty: 'demo_easy',
    questionText: "Berilgan ma'lumotlarga ko'ra, I–IV bandlarni A–F javoblar bilan moslashtiring:\nI. P(x) = (x^2 - 3x + 2)(x + 4) + 5 ozod hadi\nII. P(x) = x^3 + 3x^2 + 4x + 1 ni x^2 - 2 ga bo'lgandagi qoldiq\nIII. P(x) = 3x^{n-6} + 2x^{6-n} + x^5 - 7 ifoda ko'phad bo'lsa, uning darajasi\nIV. P(x) = x^3 - 3x^2 + 2x + 10 ni x + 1 ga bo'lgandagi qoldiq",
    options: {
      A: "I-F; II-B; III-A; IV-D",
      B: "I-F; II-C; III-A; IV-D",
      C: "I-D; II-C; III-A; IV-F",
      D: "I-F; II-C; III-E; IV-D"
    },
    correctAnswer: 'B',
    explanation: "I. P(0) = 2*4 + 5 = 13 (F). II. x^2 = 2 qo'ysak, 6x + 7 (C). III. n = 6 da daraja 5 (A). IV. P(-1) = 4 (D).",
    source: '2-test, 1-savol',
  },
  {
    id: 'chsb_m_4',
    subject: 'Matematika',
    topicId: 5,
    topicTitle: "Gorner sxemasi",
    category: 'Algebra',
    difficulty: 'demo_easy',
    questionText: "Quyidagi ko'phadni x - 2 ga bo'lish uchun Gorner sxemasi tuzilgan:\nP(x) = 2x^4 - 3x^3 + 5x - 4.\nJadvaldagi yetishmayotgan qiymatlarni aniqlab, bo'linma Q(x) va qoldiq r ni toping.",
    options: {
      A: "Q = 2x^3 + x^2 + 2x + 9, r = -14",
      B: "Q = 2x^3 + x^2 + 2x + 9, r = 14",
      C: "Q = 2x^3 - x^2 + 2x + 9, r = 14",
      D: "Q = 2x^3 + x^2 + 2x + 7, r = 10"
    },
    correctAnswer: 'B',
    explanation: "Gorner sxemasi: b0 = 2, b1 = 2*2 - 3 = 1, b2 = 2*1 + 0 = 2, b3 = 2*2 + 5 = 9, r = 2*9 - 4 = 14. Q(x) = 2x^3 + x^2 + 2x + 9, r = 14.",
    source: '5-test, 1-savol',
  },
  {
    id: 'chsb_m_5',
    subject: 'Matematika',
    topicId: 14,
    topicTitle: "Muntazam ko'pburchak va ichki-tashqi radiuslar",
    category: 'Geometriya',
    difficulty: 'demo_easy',
    questionText: "Muntazam ko'pburchakning har bir tomoni 18 cm ga teng. Unga tashqi chizilgan aylananing radiusi R, ichki chizilgan aylananing radiusi esa r ga teng. R^2 - r^2 ifodaning qiymatini toping.",
    options: { A: "81 cm^2", B: "72 cm^2", C: "324 cm^2", D: "36 cm^2" },
    correctAnswer: 'A',
    explanation: "R^2 - r^2 = (a/2)^2 = (18/2)^2 = 9^2 = 81 cm^2.",
    source: '14-test, 2-savol',
  },
  {
    id: 'chsb_m_6',
    subject: 'Matematika',
    topicId: 15,
    topicTitle: "Muntazam tetraedr",
    category: 'Geometriya',
    difficulty: 'demo_easy',
    diagramType: 'tetrahedron',
    questionText: "TABC muntazam tetraedrda TG balandlik TG = 2*sqrt(6) cm ga teng. Tetraedrning to'la sirt yuzini toping.",
    expression: "TG = 2*sqrt(6) cm",
    options: {
      A: "18*sqrt(3) cm^2",
      B: "24*sqrt(3) cm^2",
      C: "36*sqrt(3) cm^2",
      D: "72*sqrt(3) cm^2"
    },
    correctAnswer: 'C',
    explanation: "H = a*sqrt(6)/3 => a = 6 cm. S_tola = a^2 * sqrt(3) = 36*sqrt(3) cm^2.",
    source: '15-test, 1-savol',
  },
  {
    id: 'chsb_m_7',
    subject: 'Matematika',
    topicId: 17,
    topicTitle: "Silindr o'qidan kesmagacha eng qisqa masofa",
    category: 'Geometriya',
    difficulty: 'demo_easy',
    diagramType: 'cylinder',
    questionText: "To'g'ri doiraviy silindrning balandligi 9 cm, asos radiusi 10 cm. Yon sirtidagi A va B nuqtalarning balandliklari mos ravishda 2 cm va 7 cm. Agar AB = 13 cm bo'lsa, silindr o'qidan AB gacha eng qisqa masofani toping.",
    expression: "R = 10, h1 = 2, h2 = 7, AB = 13",
    options: { A: "6 cm", B: "8 cm", C: "10 cm", D: "12 cm" },
    correctAnswer: 'B',
    explanation: "delta_h = 7 - 2 = 5 cm. Vatar c = sqrt(169 - 25) = 12 cm. Masofa d = sqrt(100 - 36) = 8 cm.",
    source: '17-test, 1-savol',
  },
  {
    id: 'chsb_m_8',
    subject: 'Matematika',
    topicId: 20,
    topicTitle: "Parallelepiped sirtlari bo'ylab eng qisqa yo'l",
    category: 'Geometriya',
    difficulty: 'demo_easy',
    diagramType: 'box_unfolding',
    questionText: "To'g'ri to'rtburchakli parallelepiped shaklidagi bino o'lchamlari: AB = 7 m, BC = 10 m, AE = 18 m. Kabel A nuqtadan boshlanib, old, o'ng yon va orqa sirtlari bo'ylab H nuqtaga tortiladi. Kabelning eng qisqa uzunligini toping.",
    expression: "AB = 7 m, BC = 10 m, CD = 7 m, H = 18 m",
    options: { A: "24 m", B: "32 m", C: "30 m", D: "26 m" },
    correctAnswer: 'C',
    explanation: "W = 7 + 10 + 7 = 24 m. L = sqrt(24^2 + 18^2) = sqrt(576 + 324) = 30 m.",
    source: '20-test, 1-savol',
  },

  // ==========================================
  // FIZIKA (PDF: CHSB_PRO 10-sinf Fizika)
  // ==========================================
  {
    id: 'chsb_f_1',
    subject: 'Fizika',
    topicId: 101,
    topicTitle: "To'g'ri chiziqli harakat va vektorlar",
    category: 'Kinematika',
    difficulty: 'demo_easy',
    questionText: "To'g'ri chiziq bo'ylab harakatlanayotgan jismning harakatini tavsiflashda:\nI. Koordinata (holat);\nII. Ko'chish;\nIII. Bosib o'tilgan yo'l\nkattaliklaridan qaysilarini ifodalash uchun yo'nalish ko'rsatilishi kerak?",
    options: { A: "Faqat I", B: "Faqat II", C: "I va II", D: "I va III" },
    correctAnswer: 'C',
    explanation: "Koordinata sanoq boshiga nisbatan yo'nalishga ega (+ yoki -). Ko'chish — boshlang'ich nuqtani oxirgi nuqta bilan tutashtiruvchi yo'nalgan kesma (vektor). Bosib o'tilgan yo'l esa skalyar kattalik. Demak, I va II.",
    source: 'Fizika Demo, 1-savol',
  },
  {
    id: 'chsb_f_2',
    subject: 'Fizika',
    topicId: 101,
    topicTitle: "To'g'ri chiziqli harakat va vektorlar",
    category: 'Kinematika',
    difficulty: 'demo_easy',
    questionText: "Rasmda bir to'g'ri chiziq bo'ylab joylashgan vektorlar berilgan: A_vec = 3 birlik (o'ngga), B_vec = 6 birlik (o'ngga), C_vec = 4 birlik (chapga). Ularning teng ta'sir etuvchi vektori modulini aniqlang.",
    options: { A: '5', B: '7', C: '9', D: '10' },
    correctAnswer: 'A',
    explanation: "O'ngga yo'nalganlarni musbat, chapga yo'nalganlarni manfiy olamiz: R = 3 + 6 - 4 = 5 birlik.",
    source: 'Fizika Demo, 2-savol',
  },
  {
    id: 'chsb_f_3',
    subject: 'Fizika',
    topicId: 102,
    topicTitle: "Kontakt va maydon kuchlari",
    category: 'Dinamika',
    difficulty: 'demo_easy',
    questionText: "Kuchlar haqidagi fikrlarni ularga mos izohlar bilan moslashtiring:\n1. Jismni harakatga keltiruvchi kuch jism bilan bevosita kontaktda bo'lishi shart.\n2. Kontakt kuchlari har doim itaruvchi kuch sifatida ta'sir qiladi.\n3. Maydon kuchlari tortish yoki itarish tarzida ta'sir qiladi.",
    options: {
      A: "1-A, 2-C, 3-D",
      B: "1-C, 2-A, 3-B",
      C: "1-D, 2-B, 3-A",
      D: "1-B, 2-D, 3-C"
    },
    correctAnswer: 'B',
    explanation: "1-fikrga C (Noto'g'ri, maydon kuchlari kontaktsiz ta'sir qiladi). 2-fikrga A (Noto'g'ri, masalan ip taranglik kuchi jismni tortadi). 3-fikrga B (To'g'ri, elektr va magnit kuchlar tortish yoki itarish tarzida bo'ladi). Javob: 1-C, 2-A, 3-B.",
    source: 'Fizika Demo, 3-savol',
  },
  {
    id: 'chsb_f_4',
    subject: 'Fizika',
    topicId: 103,
    topicTitle: "Tezlik-vaqt grafigi va ko'chish",
    category: 'Kinematika',
    difficulty: 'medium',
    questionText: "To'g'ri chiziqli yo'lda harakatlanayotgan avtomobilning tezlik-vaqt grafigida: 0 dan 10 s gacha tezlik -10 m/s dan 0 m/s ga, 10 dan 30 s gacha 0 dan 20 m/s ga, 30 dan 40 s gacha o'zgarmas 20 m/s tezlik bilan harakatlandi. Grafikka ko'ra avtomobilning ko'chishi necha metrga teng?",
    options: { A: '350', B: '375', C: '400', D: '450' },
    correctAnswer: 'A',
    explanation: "Ko'chish v(t) grafigi ostidagi sohalar yuzasi yig'indisiga teng. 0-10 s da: S1 = -(10 * 10)/2 = -50 m. 10-30 s da: S2 = (20 * 20)/2 = 200 m. 30-40 s da: S3 = 10 * 20 = 200 m. Jami ko'chish: -50 + 200 + 200 = 350 m.",
    source: 'Fizika Demo, 5-savol',
  },
  {
    id: 'chsb_f_5',
    subject: 'Fizika',
    topicId: 104,
    topicTitle: "Egri chiziqli harakat va aylanada o'rtacha tezlik",
    category: 'Kinematika',
    difficulty: 'medium',
    questionText: "Radiusi 20 m bo'lgan aylana shaklidagi yo'lda harakatlanayotgan avtomobil K nuqtadan yo'lga chiqib, 2 s dan keyin aylananing 3/4 qismini bosib o'tib L nuqtaga yetdi. Avtomobilning o'rtacha tezlik moduli v_ort va ko'chish vektori moduli |v_vec| necha m/s? (pi = 3 deb oling)",
    options: {
      A: "v_ort = 45 m/s; |v_vec| = 10*sqrt(2) m/s",
      B: "v_ort = 30 m/s; |v_vec| = 30 m/s",
      C: "v_ort = 10 m/s; |v_vec| = 10*sqrt(2) m/s",
      D: "v_ort = 10 m/s; |v_vec| = 10 m/s"
    },
    correctAnswer: 'A',
    explanation: "Yo'l: s = (3/4)*2*pi*R = (3/4)*2*3*20 = 90 m. v_ort = 90 / 2 = 45 m/s. Ko'chish vatar uzunligi: delta_r = R*sqrt(2) = 20*sqrt(2) m. |v_vec| = 20*sqrt(2)/2 = 10*sqrt(2) m/s.",
    source: 'Fizika Demo, 6-savol',
  },
  {
    id: 'chsb_f_6',
    subject: 'Fizika',
    topicId: 105,
    topicTitle: "Burchak ostida va gorizontal otilgan jism",
    category: 'Kinematika',
    difficulty: 'medium',
    questionText: "Havo qarshiligi hisobga olinmaydigan sharoitda jism gorizontga 37° burchak ostida 50 m/s boshlang'ich tezlik bilan otildi. Jismning gorizontal yo'nalishda bosib o'tgan masofasi x necha metr? (sin 37° = 0.6; cos 37° = 0.8; g = 10 m/s^2)",
    options: { A: '120', B: '160', C: '180', D: '240' },
    correctAnswer: 'D',
    explanation: "v0x = 50 * cos 37° = 40 m/s. v0y = 50 * sin 37° = 30 m/s. Uchish vaqti t = 2*v0y / g = 2*30/10 = 6 s. Gorizontal masofa: x = v0x * t = 40 * 6 = 240 m.",
    source: 'Fizika Demo, 9-savol',
  },
  {
    id: 'chsb_f_7',
    subject: 'Fizika',
    topicId: 106,
    topicTitle: "Nyuton qonunlari va tajribaviy xatoliklar",
    category: 'Dinamika',
    difficulty: 'hard',
    questionText: "Gorizontal yo'lda tezlanayotgan aravachaga ip orqali sharcha osildi. 1-tajriba: m=0.1 kg, a=2 m/s^2, burchak=11.3°. 2-tajriba: m=0.2 kg, a=4 m/s^2, burchak=21.8°. 3-tajriba: m=0.2 kg, a=2 m/s^2, burchak=11.4°. O'quvchi 1- va 2-tajribalarni solishtirib: 'Sharchaning massasi oshsa, ipning og'ish burchagi ham ortadi' degan xulosaga keldi. Qaysi baho eng asosli?",
    options: {
      A: "Xulosa asosli: 1 va 2 da massa ortishi bilan burchak ham ortgan.",
      B: "Xulosa asosli: 1 va 3 dagi burchaklar farqi massa ta'sirini ko'rsatadi.",
      C: "Xulosa asoslanmagan: 1 va 2 da massa bilan birga tezlanish ham o'zgargan.",
      D: "Xulosa asoslanmagan: 2 va 3 da massalar tengligi burchaklar tengligini talab qiladi."
    },
    correctAnswer: 'C',
    explanation: "1- va 2-tajribada ikkita parametr (massa ham, tezlanish ham) bir vaqtda o'zgargan. Ilmiy eksperimentda esa faqat bitta erkli o'zgaruvchi o'zgartirilishi lozim. Shuning uchun xulosa asoslanmagan.",
    source: 'Fizika Demo, 14-savol',
  },
  {
    id: 'chsb_f_8',
    subject: 'Fizika',
    topicId: 106,
    topicTitle: "Nyuton qonunlari va tajribaviy xatoliklar",
    category: 'Dinamika',
    difficulty: 'medium',
    questionText: "Fizikani bilmaydigan masxaraboz to'pdan o'q uzish paytida to'p orqasida turgani uchun snaryad otilganda to'p orqaga tepilib uni yiqitdi. Bunga ko'ra quyidagi fikrlardan qaysilari to'g'ri?\nI. Har qanday ta'sirga miqdor jihatidan teng va qarama-qarshi yo'nalgan aks ta'sir mavjud.\nII. Ta'sir va aks ta'sir kuchlar teng va qarama-qarshi bo'lgani sababli snaryadga ta'sir qiluvchi natijaviy kuch 0 ga teng.\nIII. Ta'sir kuchi snaryadga, aks ta'sir kuchi esa to'p aravachasiga ta'sir qiladi.",
    options: { A: "I, II va III", B: "Faqat II", C: "I va II", D: "I va III" },
    correctAnswer: 'D',
    explanation: "Nyutonning III qonuniga ko'ra ta'sir va aks ta'sir kuchlari teng va qarama-qarshi (I to'g'ri), lekin ular bitta jismga emas, turli jismlarga qo'yiladi (III to'g'ri). Shuning uchun ular bir-birini muvozanatlamaydi (II noto'g'ri). Javob: I va III.",
    source: 'Fizika Demo, 12-savol',
  },
  {
    id: 'chsb_f_9',
    subject: 'Fizika',
    topicId: 101,
    topicTitle: "To'g'ri chiziqli harakat va vektorlar",
    category: 'Kinematika',
    difficulty: 'medium',
    questionText: "Avtomobil to'g'ri chiziqli yo'lning K nuqtasida tinch holatda turibdi. U K nuqtadan L nuqtagacha tekis tezlanuvchan, L nuqtadan M nuqtagacha esa L nuqtadagi o'zgarmas tezligi bilan harakat qiladi. KL masofa LM masofaga teng. Avtomobilning KL masofani bosib o'tish vaqti LM masofani bosib o'tish vaqtidan necha marta katta?",
    options: { A: '1', B: '2', C: '3', D: '4' },
    correctAnswer: 'B',
    explanation: "Tekis tezlanuvchan qismda: s = v_L * t1 / 2 => t1 = 2s / v_L. Tekis harakat qismida: s = v_L * t2 => t2 = s / v_L. Demak, t1 / t2 = 2 marta katta.",
    source: 'Fizika CHSB-1, 4-savol',
  },
  {
    id: 'chsb_f_10',
    subject: 'Fizika',
    topicId: 101,
    topicTitle: "To'g'ri chiziqli harakat va vektorlar",
    category: 'Kinematika',
    difficulty: 'medium',
    questionText: "Jism x(t) = 6t - t² qonuniyat bilan to'g'ri chiziq bo'ylab harakatlanadi. Uning dastlabki 4 s ichida bosib o'tgan to'liq yo'lini toping (m).",
    options: { A: '16', B: '10', C: '12', D: '5' },
    correctAnswer: 'B',
    explanation: "v(t) = x'(t) = 6 - 2t. v(t) = 0 bo'lganda t = 3 s (jism to'xtab orqaga qaytadi). 0 dan 3 s gacha: |x(3) - x(0)| = 9 m. 3 dan 4 s gacha: |x(4) - x(3)| = 1 m. Jami yo'l: 9 + 1 = 10 m.",
    source: 'Fizika CHSB-1, 7-savol',
  },
  {
    id: 'chsb_f_11',
    subject: 'Fizika',
    topicId: 105,
    topicTitle: "Burchak ostida va gorizontal otilgan jism",
    category: 'Kinematika',
    difficulty: 'medium',
    questionText: "Jism h balandlikdagi minoradan vertikal yuqoriga 60 m/s boshlang'ich tezlik bilan otildi. Jism yerga 80 m/s tezlik bilan urildi. Havo qarshiligi hisobga olinmasa, h balandlik necha metrga teng? (g = 10 m/s²)",
    options: { A: '150', B: '140', C: '130', D: '120' },
    correctAnswer: 'B',
    explanation: "v² - v₀² = 2gh => 80² - 60² = 2 * 10 * h => 6400 - 3600 = 2800 = 20h => h = 140 m.",
    source: 'Fizika CHSB-1, 8-savol',
  },
  {
    id: 'chsb_f_12',
    subject: 'Fizika',
    topicId: 106,
    topicTitle: "Nyuton qonunlari va tajribaviy xatoliklar",
    category: 'Dinamika',
    difficulty: 'medium',
    questionText: "To'g'ri chiziqli yo'lda harakatlanayotgan K avtomobilning koordinata–vaqt va L avtomobilning tezlik–vaqt grafiklari berilgan. Grafiklarga ko'ra quyidagi fikrlardan qaysilari to'g'ri?\nI. K avtomobildagi yo'lovchilarning harakat holati o'zgarmaydi (tekis harakat);\nII. L avtomobildagi yo'lovchilar tormozlanishda inersiya tufayli oldinga tomon intiladi;\nIII. K avtomobilga ta'sir etuvchi natijaviy kuch nolga teng, L avtomobil esa noldan farqli kuch ta'sirida.",
    options: { A: 'Faqat I', B: 'I va II', C: 'I va III', D: 'I, II va III' },
    correctAnswer: 'D',
    explanation: "K avtomobil tekis to'g'ri chiziqli harakatda (inersial holat, F=0). L avtomobil esa tezlanuvchan/sekinlanuvchan bo'lib, yo'lovchilar inersiya tufayli siljiydi va natijaviy kuch noldan farqli. Javob: I, II va III.",
    source: 'Fizika CHSB-1, 10-savol',
  },
  {
    id: 'chsb_f_13',
    subject: 'Fizika',
    topicId: 106,
    topicTitle: "Nyuton qonunlari va tajribaviy xatoliklar",
    category: 'Dinamika',
    difficulty: 'medium',
    questionText: "Gorizontal silliq tekislikda turgan jismga ta'sir etuvchi kuch F = 10 N bo'lganda uning tezlanishi a = 5 m/s² bo'ldi. Shu jismga o'ng tomonga F₁ = 12 N va chap tomonga F₂ = 8 N kuchlar ta'sir ettirilsa, uning tezlanishi necha m/s² bo'ladi?",
    options: { A: '1', B: '2', C: '4', D: '6' },
    correctAnswer: 'B',
    explanation: "m = F / a = 10 / 5 = 2 kg. Natijaviy kuch: F_nat = 12 - 8 = 4 N. Yangi tezlanish: a' = 4 / 2 = 2 m/s².",
    source: 'Fizika CHSB-1, 11-savol',
  },
  {
    id: 'chsb_f_14',
    subject: 'Fizika',
    topicId: 105,
    topicTitle: "Burchak ostida va gorizontal otilgan jism",
    category: 'Kinematika',
    difficulty: 'hard',
    questionText: "Salim tangani stol sirtidan 10 m/s boshlang'ich tezlik bilan sirpantirdi. Tanga 2.5 m/s² sekinlanish bilan 2 s sirpanib, stol chetidan gorizontal uchib ketdi. Stol balandligi 1 m bo'lsa, tanga stol etagidan necha metr uzoqlikka tushadi? (g = 10 m/s²)",
    options: { A: '1 m', B: '2 m', C: '2.24 m', D: '3 m' },
    correctAnswer: 'C',
    explanation: "v = v₀ - at = 10 - 2.5 * 2 = 5 m/s. Balandlikdan tushish vaqti: t = √(2h/g) = √(0.2) s. Masofa: x = 5 * √0.2 = √5 ≈ 2.24 m.",
    source: 'Fizika CHSB-1, 13-savol',
  },
  {
    id: 'chsb_f_15',
    subject: 'Fizika',
    topicId: 106,
    topicTitle: "Nyuton qonunlari va tajribaviy xatoliklar",
    category: 'Dinamika',
    difficulty: 'demo_easy',
    questionText: "Gorizontal tekislikda tezlanish bilan harakatlanayotgan aravachaga ip orqali osilgan sharchaning ip og'ish burchagi tg(α) = a / g formulasi bilan aniqlanadi. Agar sharchaning massasi 2 marta orttirilsa, aravachaning o'sha tezlanishida ipning og'ish burchagi qanday o'zgaradi?",
    options: { A: "2 marta ortadi", B: "2 marta kamayadi", C: "O'zgarmaydi", D: "4 marta ortadi" },
    correctAnswer: 'C',
    explanation: "Ipning og'ish burchagi faqat aravachaning tezlanishi 'a' va erkin tushish tezlanishi 'g' ga bog'liq bo'lib, osilgan jism massasi 'm' ga bog'liq emas. Shuning uchun burchak o'zgarmaydi.",
    source: 'Fizika CHSB-1, 15-savol',
  },

  // ==========================================
  // INGLIZ TILI (PDF: Grade 10 English Summative Assessment & CHSB PRO)
  // ==========================================
  {
    id: 'chsb_e_1',
    subject: 'Ingliz tili',
    topicId: 201,
    topicTitle: "Vocabulary: Shopping & Money",
    category: "Vocabulary",
    difficulty: 'demo_easy',
    questionText: "If a shop gives you 10% off, you receive a ______.",
    options: { A: 'receipt', B: 'discount', C: 'refund', D: 'promotion' },
    correctAnswer: 'B',
    explanation: "A reduction in the usual price (10% off) is a 'discount'. 'Receipt' is the paper proof of payment, 'refund' is money returned.",
    source: 'English Demo, Q1',
  },
  {
    id: 'chsb_e_2',
    subject: 'Ingliz tili',
    topicId: 202,
    topicTitle: "Character Traits & Personality Adjectives",
    category: "Vocabulary",
    difficulty: 'demo_easy',
    questionText: "Which adjective describes someone who can always be trusted?",
    options: { A: 'jealous', B: 'sensitive', C: 'reliable', D: 'anxious' },
    correctAnswer: 'C',
    explanation: "'Reliable' (or trustworthy) describes a person you can depend on and trust. 'Sensitive' means easily hurt, 'anxious' means worried.",
    source: 'English Demo, Q2',
  },
  {
    id: 'chsb_e_3',
    subject: 'Ingliz tili',
    topicId: 201,
    topicTitle: "Vocabulary: Sports Collocations",
    category: "Vocabulary",
    difficulty: 'demo_easy',
    questionText: "Our basketball team played confidently and finally ______ after extra time.",
    options: {
      A: "beat the other team",
      B: "reached a goalkeeper",
      C: "scored the referee",
      D: "trained the stadium"
    },
    correctAnswer: 'A',
    explanation: "In sports collocations: you 'beat' an opponent or another team, and you 'win' a game or trophy. Therefore, 'beat the other team' is correct.",
    source: 'English Demo, Q3',
  },
  {
    id: 'chsb_e_4',
    subject: 'Ingliz tili',
    topicId: 201,
    topicTitle: "Vocabulary: Natural Disasters",
    category: "Vocabulary",
    difficulty: 'demo_easy',
    questionText: "Which natural event is a dangerous wind that moves in a circle?",
    options: { A: 'flood', B: 'earthquake', C: 'lightning', D: 'tornado' },
    correctAnswer: 'D',
    explanation: "A 'tornado' is a violently rotating column of air (funnel). An earthquake is ground shaking, flood is water overflowing.",
    source: 'English Demo, Q4',
  },
  {
    id: 'chsb_e_5',
    subject: 'Ingliz tili',
    topicId: 203,
    topicTitle: "Countable vs Uncountable Nouns & Quantifiers",
    category: "Grammar",
    difficulty: 'demo_easy',
    questionText: "Although the website contained ______ useful information, we still needed to ask the teacher for help.",
    options: { A: 'many', B: 'a few', C: 'a lot of', D: 'several' },
    correctAnswer: 'C',
    explanation: "'Information' is an uncountable noun. 'Many', 'a few', and 'several' can only be used with countable plural nouns. 'A lot of' works with uncountable nouns.",
    source: 'English Demo, Q5',
  },
  {
    id: 'chsb_e_6',
    subject: 'Ingliz tili',
    topicId: 203,
    topicTitle: "Countable vs Uncountable Nouns & Quantifiers",
    category: "Grammar",
    difficulty: 'medium',
    questionText: "Choose the grammatically correct sentence.",
    options: {
      A: "There aren't many furniture stores in our town.",
      B: "We bought a few new furniture yesterday.",
      C: "There isn't much information about the sale online.",
      D: "She gave me many useful advice."
    },
    correctAnswer: 'C',
    explanation: "'Information' is uncountable, so 'There isn't much information' is completely correct. (B is wrong because furniture is uncountable; D is wrong because advice is uncountable).",
    source: 'English Demo, Q6',
  },
  {
    id: 'chsb_e_7',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Gerund (-ing) vs Infinitive (to do) & Used to",
    category: "Grammar",
    difficulty: 'demo_easy',
    questionText: "Which sentence is grammatically correct?",
    options: {
      A: "My brother doesn't mind to help his classmates.",
      B: "My brother doesn't mind helping his classmates.",
      C: "My brother doesn't mind help his classmates.",
      D: "My brother doesn't mind helped his classmates."
    },
    correctAnswer: 'B',
    explanation: "The verb 'mind' is always followed by a gerund (V-ing): 'doesn't mind helping'.",
    source: 'English Demo, Q7',
  },
  {
    id: 'chsb_e_8',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Present Continuous for Future Arrangements",
    category: "Grammar",
    difficulty: 'demo_easy',
    questionText: "Emma has a presentation tomorrow. She ______ her classmates after school to prepare together.",
    options: { A: 'meets', B: 'met', C: 'is meeting', D: 'has met' },
    correctAnswer: 'C',
    explanation: "Present Continuous ('is meeting') is used for pre-arranged future personal plans with a fixed time/place ('tomorrow', 'after school').",
    source: 'English Demo, Q8',
  },
  {
    id: 'chsb_e_9',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Present Simple vs Present Continuous",
    category: "Grammar",
    difficulty: 'medium',
    questionText: "My older brother ______ computer games every evening, but tonight he ______ for his exam.",
    options: {
      A: "is playing / studies",
      B: "played / studied",
      C: "plays / is studying",
      D: "play / studies"
    },
    correctAnswer: 'C',
    explanation: "'Every evening' indicates a regular habit (Present Simple: plays). 'Tonight' indicates a temporary action happening now/this evening (Present Continuous: is studying).",
    source: 'English Demo, Q9',
  },
  {
    id: 'chsb_e_10',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Used to for Past Habits",
    category: "Grammar",
    difficulty: 'demo_easy',
    questionText: "Last year, my grandfather ______ near the sea, but now he lives in the city.",
    options: { A: 'is living', B: 'lives', C: 'used to live', D: 'was living' },
    correctAnswer: 'C',
    explanation: "'Used to live' expresses a past state or habit that is no longer true in the present ('but now he lives in the city').",
    source: 'English Demo, Q11',
  },
  {
    id: 'chsb_e_11',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Past Continuous vs Past Simple",
    category: "Grammar",
    difficulty: 'medium',
    questionText: "I ______ home when I suddenly ______ my English teacher.",
    options: {
      A: "walked / was meeting",
      B: "was walking / met",
      C: "met / was walking",
      D: "walk / met"
    },
    correctAnswer: 'B',
    explanation: "A long background continuous action (was walking) is interrupted by a sudden short event in Past Simple (met).",
    source: 'English Demo, Q13',
  },
  {
    id: 'chsb_e_12',
    subject: 'Ingliz tili',
    topicId: 205,
    topicTitle: "Reading Comprehension: Shopping Smart",
    category: "Reading",
    difficulty: 'medium',
    questionText: "Shopping Smart\nNina wanted to buy a new backpack. The first shop sold a fashionable one for $60. She almost bought it immediately. Before paying, she checked two more shops. The second shop had exactly the same backpack for $45 and also offered a free water bottle. Nina bought it there and used the money she saved to buy a notebook for school.\n\nWhy was checking more than one shop a good decision?",
    options: {
      A: "She found a different colour to buy backpack.",
      B: "She spent less money and received an extra gift.",
      C: "She decided not to buy a backpack to save money.",
      D: "She exchanged her old backpack to the new one."
    },
    correctAnswer: 'B',
    explanation: "She bought the same backpack for $45 instead of $60 (saving $15) and received a free water bottle (an extra gift).",
    source: 'English Demo, Q14',
  },
  {
    id: 'chsb_e_13',
    subject: 'Ingliz tili',
    topicId: 205,
    topicTitle: "Reading Comprehension: Team Project",
    category: "Reading",
    difficulty: 'medium',
    questionText: "Team Project\nFour students had to prepare a presentation. Amir searched for information, Maya designed the slides, Leo practiced speaking, and Sara checked all the facts. They finished one day early because everyone completed their own task on time and helped each other whenever someone needed support.\n\nWhich statement best explains why the group succeeded?",
    options: {
      A: "One student did most of the work.",
      B: "The project was very easy to explain and presenting.",
      C: "Each member had a clear role and cooperated.",
      D: "The teacher completed the difficult parts and helped for checking."
    },
    correctAnswer: 'C',
    explanation: "Each student was responsible for a specific part (research, slides, speaking, facts) and they collaborated and supported each other.",
    source: 'English Demo, Q15',
  },
  {
    id: 'chsb_e_14',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Past Continuous vs Past Simple",
    category: "Grammar",
    difficulty: 'demo_easy',
    questionText: "I ______ dinner when my friend ______ me.",
    options: {
      A: "cook / called",
      B: "was cooking / was calling",
      C: "cooked / was calling",
      D: "was cooking / called"
    },
    correctAnswer: 'D',
    explanation: "A continuous action in progress (was cooking) was interrupted by a single completed action in Past Simple (called).",
    source: 'English CHSB-1, Q13',
  },
  {
    id: 'chsb_e_15',
    subject: 'Ingliz tili',
    topicId: 205,
    topicTitle: "Reading Comprehension: Phone Problem",
    category: "Reading",
    difficulty: 'medium',
    questionText: "Phone Problem\nAziz's phone screen broke. The first repair shop wanted $80 and three days to fix it. A second shop fixed it for $50 in one hour and gave a six-month guarantee.\n\nWhy was the second shop a better choice?",
    options: {
      A: "It was cheaper, faster and gave a guarantee.",
      B: "It was closer to Aziz's school.",
      C: "It gave Aziz a free case only.",
      D: "It sold new phones."
    },
    correctAnswer: 'A',
    explanation: "The second shop charged $50 instead of $80 (cheaper), took 1 hour instead of 3 days (faster), and included a six-month guarantee.",
    source: 'English CHSB-1, Q14',
  },
  {
    id: 'chsb_e_16',
    subject: 'Ingliz tili',
    topicId: 205,
    topicTitle: "Reading Comprehension: School Garden",
    category: "Reading",
    difficulty: 'medium',
    questionText: "School Garden\nFive students created a garden at school. Ali bought seeds, Sara planned the beds, Tom watered the plants, and Lola and Mia made signs. Because everyone did their part, the garden was ready in two weeks.\n\nWhich statement best explains why the project succeeded?",
    options: {
      A: "Everyone had a task and did it.",
      B: "Ali did all the work alone.",
      C: "The teacher planted everything.",
      D: "The garden was very small."
    },
    correctAnswer: 'A',
    explanation: "Each student was responsible for a specific task and completed their part responsibly, allowing the project to finish in two weeks.",
    source: 'English CHSB-1, Q15',
  },
  {
    id: 'chsb_e_17',
    subject: 'Ingliz tili',
    topicId: 201,
    topicTitle: "Vocabulary: Shopping & Money",
    category: "Vocabulary",
    difficulty: 'demo_easy',
    questionText: "If you return a product and the shop gives your money back, you get a ______.",
    options: { A: 'discount', B: 'bargain', C: 'refund', D: 'receipt' },
    correctAnswer: 'C',
    explanation: "When a customer returns a product and gets their money back, that is a 'refund'.",
    source: 'English CHSB-1, Q1',
  },
  {
    id: 'chsb_e_18',
    subject: 'Ingliz tili',
    topicId: 204,
    topicTitle: "Gerund (-ing) vs Infinitive (to do)",
    category: "Grammar",
    difficulty: 'demo_easy',
    questionText: "Which sentence is grammatically correct?",
    options: {
      A: "She enjoys read detective stories.",
      B: "She enjoys reads detective stories.",
      C: "She enjoys to read detective stories.",
      D: "She enjoys reading detective stories."
    },
    correctAnswer: 'D',
    explanation: "The verb 'enjoy' is always followed by a gerund (V-ing): 'enjoys reading'.",
    source: 'English CHSB-1, Q7',
  }
];
