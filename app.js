const categories = [
  { name: 'Geografía', color: '#2ECC71' },
  { name: 'Historia', color: '#3498DB' },
  { name: 'Computacion', color: '#E74C3C' },
  { name: 'Enfermeria', color: '#2980B9' },
  { name: 'Ingles', color: '#9B59B6' },
  { name: 'Logica', color: '#1ABC9C' },
  { name: 'Matematicas', color: '#F39C12' }
];

let allQuestions = {};
let currentCategory = null;
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let selectedOptionIndex = null;

const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const categoryGrid = document.querySelector('.category-grid');
const quizCategoryTitle = document.getElementById('quiz-category');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressLabel = document.getElementById('progress');
const answerButton = document.getElementById('answer-button');
const backToCategoriesButton = document.getElementById('back-to-categories');
const resultText = document.getElementById('result-text');
const retryButton = document.getElementById('retry-button');

function showScreen(screen) {
  [categoryScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function loadCategories() {
  categoryGrid.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-card';
    btn.style.backgroundColor = cat.color;
    btn.textContent = cat.name;
    btn.addEventListener('click', () => startQuiz(cat.name));
    categoryGrid.appendChild(btn);
  });
}

async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    allQuestions = await res.json();
  } catch (e) {
    console.error('Error cargando questions.json', e);
  }
}

function startQuiz(categoryName) {
  currentCategory = categoryName;
  currentQuestions = (allQuestions[categoryName] || []).slice();
  currentIndex = 0;
  correctCount = 0;

  if (currentQuestions.length === 0) {
    alert(`No hay preguntas para la categoría "${categoryName}".`);
    return;
  }

  quizCategoryTitle.textContent = `Categoría: ${categoryName}`;
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuestions[currentIndex];
  if (!q) return;

  questionText.textContent = q.pregunta;
  optionsContainer.innerHTML = '';
  selectedOptionIndex = null;

  q.opciones.forEach((op, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = op;
    btn.addEventListener('click', () => {
      selectedOptionIndex = idx;
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    optionsContainer.appendChild(btn);
  });

  progressLabel.textContent = `Pregunta ${currentIndex + 1} de ${currentQuestions.length}`;
}

function handleAnswer() {
  if (selectedOptionIndex === null) {
    alert('Selecciona una opción antes de continuar.');
    return;
  }

  const q = currentQuestions[currentIndex];
  if (selectedOptionIndex === q.respuesta) {
    correctCount++;
  }

  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const total = currentQuestions.length;
  const percent = Math.round((correctCount / total) * 100);
  resultText.textContent = `Obtuviste ${correctCount} de ${total} respuestas correctas (${percent}%).`;
  showScreen(resultScreen);
}

answerButton.addEventListener('click', handleAnswer);
backToCategoriesButton.addEventListener('click', () => showScreen(categoryScreen));
retryButton.addEventListener('click', () => {
  showScreen(categoryScreen);
});

loadCategories();
loadQuestions();
