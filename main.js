const height = 30;
const width = 30;
let snaekSpeed = 200;

const snake = [5, 4, 3, 2, 1, 0];
let head = snake[0];

let isGameOver = false;
let direction = 'left';
let interval;
let random;

const rightBoundaries = [];
const leftBoundaries = [];

// עדכון הSCORE
const score = document.querySelector('.points');
let points = 0;


// עדכון הTIMER
let intervalTime;

function timerStart() {
    let timer = document.querySelector(".time");
    let counter = 30;


    function startInterval() {
        intervalTime = setInterval(() => {
            timer.innerHTML = counter;
            if (counter < 1) {
                clearInterval(intervalTime);
                isGameOver = true;
                gameOver();
                return;
            } else {
                counter--;
            }
        }, 1000);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (!isGameOver) {
                clearInterval(intervalTime);
                counter = 29;
            }
            startInterval();
        }
    });
}

timerStart();


document.addEventListener('keydown', () => {
    timerStart();
    return;
})

// גבולות ימין
for (let i = 0; i < height; i++) {
    rightBoundaries.push(i * width - 1);
}

// גבולות שמאל
for (let i = 1; i <= height; i++) {
    leftBoundaries.push(i * width);
}

const board = document.querySelector('.board');
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

function createBoard() {
    for (let i = 0; i < width * height; i++) {
        const div = document.createElement("div");
        board.appendChild(div);
    }

    color();
    setRandom();
}

function color() {
    const divs = board.querySelectorAll("div");

    divs.forEach(el => el.classList.remove('snake', 'head', 'up', 'right', 'down', 'left'));

    snake.forEach(num => divs[num].classList.add('snake'));

    divs[head].classList.add('head', direction);
}

window.addEventListener("keydown", ev => {
    ev.preventDefault();

    switch (ev.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowRight':
            move('right');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'Escape':
            clearInterval(interval);
            break;
    }
});

function move(dir) {
    if (isGameOver) {
        return;
    }

    const divs = board.querySelectorAll("div");

    if (dir == 'up') {
        if (direction == 'down') {
            return;
        }

        head -= width;

        if (!divs[head]) {
            gameOver();
            return;
        }
    } else if (dir == 'right') {
        if (direction == 'left') {
            return;
        }

        head--;

        if (rightBoundaries.includes(head)) {
            gameOver();
            return;
        }
    } else if (dir == 'down') {
        if (direction == 'up') {
            return;
        }

        head += width;

        if (!divs[head]) {
            gameOver();
            return;
        }
    } else if (dir == 'left') {
        if (direction == 'right') {
            return;
        }

        head++;

        if (leftBoundaries.includes(head)) {
            gameOver();
            return;
        }
    }

    if (snake.includes(head)) {
        gameOver();
        return;
    }

    direction = dir;
    snake.unshift(head);

    if (random == head) {

        const audio = document.createElement('audio');
        audio.src = "Pebble.ogg";
        audio.volume = 0.2;
        audio.play();

        scorePoints();
        setRandom();

        if (snaekSpeed <= 100) {
            return;
        }


        snaekSpeed -= 10;
    } else {
        snake.pop();
    }

    color();
    startAuto();
}

function startAuto() {
    clearInterval(interval);
    interval = setInterval(() => move(direction), snaekSpeed);
}

function setRandom() {
    random = Math.floor(Math.random() * (width * height));

    if (snake.includes(random)) {
        setRandom();
    } else {
        const divs = board.querySelectorAll("div");

        divs.forEach(el => el.classList.remove('apple'));
        divs[random].classList.add('apple');
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(interval);

    const audio = document.createElement('audio');
    audio.src = "Country_Blues.ogg";
    audio.volume = 0.1;
    audio.play();

    setTimeout(() => {
        alert("Game over");
        location.reload();
    }, 200);
}

// תוצאת SCORE
function scorePoints() {
    points++;
    score.textContent = points;
};