
let preguntas = {};
let colores = {};
let categorias = [];
let tiempo = 20;
let indice = 0;
let puntaje = 0;
let actualCat = "";

fetch("preguntas.json").then(r=>r.json()).then(d=>{
    preguntas=d;
    cargarCategorias();
});
fetch("colores.json").then(r=>r.json()).then(d=>colores=d);

function cargarCategorias(){
  categorias = Object.keys(preguntas);
  let cont = document.querySelector("#category-list");
  cont.innerHTML="";
  categorias.forEach(cat=>{
    let btn = document.createElement("button");
    btn.textContent = cat;
    btn.style.background = colores[cat] || "#2563eb";
    btn.onclick = ()=> iniciar(cat);
    cont.appendChild(btn);
  });
}

function iniciar(cat){
  actualCat=cat;
  indice=0;
  puntaje=0;
  document.querySelector("#category-screen").style.display="none";
  document.querySelector("#quiz-screen").style.display="block";
  mostrarPregunta();
}

function mostrarPregunta(){
  let q = preguntas[actualCat];
  let pregunta = q[indice];
  document.querySelector("#quiz-title").textContent=actualCat;
  document.querySelector("#question").textContent=pregunta.pregunta;
  let opts = document.querySelector("#options");
  opts.innerHTML="";
  pregunta.opciones.forEach(op=>{
    let b=document.createElement("button");
    b.className="opt";
    b.textContent=op;
    b.onclick=()=> seleccionar(b,op);
    opts.appendChild(b);
  });
  document.querySelector("#progress").textContent = `Pregunta ${indice+1} de ${q.length}`;
}

function seleccionar(btn,op){
  document.querySelectorAll(".opt").forEach(x=>x.style.border="none");
  btn.style.border="2px solid #f472b6";
  btn.dataset.sel=op;
}

document.querySelector("#next-btn").onclick=()=>{
  let sel = Array.from(document.querySelectorAll(".opt")).find(b=>b.dataset.sel);
  if(!sel){ alert("Selecciona una opción"); return; }
  let correcta = preguntas[actualCat][indice].respuesta;
  if(sel.dataset.sel === correcta) puntaje++;
  indice++;
  if(indice>=preguntas[actualCat].length) finalizar();
  else mostrarPregunta();
};

function finalizar(){
  document.querySelector("#quiz-screen").style.display="none";
  document.querySelector("#result").textContent = `Puntaje: ${puntaje} de ${preguntas[actualCat].length}`;
  document.querySelector("#result-screen").style.display="block";
}

document.querySelector("#back-btn").onclick=()=>{
  document.querySelector("#result-screen").style.display="none";
  document.querySelector("#category-screen").style.display="block";
};

document.querySelector("#config-btn").onclick=()=>{
  document.querySelector("#config-modal").style.display="flex";
  document.querySelector("#current-time").textContent = tiempo + " segundos";
};
document.querySelector("#close-config").onclick=()=>{
  document.querySelector("#config-modal").style.display="none";
};
document.querySelectorAll(".times button").forEach(b=>{
  b.onclick=()=>{
    tiempo=parseInt(b.dataset.t);
    document.querySelector("#current-time").textContent = tiempo+" segundos";
  };
});
