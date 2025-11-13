import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, CheckCircle, Eye, X, Zap } from 'lucide-react';
import './App.css';

export default function CyberSecurityLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [hackedCount, setHackedCount] = useState(8547);
  const [testResults, setTestResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setHackedCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const testQuestions = [
    {
      id: 1,
      title: "¿Cuál de estas es tu contraseña típica?",
      options: [
        { text: "Tu fecha de nacimiento (15031990)", score: 1 },
        { text: "Tu nombre + número (Juan123)", score: 2 },
        { text: "Abc123!@#XyZ", score: 4 }
      ]
    },
    {
      id: 2,
      title: "Recibes un email de 'PayPal' pidiendo verificar tu cuenta...",
      options: [
        { text: "Hago clic en el enlace del email inmediatamente", score: 1 },
        { text: "Verifico la dirección del email y voy directamente a PayPal", score: 4 },
        { text: "Doy mis datos en el email por si acaso", score: 0 }
      ]
    },
    {
      id: 3,
      title: "¿Usas la MISMA contraseña en...?",
      options: [
        { text: "Sí, en TODO (banco, redes, email, etc)", score: 1 },
        { text: "Tengo 2 o 3 contraseñas que reutilizo", score: 2 },
        { text: "Contraseña única para cada sitio importante", score: 4 }
      ]
    },
    {
      id: 4,
      title: "¿Has activado autenticación en 2 pasos en...?",
      options: [
        { text: "¿Autenticación de qué? Nunca lo escuché", score: 1 },
        { text: "Solo en el banco", score: 2 },
        { text: "En banco, email, redes sociales y apps principales", score: 4 }
      ]
    },
    {
      id: 5,
      title: "Ves una red WiFi pública sin contraseña...",
      options: [
        { text: "Me conecto al instante para ahorrar datos", score: 1 },
        { text: "Me conecto pero solo navego", score: 2 },
        { text: "Evito conectarme o uso VPN si es necesario", score: 4 }
      ]
    }
  ];

  const handleTestAnswer = (questionId, optionScore) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionScore }));
  };

  const calculateTestResults = () => {
    const totalScore = Object.values(userAnswers).reduce((sum, score) => sum + score, 0);
    const maxScore = testQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    let risk = {
      level: 'CRÍTICO',
      emoji: '🚨',
      message: '¡Eres un objetivo FÁCIL para los hackers!',
      advice: 'Necesitas protegerte YA.'
    };

    if (percentage >= 75) {
      risk = {
        level: 'SEGURO',
        emoji: '🛡️',
        message: '¡Estás bastante protegido!',
        advice: 'Descubre los últimos trucos de seguridad.'
      };
    } else if (percentage >= 50) {
      risk = {
        level: 'MODERADO',
        emoji: '⚠️',
        message: 'Estás a mitad de camino, pero hay riesgos.',
        advice: 'Aprende qué cambios hacer AHORA.'
      };
    }

    setTestResults({ percentage, level: risk.level, emoji: risk.emoji, message: risk.message, advice: risk.advice });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 border-b border-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="font-black text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            🔒 SafeClick
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="hidden sm:inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            ⚡ Protégete YA
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-center">
          <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block px-4 py-2 bg-red-100 rounded-full mb-6 animate-pulse">
              <span className="text-red-700 font-black text-sm">🚨 {hackedCount.toLocaleString()} hackeados HOY</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 text-gray-900">
              Tu Contraseña
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                ESTÁ EN PELIGRO
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-10 font-semibold">
              El 73% reutiliza contraseña. Los hackers lo saben. <span className="text-red-600 font-black">¿Cuánto tiempo te queda?</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mb-8">
              <button 
                onClick={() => setShowTest(true)}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg hover:shadow-2xl transition-all hover:scale-110 animate-bounce"
              >
                🎯 Saber Mi Riesgo (60 seg)
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="px-8 py-4 rounded-full border-3 border-purple-600 text-purple-600 font-black text-lg hover:bg-purple-50 transition-all"
              >
                Protegerme Gratis
              </button>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl">
                <div className="text-7xl animate-bounce mb-4">🛡️</div>
                <h3 className="font-black text-2xl text-gray-900 mb-2">PROTECCIÓN INMEDIATA</h3>
                <p className="text-gray-600 mb-4">En 5 minutos aprenderás a:</p>
                <ul className="space-y-2 mb-6">
                  {["✅ Crear contraseñas IMPOSIBLES", "✅ Activar 2 pasos", "✅ Detectar estafas", "✅ Dormir tranquilo"].map((item, i) => (
                    <li key={i} className="font-semibold text-gray-700">{item}</li>
                  ))}
                </ul>
                <button 
                  onClick={() => setShowTest(true)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:shadow-xl transition-all hover:scale-105 text-lg"
                >
                  ⚡ Empezar AHORA
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full flex justify-center">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
            {[
              { num: hackedCount + '+', text: 'Hackeados HOY', icon: '🚨' },
              { num: '73%', text: 'Reutiliza contraseña', icon: '😱' },
              { num: '2 MIN', text: 'Protección', icon: '⚡' },
              { num: '50K+', text: 'Ya protegidos', icon: '✅' }
            ].map((item, i) => (
              <div key={i} className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-black text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{item.num}</div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">{item.text}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problemas */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-center">
          <div className="max-w-6xl w-full">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-gray-900 text-center">
              ¿ALGUNO DE ESTOS ERES TÚ?
            </h2>
            <p className="text-xl text-red-600 font-bold text-center mb-20">Si dices SÍ... TIENES PROBLEMA</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              { emoji: '😱', title: 'Contraseña "123456"', desc: 'O tu fecha de nacimiento o nombre+número' },
              { emoji: '🔄', title: 'LA MISMA Para Todo', desc: 'Gmail, Facebook, Bank... Todas IGUALES' },
              { emoji: '📧', title: 'Caes En Emails Falsos', desc: 'Phishing, "Verifica cuenta", reclamos' },
              { emoji: '📱', title: 'Sin 2 Pasos Activado', desc: 'Ni siquiera lo conoces, ¿verdad?' }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-xl transition-all transform hover:-translate-y-2">
                <div className="text-6xl mb-4">{item.emoji}</div>
                <h3 className="font-black text-2xl text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 font-semibold">{item.desc}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Soluciones */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 to-black text-white">
        <div className="w-full flex justify-center">
          <div className="max-w-6xl w-full">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-20 text-center">LA SOLUCIÓN? MÁS FÁCIL</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
            {[
              { icon: '🔐', title: 'Contraseñas IMPOSIBLES', items: ['Fácil de recordar', 'Sin complicaciones', 'Máxima seguridad'] },
              { icon: '📱', title: 'Doble Protección', items: ['Tu celular es tu escudo', 'Actívalo en 2 minutos', 'Impenetrable'] },
              { icon: '👀', title: 'Detecta Estafas', items: ['Identifica phishing', 'Sitios peligrosos', 'Antes de caer'] },
              { icon: '🛡️', title: '5 Errores Clave', items: ['Qué NUNCA hacer', 'Hábitos seguros', 'Guía simple'] }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-2xl bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-black text-2xl mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-200">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Test Viral */}
      {!showTest && !testResults && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-yellow-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-8 py-4 bg-yellow-200 rounded-full mb-8 animate-pulse">
              <span className="text-yellow-800 font-black text-lg">⚡ QUIZ VIRAL ⚡</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-gray-900">
              ¿QUÉ TAN SEGURO ERES?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-10 font-semibold">
              Descubre si eres FÁCIL o IMPOSIBLE en 60 segundos • Sin registrarse • 100% Anónimo
            </p>
            <button 
              onClick={() => setShowTest(true)}
              className="inline-block px-12 py-6 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-black text-2xl hover:shadow-2xl transition-all hover:scale-110 mb-6 animate-bounce"
            >
              🎯 HACER QUIZ AHORA
            </button>
            <p className="text-sm text-gray-600">
              <span className="font-black text-lg">50,000+</span> ya lo hicieron
            </p>
          </div>
        </section>
      )}

      {/* Test Modal */}
      {showTest && !testResults && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {setShowTest(false); setUserAnswers({}); setTestResults(null);}}
              className="float-right text-gray-600 hover:text-gray-900 text-3xl font-bold"
            >
              ✕
            </button>

            <div className="mb-8 clear-both">
              <p className="text-sm text-purple-700 font-black mb-3">PREGUNTA {Object.keys(userAnswers).length + 1} DE {testQuestions.length}</p>
              <div className="w-full bg-gray-300 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                  style={{width: `${(Object.keys(userAnswers).length / testQuestions.length) * 100}%`}}
                ></div>
              </div>
            </div>

            {testQuestions.map((q) => (
              !(q.id in userAnswers) && (
                <div key={q.id}>
                  <h3 className="text-2xl sm:text-3xl font-black text-center mb-8 text-gray-900">{q.title}</h3>
                  <div className="space-y-3">
                    {q.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleTestAnswer(q.id, option.score);
                          if (Object.keys(userAnswers).length === testQuestions.length - 1) {
                            setTimeout(() => calculateTestResults(), 300);
                          }
                        }}
                        className="w-full p-4 text-left rounded-xl border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 bg-white transition-all font-semibold text-base text-gray-900"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {testResults && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center">
            <button 
              onClick={() => {setShowTest(false); setUserAnswers({}); setTestResults(null);}}
              className="float-right text-gray-600 hover:text-gray-900 text-3xl font-bold"
            >
              ✕
            </button>

            <div className="clear-both mb-8">
              <div className="text-8xl mb-4 animate-bounce">{testResults.emoji}</div>
              <h3 className="text-6xl font-black mb-3 text-gray-900">{testResults.percentage.toFixed(0)}%</h3>
              <p className="text-sm text-gray-600 mb-4">
                Este porcentaje representa qué tan seguro eres en línea (mayor = más protegido).
              </p>
              <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {testResults.level}
              </p>
            </div>

            <div className="bg-yellow-100 p-6 rounded-2xl mb-8">
              <p className="text-2xl font-black mb-2 text-gray-900">{testResults.message}</p>
              <p className="text-gray-800 font-semibold">{testResults.advice}</p>
            </div>

            <button 
              onClick={() => {setShowTest(false); setShowModal(true); setUserAnswers({}); setTestResults(null);}}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg hover:shadow-lg transition-all"
            >
              VER MI PLAN PERSONALIZADO
            </button>
          </div>
        </div>
      )}

      {/* CTA Final */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            NO ESPERES A SER<br/>
            <span className="text-yellow-300">LA PRÓXIMA VÍCTIMA</span>
          </h2>
          <p className="text-xl sm:text-2xl mb-8 font-bold text-white/90">
            Mientras lees esto, 5 cuentas más son hackeadas
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-12 py-6 rounded-full bg-white text-red-600 font-black text-2xl hover:shadow-2xl transition-all hover:scale-110"
          >
            🔒 PROTÉGEME GRATIS
          </button>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-3xl font-black mb-4">¡EXCELENTE DECISIÓN!</h3>
              <p className="text-gray-700 mb-6 font-semibold">En 5 minutos aprenderás todo lo que necesitas</p>
              <div className="bg-purple-50 p-8 rounded-2xl mb-8 text-left">
                <h4 className="font-black text-lg mb-3 text-purple-600">VAS A APRENDER:</h4>
                <ul className="space-y-2">
                  {[
                    "✅ Contraseñas imposibles de hackear",
                    "✅ Autenticación en 2 pasos",
                    "✅ Detectar estafas y sitios falsos",
                    "✅ 5 errores críticos a evitar"
                  ].map((item, i) => (
                    <li key={i} className="font-semibold text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              <button className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg hover:shadow-lg transition-all">
                COMENZAR MI PROTECCIÓN →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
