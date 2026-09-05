let fondo;
let fondoX = 0;
let velocidadFondo = 1;

let spritesQuieto = [];
let spritesCaminando = [];
let spritesSalto = [];

let estado = "caminando";

let velQuieto = 20;
let velCaminando = 8;

let ancho = 80;
let alto = 80;

let x = -50;
let ySuelo = 300;
let y = ySuelo;
let velocidadMovimiento = 3;

let paso = "entrando";

let inicioQuieto = 0;
let duracionQuieto = 2000;

let saltando = false;
let subiendo = true;
let alturaSalto = 100;
let velocidadSalto = 5;

function preload() {
  fondo = loadImage("data/fondo.png");

  let nombresQuieto = ["data/quieto1.png", "data/quieto2.png", "data/quieto3.png"];
  for (let i = 0; i < nombresQuieto.length; i++) {
    spritesQuieto[i] = loadImage(nombresQuieto[i]);
  }

  let nombresCorrer = ["data/correr1.png", "data/correr2.png", "data/correr3.png", "data/correr4.png", "data/correr5.png"];
  for (let i = 0; i < nombresCorrer.length; i++) {
    spritesCaminando[i] = loadImage(nombresCorrer[i]);
  }

  spritesSalto[0] = loadImage("data/salto1.png");
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
}

function draw() {
  dibujarFondo();
  manejarCinematica();
  actualizarSalto();

  let frames;
  let velocidad;
  if (estado === "saltando") {
    frames = spritesSalto;
    velocidad = 1;
  } else if (estado === "caminando") {
    frames = spritesCaminando;
    velocidad = velCaminando;
  } else {
    frames = spritesQuieto;
    velocidad = velQuieto;
  }

  let indice = calcularFrame(frames, velocidad);
  dibujarPersonaje(frames, indice, x, y);
}

function dibujarFondo() {
  if (paso !== "fin") {
    fondoX -= velocidadFondo;
  }
  if (fondoX <= -800) {
    fondoX = 0;
  }
  imageMode(CORNER);
  image(fondo, fondoX, 0, 800, 600);
  image(fondo, fondoX + 800, 0, 800, 600);
  imageMode(CENTER);
}

function manejarCinematica() {

  if (paso === "entrando") {
    estado = "caminando";
    x += velocidadMovimiento;
    if (x >= 400) {
      paso = "quieto";
      inicioQuieto = millis();
    }
  }

  else if (paso === "quieto") {
    estado = "quieto";
    if (millis() - inicioQuieto >= duracionQuieto) {
      paso = "saltando";
      saltando = true;
      subiendo = true;
    }
  }

  else if (paso === "saltando") {
    estado = "saltando";
    if (!saltando) {
      paso = "saliendo";
    }
  }

  else if (paso === "saliendo") {
    estado = "caminando";
    x += velocidadMovimiento;
    if (x >= 900) {
      paso = "fin";
    }
  }

  else if (paso === "fin") {
    estado = "quieto";
  }
}

function actualizarSalto() {
  if (!saltando) {
    y = ySuelo;
    return;
  }

  if (subiendo) {
    y -= velocidadSalto;
    if (y <= ySuelo - alturaSalto) {
      subiendo = false;
    }
  } else {
    y += velocidadSalto;
    if (y >= ySuelo) {
      y = ySuelo;
      saltando = false;
    }
  }
}

function calcularFrame(frames, velocidad) {
  let indice = floor(frameCount / velocidad) % frames.length;
  return indice;
}

function dibujarPersonaje(frames, indice, posX, posY) {
  push();
  translate(posX, posY);
  scale(-1, 1);
  image(frames[indice], 0, 0, ancho, alto);
  pop();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    x = -50;
    y = ySuelo;
    paso = "entrando";
    estado = "caminando";
    saltando = false;
  }
}
