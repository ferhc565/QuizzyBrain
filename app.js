let QUESTIONS = {
  logica: [
    {
      pregunta: "Dada la proposición p, ¿cuál es el valor de verdad de ~p si p es verdadera?",
      opciones: ["Verdadero", "Falso", "Depende", "Indefinido"],
      respuesta: "Falso"
    },
    {
      pregunta: "¿Cuál es el resultado de p ∧ q si p es verdadera y q es falsa?",
      opciones: ["Verdadero", "Falso", "Depende de la tabla", "Indeterminado"],
      respuesta: "Falso"
    }
  ],
  matematicas: [
    {
      pregunta: "¿Cuál es la derivada de f(x) = 3x² + 2x - 5?",
      opciones: ["6x + 2", "6x - 2", "3x + 2", "6x² + 2x"],
      respuesta: "6x + 2"
    }
  ],
  enfermeria: [],
  ingles: [],
};

const categoriaColores = {
  logica: "#10b981",
  matematicas: "#f59e0b",
  enfermeria: "#3b82f6",
  ingles: "#8b5cf6"
};

let numPreguntasPorJuego = 5;
let feedbackInmediato = true;

let categoriaActual = null;
let preguntasSeleccionadas = [];
let indicePregunta = 0;
let aciertos = 0;

const categoriasContainer = document.getElementById("categorias-container");
const categoriaActualBadge = document.getElementById("categoria-actual");
const progresoTexto = document.getElementById("progreso");
const preguntaTexto = document.getElementById("pregunta-texto");
const opcionesContainer = document.getElementById("opciones-container");
const btnSiguiente = document.getElementById("btn-siguiente");

const resumenPuntaje = document.getElementById("resumen-puntaje");
const resumenMensaje = document.getElementById("resumen-mensaje");
const btnReiniciar = document.getElementById("btn-reiniciar");

const numPreguntasInput = document.getElementById("num-preguntas-input");
const chkFeedbackInmediato = document.getElementById("chk-feedback-inmediato");
const btnGuardarConfig = document.getElementById("btn-guardar-config");
const configMsg = document.getElementById("config-msg");

const adminCategoriaSelect = document.getElementById("admin-categoria-select");
const btnNuevaCategoria = document.getElementById("btn-nueva-categoria");
const btnEliminarCategoria = document.getElementById("btn-eliminar-categoria");
const listaPreguntas = document.getElementById("lista-preguntas");

const formPregunta = document.getElementById("form-pregunta");
const preguntaIndexInput = document.getElementById("pregunta-index");
const txtPregunta = document.getElementById("txt-pregunta");
const opc1 = document.getElementById("opc-1");
const opc2 = document.getElementById("opc-2");
const opc3 = document.getElementById("opc-3");
const opc4 = document.getElementById("opc-4");
const respuestaCorrectaSelect = document.getElementById("respuesta-correcta");
const btnNuevaPregunta = document.getElementById("btn-nueva-pregunta");
const btnEliminarPregunta = document.getElementById("btn-eliminar-pregunta");
const adminMsg = document.getElementById("admin-msg");

function cambiarPantalla(id) {
  document.querySelectorAll(".screen").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function barajar(array) {
  const copia = array.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function inicializarCategorias() {
  categoriasContainer.innerHTML = "";
  Object.keys(QUESTIONS).forEach(cat => {
    const preguntas = QUESTIONS[cat] || [];
    const card = document.createElement("button");
    card.className = "category-card";
    if (!preguntas.length) {
      card.classList.add("category-empty");
      card.disabled = true;
    }
    const color = categoriaColores[cat] || "#38bdf8";

    const nombre = document.createElement("div");
    nombre.className = "category-name";
    nombre.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);

    const meta = document.createElement("div");
    meta.className = "category-meta";
    meta.textContent = preguntas.length
      ? `${preguntas.length} preguntas disponibles`
      : "Sin preguntas aún";

    card.appendChild(nombre);
    card.appendChild(meta);

    card.style.borderColor = color;
    nombre.style.color = color;

    if (preguntas.length) {
      card.addEventListener("click", () => {
        iniciarJuego(cat);
      });
    }

    categoriasContainer.appendChild(card);
  });
}

function iniciarJuego(categoria) {
  categoriaActual = categoria;
  const preguntas = QUESTIONS[categoria] || [];
  if (!preguntas.length) return;

  const mezcladas = barajar(preguntas);
  const n = Math.min(numPreguntasPorJuego, mezcladas.length);
  preguntasSeleccionadas = mezcladas.slice(0, n);
  indicePregunta = 0;
  aciertos = 0;

  categoriaActualBadge.textContent =
    categoria.charAt(0).toUpperCase() + categoria.slice(1);
  categoriaActualBadge.style.borderColor = categoriaColores[categoria] || "#38bdf8";
  categoriaActualBadge.style.backgroundColor = "rgba(15,23,42,0.9)";

  mostrarPreguntaActual();
  cambiarPantalla("screen-juego");
}

function mostrarPreguntaActual() {
  btnSiguiente.disabled = true;
  opcionesContainer.innerHTML = "";

  const preguntaObj = preguntasSeleccionadas[indicePregunta];
  progresoTexto.textContent = `Pregunta ${indicePregunta + 1} de ${preguntasSeleccionadas.length}`;
  preguntaTexto.textContent = preguntaObj.pregunta;

  const opcionesMezcladas = barajar(preguntaObj.opciones);
  opcionesMezcladas.forEach(opcion => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opcion;
    btn.addEventListener("click", () => {
      manejarRespuesta(btn, preguntaObj.respuesta);
    });
    opcionesContainer.appendChild(btn);
  });
}

function manejarRespuesta(botonSeleccionado, respuestaCorrecta) {
  const botones = Array.from(
    opcionesContainer.querySelectorAll(".option-btn")
  );
  botones.forEach(b => {
    b.classList.add("disabled");
    b.disabled = true;
    if (feedbackInmediato && b.textContent === respuestaCorrecta) {
      b.classList.add("correct");
    }
  });

  if (botonSeleccionado.textContent !== respuestaCorrecta) {
    if (feedbackInmediato) {
      botonSeleccionado.classList.add("incorrect");
    }
  } else {
    aciertos++;
  }

  btnSiguiente.disabled = false;
}

function mostrarResultados() {
  cambiarPantalla("screen-resultados");
  const total = preguntasSeleccionadas.length;
  const porcentaje = total ? Math.round((aciertos / total) * 100) : 0;

  resumenPuntaje.textContent = `${aciertos} de ${total} aciertos (${porcentaje}%)`;

  let mensaje;
  if (porcentaje === 100) {
    mensaje = "¡Perfecto! Dominaste este tema. 🎉";
  } else if (porcentaje >= 80) {
    mensaje = "¡Excelente trabajo! 👏 Sigue así.";
  } else if (porcentaje >= 60) {
    mensaje = "Buen resultado, pero puedes mejorar con un repaso. 💪";
  } else {
    mensaje = "Lo importante es practicar. Intenta de nuevo y mejorarás. 📚";
  }
  resumenMensaje.textContent = mensaje;
}

function cargarConfigInicial() {
  numPreguntasInput.value = numPreguntasPorJuego;
  chkFeedbackInmediato.checked = feedbackInmediato;
}

btnGuardarConfig.addEventListener("click", () => {
  const n = parseInt(numPreguntasInput.value, 10);
  if (isNaN(n) || n <= 0) {
    configMsg.textContent = "Ingresa un número de preguntas válido.";
    return;
  }
  numPreguntasPorJuego = n;
  feedbackInmediato = chkFeedbackInmediato.checked;
  configMsg.textContent = "Configuración guardada (solo para esta sesión).";
});

function inicializarAdminCategorias() {
  adminCategoriaSelect.innerHTML = "";
  const cats = Object.keys(QUESTIONS);
  if (!cats.length) return;
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    adminCategoriaSelect.appendChild(opt);
  });
  if (!adminCategoriaSelect.value && cats.length) {
    adminCategoriaSelect.value = cats[0];
  }
  refrescarListaPreguntas();
}

function refrescarListaPreguntas() {
  listaPreguntas.innerHTML = "";
  const cat = adminCategoriaSelect.value;
  if (!cat) return;
  const lista = QUESTIONS[cat] || [];
  lista.forEach((p, idx) => {
    const li = document.createElement("li");
    li.textContent = p.pregunta.length > 80 ? p.pregunta.slice(0, 80) + "..." : p.pregunta;
    li.dataset.index = idx;
    li.addEventListener("click", () => {
      seleccionarPregunta(idx);
    });
    listaPreguntas.appendChild(li);
  });
}

function seleccionarPregunta(idx) {
  Array.from(listaPreguntas.children).forEach(li => {
    li.classList.remove("activa");
  });
  const li = Array.from(listaPreguntas.children).find(el => parseInt(el.dataset.index, 10) === idx);
  if (li) li.classList.add("activa");

  const cat = adminCategoriaSelect.value;
  const lista = QUESTIONS[cat] || [];
  const p = lista[idx];
  preguntaIndexInput.value = idx;
  txtPregunta.value = p.pregunta;
  opc1.value = p.opciones[0] || "";
  opc2.value = p.opciones[1] || "";
  opc3.value = p.opciones[2] || "";
  opc4.value = p.opciones[3] || "";

  respuestaCorrectaSelect.innerHTML = '<option value="">Selecciona la respuesta correcta</option>';
  [opc1.value, opc2.value, opc3.value, opc4.value].forEach(opc => {
    if (opc.trim()) {
      const opt = document.createElement("option");
      opt.value = opc;
      opt.textContent = opc;
      respuestaCorrectaSelect.appendChild(opt);
    }
  });
  respuestaCorrectaSelect.value = p.respuesta || "";
  adminMsg.textContent = "Editando pregunta existente.";
}

formPregunta.addEventListener("submit", e => {
  e.preventDefault();
  const cat = adminCategoriaSelect.value;
  if (!cat) {
    adminMsg.textContent = "Selecciona una categoría.";
    return;
  }
  const pregunta = txtPregunta.value.trim();
  const o1 = opc1.value.trim();
  const o2 = opc2.value.trim();
  const o3 = opc3.value.trim();
  const o4 = opc4.value.trim();
  const resp = respuestaCorrectaSelect.value.trim();

  if (!pregunta || !o1 || !o2 || !resp) {
    adminMsg.textContent = "Mínimo pregunta, 2 opciones y marcar la correcta.";
    return;
  }

  const opciones = [o1, o2];
  if (o3) opciones.push(o3);
  if (o4) opciones.push(o4);

  const idx = parseInt(preguntaIndexInput.value, 10);
  if (isNaN(idx) || idx < 0) {
    if (!QUESTIONS[cat]) QUESTIONS[cat] = [];
    QUESTIONS[cat].push({ pregunta, opciones, respuesta: resp });
    adminMsg.textContent = "Pregunta agregada.";
  } else {
    QUESTIONS[cat][idx] = { pregunta, opciones, respuesta: resp };
    adminMsg.textContent = "Pregunta actualizada.";
  }

  refrescarListaPreguntas();
  inicializarCategorias();
});

btnNuevaPregunta.addEventListener("click", () => {
  limpiarFormularioPregunta();
});

btnEliminarPregunta.addEventListener("click", () => {
  const cat = adminCategoriaSelect.value;
  const idx = parseInt(preguntaIndexInput.value, 10);
  if (!cat || isNaN(idx) || idx < 0) {
    adminMsg.textContent = "Selecciona una pregunta para eliminar.";
    return;
  }
  QUESTIONS[cat].splice(idx, 1);
  adminMsg.textContent = "Pregunta eliminada.";
  limpiarFormularioPregunta();
  refrescarListaPreguntas();
  inicializarCategorias();
});

function limpiarFormularioPregunta() {
  preguntaIndexInput.value = -1;
  txtPregunta.value = "";
  opc1.value = "";
  opc2.value = "";
  opc3.value = "";
  opc4.value = "";
  respuestaCorrectaSelect.innerHTML = '<option value="">Selecciona la respuesta correcta</option>';
  adminMsg.textContent = "Formulario listo para nueva pregunta.";
  Array.from(listaPreguntas.children).forEach(li => li.classList.remove("activa"));
}

btnNuevaCategoria.addEventListener("click", () => {
  const nombre = prompt("Nombre de la nueva categoría:");
  if (!nombre) return;
  const key = nombre.trim();
  if (!key) return;
  if (QUESTIONS[key]) {
    alert("Ya existe una categoría con ese nombre.");
    return;
  }
  QUESTIONS[key] = [];
  inicializarAdminCategorias();
  inicializarCategorias();
  adminCategoriaSelect.value = key;
  refrescarListaPreguntas();
});

btnEliminarCategoria.addEventListener("click", () => {
  const cat = adminCategoriaSelect.value;
  if (!cat) return;
  if (!confirm(`¿Eliminar la categoría "${cat}"? Las preguntas se perderán en esta versión web.`)) {
    return;
  }
  delete QUESTIONS[cat];
  inicializarAdminCategorias();
  inicializarCategorias();
  limpiarFormularioPregunta();
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.screen;
    cambiarPantalla(target);
    if (target === "screen-categorias") {
      inicializarCategorias();
    } else if (target === "screen-config") {
      cargarConfigInicial();
    } else if (target === "screen-admin") {
      inicializarAdminCategorias();
      limpiarFormularioPregunta();
    }
  });
});

btnSiguiente.addEventListener("click", () => {
  indicePregunta++;
  if (indicePregunta >= preguntasSeleccionadas.length) {
    mostrarResultados();
  } else {
    mostrarPreguntaActual();
  }
});

btnReiniciar.addEventListener("click", () => {
  cambiarPantalla("screen-categorias");
});

document.addEventListener("DOMContentLoaded", () => {
  inicializarCategorias();
  cargarConfigInicial();
  inicializarAdminCategorias();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch(err => console.error("SW error", err));
  });
}
