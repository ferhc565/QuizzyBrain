let preguntas = {};
let colores = {};
let categoriasOrdenadas = [];
let estado = {
  categoriaActual: null,
  preguntasCategoria: [],
  indice: 0,
  puntaje: 0,
  tiempoPorPregunta: 20,
  temporizadorId: null,
  tiempoRestante: 0
};

const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const categoryListEl = document.getElementById('category-list');
const quizCategoryEl = document.getElementById('quiz-category');
const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('options-container');
const nextButtonEl = document.getElementById('next-button');
const progressTextEl = document.getElementById('progress-text');
const scoreTextEl = document.getElementById('score-text');
const timerEl = document.getElementById('timer');

const resultSummaryEl = document.getElementById('result-summary');
const backToCategoriesEl = document.getElementById('back-to-categories');

const configButton = document.getElementById('config-button');
const configModal = document.getElementById('config-modal');
const closeConfig = document.getElementById('close-config');
const currentTimeLabel = document.getElementById('current-time-label');

const timeButtons = document.querySelectorAll('.time-options button');

function mostrarPantalla(screen) {
  categoryScreen.classList.remove('active');
  quizScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  screen.classList.add('active');
}

async function cargarDatos() {
  try {
    const [pregRes, colRes] = await Promise.all([
      fetch('preguntas.json'),
      fetch('colores.json')
    ]);
    preguntas = await pregRes.json();
    colores = await colRes.json();

    categoriasOrdenadas = Object.keys(colores);
    crearBotonesCategorias();
  } catch (e) {
    console.error('Error cargando datos', e);
  }
}

function crearBotonesCategorias() {
  categoryListEl.innerHTML = '';
  categoriasOrdenadas.forEach(catKey => {
    const btn = document.createElement('button');
    btn.className = 'category-button';
    const nombreVisible = formatearNombreCategoria(catKey);
    btn.innerHTML = `<span class="name">${nombreVisible}</span><span class="category-indicator"></span>`;
    const color = colores[catKey] || '#6366f1';
    btn.querySelector('.category-indicator').style.backgroundColor = color;
    btn.style.background = `linear-gradient(135deg, ${color}, rgba(15,23,42,0.95))`;

    btn.addEventListener('click', () => iniciarQuiz(catKey));
    categoryListEl.appendChild(btn);
  });
}

function formatearNombreCategoria(key) {
  switch (key) {
    case 'logica': return 'Lógica';
    case 'matematicas': return 'Matemáticas';
    case 'enfermeria': return 'Enfermería';
    case 'ingles': return 'Inglés';
    case 'computacion': return 'Computación';
    default: return key;
  }
}

function iniciarQuiz(catKey) {
  detenerTemporizador();

  estado.categoriaActual = catKey;
  estado.indice = 0;
  estado.puntaje = 0;

  const listaPreguntas = preguntas[catKey] || [];
  if (!listaPreguntas.length) {
    alert('Esta categoría aún no tiene preguntas registradas.');
    return;
  }

  estado.preguntasCategoria = mezclarArray(listaPreguntas.slice());
  quizCategoryEl.textContent = formatearNombreCategoria(catKey);
  mostrarPantalla(quizScreen);
  mostrarPreguntaActual();
}

function mezclarArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mostrarPreguntaActual() {
  detenerTemporizador();
  nextButtonEl.disabled = false;

  const q = estado.preguntasCategoria[estado.indice];
  questionTextEl.textContent = q.pregunta;
  optionsContainerEl.innerHTML = '';

  q.opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.textContent = op;
    btn.addEventListener('click', () => seleccionarOpcion(btn, op));
    optionsContainerEl.appendChild(btn);
  });

  actualizarInfoQuiz();
  iniciarTemporizador();
}

function seleccionarOpcion(btn, valorOpcion) {
  const botones = optionsContainerEl.querySelectorAll('.option-button');
  botones.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  btn.dataset.selected = 'true';
}

function siguiente() {
  const q = estado.preguntasCategoria[estado.indice];
  const botones = optionsContainerEl.querySelectorAll('.option-button');
  let seleccion = null;
  botones.forEach(b => {
    if (b.classList.contains('selected')) {
      seleccion = b.textContent;
    }
  });

  if (!seleccion) {
    alert('Selecciona una opción antes de continuar.');
    return;
  }

  if (seleccion === q.respuesta) {
    estado.puntaje += 1;
  }

  avanzarPregunta();
}

function avanzarPregunta() {
  detenerTemporizador();
  estado.indice += 1;
  if (estado.indice >= estado.preguntasCategoria.length) {
    mostrarResultados();
  } else {
    mostrarPreguntaActual();
  }
}

function mostrarResultados() {
  const total = estado.preguntasCategoria.length;
  const porcentaje = Math.round((estado.puntaje / total) * 100);
  resultSummaryEl.textContent = `Respondiste correctamente ${estado.puntaje} de ${total} preguntas (${porcentaje}%).`;
  mostrarPantalla(resultScreen);
}

function actualizarInfoQuiz() {
  const total = estado.preguntasCategoria.length;
  const actual = estado.indice + 1;
  progressTextEl.textContent = `Pregunta ${actual} de ${total}`;
  scoreTextEl.textContent = `Puntaje: ${estado.puntaje} / ${total}`;
}

function iniciarTemporizador() {
  estado.tiempoRestante = estado.tiempoPorPregunta;
  actualizarTextoTiempo();
  detenerTemporizador();

  estado.temporizadorId = setInterval(() => {
    estado.tiempoRestante -= 1;
    if (estado.tiempoRestante <= 0) {
      detenerTemporizador();
      avanzarPregunta();
    } else {
      actualizarTextoTiempo();
    }
  }, 1000);
}

function detenerTemporizador() {
  if (estado.temporizadorId) {
    clearInterval(estado.temporizadorId);
    estado.temporizadorId = null;
  }
}

function actualizarTextoTiempo() {
  timerEl.textContent = `${estado.tiempoRestante}s`;
}

// Configuración de tiempo
function cargarTiempoDesdeStorage() {
  const guardado = localStorage.getItem('quizzybrain_tiempo');
  if (guardado) {
    const val = parseInt(guardado, 10);
    if (!isNaN(val)) {
      estado.tiempoPorPregunta = val;
    }
  }
  actualizarLabelTiempo();
}

function actualizarLabelTiempo() {
  currentTimeLabel.textContent = `${estado.tiempoPorPregunta} segundos`;
}

configButton.addEventListener('click', () => {
  actualizarLabelTiempo();
  configModal.classList.remove('hidden');
});

closeConfig.addEventListener('click', () => {
  configModal.classList.add('hidden');
});

timeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const secs = parseInt(btn.dataset.seconds, 10);
    if (!isNaN(secs)) {
      estado.tiempoPorPregunta = secs;
      localStorage.setItem('quizzybrain_tiempo', String(secs));
      actualizarLabelTiempo();
    }
  });
});

backToCategoriesEl.addEventListener('click', () => {
  mostrarPantalla(categoryScreen);
});

nextButtonEl.addEventListener('click', siguiente);

document.addEventListener('DOMContentLoaded', () => {
  cargarTiempoDesdeStorage();
  cargarDatos();
});
