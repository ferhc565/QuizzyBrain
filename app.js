const questions = [
  {
    question: "¿Cuánto es 7 × 8?",
    options: ["48", "54", "56", "64"],
    answer: 2
  },
  {
    question: "¿Cuál de estos es un sistema operativo?",
    options: ["Chrome", "Windows", "Facebook", "YouTube"],
    answer: 1
  },
  {
    question: "La memoria RAM sirve para...",
    options: [
      "Almacenar datos de forma permanente",
      "Ejecutar procesos y programas en uso",
      "Conectarse a Internet",
      "Imprimir documentos"
    ],
    answer: 1
  },
  {
    question: "¿Qué lenguaje se usa más en el desarrollo web?",
    options: ["Python", "HTML", "C", "Assembler"],
    answer: 1
  },
  {
    question: "1 byte equivale a...",
    options: ["4 bits", "8 bits", "16 bits", "32 bits"],
    answer: 1
  }
];

let currentIndex = 0;
let score = 0;
let selectedOptionIndex = null;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const resultContainer = document.getElementById("result-container");
const quizContainer = document.getElementById("quiz-container");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

function renderQuestion() {
  const q = questions[currentIndex];
  questionEl.textContent = q.question;

  optionsEl.innerHTML = "";
  selectedOptionIndex = null;
  nextBtn.disabled = true;

  q.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => handleSelect(index, btn));
    optionsEl.appendChild(btn);
  });

  progressEl.textContent = `Pregunta ${currentIndex + 1} de ${questions.length}`;
  scoreEl.textContent = `Puntaje: ${score} / ${questions.length}`;
}

function handleSelect(index, button) {
  document.querySelectorAll(".option-btn").forEach((b) => {
    b.classList.remove("selected");
  });

  button.classList.add("selected");
  selectedOptionIndex = index;
  nextBtn.disabled = false;
}

function handleNext() {
  if (selectedOptionIndex === null) return;

  const q = questions[currentIndex];
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    if (i === q.answer) {
      btn.classList.add("correct");
    } else if (i === selectedOptionIndex && selectedOptionIndex !== q.answer) {
      btn.classList.add("incorrect");
    }
    btn.disabled = true;
  });

  if (selectedOptionIndex === q.answer) {
    score++;
    scoreEl.textContent = `Puntaje: ${score} / ${questions.length}`;
  }

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 650);
}

function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");

  finalScoreEl.textContent = `Obtuviste ${score} de ${questions.length} respuestas correctas.`;
}

function restart() {
  currentIndex = 0;
  score = 0;
  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  renderQuestion();
}

nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", restart);

renderQuestion();
