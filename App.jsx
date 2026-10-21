import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, CheckCircle, Clock, Search, Lock, 
  Plus, Trash2, Edit3, Globe, Sparkles, UserCheck, 
  PlayCircle, FileText, ChevronRight, Volume2, Shield, Menu, X
} from 'lucide-react';

// --- البيانات المبدئية للمناهج المصرية ---
const INITIAL_LESSONS = [
  {
    id: '1',
    stage: 'primary',
    grade: 'Primary 4',
    title: 'Unit 1: Connect - Present Simple',
    type: 'grammar',
    content: 'نستخدم زمن المضارع البسيط للتعبير عن الحقائق والعادات اليومية. التكوين: I/We/They + Verb, He/She/It + Verb(s).',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioText: 'I go to school every day. She likes English.'
  },
  {
    id: '2',
    stage: 'prep',
    grade: 'Prep 2',
    title: 'Unit 3: Past Continuous vs Past Simple',
    type: 'grammar',
    content: 'While + Past Continuous (was/were + v-ing), Past Simple (v2). يعبر عن حدث كان مستمراً عندما قطعه حدث آخر.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioText: 'While I was studying, the phone rang.'
  },
  {
    id: '3',
    stage: 'secondary',
    grade: 'Secondary 3',
    title: 'Unit 1: Past Tenses & Thanawya Amma Tips',
    type: 'cheat-sheet',
    content: 'كبسولة الثانوية العامة: الفرق بين Past Perfect و Past Perfect Continuous والإحروف الجر الهامة مع التراكيب.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    audioText: 'By the time the exam started, he had revised all units.'
  }
];

const INITIAL_QUIZZES = [
  {
    id: 'q1',
    stage: 'primary',
    grade: 'Primary 4',
    title: 'اختبار سريع - المضارع البسيط',
    questions: [
      {
        id: 1,
        question: 'He _______ to school by bus every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 1,
        explanation: 'مع المفرد الغائب (He/She/It) نضيف s أو es للفعل في المضارع البسيط.'
      },
      {
        id: 2,
        question: 'They _______ play football on Fridays.',
        options: ['doesn\'t', 'don\'t', 'isn\'t', 'aren\'t'],
        correctAnswer: 1,
        explanation: 'نستخدم don\'t لنفي المضارع البسيط مع الضمائر الجمع I/We/They/You.'
      }
    ]
  },
  {
    id: 'q2',
    stage: 'secondary',
    grade: 'Secondary 3',
    title: 'امتحان قواعد الشامل - ثانوية عامة',
    questions: [
      {
        id: 1,
        question: 'By next year, I _______ my university degree.',
        options: ['will complete', 'will have completed', 'completed', 'have completed'],
        correctAnswer: 1,
        explanation: 'تركيب (By + زمن مستقبلي) يدل على المستقبل التام Future Perfect (will have + P.P).'
      }
    ]
  }
];

const FLASHCARDS = [
  { id: 1, word: 'Curriculum', translation: 'منهج دراسي', example: 'The Egyptian English curriculum is modern.' },
  { id: 2, word: 'Grammar', translation: 'قواعد اللغة', example: 'Mastering grammar helps you score high.' },
  { id: 3, word: 'Vocabulary', translation: 'حصيلة المفردات', example: 'Learn 5 new words daily.' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('student');
  const [selectedStage, setSelectedStage] = useState('primary');
  const [selectedGrade, setSelectedGrade] = useState('Primary 4');
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('خاصية الصوت غير مدعومة في متصفحك.');
    }
  };

  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  const [isAuth, setIsAuth] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [newLesson, setNewLesson] = useState({ stage: 'primary', grade: 'Primary 4', title: '', type: 'grammar', content: '', videoUrl: '' });

  const stages = [
    { id: 'primary', name: 'المرحلة الابتدائية', grades: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'] },
    { id: 'prep', name: 'المرحلة الإعدادية', grades: ['Prep 1', 'Prep 2', 'Prep 3'] },
    { id: 'secondary', name: 'المرحلة الثانوية', grades: ['Secondary 1', 'Secondary 2', 'Secondary 3'] }
  ];

  const handleQuizSubmit = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore({
      score,
      total: activeQuiz.questions.length,
      percentage: Math.round((score / activeQuiz.questions.length) * 100)
    });
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.content) return;
    const item = { ...newLesson, id: Date.now().toString() };
    setLessons([item, ...lessons]);
    setNewLesson({ stage: 'primary', grade: 'Primary 4', title: '', type: 'grammar', content: '', videoUrl: '' });
    alert('تم إضافة الدرس بنجاح!');
  };

  const handleDeleteLesson = (id) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans dir-rtl" dir="rtl">
      <header className="bg-indigo-950 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-cyan-500 text-indigo-950 p-2 rounded-xl font-black text-xl flex items-center gap-1">
              <span>Q</span>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide text-cyan-400">Quzman in English</h1>
              <p className="text-xs text-indigo-200">منصة كوزمان التعليمية للغة الإنجليزية في مصر</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <button 
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'student' ? 'bg-cyan-500 text-indigo-950' : 'hover:bg-indigo-900'}`}
            >
              بوابة الطلاب (دخول مباشر)
            </button>
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition border border-indigo-700 ${activeTab === 'teacher' ? 'bg-amber-400 text-indigo-950' : 'hover:bg-indigo-900 text-amber-300'}`}
            >
              <Lock className="w-4 h-4 inline ml-1" />
              لوحة التحكم للمعلمين
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-900 px-4 py-3 space-y-2 border-t border-indigo-800">
            <button 
              onClick={() => { setActiveTab('student'); setMobileMenuOpen(false); }}
              className="w-full text-right py-2 px-3 rounded bg-indigo-800 text-cyan-300 font-bold"
            >
              بوابة الطلاب
            </button>
            <button 
              onClick={() => { setActiveTab('teacher'); setMobileMenuOpen(false); }}
              className="w-full text-right py-2 px-3 rounded bg-amber-500 text-indigo-950 font-bold"
            >
              لوحة تحكم المعلمين
            </button>
          </div>
        )}
      </header>

      {activeTab === 'student' && (
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-cyan-800 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="bg-amber-400 text-indigo-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">مجاني 100% للطلاب</span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">تفوق في الإنجليزي بكل سهولة مع كوزمان!</h2>
              <p className="text-indigo-100 text-sm md:text-base mb-6">
                شروحات مبسطة لكل مراحل التعليم المصرية (ابتدائي، إعدادي، وثانوي)، قواعد، كلمات، واختبارات تفاعلية بتصحيح فوري.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-950 flex items-center gap-2">
              <BookOpen className="text-cyan-600" />
              اختر مرحلتك الدراسية:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stages.map((stg) => (
                <button
                  key={stg.id}
                  onClick={() => {
                    setSelectedStage(stg.id);
                    setSelectedGrade(stg.grades[0]);
                  }}
                  className={`p-5 rounded-2xl border-2 text-right transition-all flex flex-col justify-between ${
                    selectedStage === stg.id 
                      ? 'border-cyan-500 bg-white shadow-lg ring-2 ring-cyan-400' 
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <span className="font-extrabold text-lg text-indigo-950">{stg.name}</span>
                  <span className="text-xs text-slate-500 mt-2">{stg.grades.join(' • ')}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {stages.find(s => s.id === selectedStage)?.grades.map((grd) => (
                <button
                  key={grd}
                  onClick={() => setSelectedGrade(grd)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                    selectedGrade === grd 
                      ? 'bg-indigo-900 text-white shadow' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {grd}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
              <Volume2 className="text-amber-500" />
              قاموس كوزمان السريع ونطق الكلمات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FLASHCARDS.map((card) => (
                <div key={card.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-lg text-indigo-900">{card.word}</span>
                    <button 
                      onClick={() => speakText(card.word)}
                      className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full text-indigo-900"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-cyan-700">{card.translation}</p>
                  <p className="text-xs text-slate-500 italic">"{card.example}"</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-indigo-950 flex items-center justify-between">
                <span>الدروس والشروحات لصف ({selectedGrade})</span>
                <span className="text-xs text-slate-500 font-normal">عدد الدروس: {lessons.filter(l => l.grade === selectedGrade).length}</span>
              </h3>

              {lessons.filter(l => l.grade === selectedGrade).length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-300">
                  <p className="text-slate-500">لا توجد دروس مضافة لهذا الصف حالياً.</p>
                </div>
              ) : (
                lessons.filter(l => l.grade === selectedGrade).map((lesson) => (
                  <div key={lesson.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-cyan-400 transition">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                        {lesson.type === 'grammar' ? 'القواعد (Grammar)' : 'ملخص كبسولة'}
                      </span>
                      <button 
                        onClick={() => setActiveLesson(lesson)}
                        className="text-xs text-cyan-600 font-bold hover:underline flex items-center gap-1"
                      >
                        عرض الشرح
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                    <h4 className="font-bold text-lg text-slate-900">{lesson.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{lesson.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                <Award className="text-amber-500" />
                الاختبارات التفاعلية
              </h3>

              {quizzes.filter(q => q.grade === selectedGrade).length === 0 ? (
                <div className="bg-white p-6 rounded-2xl text-center border border-slate-200">
                  <p className="text-xs text-slate-500">لا توجد اختبارات مجهزة لصف {selectedGrade} بعد.</p>
                </div>
              ) : (
                quizzes.filter(q => q.grade === selectedGrade).map((quiz) => (
                  <div key={quiz.id} className="bg-indigo-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
                    <h4 className="font-bold text-md">{quiz.title}</h4>
                    <p className="text-xs text-indigo-200">عدد الأسئلة: {quiz.questions.length}</p>
                    <button
                      onClick={() => {
                        setActiveQuiz(quiz);
                        setQuizAnswers({});
                        setQuizScore(null);
                      }}
                      className="w-full py-2 bg-amber-400 text-indigo-950 font-bold rounded-xl hover:bg-amber-300 text-sm transition"
                    >
                      ابدأ الاختبار الآن
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {activeLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-xl text-indigo-950">{activeLesson.title}</h3>
              <button onClick={() => setActiveLesson(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line">{activeLesson.content}</p>

            {activeLesson.audioText && (
              <div className="p-4 bg-indigo-50 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-indigo-900 text-sm">{activeLesson.audioText}</span>
                <button 
                  onClick={() => speakText(activeLesson.audioText)}
                  className="p-2 bg-indigo-600 text-white rounded-lg flex items-center gap-1 text-xs"
                >
                  <Volume2 className="w-4 h-4" /> استمع
                </button>
              </div>
            )}

            <button 
              onClick={() => setActiveLesson(null)}
              className="w-full py-2 bg-slate-200 text-slate-800 rounded-xl font-bold mt-4"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {activeQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-xl text-indigo-950">{activeQuiz.title}</h3>
                <p className="text-xs text-slate-500">صف: {activeQuiz.grade}</p>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!quizScore ? (
              <div className="space-y-6">
                {activeQuiz.questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="font-bold text-indigo-950">{idx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                          className={`p-3 rounded-lg text-right text-sm font-medium transition ${
                            quizAnswers[idx] === optIdx 
                              ? 'bg-indigo-900 text-white font-bold' 
                              : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleQuizSubmit}
                  className="w-full py-3 bg-cyan-500 text-indigo-950 font-black rounded-xl hover:bg-cyan-400 transition"
                >
                  إنهاء وتصحيح الاختبار
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <Award className="w-16 h-16 text-amber-500 mx-auto mb-2" />
                  <h4 className="text-2xl font-black text-indigo-950">درجتك: {quizScore.score} / {quizScore.total}</h4>
                  <p className="text-sm font-bold text-cyan-700 mt-1">النسبة المئوية: {quizScore.percentage}%</p>
                </div>

                <div className="space-y-4 text-right">
                  <h5 className="font-bold text-slate-900 border-b pb-2">مراجعة الإجابات:</h5>
                  {activeQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                      <p className="font-bold text-slate-800">{q.question}</p>
                      <p className=
