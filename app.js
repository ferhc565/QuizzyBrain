
let preguntas = {};
let colores = {};
let categorias = [];
let tiempo = 20;  // tiempo por pregunta (segundos), configurable
let indice = 0;
let puntaje = 0;
let actualCat = "";

// Cargar datos
fetch("preguntas.json")
  .then(r => r.json())
  .then(d => {
    preguntas = d;
    cargarCategorias();
  });

fetch("colores.json")
  .then(r => r.json())
  .then(d => {
    colores = d;
  });

// Cargar categorías en la pantalla principal
function cargarCategorias() {
  categorias = Object.keys(preguntas);
  const cont = document.querySelector("#category-list");
  cont.innerHTML = "";
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.style.background = colores[cat] || "#2563eb";
    btn.onclick = () => iniciar(cat);
    cont.appendChild(btn);
  });
}

// Iniciar quiz en una categoría
function iniciar(cat) {
  actualCat = cat;
  indice = 0;
  puntaje = 0;
  document.querySelector("#category-screen").style.display = "none";
  document.querySelector("#quiz-screen").style.display = "block";
  document.querySelector("#result-screen").style.display = "none";
  mostrarPregunta();
}

// Mostrar pregunta actual
function mostrarPregunta() {
  const qList = preguntas[actualCat];
  const pregunta = qList[indice];
  document.querySelector("#quiz-title").textContent = actualCat;
  document.querySelector("#question").textContent = pregunta.pregunta;
  const opts = document.querySelector("#options");
  opts.innerHTML = "";
  pregunta.opciones.forEach(op => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = op;
    b.onclick = () => seleccionar(b, op);
    opts.appendChild(b);
  });
  document.querySelector("#progress").textContent =
    "Pregunta " + (indice + 1) + " de " + qList.length;
}

// Seleccionar opción
function seleccionar(btn, op) {
  document.querySelectorAll(".opt").forEach(x => {
    x.style.border = "none";
    x.removeAttribute("data-sel");
  });
  btn.style.border = "2px solid #f472b6";
  btn.setAttribute("data-sel", op);
}

// Botón Siguiente
document.querySelector("#next-btn").onclick = () => {
  const opts = Array.from(document.querySelectorAll(".opt"));
  const sel = opts.find(b => b.getAttribute("data-sel"));
  if (!sel) {
    alert("Selecciona una opción");
    return;
  }
  const respCorrecta = preguntas[actualCat][indice].respuesta;
  if (sel.getAttribute("data-sel") === respCorrecta) {
    puntaje++;
  }
  indice++;
  if (indice >= preguntas[actualCat].length) {
    finalizar();
  } else {
    mostrarPregunta();
  }
};

// Finalizar quiz
function finalizar() {
  document.querySelector("#quiz-screen").style.display = "none";
  const total = preguntas[actualCat].length;
  document.querySelector("#result").textContent =
    "Puntaje: " + puntaje + " de " + total;
  document.querySelector("#result-screen").style.display = "block";
}

// Volver a categorías
document.querySelector("#back-btn").onclick = () => {
  document.querySelector("#result-screen").style.display = "none";
  document.querySelector("#quiz-screen").style.display = "none";
  document.querySelector("#category-screen").style.display = "block";
};

// Configuración de tiempo
document.querySelector("#config-btn").onclick = () => {
  document.querySelector("#config-modal").style.display = "flex";
  document.querySelector("#current-time").textContent =
    tiempo + " segundos";
};

document.querySelector("#close-config").onclick = () => {
  document.querySelector("#config-modal").style.display = "none";
};

document.querySelectorAll(".times button").forEach(b => {
  b.onclick = () => {
    tiempo = parseInt(b.getAttribute("data-t"));
    document.querySelector("#current-time").textContent =
      tiempo + " segundos";
  };
});
