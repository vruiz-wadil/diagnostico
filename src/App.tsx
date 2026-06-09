/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  AlertTriangle,
  Rocket,
  Zap,
  Search,
  Activity,
  X,
  House
} from 'lucide-react';
import { QUESTIONS, LEVELS_CONFIG, CATEGORIES } from './config';
import { AssessmentResult, CompanyLevel, Option } from './types';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  icon?: string;
}

const ANALYSIS_STEPS = [
  "Analizando patrones de gestión...",
  "Evaluando madurez operativa...",
  "Cruzando datos de eficiencia financiera...",
  "Identificando cuellos de botella estructurales...",
  "Generando plan de acción personalizado..."
];

const WadilLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <svg 
      viewBox="0 0 943 238" 
      className="h-10 md:h-11 w-auto object-contain flex-shrink-0"
      aria-label="Wadil AI Studio Logo"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_120_466)">
        <path d="M35.9049 0.0532359L78.8524 110.944L125.259 0L159.638 0.834029L204.129 110.944L248.602 0.0532359H282.574L223.678 143.737C223.075 144.518 222.206 144.447 221.354 144.553C217.505 144.997 185.006 145.21 183.427 144.163L142.076 41.4353L99.5545 143.737L59.3211 144.127L0 0.0532359H35.9049Z" fill="#1C3C6D"/>
        <path d="M515.583 0.0532227H626.42C654.413 0.0532227 681.022 27.6472 683.044 55.0637C685.297 85.4791 684.144 118.592 655.158 135.752C649.109 139.336 634.828 144.5 627.998 144.5H515.601L514.43 143.329V1.22441L515.601 0.0532227H515.583ZM547.177 117.971H618.596C652.071 117.971 653.189 83.0835 650.971 58.2401C649.712 44.2035 636.62 27.381 621.719 27.381H547.177V117.971Z" fill="#1C3C6D"/>
        <path d="M281.793 144.5L357.896 0.834029L396.178 0L473.043 144.5H436.748L377.8 30.5219L318.478 144.5H281.793Z" fill="#1C3C6D"/>
        <path d="M852.386 0.0532227V117.971H942.947C943.16 118.539 942.166 118.911 942.166 119.142V142.566C942.166 142.796 943.248 143.666 942.947 144.535H820.384V0.0532227H852.386Z" fill="#1C3C6D"/>
        <path d="M763.405 0.0532227H731.402V144.5H763.405V0.0532227Z" fill="#1C3C6D"/>
        <path d="M70.6035 193.087H87.119L109.382 237.13H97.6031L91.8555 225.454H65.8493L60.1017 237.13H48.4113L70.5857 193.087H70.6035ZM88.5737 218.8L78.9056 199.226L69.2375 218.8H88.5914H88.5737Z" fill="#BE2026" stroke="#BE2026"/>
        <path d="M170.264 193.087H181.671V237.13H170.264V193.087Z" fill="#BE2026" stroke="#BE2026"/>
        <path d="M309.999 226.678C309.999 226.235 309.999 226.182 310.088 226.004L321.405 225.064V225.507C321.405 229.677 323.694 231.097 330.435 231.097H341.575C348.245 231.097 350.516 229.677 350.516 225.436V224.389C350.516 220.982 348.778 219.971 341.664 219.296L325.876 217.735C314.469 216.617 310.354 213.937 310.354 207.478V203.627C310.354 195.979 315.835 192.448 327.508 192.448H344.396C356.175 192.448 361.55 195.997 361.55 203.503V204.177L350.144 205.1V204.674C350.144 200.575 347.855 199.138 341.203 199.138H330.896C324.137 199.138 321.76 200.575 321.76 204.798V205.544C321.76 209.022 323.321 209.891 330.701 210.637L346.489 212.198C357.984 213.316 361.923 215.978 361.923 222.508V226.607C361.923 234.185 356.53 237.734 344.768 237.734H327.242C315.463 237.734 309.999 234.185 309.999 226.678Z" fill="#1C3C6D"/>
        <path d="M441.059 199.794H420.605V193.087H472.99V199.794H452.448V237.13H441.041V199.794H441.059Z" fill="#1C3C6D"/>
        <path d="M567.294 237.734H551.222C539.443 237.734 533.979 234.185 533.979 226.607V193.069H545.385V225.436C545.385 229.66 547.674 231.097 554.415 231.097H564.083C570.753 231.097 573.024 229.677 573.024 225.436V193.069H584.43V226.607C584.43 234.185 579.037 237.734 567.276 237.734H567.294Z" fill="#1C3C6D"/>
        <path d="M700.447 204.266V226.004C700.447 233.581 694.965 237.13 683.293 237.13H650.705V193.087H683.293C694.983 193.087 700.447 196.636 700.447 204.266ZM680.011 199.794H662.129V230.476H680.011C686.77 230.476 689.04 229.039 689.04 224.815V205.437C689.04 201.214 686.752 199.777 680.011 199.777V199.794Z" fill="#1C3C6D"/>
        <path d="M765.888 193.087H777.295V237.13H765.888V193.087Z" fill="#1C3C6D"/>
        <path d="M894.589 203.645V226.625C894.589 234.202 889.196 237.751 877.435 237.751H860.085C848.306 237.751 842.842 234.202 842.842 226.625V203.645C842.842 195.997 848.324 192.465 860.085 192.465H877.435C889.214 192.465 894.589 196.015 894.589 203.645ZM874.224 199.173H863.278C856.52 199.173 854.249 200.611 854.249 204.834V225.454C854.249 229.677 856.537 231.115 863.278 231.115H874.224C880.982 231.115 883.164 229.695 883.164 225.454V204.834C883.164 200.611 880.982 199.173 874.224 199.173Z" fill="#1C3C6D"/>
      </g>
      <defs>
        <clipPath id="clip0_120_466">
          <rect width="943" height="238" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </div>
);

const WadilLogoWhite = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center ${className}`}>
    <svg 
      viewBox="0 0 943 238" 
      className="h-10 md:h-11 w-auto object-contain flex-shrink-0"
      aria-label="Wadil AI Studio Logo White"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_120_485)">
        <path d="M35.9049 0.0532359L78.8524 110.944L125.259 0L159.638 0.834029L204.129 110.944L248.602 0.0532359H282.574L223.678 143.737C223.075 144.518 222.206 144.447 221.354 144.553C217.505 144.997 185.006 145.21 183.427 144.163L142.076 41.4353L99.5545 143.737L59.3211 144.127L0 0.0532359H35.9049Z" fill="white"/>
        <path d="M515.583 0.0532227H626.42C654.413 0.0532227 681.022 27.6472 683.044 55.0637C685.297 85.4791 684.144 118.592 655.158 135.752C649.109 139.336 634.828 144.5 627.998 144.5H515.601L514.43 143.329V1.22441L515.601 0.0532227H515.583ZM547.177 117.971H618.596C652.071 117.971 653.189 83.0835 650.971 58.2401C649.712 44.2035 636.62 27.381 621.719 27.381H547.177V117.971Z" fill="white"/>
        <path d="M281.793 144.5L357.896 0.834029L396.178 0L473.043 144.5H436.748L377.8 30.5219L318.478 144.5H281.793Z" fill="white"/>
        <path d="M852.386 0.0532227V117.971H942.947C943.16 118.539 942.166 118.911 942.166 119.142V142.566C942.166 142.796 943.248 143.666 942.947 144.535H820.384V0.0532227H852.386Z" fill="white"/>
        <path d="M763.405 0.0532227H731.402V144.5H763.405V0.0532227Z" fill="white"/>
        <path d="M70.6035 193.087H87.119L109.382 237.131H97.6031L91.8555 225.454H65.8493L60.1017 237.131H48.4113L70.5857 193.087H70.6035ZM88.5737 218.8L78.9056 199.227L69.2375 218.8H88.5914H88.5737Z" fill="white" stroke="white"/>
        <path d="M170.264 193.087H181.671V237.131H170.264V193.087Z" fill="white" stroke="white"/>
        <path d="M309.999 226.678C309.999 226.235 309.999 226.182 310.088 226.004L321.405 225.064V225.507C321.405 229.677 323.694 231.097 330.435 231.097H341.575C348.245 231.097 350.516 229.677 350.516 225.436V224.389C350.516 220.982 348.778 219.971 341.664 219.296L325.876 217.735C314.469 216.617 310.354 213.937 310.354 207.478V203.627C310.354 195.979 315.835 192.448 327.508 192.448H344.396C356.175 192.448 361.55 195.997 361.55 203.503V204.177L350.144 205.1V204.674C350.144 200.575 347.855 199.138 341.203 199.138H330.896C324.137 199.138 321.76 200.575 321.76 204.798V205.544C321.76 209.022 323.321 209.891 330.701 210.637L346.489 212.198C357.984 213.316 361.923 215.978 361.923 222.508V226.607C361.923 234.185 356.53 237.734 344.768 237.734H327.242C315.463 237.734 309.999 234.185 309.999 226.678Z" fill="white"/>
        <path d="M441.059 199.794H420.605V193.087H472.99V199.794H452.448V237.131H441.041V199.794H441.059Z" fill="white"/>
        <path d="M567.294 237.734H551.222C539.443 237.734 533.979 234.185 533.979 226.607V193.069H545.385V225.436C545.385 229.66 547.674 231.097 554.415 231.097H564.083C570.753 231.097 573.024 229.677 573.024 225.436V193.069H584.43V226.607C584.43 234.185 579.037 237.754 567.276 237.734H567.294Z" fill="white"/>
        <path d="M700.447 204.266V226.004C700.447 233.581 694.965 237.131 683.293 237.131H650.705V193.087H683.293C694.983 193.087 700.447 196.636 700.447 204.266ZM680.011 199.794H662.129V230.476H680.011C686.77 230.476 689.04 229.039 689.04 224.815V205.437C689.04 201.214 686.752 199.777 680.011 199.777V199.794Z" fill="white"/>
        <path d="M765.888 193.087H777.295V237.131H765.888V193.087Z" fill="white"/>
        <path d="M894.589 203.645V226.625C894.589 234.203 889.196 237.752 877.435 237.752H860.085C848.306 237.752 842.842 234.203 842.842 226.625V203.645C842.842 195.997 848.324 192.466 860.085 192.466H877.435C889.214 192.466 894.589 196.015 894.589 203.645ZM874.224 199.173H863.278C856.52 199.173 854.249 200.611 854.249 204.834V225.454C854.249 229.677 856.537 231.115 863.278 231.115H874.224C880.982 231.115 883.164 229.695 883.164 225.454V204.834C883.164 200.611 880.982 199.173 874.224 199.173Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_120_485">
          <rect width="943" height="238" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </div>
);

const WadilEmblem = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 283 145" 
    className={className}
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M35.9049 0.0532359L78.8524 110.944L125.259 0L159.638 0.834029L204.129 110.944L248.602 0.0532359H282.574L223.678 143.737C223.075 144.518 222.206 144.447 221.354 144.553C217.505 144.997 185.006 145.21 183.427 144.163L142.076 41.4353L99.5545 143.737L59.3211 144.127L0 0.0532359H35.9049Z" 
      fill="currentColor"
    />
  </svg>
);

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{ questionId: number; questionText: string; answerLabel: string; points: number }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fab = (
    <a href="https://wadil.mx"
       className="fixed bottom-6 right-6 z-50 flex items-center bg-wad-red-600 hover:bg-wad-red-500 text-white rounded-full shadow-lg cursor-pointer transition-all duration-200 h-12 overflow-hidden w-12 hover:w-[8.5rem] group">
      <div className="flex items-center justify-center w-12 h-12 shrink-0">
        <House className="w-5 h-5" strokeWidth={2} />
      </div>
      <span className="font-display font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 pr-4">
        Regresar
      </span>
    </a>
  );

  const initialized = useRef(false);

  useEffect(() => {
    if (!isStarted || initialized.current) return;
    initialized.current = true;

    const welcome = async () => {
      setCurrentQuestionIndex(0);
    };
    welcome();
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (currentSessionId) {
      const contactInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        submittedAt: new Date().toISOString()
      };

      try {
        await updateDoc(doc(db, 'sessions', currentSessionId), {
          contactInfo: contactInfo
        });
        console.log('Session updated with contact info:', currentSessionId);
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `sessions/${currentSessionId}`);
        } catch (e) {
          console.error('Silent/logged Firestore error on lead update:', e);
        }
      }
    }

    // Send email via PHP (LAMP server)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        score: score,
        level: getResult().level,
        answers: userAnswers
      };

      const response = await fetch('./send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log('Email sending outcome:', data);
    } catch (err) {
      console.error('Error sending email:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Effect to handle bot "sending" the next question
  useEffect(() => {
    if (currentQuestionIndex !== null && currentQuestionIndex < QUESTIONS.length) {
      const askQuestion = async () => {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1000));
        const question = QUESTIONS[currentQuestionIndex];
        const questionMessage: Message = {
          id: `q-${question.id}`,
          type: 'bot',
          text: question.text
        };
        setMessages(prev => [...prev, questionMessage]);
        setIsTyping(false);
      };
      askQuestion();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionSelect = async (option: Option) => {
    if (currentQuestionIndex === null || isTyping) return;

    const question = QUESTIONS[currentQuestionIndex];
    const newAnswer = {
      questionId: question.id,
      questionText: question.text,
      answerLabel: option.label,
      points: option.points
    };
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    // Add user message
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'user', text: option.label, icon: option.icon }
    ]);

    const newScore = score + option.points;
    setScore(newScore);
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setCurrentQuestionIndex(null);
      startAnalysis(newScore, updatedAnswers);
    }
  };

  const startAnalysis = async (finalScore: number, finalAnswers: Array<{ questionId: number; questionText: string; answerLabel: string; points: number }>) => {
    setIsAnalyzing(true);
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 1200));
    }

    // Generate a unique session ID and save session to Firestore
    const newSessionId = 'ses_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    setCurrentSessionId(newSessionId);

    const resultObj = getResultByScore(finalScore);
    const sessionData = {
      id: newSessionId,
      score: finalScore,
      level: resultObj.level,
      createdAt: new Date().toISOString(),
      answers: finalAnswers
    };

    try {
      await setDoc(doc(db, 'sessions', newSessionId), sessionData);
      console.log('Session saved to Firestore:', newSessionId);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `sessions/${newSessionId}`);
      } catch (e) {
        console.error('Silent/logged Firestore error on session save:', e);
      }
    }

    setIsAnalyzing(false);
    setShowResult(true);
  };

  const getResultByScore = (targetScore: number): AssessmentResult => {
    const maxScore = QUESTIONS.length * 3;
    const config = LEVELS_CONFIG.find(c => targetScore >= c.minScore) || LEVELS_CONFIG[LEVELS_CONFIG.length - 1];
    
    return { 
      totalScore: targetScore, 
      maxScore, 
      level: config.level, 
      feedback: config.feedback 
    };
  };

  const getResult = (): AssessmentResult => {
    return getResultByScore(score);
  };

  const reset = () => {
    setMessages([]);
    setScore(0);
    setUserAnswers([]);
    setCurrentSessionId(null);
    setShowResult(false);
    setIsUnlocked(true);
    setFormData({ name: '', email: '', phone: '' });
    setShowContactModal(false);
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setIsStarted(false);
    initialized.current = false;
  };

  const currentQuestion = currentQuestionIndex !== null ? QUESTIONS[currentQuestionIndex] : null;
  const progressPercent = currentQuestionIndex !== null ? (currentQuestionIndex / QUESTIONS.length) * 100 : showResult || isAnalyzing ? 100 : 0;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-wad-bg flex flex-col items-center justify-center font-sans text-wad-ink-800 p-6 md:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full text-center"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-12">
            <a href="https://wadil.mx" className="flex items-center">
              <WadilLogo className="scale-110" />
            </a>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight text-wad-ink-800 mb-6 antialiased">
            ¿Qué tan preparada está tu empresa?
          </h1>
          
          <p className="text-wad-ink-600 text-base md:text-lg font-normal mb-10 leading-relaxed max-w-md mx-auto">
            Descubre en 2 minutos el nivel de madurez de tu negocio y obtén recomendaciones personalizadas.
          </p>

          <div className="bg-wad-bg-soft rounded-wad-2xl p-6 md:p-8 mb-10 border border-wad-ink-100/70 text-left space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-white border border-wad-ink-100 rounded-wad-md flex items-center justify-center shrink-0 shadow-xs">
                <Search className="w-5 h-5 text-wad-navy-500" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base md:text-lg text-wad-ink-800 mb-1">Assessment rápido y práctico</h3>
                <p className="text-wad-ink-600 text-sm font-normal">15 preguntas simples sobre tus procesos actuales</p>
              </div>
            </div>

            <div className="w-full h-px bg-wad-ink-100/60" />

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-white border border-wad-ink-100 rounded-wad-md flex items-center justify-center shrink-0 shadow-xs">
                <ChevronRight className="w-5 h-5 text-wad-navy-500" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base md:text-lg text-wad-ink-800 mb-1">Resultados instantáneos</h3>
                <p className="text-wad-ink-600 text-sm font-normal">Análisis personalizado y siguientes pasos</p>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleStart}
            className="w-full h-14 bg-wad-red-600 hover:bg-wad-red-500 text-white rounded-wad-md font-display font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors duration-150 text-base md:text-lg pointer-events-auto cursor-pointer"
          >
            <span>Comenzar assessment</span>
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </motion.button>

          <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-wad-ink-300 font-bold uppercase tracking-widest pb-4">
            <span>🔒</span>
            <span>Tu información es confidencial · Wadil AI Studio</span>
          </div>
        </motion.div>
        {fab}
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-wad-bg flex flex-col items-center justify-center font-sans text-wad-ink-800 p-6 md:p-12 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-16">
            <WadilLogo className="scale-110" />
          </div>

          {/* Analysis Animation */}
          <div className="relative mb-12">
             <div className="flex justify-center items-center h-48">
              {/* Circular Progress */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-wad-navy-100" />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="74"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={465}
                    animate={{ strokeDashoffset: 465 - (465 * (analysisStep + 1)) / ANALYSIS_STEPS.length }}
                    transition={{ duration: 0.8 }}
                    strokeLinecap="round"
                    className="text-wad-navy-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <Activity className="w-8 h-8 text-wad-navy-400 mb-2 animate-pulse" strokeWidth={2} />
                   <span className="text-xl font-display font-semibold text-wad-ink-800">{Math.round(((analysisStep + 1) / ANALYSIS_STEPS.length) * 100)}%</span>
                </div>
              </div>
             </div>
          </div>

          {/* Status Message */}
          <div className="h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={analysisStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <p className="text-base md:text-lg font-display font-semibold text-wad-ink-800 mb-2">
                  {ANALYSIS_STEPS[analysisStep]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-16 text-[10px] text-wad-ink-300 font-bold uppercase tracking-widest bg-white border border-wad-ink-100 px-4 py-2 rounded-full inline-block">
             PROCESANDO DIAGNÓSTICO ESTRATÉGICO
          </div>
        </motion.div>
        {fab}
      </div>
    );
  }

  if (showResult) {
    const result = getResult();
    const resultPercent = (result.totalScore / result.maxScore) * 100;

    // Process feedback text: Split intro and details
    const fullText = result.feedback;
    const blocks = fullText.split('\n\n');
    
    // Improved subtitle detection: Look for lines that are mostly uppercase or special sections
    const firstSubtitleIndex = blocks.findIndex((b, i) => {
      if (i === 0) return false;
      const trimmed = b.trim();
      if (!trimmed) return false;
      const firstLine = trimmed.split('\n')[0];
      // Match lines that look like section titles (mostly uppercase, icons, or specific keywords)
      return /[A-ZÁÉÍÓÚÑ]{4,}/.test(firstLine) || firstLine.includes('✅') || firstLine.includes('⚠️');
    });

    const introParts = firstSubtitleIndex !== -1 ? blocks.slice(1, firstSubtitleIndex) : blocks.slice(1);
    let detailParts = firstSubtitleIndex !== -1 ? blocks.slice(firstSubtitleIndex) : [];
    
    // Fallback: If no subtitles detected but there are multiple blocks, treat everything after intro as details
    if (detailParts.length === 0 && blocks.length > 2) {
      detailParts = blocks.slice(2);
    }

    // Add extra line breaks after every period for the intro
    const introText = introParts.join(' ');
    const formattedIntro = introText
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join('.\n\n') + (introText.includes('.') ? '.' : '');

    // Parse detail parts into structured sections
    const detailSections = detailParts.map(block => {
      const lines = block.split('\n').filter(l => l.trim());
      const title = lines[0];
      const items = lines.slice(1);
      
      let type: 'strength' | 'risk' | 'opportunity' | 'recommendation' | 'general' = 'general';
      const t = title.toUpperCase();
      if (t.includes('FORTALEZAS')) type = 'strength';
      else if (t.includes('RIESGO') || t.includes('SEÑALES') || t.includes('ZONA ROJA') || t.includes('PASA')) type = 'risk';
      else if (t.includes('OPORTUNIDAD')) type = 'opportunity';
      else if (t.includes('RECOMENDACIÓN') || t.includes('PLAN') || t.includes('NECESITA')) type = 'recommendation';

      return { title, items, type };
    });

    const getSectionStyles = (title: string, type: string) => {
      const t = title.toUpperCase();
      switch (type) {
        case 'strength': 
          return { 
            icon: Award, 
            bg: 'bg-white', 
            border: 'border-wad-ink-100', 
            text: 'text-wad-ink-800', 
            iconColor: 'text-wad-success', 
            iconBg: 'bg-wad-success/10' 
          };
        case 'risk': 
          const riskIcon = t.includes('SEÑALES') ? Search : AlertTriangle;
          return { 
            icon: riskIcon, 
            bg: 'bg-white', 
            border: 'border-wad-red-100', 
            text: 'text-wad-ink-800', 
            iconColor: 'text-wad-danger', 
            iconBg: 'bg-wad-danger/10' 
          };
        case 'opportunity': 
          return { 
            icon: Rocket, 
            bg: 'bg-white', 
            border: 'border-wad-ink-100', 
            text: 'text-wad-ink-800', 
            iconColor: 'text-wad-navy-500', 
            iconBg: 'bg-wad-navy-500/10' 
          };
        case 'recommendation': 
          return { 
            icon: Target, 
            bg: 'bg-wad-navy-050', 
            border: 'border-wad-navy-100', 
            text: 'text-wad-navy-900', 
            iconColor: 'text-wad-red-600', 
            iconBg: 'bg-white border border-wad-red-100' 
          };
        default: 
          const genIcon = t.includes('PASA') ? Activity : Users;
          return { 
            icon: genIcon, 
            bg: 'bg-white', 
            border: 'border-wad-ink-100', 
            text: 'text-wad-ink-800', 
            iconColor: 'text-wad-navy-400', 
            iconBg: 'bg-wad-navy-100/50' 
          };
      }
    };

    const styles = LEVELS_CONFIG.find(c => score >= c.minScore)?.styles || LEVELS_CONFIG[LEVELS_CONFIG.length - 1].styles;

  return (
    <div className="min-h-screen bg-wad-bg-soft flex flex-col font-sans text-wad-ink-800 relative overflow-x-hidden">
      <AnimatePresence>
        {showContactModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-wad-navy-900/50 backdrop-blur-xs" onClick={() => setShowContactModal(false)} />
            <motion.div 
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              className="bg-white rounded-wad-2xl p-8 md:p-10 shadow-xl max-w-lg w-full relative z-10 border border-wad-ink-100/60"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-wad-ink-400 hover:text-wad-ink-600 hover:bg-wad-bg-soft transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>

              {isSubmitted ? (
                <div className="flex flex-col items-center text-center py-8">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-wad-navy-050 text-wad-success rounded-wad-md border border-wad-navy-100 flex items-center justify-center mb-6 shadow-xs"
                  >
                    <CheckCircle2 className="w-8 h-8" strokeWidth={2} />
                  </motion.div>
                  <h4 className="font-display font-bold text-2xl text-wad-ink-800 mb-3">¡Información recibida!</h4>
                  <p className="text-wad-ink-600 font-sans text-sm mb-8 leading-relaxed">
                    La información se ha compartido y en breve lo contactaremos para coordinar su sesión ejecutiva.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setShowContactModal(false);
                      setIsSubmitted(false);
                    }}
                    className="w-full h-12 bg-wad-navy-500 hover:bg-wad-navy-600 text-white rounded-wad-md font-display font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Entendido
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="mb-4">
                      <WadilLogo className="scale-110" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-wad-ink-800 mb-3 tracking-tight">
                      Agenda tu sesión ejecutiva
                    </h3>
                    <p className="text-wad-ink-600 font-sans text-sm leading-relaxed">
                      Completa tus datos para coordinar una sesión corporativa 1 a 1 y personalizar el plan de acción para tu empresa.
                    </p>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-display font-bold uppercase tracking-widest text-wad-ink-400 ml-1">Nombre completo <span className="lowercase font-normal text-wad-ink-300">(opcional)</span></label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 bg-white border border-wad-ink-100 rounded-wad-md font-sans text-sm text-wad-ink-800 placeholder-wad-ink-300 focus:ring-4 focus:ring-wad-navy-050 focus:border-wad-navy-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-display font-bold uppercase tracking-widest text-wad-ink-400 ml-1">Correo corporativo <span className="lowercase font-normal text-wad-ink-300">(opcional)</span></label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ejemplo@tuempresa.com"
                        className="w-full px-4 py-3 bg-white border border-wad-ink-100 rounded-wad-md font-sans text-sm text-wad-ink-800 placeholder-wad-ink-300 focus:ring-4 focus:ring-wad-navy-050 focus:border-wad-navy-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-display font-bold uppercase tracking-widest text-wad-ink-400 ml-1">WhatsApp / Teléfono <span className="text-wad-red-600 font-bold">*</span></label>
                      <input 
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+52 ..."
                        className="w-full px-4 py-3 bg-white border border-wad-ink-100 rounded-wad-md font-sans text-sm text-wad-ink-800 placeholder-wad-ink-300 focus:ring-4 focus:ring-wad-navy-050 focus:border-wad-navy-500 outline-none transition-all"
                      />
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full h-12 bg-wad-red-600 hover:bg-wad-red-500 text-white rounded-wad-md font-display font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors duration-150 text-base mt-2 cursor-pointer"
                    >
                      <span>Agendar sesión ejecutiva</span>
                      <ChevronRight className="w-5 h-5" strokeWidth={2} />
                    </motion.button>
                  </form>

                  <p className="mt-6 text-center text-[10px] text-wad-ink-400 font-bold uppercase tracking-wider">
                    🔒 Tus datos están protegidos y son confidenciales.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex flex-col flex-1 transition-all duration-1000 ${!isUnlocked ? 'blur-3xl' : 'blur-0'}`}>
        {/* Refined Professional Header */}
        <nav className="h-16 bg-white border-b border-wad-ink-100/60 px-8 flex items-center justify-between flex-shrink-0 z-20">
          <a href="https://wadil.mx" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <WadilLogo className="scale-75 origin-left" />
          </a>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold text-wad-ink-400">{QUESTIONS.length}/{QUESTIONS.length}</span>
              <div className="w-24 bg-wad-bg-soft h-1.5 rounded-full overflow-hidden border border-wad-ink-100/50">
                <div className="bg-wad-navy-500 h-full w-full" />
              </div>
            </div>
          </div>
        </nav>
        
        <div className="bg-white px-8 py-2 border-b border-wad-ink-100/30 text-center">
          <span className="text-wad-ink-500 font-display font-bold text-xs">Diagnóstico empresarial · Asesor AI</span>
        </div>

        {/* Main Container - Results Focused */}
        <main className="flex-1 bg-wad-bg-soft overflow-x-hidden">
          <div className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
            {/* Striking Results Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-wad-navy-900 border-t-4 border-wad-red-600 border border-wad-navy-800 rounded-wad-2xl p-8 md:p-10 mb-10 relative overflow-hidden text-white shadow-xs"
            >
              <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-16 -mt-8">
                <WadilLogo className="scale-[2.5] origin-top-right" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                {/* Score Graphic on Left */}
                <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-wad-navy-800" />
                    <motion.circle
                      cx="88"
                      cy="88"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={502}
                      initial={{ strokeDashoffset: 502 }}
                      animate={{ strokeDashoffset: 502 - (502 * resultPercent) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      className="text-wad-red-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-display font-bold">
                      {result.totalScore}
                      <span className="text-2xl opacity-40 ml-1">/45</span>
                    </span>
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest mt-1 text-wad-navy-300">Puntos</span>
                  </div>
                </div>

                {/* Info on Right */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-wad-red-100/10 rounded-full text-wad-red-400 font-display text-xs font-bold tracking-wider mb-4 border border-wad-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-wad-red-600 animate-pulse" />
                    Diagnóstico finalizado
                  </span>
                  <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 tracking-tight leading-tight">
                    {result.level.split(' ').slice(1).join(' ')}
                  </h2>
                  <div className="leading-relaxed font-sans text-sm md:text-base text-wad-navy-200 whitespace-pre-wrap max-w-xl">
                    {formattedIntro}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Detailed Content Below */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-6"
            >
            {/* Dashboard grid of detailed insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {detailSections.map((section, idx) => {
                  const s = getSectionStyles(section.title, section.type);
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className={`${s.bg} border ${s.border} rounded-wad-2xl p-6 shadow-xs group ${
                        idx === detailSections.length - 1 && detailSections.length % 2 !== 0
                          ? 'md:col-span-2'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2.5 rounded-wad-md ${s.iconBg} ${s.iconColor} flex items-center justify-center shadow-xs`}>
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <h4 className="font-display font-bold text-sm uppercase tracking-wider text-wad-ink-800">
                          {section.title.replace(/[✅⚠️●\-\n]/g, '').trim()}
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex gap-2.5 items-start">
                            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${section.type === 'recommendation' ? 'bg-wad-red-600' : 'bg-wad-navy-500'}`} />
                            <p className="text-sm font-sans font-normal leading-relaxed text-wad-ink-600 flex-1">
                              {item.replace(/[✅⚠️●\-\*]/g, '').trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Bottom Actions and Final CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center"
            >
              <div id="cta-container" className="w-full p-8 md:p-12 bg-wad-navy-900 border-t-4 border-wad-red-600 border border-wad-navy-800 rounded-wad-2xl text-center mb-12 overflow-hidden relative group shadow-sm">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-wad-navy-850 rounded-full blur-3xl opacity-50" />
                </div>

                <motion.div
                  initial={{ scale: 0.98, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <div className="flex justify-center mb-6">
                    <WadilLogoWhite className="scale-110" />
                  </div>
                  
                  <h3 id="cta-title" className="font-display font-bold text-2xl md:text-3xl text-white mb-4 leading-tight max-w-2xl mx-auto">
                    ¿Quieres saber exactamente qué hacer en tu caso?
                  </h3>
                  
                  <p id="cta-description" className="text-wad-navy-200 font-sans text-sm md:text-base mb-8 leading-relaxed max-w-xl mx-auto">
                    Solicita una sesión ejecutiva confidencial con <span className="font-display font-bold text-white">Wadil AI Studio</span> para maximizar tu valor empresarial.
                  </p>

                  <motion.button 
                    id="cta-button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="inline-flex items-center gap-2 h-12 px-10 bg-wad-red-600 hover:bg-wad-red-500 text-white rounded-wad-md font-display font-semibold transition-colors text-base shadow-xs pointer-events-auto cursor-pointer"
                    onClick={() => setShowContactModal(true)}
                  >
                    <span>Contáctanos ahora</span>
                    <ChevronRight className="w-5 h-5" strokeWidth={2} />
                  </motion.button>
                  
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-wad-navy-300 font-display font-bold text-[10px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-wad-red-500" strokeWidth={2} /> Sesión 1 a 1</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-wad-red-500" strokeWidth={2} /> Plan de acción</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-wad-red-500" strokeWidth={2} /> Confidencial</span>
                  </div>
                </motion.div>
              </div>

              <button 
                onClick={reset}
                className="flex items-center gap-1.5 text-wad-ink-400 hover:text-wad-ink-600 font-display font-bold text-xs transition-colors uppercase tracking-widest mb-10 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                Volver a empezar
              </button>
            </motion.div>
            </motion.div>
          </div>
        </main>
        {fab}
      </div>
    </div>
    );
  }

  return (
    <div className="h-screen bg-wad-bg-soft flex flex-col font-sans text-wad-ink-800 overflow-hidden relative">
      {/* Refined Professional Header */}
      <nav className="h-16 bg-white border-b border-wad-ink-100/60 px-8 flex items-center justify-between flex-shrink-0 z-20">
        <a href="https://wadil.mx" target="_blank" rel="noopener noreferrer" className="flex items-center">
          <WadilLogo className="scale-75 origin-left" />
        </a>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-4">
            <a href="https://wadil.mx" className="text-xs font-display font-bold text-wad-red-600 hover:text-wad-red-500 transition-colors">
              Inicio
            </a>
            <span className="text-xs font-display font-bold text-wad-ink-400">{currentQuestionIndex !== null ? currentQuestionIndex + 1 : showResult ? QUESTIONS.length : 1}/{QUESTIONS.length}</span>
            <div className="w-24 bg-wad-bg-soft h-1.5 rounded-full overflow-hidden border border-wad-ink-100/50">
              <motion.div 
                animate={{ width: `${progressPercent}%` }}
                className="bg-wad-navy-500 h-full transition-all duration-500" 
              />
            </div>
          </div>
        </div>
      </nav>
      
      <div className="bg-white px-8 py-2 border-b border-wad-ink-100/30 text-center flex-shrink-0">
        <span className="text-wad-ink-500 font-display font-bold text-xs">Diagnóstico empresarial · Asesor AI</span>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full relative z-10 px-4 py-8">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-6 scroll-smooth pb-12 pr-1"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 items-start ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-wad-md bg-wad-navy-050 border border-wad-navy-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-xs p-1.5 text-wad-navy-600">
                    <WadilEmblem />
                  </div>
                )}
                
                <div 
                  className={`relative px-5 py-3.5 rounded-wad-xl text-sm leading-relaxed whitespace-pre-wrap flex items-center gap-2 shadow-xs ${
                    msg.type === 'user' 
                      ? 'bg-wad-navy-700 text-white rounded-tr-xs border border-wad-navy-800' 
                      : 'bg-white text-wad-ink-700 border border-wad-ink-100/60 rounded-tl-xs w-full max-w-[85%]'
                  }`}
                >
                  {msg.type === 'user' && msg.icon && (
                    <span className="text-base shrink-0">{msg.icon}</span>
                  )}
                  <span className="font-sans font-normal">{msg.text}</span>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex gap-3.5 items-start justify-start"
              >
                <div className="w-8 h-8 rounded-wad-md bg-wad-navy-050 border border-wad-navy-100 flex items-center justify-center flex-shrink-0 shadow-xs p-1.5 text-wad-navy-600">
                  <WadilEmblem />
                </div>
                <div className="bg-white border border-wad-ink-100/60 px-5 py-3.5 rounded-wad-xl rounded-tl-xs flex gap-1.5 items-center shadow-xs">
                  <div className="w-1.5 h-1.5 bg-wad-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-wad-navy-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-wad-navy-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            {/* Selection Buttons */}
            {currentQuestionIndex !== null && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-4 ml-11 max-w-[90%]"
              >
                {QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className="w-full sm:w-auto bg-white border border-wad-ink-100/80 hover:border-wad-navy-400 hover:bg-wad-navy-050/50 px-5 py-3.5 rounded-wad-md text-sm font-semibold text-wad-ink-800 transition-all flex items-center gap-2.5 shadow-xs text-left cursor-pointer group pointer-events-auto"
                  >
                    {opt.icon && <span className="text-base shrink-0">{opt.icon}</span>}
                    <span className="font-display font-bold">{opt.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Status Area */}
        <div className="flex flex-col gap-3 pt-4 border-t border-wad-ink-100/40 flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-wad-ink-400 font-bold uppercase tracking-widest">
            <span>🔒</span>
            <span>Tu información es confidencial · Wadil AI Studio</span>
          </div>
        </div>
      </main>
      {fab}
    </div>
  );
}
