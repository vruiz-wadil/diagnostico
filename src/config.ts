import { Question, CompanyLevel } from './types';

export const CATEGORIES = [
  { name: 'Perfil y Tamaño', questions: [1, 2] },
  { name: 'Desempeño Financiero', questions: [3, 4, 10, 11] },
  { name: 'Estructura y Talento', questions: [5, 6, 7] },
  { name: 'Mercado y Clientes', questions: [8, 9, 14] },
  { name: 'Visión y Escala', questions: [12, 13, 15] }
];

export interface LevelConfig {
  minScore: number;
  level: CompanyLevel;
  feedback: string;
  styles: {
    bg: string;
    text: string;
    subText: string;
    dot: string;
  };
}

export const LEVELS_CONFIG: LevelConfig[] = [
  {
    minScore: 40,
    level: '🔵 Empresa Escalable',
    feedback: 'Nivel actual: EMPRESA ESCALABLE\n\nTu empresa ya tiene características poco comunes: estructura, liderazgo y capacidad de crecer sin depender totalmente del fundador.\nEso cambia el juego.\n\nFORTALEZAS COMUNES\n✅ Sistema replicable\n✅ Equipo con autonomía\n✅ Rentabilidad sólida\n✅ Expansión viable\n\nRIESGO INVISIBLE\nEscalar sin estrategia puede destruir lo que costó años construir.\n\nOPORTUNIDAD REAL\nSucursales, franquicias, alianzas, expansión nacional o adquisiciones.\n\nRECOMENDACIÓN Wadil AI Studio\nPlan Growth Architecture\nDiseño de expansión profesional.',
    styles: { bg: 'from-blue-700 to-blue-900', text: 'text-white', subText: 'text-blue-100', dot: 'bg-white/20' }
  },
  {
    minScore: 33,
    level: '🟢 Empresa Consolidada',
    feedback: 'Nivel actual: EMPRESA CONSOLIDADA\n\nTu empresa ya opera por encima del promedio. Existe estructura, resultados y una base organizacional sólida.\nMuchos negocios quieren llegar a donde hoy estás.\n\nFORTALEZAS COMUNES\n✅ Operación más estable\n✅ Indicadores claros\n✅ Liderazgo funcional\n✅ Marca con reputación\n\nRIESGO INVISIBLE\nEl nuevo enemigo ya no es el desorden.\nEs la comodidad.\n\nOPORTUNIDAD REAL\nEste nivel permite expansión inteligente, compras estratégicas, nuevas unidades o regionalización.\n\nRECOMENDACIÓN Wadil AI Studio\nPlan Escalamiento Estratégico\nCrecimiento rentable sin perder cultura ni control.',
    styles: { bg: 'from-emerald-600 to-emerald-800', text: 'text-white', subText: 'text-emerald-100', dot: 'bg-white/20' }
  },
  {
    minScore: 25,
    level: '🟡 Empresa en Crecimiento',
    feedback: 'Nivel actual: EMPRESA EN CRECIMIENTO\n\nTu empresa ya validó el mercado y tiene tracción real. El problema ya no es vender… el reto ahora es crecer sin perder control.\n\nFORTALEZAS COMUNES\n✅ Clientes reales\n✅ Buen producto\n✅ Equipo base funcional\n✅ Potencial visible\n\nRIESGO INVISIBLE\nMuchas empresas aquí crecen ventas… pero también crecen errores, presión y dependencia del dueño.\n\nOPORTUNIDAD REAL\nSi profesionalizas estructura ahora, puedes multiplicar resultados sin duplicar caos.\n\nRECOMENDACIÓN Wadil AI Studio\nPlan de Consolidación Empresarial 90 Días\nProcesos + liderazgo + sistema comercial + escalabilidad.',
    styles: { bg: 'from-yellow-400 to-yellow-500', text: 'text-slate-900', subText: 'text-slate-800', dot: 'bg-black/10' }
  },
  {
    minScore: 17,
    level: '🟠 Empresa Estancada',
    feedback: 'Nivel actual: EMPRESA ESTANCADA\n\nTu empresa funciona, sobrevive y genera movimiento… pero dejó de avanzar al ritmo que debería.\nNo está en crisis.\nPero tampoco está creciendo.\n\nLO QUE SUELE PASAR AQUÍ\n✅ Se vende parecido cada año\n✅ El dueño trabaja demasiado\n✅ Se repiten problemas\n✅ El equipo depende de supervisión\n✅ No hay salto real\n\nRIESGO INVISIBLE\nLa estabilidad prolongada muchas veces es una ilusión.\nMientras tú te estancas, otros avanzan.\n\nOPORTUNIDAD REAL\nCon estrategia correcta, esta etapa suele destrabarse rápido porque ya existe base operativa.\n\nRECOMENDACIÓN Wadil AI Studio\nPlan Desbloqueo de Crecimiento 90 Días\nNueva estrategia + foco comercial + productividad.',
    styles: { bg: 'from-orange-500 to-orange-700', text: 'text-white', subText: 'text-orange-100', dot: 'bg-white/20' }
  },
  {
    minScore: 9,
    level: '🔴 Empresa en Riesgo',
    feedback: 'Nivel actual: EMPRESA EN ZONA ROJA\n\nTu empresa muestra señales claras de presión operativa, financiera o comercial. Esto no significa fracaso, significa que el modelo actual ya no está soportando la realidad del mercado.\nMuchas empresas en esta etapa siguen facturando… pero internamente ya están agotadas.\n\n⚠️ SEÑALES COMUNES DETECTADAS\n✅ Flujo de efectivo tenso\n✅ Ventas impredecibles\n✅ Estrés constante del dueño\n✅ Falta de control financiero\n✅ Operación reactiva\n\nRIESGO INVISIBLE\nEl mayor peligro no es vender poco.\nEs normalizar el caos.\n\nOPORTUNIDAD REAL\nCon decisiones correctas en 60 a 90 días se puede recuperar liquidez, ordenar operación y reconstruir crecimiento.\n\nRECOMENDACIÓN Wadil AI Studio\nPlan Rescate Empresarial Inmediato\nLiquidez + ventas + control + enfoque.',
    styles: { bg: 'from-red-600 to-red-800', text: 'text-white', subText: 'text-red-100', dot: 'bg-white/20' }
  },
  {
    minScore: 0,
    level: '⚫ Empresa Desorientada',
    feedback: 'Nivel actual: EMPRESA DESORIENTADA\n\nTu empresa actualmente muestra señales de falta de dirección, estructura y claridad operativa.\nEsto no necesariamente significa que el negocio no tenga potencial… significa que hoy está funcionando más por reacción que por estrategia.\nMuchas empresas en esta etapa trabajan muchísimo, pero sin lograr estabilidad, control o crecimiento consistente.\n\nSEÑALES COMUNES DETECTADAS\n✅ Falta de claridad financiera\n✅ Ventas impredecibles\n✅ Operación desorganizada\n✅ Dependencia total del día a día\n✅ Sensación constante de incertidumbre\n\nRIESGO INVISIBLE\nEl mayor riesgo en esta etapa no es crecer lento. Es no entender realmente qué está fallando.\nCuando una empresa no tiene indicadores, procesos o dirección clara, normalmente:\n● Se toman decisiones por intuición\n● Se apagan fuegos todo el tiempo\n● El dueño vive saturado\n● El negocio depende demasiado de esfuerzos urgentes\nY eso provoca desgaste financiero, emocional and operativo.\n\nOPORTUNIDAD REAL\nLa buena noticia es que este nivel también representa una enorme oportunidad. Porque cuando una empresa comienza a ordenar:\n✅ Finanzas\n✅ Operación\n✅ Prioridades\n✅ Ventas\n✅ Dirección estratégica\nLos resultados suelen mejorar rápidamente.\nMuchas empresas exitosas pasaron primero por esta etapa antes de consolidarse.\n\nLO QUE NORMALMENTE NECESITA UNA EMPRESA AQUÍ\nNo más trabajo. Necesita más claridad.\nAntes de crecer, vender más o invertir en publicidad, primero debe entender:\n● Qué sí funciona\n● Qué está frenando el negocio\n● Dónde se pierde dinero\n● Cuál es el verdadero cuello de botella\n\nRECOMENDACIÓN Wadil AI Studio\nPlan de Reordenamiento Empresarial Inicial\nEnfoque + claridad + control + estructura.\nIdeal para empresas que necesitan recuperar dirección y construir bases sólidas para crecer.',
    styles: { bg: 'from-slate-800 to-black', text: 'text-white', subText: 'text-slate-300', dot: 'bg-white/20' }
  }
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Qué tamaño tiene tu empresa?",
    options: [
      { label: "Micro (1-10 empleados)", points: 0, icon: "👤" },
      { label: "Pequeña (11-50)", points: 1, icon: "👥" },
      { label: "Mediana (51-250)", points: 2, icon: "🏢" },
      { label: "Grande (+250)", points: 3, icon: "🏙️" }
    ]
  },
  {
    id: 2,
    text: "¿Cuántos años lleva operando?",
    options: [
      { label: "Menos de 1 año", points: 0, icon: "🌱" },
      { label: "1 a 3 años", points: 1, icon: "🌿" },
      { label: "4 a 10 años", points: 2, icon: "🌳" },
      { label: "Más de 10 años", points: 3, icon: "🏰" }
    ]
  },
  {
    id: 3,
    text: "¿Cómo van tus ventas en los últimos 12 meses?",
    options: [
      { label: "Bajaron fuerte", points: 0, icon: "📉" },
      { label: "Igual que siempre", points: 1, icon: "📊" },
      { label: "Crecieron 10%-30%", points: 2, icon: "📈" },
      { label: "Crecieron más de 30%", points: 3, icon: "🚀" }
    ]
  },
  {
    id: 4,
    text: "¿Tienes utilidad real al final del mes?",
    options: [
      { label: "Nunca sé", points: 0, icon: "❓" },
      { label: "Muy poca", points: 1, icon: "💳" },
      { label: "Sí, rentable", points: 2, icon: "💰" },
      { label: "Alta utilidad", points: 3, icon: "💎" }
    ]
  },
  {
    id: 5,
    text: "¿Tu empresa depende demasiado de ti?",
    options: [
      { label: "Sin mí no funciona", points: 0, icon: "🔗" },
      { label: "Mucho", points: 1, icon: "⛓️" },
      { label: "Poco", points: 2, icon: "⚙️" },
      { label: "Nada", points: 3, icon: "🕊️" }
    ]
  },
  {
    id: 6,
    text: "¿Tus procesos están documentados?",
    options: [
      { label: "Nada", points: 0, icon: "📝" },
      { label: "Algunos", points: 1, icon: "📁" },
      { label: "La mayoría", points: 2, icon: "📚" },
      { label: "Totalmente medidos", points: 3, icon: "⚖️" }
    ]
  },
  {
    id: 7,
    text: "¿Qué pasa si un empleado clave renuncia mañana?",
    options: [
      { label: "Caos total", points: 0, icon: "🔥" },
      { label: "Problemas fuertes", points: 1, icon: "⚠️" },
      { label: "Se ajusta", points: 2, icon: "🧩" },
      { label: "Sin impacto mayor", points: 3, icon: "✅" }
    ]
  },
  {
    id: 8,
    text: "¿Cómo consigues clientes?",
    options: [
      { label: "Recomendación solamente", points: 0, icon: "🗣️" },
      { label: "Redes sociales básicas", points: 1, icon: "📱" },
      { label: "Ventas estructuradas", points: 2, icon: "💼" },
      { label: "Marketing + ventas profesional", points: 3, icon: "🎯" }
    ]
  },
  {
    id: 9,
    text: "¿Tus clientes regresan y recompran?",
    options: [
      { label: "No", points: 0, icon: "🚪" },
      { label: "Poco", points: 1, icon: "🔁" },
      { label: "Sí, frecuentemente", points: 2, icon: "🤝" },
      { label: "Tenemos fidelización alta", points: 3, icon: "🌟" }
    ]
  },
  {
    id: 10,
    text: "¿Tienes flujo de efectivo sano?",
    options: [
      { label: "No alcanzo", points: 0, icon: "🥀" },
      { label: "Justo", points: 1, icon: "⚖️" },
      { label: "Bien controlado", points: 2, icon: "💸" },
      { label: "Excelente liquidez", points: 3, icon: "🏦" }
    ]
  },
  {
    id: 11,
    text: "¿Conoces tus indicadores clave?",
    options: [
      { label: "No", points: 0, icon: "🙈" },
      { label: "Algunos", points: 1, icon: "👀" },
      { label: "Sí, mensuales", points: 2, icon: "📅" },
      { label: "Dashboard semanal", points: 3, icon: "🖥️" }
    ]
  },
  {
    id: 12,
    text: "¿Hoy podrías duplicar ventas sin colapsar?",
    options: [
      { label: "No", points: 0, icon: "🛑" },
      { label: "Difícilmente", points: 1, icon: "🧗" },
      { label: "Sí, con ajustes", points: 2, icon: "🛠️" },
      { label: "Sí, totalmente", points: 3, icon: "🏗️" }
    ]
  },
  {
    id: 13,
    text: "¿Tienes un plan estratégico a 1-3 años?",
    options: [
      { label: "No", points: 0, icon: "🗺️" },
      { label: "Ideas sueltas", points: 1, icon: "💭" },
      { label: "Parcial", points: 2, icon: "📍" },
      { label: "Formal ejecutándose", points: 3, icon: "🏁" }
    ]
  },
  {
    id: 14,
    text: "¿Tu marca es reconocida en el mercado?",
    options: [
      { label: "No", points: 0, icon: "👻" },
      { label: "Poco", points: 1, icon: "📣" },
      { label: "Sí, localmente", points: 2, icon: "🏘️" },
      { label: "Sí, regional/nacional", points: 3, icon: "🌎" }
    ]
  },
  {
    id: 15,
    text: "¿Qué sientes hoy sobre tu empresa?",
    options: [
      { label: "Estoy perdido", points: 0, icon: "🌀" },
      { label: "Sobreviviendo", points: 1, icon: "🛶" },
      { label: "Avanzando", points: 2, icon: "🛥️" },
      { label: "Dominando mercado", points: 3, icon: "🥇" }
    ]
  }
];
