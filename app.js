
let preguntas = {};
let colores = {};
let tiempo = 20;  // segundos por pregunta
let indice = 0;
let puntaje = 0;
let actualCat = "";

// temporizador
let timerId = null;
let tiempoRestante = 0;

// Cargar datos y solo dibujar categorías cuando ambos estén listos
let datosListos = { preguntas: false, colores: false };

function intentarCargar() {
  if (datosListos.preguntas && datosListos.colores) {
    cargarCategorias();
  }
}

fetch("preguntas.json")
  .then(r => r.json())
  .then(d => {
    preguntas = d;
    datosListos.preguntas = true;
    intentarCargar();
  });

fetch("colores.json")
  .then(r => r.json())
  .then(d => {
    colores = d;
    datosListos.colores = true;
    intentarCargar();
  });

function cargarCategorias() {
  const cont = document.querySelector("#category-list");
  cont.innerHTML = "";

  Object.keys(preguntas)
    .filter(cat => cat !== "__orphan__" && Array.isArray(preguntas[cat]) && preguntas[cat].length > 0)
    .forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.style.background = colores[cat] || "#2563eb";
      btn.onclick = () => iniciar(cat);
      cont.appendChild(btn);
    });
}

function iniciar(cat) {
  actualCat = cat;
  indice = 0;
  puntaje = 0;
  limpiarTemporizador();
  document.querySelector("#category-screen").style.display = "none";
  document.querySelector("#quiz-screen").style.display = "block";
  document.querySelector("#result-screen").style.display = "none";
  mostrarPregunta();
}

function mostrarPregunta() {
  const lista = preguntas[actualCat];
  const pregunta = lista[indice];
  document.querySelector("#quiz-title").textContent = actualCat;
  document.querySelector("#question").textContent = pregunta.pregunta;
  const cont = document.querySelector("#options");
  cont.innerHTML = "";
  pregunta.opciones.forEach(op => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = op;
    b.onclick = () => seleccionar(b, op);
    cont.appendChild(b);
  });
  document.querySelector("#progress").textContent =
    "Pregunta " + (indice + 1) + " de " + lista.length;

  iniciarTemporizador();
}

function seleccionar(btn, op) {
  document.querySelectorAll(".opt").forEach(x => {
    x.style.border = "none";
    x.removeAttribute("data-sel");
  });
  btn.style.border = "2px solid #f472b6";
  btn.setAttribute("data-sel", op);
}

function iniciarTemporizador() {
  limpiarTemporizador();
  tiempoRestante = tiempo;
  actualizarTimerTexto();
  timerId = setInterval(() => {
    tiempoRestante--;
    actualizarTimerTexto();
    if (tiempoRestante <= 0) {
      limpiarTemporizador();
      tiempoAgotado();
    }
  }, 1000);
}

function limpiarTemporizador() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function actualizarTimerTexto() {
  const el = document.querySelector("#timer");
  if (el) {
    el.textContent = "Tiempo: " + tiempoRestante + " s";
  }
}

function tiempoAgotado() {
  // cuenta como incorrecta (no sumamos puntaje)
  indice++;
  if (indice >= preguntas[actualCat].length) {
    finalizar();
  } else {
    mostrarPregunta();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#next-btn").onclick = () => {
    const sel = Array.from(document.querySelectorAll(".opt"))
      .find(b => b.getAttribute("data-sel"));
    if (!sel) {
      alert("Selecciona una opción");
      return;
    }
    const correcta = preguntas[actualCat][indice].respuesta;
    if (sel.getAttribute("data-sel") === correcta) {
      puntaje++;
    }
    indice++;
    limpiarTemporizador();
    if (indice >= preguntas[actualCat].length) {
      finalizar();
    } else {
      mostrarPregunta();
    }
  };

  document.querySelector("#back-btn").onclick = () => {
    limpiarTemporizador();
    document.querySelector("#result-screen").style.display = "none";
    document.querySelector("#quiz-screen").style.display = "none";
    document.querySelector("#category-screen").style.display = "block";
  };

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
});

function finalizar() {
  limpiarTemporizador();
  document.querySelector("#quiz-screen").style.display = "none";
  const total = preguntas[actualCat].length;
  document.querySelector("#result").textContent =
    "Puntaje: " + puntaje + " de " + total;
  document.querySelector("#result-screen").style.display = "block";
  actualizarTimerTexto();
}
