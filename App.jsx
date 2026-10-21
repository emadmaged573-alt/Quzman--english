```react
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, GraduationCap, Lock, LogOut, CheckCircle2, XCircle, 
  Plus, Trash2, FileText, Video, Award, Users, Copy, Check, 
  HelpCircle, ChevronRight, BarChart2, Eye, Download, Search, Sparkles
} from 'lucide-react';

// --- SAMPLE INITIAL DATA FOR LOCALSTORAGE ---
const initialLessons = [
  {
    id: 'l1',
    title: 'الوحدة الأولى: Grammar - Present Perfect vs Past Simple',
    grade: '1sec',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'ملف شرح وافي ومبسط مع تدريبات على زمن المضارع التام والماضي البسيط للصف الأول الثانوي.',
    date: '2026-10-15'
  },
  {
    id: 'l2',
    title: 'شرح بالفيديو: Advanced Vocabulary & Idioms',
    grade: '3sec',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'محاضرة شاملة لتغطية أهم مفردات ومصطلحات التميز للثانوية العامة.',
    date: '2026-10-18'
  },
  {
    id: 'l3',
    title: 'ملخص القواعد الأساسية - Unit 3 Relative Clauses',
    grade: '2sec',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'ملخص ملحق بضمائر الوصل وحالات حذف Who / Which / That للصف الثاني الثانوي.',
    date: '2026-10-20'
  }
];

const initialQuizzes = [
  {
    id: 'q1',
    title: 'اختبار شامل - Grammer Unit 1',
    grade: '1sec',
    timeLimit: 15, // mins
    questions: [
      {
        id: 'q1_1',
        text: 'I __________ English since 2018.',
        options: ['have studied', 'studied', 'study', 'am studying'],
        correctAnswer: 0,
        explanation: 'نستخدم المضارع التام (have studied) لوجود الكلمة الدالة since المتبوعة بسنة محدودة.'
      },
      {
        id: 'q1_2',
        text: 'Yesterday, Ali __________ to the library.',
        options: ['has gone', 'went', 'goes', 'will go'],
        correctAnswer: 1,
        explanation: 'كلمة Yesterday تدل على حدث انتهى في الماضي في زمن المحدد، لذا نستخدم الماضي البسيط went.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'كويز التميز - الصف الثالث الثانوي (Conditional Sentences)',
    grade: '3sec',
    timeLimit: 20,
    questions: [
      {
        id: 'q2_1',
        text: 'If he had trained well, he __________ the match.',
        options: ['will win', 'would win', 'would have won', 'wins'],
        correctAnswer: 2,
        explanation: 'الحالة الشرطية الثالثة (If + Past Perfect -> would + have + P.P).'
      },
      {
        id: 'q2_2',
        text: 'Provided that you work hard, you __________ your goals.',
        options: ['achieved', 'will achieve', 'would achieve', 'achieves'],
        correctAnswer: 1,
        explanation: 'تُعامل Provided that معاملة If في الحالة الأولى (مضارع بسيط -> مستقبل بسيط).'
      }
    ]
  }
];

const initialStudents = [
  { id: 'STU-101', name: 'أحمد محمد علي', grade: '1sec', code: 'STU-101', scoreCount: 1, avgScore: 100 },
  { id: 'STU-202', name: 'سارة محمود', grade: '2sec', code: 'STU-202', scoreCount: 0, avgScore: 0 },
  { id: 'STU-303', name: 'عمر خالد', grade: '3sec', code: 'STU-303', scoreCount: 1, avgScore: 85 }
];

export default function App() {
  // State variables
  const [view, setView] = useState('landing'); // 'landing', 'teacher-login', 'teacher-dash', 'student-dash', 'take-quiz'
  const [teacherPasscode, setTeacherPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // App Data stored in LocalStorage
  const [lessons, setLessons] = useState(() => {
    const saved = localStorage.getItem('qz_lessons');
    return saved ? JSON.parse(saved) : initialLessons;
  });

  const [quizzes, setQuizzes] = useState(() => {
    const saved = localStorage.getItem('qz_quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('qz_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [quizResults, setQuizResults] = useState(() => {
    const saved = localStorage.getItem('qz_results');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected Student / Active Session
  const [selectedGrade, setSelectedGrade] = useState('1sec');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [currentStudent, setCurrentStudent] = useState(null);

  // Teacher UI Sub-tabs
  const [teacherTab, setTeacherTab] = useState('lessons'); // 'lessons', 'add-lesson', 'quizzes', 'add-quiz', 'students', 'stats'

  // Form states for New Lesson
  const [newLesson, setNewLesson] = useState({
    title: '',
    grade: '1sec',
    type: 'pdf',
    url: '',
    description: ''
  });

  // Form states for New Quiz
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    grade: '1sec',
    timeLimit: 15,
    questions: [
      { text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
    ]
  });

  // New Student ID Generator Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('1sec');
  const [copiedCode, setCopiedCode] = useState('');

  // Persist Data
  useEffect(() => {
    localStorage.setItem('qz_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('qz_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('qz_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('qz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  // Helper Labels
  const getGradeName = (code) => {
    switch (code) {
      case '1sec': return 'الصف الأول الثانوي';
      case '2sec': return 'الصف الثاني الثانوي';
      case '3sec': return 'الصف الثالث الثانوي';
      default: return code;
    }
  };

  // Handlers - Teacher Login
  const handleTeacherLogin = (e) => {
    e.preventDefault();
    if (teacherPasscode === 'quzman5656') {
      setView('teacher-dash');
      setLoginError('');
      setTeacherPasscode('');
    } else {
      setLoginError('كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.');
    }
  };

  // Handlers - Student Login
  const handleStudentLogin = (e) => {
    e.preventDefault();
    const found = students.find(s => s.code.trim().toUpperCase() === studentCodeInput.trim().toUpperCase());
    if (found) {
      setCurrentStudent(found);
      setSelectedGrade(found.grade);
      setView('student-dash');
    } else {
      alert('كود الطالب غير صحيح! يمكنك الدخول كزائر واستكشاف الدروس.');
    }
  };

  // Add Lesson
  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newLesson.title || !newLesson.url) return;
    
    const lessonObj = {
      ...newLesson,
      id: 'l_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    setLessons([lessonObj, ...lessons]);
    setNewLesson({ title: '', grade: '1sec', type: 'pdf', url: '', description: '' });
    setTeacherTab('lessons');
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذا المحتوى؟')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  // Add Question to New Quiz Form
  const addQuestionToQuiz = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        { text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
      ]
    });
  };

  const updateQuizQuestion = (qIndex, field, value) => {
    const updatedQs = [...newQuiz.questions];
    updatedQs[qIndex][field] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQs });
  };

  const updateQuizOption = (qIndex, oIndex, value) => {
    const updatedQs = [...newQuiz.questions];
    updatedQs[qIndex].options[oIndex] = value;
    setNewQuiz({ ...newQuiz, questions: updatedQs });
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    if (!newQuiz.title || newQuiz.questions.length === 0) return;

    const quizObj = {
      ...newQuiz,
      id: 'q_' + Date.now(),
    };

    setQuizzes([quizObj, ...quizzes]);
    setNewQuiz({
      title: '',
      grade: '1sec',
      timeLimit: 15,
      questions: [{ text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
    });
    setTeacherTab('quizzes');
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm('هل تريد حذف هذا الكويز نهائياً؟')) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  // Add Student Code Generator
  const handleGenerateStudentCode = (e) => {
    e.preventDefault();
    if (!newStudentName) return;

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newCode = `QZ-${newStudentGrade.toUpperCase()}-${codeNum}`;
    
    const studentObj = {
      id: 'stu_' + Date.now(),
      name: newStudentName,
      grade: newStudentGrade,
      code: newCode,
      scoreCount: 0,
      avgScore: 0
    };

    setStudents([studentObj, ...students]);
    setNewStudentName('');
  };

  const copyToClipboard = (text) => {
    document.execCommand('copy');
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  // Student Quiz Submission
  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentAnswers({});
    setQuizSubmitted(false);
    setView('take-quiz');
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setCurrentAnswers({
      ...currentAnswers,
      [qId]: optionIdx
    });
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(currentAnswers).length < activeQuiz.questions.length) {
      if (!window.confirm('لم تقم بالإجابة على جميع الأسئلة، هل أنت تأكد من تسليم الكويز الآن؟')) {
        return;
      }
    }

    let correctCount = 0;
    activeQuiz.questions.forEach(q => {
      if (currentAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);

    const resultObj = {
      id: 'res_' + Date.now(),
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentName: currentStudent ? currentStudent.name : 'طالب زائر',
      grade: selectedGrade,
      score: scorePct,
      date: new Date().toLocaleDateString('ar-EG')
    };

    setQuizResults([resultObj, ...quizResults]);
    setQuizSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans dir-rtl" dir="rtl">
      
      {/* HEADER NAVBAR */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-indigo-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
                Quzman in English
              </h1>
              <p className="text-xs text-slate-400">منصة أستاذ قزمان للغة الإنجليزية</p>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center space-x-3 space-x-reverse">
            {view === 'landing' && (
              <>
                <button
                  onClick={() => setView('student-dash')}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition"
                >
                  دخول الطلاب
                </button>
                <button
                  onClick={() => setView('teacher-login')}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  لوحة المعلم
                </button>
              </>
            )}

            {(view === 'teacher-dash' || view === 'student-dash' || view === 'take-quiz') && (
              <button
                onClick={() => setView('landing')}
                className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            )}
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 1. LANDING PAGE */}
        {view === 'landing' && (
          <div className="space-y-16 py-8">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                المنصة الأولى للتميز في اللغة الإنجليزية للمرحلة الثانوية
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                تعلم الإنجليزية بأسلوب متطور مع <span className="text-indigo-400">أستاذ قزمان</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                شروحات وافية للمناهج، ملفات PDF ملخصة، واختبارات تفاعلية فورية مع إجابات نموذجية وشرح تفصيلي لكل الإجابات.
              </p>

              {/* Login / Quick Start Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                
                {/* Student Login Box */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 text-right hover:border-indigo-500/50 transition shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">بوابة الطلاب</h3>
                  <p className="text-sm text-slate-400 mb-6">أدخل كود الطالب الخاص بك أو تصفح الدروس والكويزات بشكل مباشر.</p>
                  
                  <form onSubmit={handleStudentLogin} className="space-y-3">
                    <input
                      type="text"
                      placeholder="أدخل كود الطالب (مثال: STU-101)"
                      value={studentCodeInput}
                      onChange={(e) => setStudentCodeInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
                      >
                        دخول برقم الطالب
                      </button>
                      <button
                        type="button"
                        onClick={() => setView('student-dash')}
                        className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition"
                      >
                        دخول كزائر
                      </button>
                    </div>
                  </form>
                </div>

                {/* Teacher Login Entrance */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 text-right hover:border-emerald-500/50 transition shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">لوحة المعلم</h3>
                    <p className="text-sm text-slate-400 mb-6">إضافة المحتوى التعليمي، رفع ملفات PDF، وتصميم الكويزات مع تحديد الإجابات الصحيحة.</p>
                  </div>
                  <button
                    onClick={() => setView('teacher-login')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    تسجيل دخول المعلم
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>

              </div>
            </div>

            {/* Grades Preview Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[
                { grade: '1sec', title: 'الصف الأول الثانوي', desc: 'تأسيس القواعد والكلمات واختبارات تفاعلية' },
                { grade: '2sec', title: 'الصف الثاني الثانوي', desc: 'تمكين القواعد المتقدمة والترجمة والقصة' },
                { grade: '3sec', title: 'الصف الثالث الثانوي', desc: 'إعداد شامل للثانوية العامة وكويزات التميز' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/70 transition">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. TEACHER LOGIN MODAL */}
        {view === 'teacher-login' && (
          <div className="max-w-md mx-auto my-12 bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">لوحة تحكم المعلم</h2>
              <p className="text-sm text-slate-400">يرجى إدخال كود المرور للوصول إلى اللوحة</p>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">كود المرور (Passcode)</label>
                <input
                  type="password"
                  value={teacherPasscode}
                  onChange={(e) => setTeacherPasscode(e.target.value)}
                  placeholder="أدخل Passcode"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition text-center tracking-widest text-lg"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-r