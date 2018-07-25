var phrase = "hi how are you";
var popSize = 500;

var words = [];

var population = [];
var fitness = [];

let possibleLetters = "abcdefghiklmnopqrstuvwxyz "

let currentRecord = 0;
let bestEver = "";

let h1Ele = document.querySelector('#guess');

var gens = document.querySelector('.gen');

let pop = document.querySelector(".pop")

pop.textContent = "population: " + popSize;

let gen = 0;


function setup() {

  // generate words
  for (let j = 0; j < popSize; j++) {
    let name = "";
    for (let i = 0; i < phrase.length; i++) {
      name += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    }
    words.push(name);
  }


  for (let i = 0; i < popSize; i++) {
    fitness[i] = 0;
  }
}

function calcFitness() {
  for (let i = 0; i < words.length; i++) {
    let splitCurrentWord = words[i].split("");
    for (let j = 0; j < splitCurrentWord.length; j++) {
      if (splitCurrentWord[j] == phrase.charAt(j)) {
        fitness[i] += 1;
      }
    }
    if (currentRecord < fitness[i]) {
      currentRecord = fitness[i];

      bestEver = words[i];
    }
  }
}

function normalizeFitness() {
  let fitnessSum = 0;
  for (let i = 0; i < popSize; i++) {
    fitnessSum += fitness[i]
  }
  
  for (let i = 0; i < popSize; i++) {
    fitness[i] = fitness[i] / fitnessSum
  }
}

function nextGene () {
  var newWords = [];
  for (let i = 0; i < words.length; i++) {
    var orderA = pickOne(words, fitness);
    var orderB = pickOne(words, fitness);

    var order = crossOver(orderA, orderB);
    order = mutate(order, 0.01);

    newWords[i] = order;
  }
  words = newWords;

  gen++;
}

function crossOver(orderA, orderB) {

  let midPoint = Math.floor(Math.random() * orderA.length);
  let newString = [];

  // Half from one, half from the other
  for (let i = 0; i < phrase.length; i++) {
    if (i > midPoint) {
      newString[i] = orderA[i];
    } else  {
      newString[i] = orderB[i];
    }
  }

  return newString.join("");
}

// pick a partner 
function pickOne(list, prob) {
  let index = 0;
  let r = Math.random();

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function mutate(order, mutationRate) {
  let splitOrder = order.split("")
  for (let i = 0; i < splitOrder.length; i++) {
    if (Math.random() < mutationRate) {
      splitOrder[i] = possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length));
    }
  }

  return splitOrder.join("");
}

function draw() {

  // // calculate fitness
  calcFitness();
  // // // normalize the fitness
  normalizeFitness()
  nextGene();

  gens.textContent = "generation: " + gen;

  h1Ele.textContent = "current best guess: " + bestEver;


  if (bestEver == phrase) {
    console.log('FOUND')
    window.cancelAnimationFrame(draw)
  } else {
    window.requestAnimationFrame(draw)
  }
}


setup();

window.requestAnimationFrame(draw)