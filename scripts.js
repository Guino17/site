const colors = ["green", "red", "yellow", "blue"];
let sequence = [];
let playerSequence = [];
let level = 0;
let acceptingInput = false;

const green = document.getElementById("green");
const red = document.getElementById("red");
const yellow = document.getElementById("yellow");
const blue = document.getElementById("blue");
const startButton = document.getElementById("start-button");
const loginButton = document.getElementById("login-button");

const sounds = {
    green: new Audio('sonidos/green.mp3'),
    red: new Audio('sonidos/red.mp3'),
    yellow: new Audio('sonidos/yellow.mp3'),
    blue: new Audio('sonidos/blue.mp3')
};

green.addEventListener("click", () => handleClick("green"));
red.addEventListener("click", () => handleClick("red"));
yellow.addEventListener("click", () => handleClick("yellow"));
blue.addEventListener("click", () => handleClick("blue"));
startButton.addEventListener("click", startGame);
loginButton.addEventListener("click", () => window.location.href = 'login.html');

function startGame() {
    level = 0;
    sequence = [];
    playerSequence = [];
    nextLevel();
}

function nextLevel() {
    level++;
    playerSequence = [];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    flashSequence();
}

function flashSequence() {
    let delay = 0;
    acceptingInput = false;
    sequence.forEach((color, index) => {
        setTimeout(() => flashColor(color), delay);
        delay += 1000;
    });
    setTimeout(() => acceptingInput = true, delay);
}

function flashColor(color) {
    const element = document.getElementById(color);
    element.classList.add("active");
    sounds[color].currentTime = 0;  // Reinicia el sonido
    sounds[color].play();
    setTimeout(() => element.classList.remove("active"), 300);
}

function handleClick(color) {
    if (!acceptingInput) return;
    const element = document.getElementById(color);
    element.classList.add("active");
    sounds[color].currentTime = 0;  // Reinicia el sonido
    sounds[color].play();
    setTimeout(() => element.classList.remove("active"), 300);
    playerSequence.push(color);
    checkSequence();
}

function checkSequence() {
    const currentMoveIndex = playerSequence.length - 1;
    if (playerSequence[currentMoveIndex] === sequence[currentMoveIndex]) {
        if (playerSequence.length === sequence.length) {
            setTimeout(nextLevel, 1500);
        }
    } else {
        const username = localStorage.getItem('username');
        const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
        scoreboard.push({ username, level });
        localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
        displayScoreboard();
        alert(`Has perdido! racha de nivel ${level}`);
        startGame();
    }
}

function displayScoreboard() {
    const scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || [];
    scoreboard.sort((a, b) => b.level - a.level); // Ordenar por nivel de mayor a menor
    const topScores = scoreboard.slice(0, 10); // Obtener los 10 mejores puntajes

    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';
    topScores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = `${score.username}: Level ${score.level}`;
        scoreList.appendChild(listItem);
    });
}

function applySavedColors() {
    const savedColors = JSON.parse(localStorage.getItem('colors'));
    if (savedColors) {
        document.getElementById('green').style.backgroundColor = savedColors.green;
        document.getElementById('red').style.backgroundColor = savedColors.red;
        document.getElementById('yellow').style.backgroundColor = savedColors.yellow;
        document.getElementById('blue').style.backgroundColor = savedColors.blue;
    }
}

window.onload = function() {
    displayScoreboard();
    applySavedColors();
};
