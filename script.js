let length = 1;
let speed = 350;
let canDie = true;

document.getElementById('endOverlay').style.display = 'none';

document.getElementById('checkDie').addEventListener('change', () => {
    if (document.getElementById('checkDie').checked) {
        canDie = true;
    } else {
        canDie = false;
    }
});

for (let i = 0; i < 441; i++) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('tile');
    newDiv.id = `tile${i}`;
    if (i % 2 == 0) {
        newDiv.style.background = '#e0e0e0';
    } else {
        newDiv.style.background = '#cccccc';
    }
    document.getElementById('container').appendChild(newDiv);
}
document.getElementById('part1').style.zIndex = '9999';

let applePostion;
function createAppel() {
    applePostion = Math.floor(Math. random()*441);
    if (document.getElementById(`tile${applePostion}`).hasChildNodes()) {
        createAppel();
    } else {
        document.getElementById(`tile${applePostion}`).appendChild(document.getElementById('apple'));
    }
}

createAppel();
document.getElementById('tile220').appendChild(document.getElementById('part1'));

let currentDirection = 'up';
let directions = [];
let adding = false;
let playing = true;
let canTurn = true;

moveSnakePart(currentDirection, '1', 'yes');
moveSnakePart(currentDirection, '2', 'yes');
moveSnakePart(currentDirection, '3', 'yes');
moveSnakePart(currentDirection, '4', 'no');

function move() {
    moveSnakePart(currentDirection, '1', 'no');
    directions.push(currentDirection);
    if (playing) {
        if (!adding) {
            for (let i = 2; i <= length; i++) {
                moveSnakePart(directions[directions.length - i], `${i}`, 'no');
            }
        } else {
            for (let i = 2; i <= length - 1; i++) {
                moveSnakePart(directions[directions.length - i], `${i}`, 'no');
            }
            moveSnakePart(directions[directions.length - length], length.toString(), 'yes');
            adding = false;
        }
        if (document.getElementById(`part1`).parentNode.id.match(/\d+/)[0] == applePostion) {
            createAppel();
            document.getElementById('length').innerText = length + 1;
            adding = true;
        }
        speed = 840 - document.getElementById('slider').value;
        setTimeout(move, speed);
        canTurn = true;
    }
}
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        if (currentDirection !== 'down' && currentDirection !== 'up' && playing && canTurn) {
            document.getElementById('face1').style.transform = 'rotate(180deg)';
            currentDirection = 'up';
            canTurn = false;
        }
    } else if (event.key === "ArrowDown") {
        if (currentDirection !== 'down' && currentDirection !== 'up' && playing && canTurn) {
            document.getElementById('face1').style.transform = 'rotate(0deg)';
            currentDirection = 'down';
            canTurn = false;
        }
    } else if (event.key === "ArrowLeft") {
        if (currentDirection !== 'left' && currentDirection !== 'right' && playing && canTurn) {
            document.getElementById('face1').style.transform = 'rotate(90deg)';
            currentDirection = 'left';
            canTurn = false;
        }
    } else if (event.key === "ArrowRight") {
        if (currentDirection !== 'left' && currentDirection !== 'right' && playing && canTurn) {
            document.getElementById('face1').style.transform = 'rotate(270deg)';
            currentDirection = 'right';
            canTurn = false;
        }
    }
});
move();

function gameOver() {
    document.getElementById('endOverlay').style.display = 'block';
    document.getElementById('showScore').innerText = length;
    playing = false;
}

function moveSnakePart(moveTo, partToMove, add) {
    if (add == 'yes') {
        length++;
        const newPart = document.createElement('div');
        newPart.classList.add('snake'); 
        newPart.id = `part${length}`;
        document.getElementById(`part${partToMove}`).parentNode.appendChild(newPart);
    }
    let currentTile = parseInt(document.getElementById(`part${partToMove}`).parentNode.id.match(/\d+/));
    let nextTile;
    if (moveTo == 'up') {
        nextTile = currentTile - 21;
    } else if (moveTo == 'down') {
        nextTile = currentTile + 21;
    } else if (moveTo == 'left') {
        nextTile = currentTile - 1;
    } else if (moveTo == 'right') {
        nextTile = currentTile + 1;
    }
    const part1Tile = parseInt(document.getElementById(`part1`).parentNode.id.match(/\d+/));
    if (nextTile >= 0 && nextTile < 441) {
        let cantGo = [];
        for (let i = 2; i <= length; i++) {
            cantGo.push(parseInt(document.getElementById(`part${i}`).parentNode.id.match(/\d+/)));
        }
        for (let x = 0; x <= cantGo.length; x++) {
            if (cantGo.length !== length) {
                cantGo.splice(x, 1);
            }
        }
        if (cantGo.includes(part1Tile) && document.getElementById(`part2`).parentNode.id !== document.getElementById(`part3`).parentNode.id && document.getElementById(`part3`).parentNode.id !== document.getElementById(`part4`).parentNode.id && canDie) {
            gameOver();
            if (partToMove !== '1') {
                document.getElementById(`tile${nextTile}`).appendChild(document.getElementById(`part${partToMove}`));
            }
        } else if (moveTo == 'left' && currentTile % 21 == 0 && partToMove == '1' && canDie || moveTo == 'left' && partToMove == '2' && currentTile - 1 == 0 && part1Tile == 0 && canDie) {
            nextTile++;
            gameOver();
        } else if (moveTo == 'right' && (currentTile + 1) % 21 == 0 && partToMove == '1' && canDie || moveTo == 'right' && partToMove == '2' && currentTile + 1 == 440 && part1Tile == 440 && canDie) {
            nextTile--;
            gameOver();
        } else if (!(moveTo == 'down') && partToMove == '2' && nextTile >= 0 && nextTile <= 20 && part1Tile == nextTile && canDie) {
            gameOver();
            document.getElementById(`part${length}`).parentNode.appendChild(document.getElementById('part2'));
        } else if (!(moveTo == 'up') && partToMove == '2' && nextTile >= 420 && nextTile <= 440 && part1Tile == nextTile && canDie) {
            gameOver();
            document.getElementById(`part${length}`).parentNode.appendChild(document.getElementById('part2'));
        } else {
            document.getElementById(`tile${nextTile}`).appendChild(document.getElementById(`part${partToMove}`));
        }
    }
}

document.getElementById('replayButton').addEventListener('click', () => {
    length = 1;
    currentDirection = 'up';
    directions = [];
    adding = false;
    playing = true;
    canTurn = true;
    document.getElementById('endOverlay').style.display = 'none';
    createAppel();
    document.getElementById('tile220').appendChild(document.getElementById('part1'));
    const snakeParts = document.querySelectorAll('.snake');
    snakeParts.forEach(part => {
        if (part.id !== 'part1') {
            part.parentNode.removeChild(part);
        }
    });
    document.getElementById('length').innerText = '4';
    document.getElementById('face1').style.transform = 'rotate(180deg)';
    moveSnakePart(currentDirection, '1', 'yes');
    moveSnakePart(currentDirection, '2', 'yes');
    moveSnakePart(currentDirection, '3', 'yes');
    moveSnakePart(currentDirection, '4', 'no');
    move();
});