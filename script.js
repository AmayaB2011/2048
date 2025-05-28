document.getElementById('board').style.width = `${document.getElementById('board').offsetHeight}px`;
document.getElementById('top').style.width = `${document.getElementById('board').offsetWidth}px`;
let board = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
let startingNumbers = [2, 4];
let colours = ['#63E6BE', '#FFDC54', '#FFB6B9', '#FF9CEE', '#FFA756', '#FF6F61', '#FF61E6', '#4D96FF', '#845EC2', '#00C2A8', '#2C2C54'];
let tileHeight = `${document.getElementById('board').offsetHeight / 4 - 10}px`;
let tileWidth = `${document.getElementById('board').offsetWidth / 4 - 10}px`;
let best = localStorage.getItem("best") || 0;
let score = 0;
let startingX;
let startingY;
let slideTime = 200;
document.getElementById('best').innerText = best;

for (let i = 0; i < 16; i++) {
    let newPlace = document.createElement('div');
    newPlace.classList.add('place');
    newPlace.id = `place${i}`;
    newPlace.style.height = `${document.getElementById('board').offsetHeight / 4 - 10}px`;
    newPlace.style.width = `${document.getElementById('board').offsetWidth / 4 - 10}px`;
    document.getElementById('board').appendChild(newPlace);
}

function createNewTile() {
    if (board.includes('')) {
        let newTile = document.createElement('div');
        newTile.classList.add('grow');
        newTile.classList.add('tile');
        let size = startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
        let baseSize = document.getElementById('board').offsetWidth / 6.5;
        if (size >= 128 && size < 1024) {
            newTile.style.fontSize = `${baseSize * 0.7}px`;
        } else if (size >= 1024) {
            newTile.style.fontSize = `${baseSize * 0.5}px`;
        } else {
            newTile.style.fontSize = `${baseSize}px`;
        }
        newTile.style.height = tileHeight;
        newTile.style.width = tileWidth;
        let colourPlace = 0;
        let sizeToChange = size;
        for (let i = 0; i < colours.length; i++) {
            if (sizeToChange / 2 !== 1) {
                colourPlace = colourPlace + 1;
                sizeToChange = sizeToChange / 2;
            } else {
                break;
            }
        }
        newTile.style.backgroundColor = colours[colourPlace];
        newTile.innerText = size;
        let place = Math.floor(Math.random() * 16);
        while (document.getElementById(`place${place}`).children.length !== 0) {
            place = Math.floor(Math.random() * 16);
        }
        board[place] = `${size}`;
        newTile.classList.add(place);
        document.getElementById(`place${place}`).appendChild(newTile);
        setTimeout(() => {
            newTile.classList.remove('grow');
        }, 200);
    }
}
createNewTile();
createNewTile();

function combine(i1, i2) {
    let newTile = document.createElement('div');
    let size = document.getElementById(`place${i1}`).children[0].innerText * 2;
    board[i1] = `${size}`;
    board[i2] = '';
    newTile.classList.add('tile');
    newTile.classList.add(i1);
    newTile.classList.add('new');
    let baseSize = document.getElementById('board').offsetWidth / 6.5;
    if (size >= 128 && size < 1024) {
        newTile.style.fontSize = `${baseSize * 0.7}px`;
    } else if (size >= 1024) {
        newTile.style.fontSize = `${baseSize * 0.5}px`;
    } else {
        newTile.style.fontSize = `${baseSize}px`;
    }
    newTile.style.height = tileHeight;
    newTile.style.width = tileWidth;
    let colourPlace = 0;
    let sizeToChange = size;
    for (let x = 0; x < colours.length; x++) {
        if (sizeToChange / 2 !== 1) {
            colourPlace = colourPlace + 1;
            sizeToChange = sizeToChange / 2;
        } else {
            break;
        }
    }
    document.getElementById(`place${i1}`).appendChild(newTile);
    newTile.classList.add('pop');
    document.getElementById(`place${i1}`).children[0].remove();
    document.getElementById(`place${i2}`).children[0].remove();
    newTile.style.backgroundColor = colours[colourPlace];
    newTile.innerText = size;
    score = score + size / 2;
    document.getElementById('scoreText').innerText = score;
    document.getElementById('scoreText').classList.add('addscore');
    setTimeout(() => {
        newTile.classList.remove('pop');
    }, 200);
    setTimeout(() => {
        document.getElementById('scoreText').classList.remove('addscore');
    }, 300);
}

function left() {
    let beforeBoard = [...board];
    let hasMoved = false;
    function moveLeft(place) {
        for (let i = 0; i < board.length; i++) {
            if (document.getElementsByClassName(i)[0]) {
                if ([place + 1, place + 2, place + 3].includes(i)) {
                    if (board[place] == '' && !(place == i + 1)) {
                        move(i, place);
                        hasMoved = true;
                    } else if (board[place + 1] == '' && !(place + 1 == i + 1)) {
                        move(i, place + 1);
                        hasMoved = true;
                    } else if (board[place + 2] == '' && !(place + 2 == i + 1)) {
                        move(i, place + 2);
                        hasMoved = true;
                    }
                }
            }
        }
    }

    moveLeft(0);
    moveLeft(4);
    moveLeft(8);
    moveLeft(12);
    for (let i = 0; i < board.length; i++) {
        if (!([0, 4, 8, 12].includes(i)) && document.getElementsByClassName(i)[0] && board[i] == board[i - 1]) {
            combine(i - 1, i);
            hasMoved = true;
            moveLeft(0);
            moveLeft(4);
            moveLeft(8);
            moveLeft(12);
        }
    }
    if (hasMoved == true) {
        slide(beforeBoard, board);
        createNewTile();
        checkForGameOver();
    }
}

function right() {
    let beforeBoard = [...board];
    let hasMoved = false;
    function moveRight(place) {
        for (let i = board.length - 1; i >= 0; i--) {
            if (document.getElementsByClassName(i)[0]) {
                if ([place - 1, place - 2, place - 3].includes(i)) {
                    if (board[place] == '' && !(place == i - 1)) {
                        move(i, place);
                        hasMoved = true;
                    } else if (board[place - 1] == '' && !(place - 1 == i - 1)) {
                        move(i, place - 1);
                        hasMoved = true;
                    } else if (board[place - 2] == '' && !(place - 2 == i - 1)) {
                        move(i, place - 2);
                        hasMoved = true;
                    }
                }
            }
        }
    }

    moveRight(3);
    moveRight(7);
    moveRight(11);
    moveRight(15);
    for (let i = board.length - 1; i >= 0; i--) {
        if (!([3, 7, 11, 15].includes(i)) && document.getElementsByClassName(i)[0] && board[i] == board[i + 1]) {
            combine(i + 1, i);
            hasMoved = true;
            moveRight(3);
            moveRight(7);
            moveRight(11);
            moveRight(15);
        }
    }
    if (hasMoved == true) {
        slide(beforeBoard, board);
        createNewTile();
        checkForGameOver();
    }
}

function up() {
    let beforeBoard = [...board];
    let hasMoved = false;
    function moveUp(place) {
        for (let i = 0; i < board.length; i++) {
            if (document.getElementsByClassName(i)[0]) {
                if ([place + 4, place + 8, place + 12].includes(i)) {
                    if (board[place] == '' && !(place == i + 4)) {
                        move(i, place);
                        hasMoved = true;
                    } else if (board[place + 4] == '' && !(place + 4 == i + 4)) {
                        move(i, place + 4);
                        hasMoved = true;
                    } else if (board[place + 8] == '' && !(place + 8 == i + 4)) {
                        move(i, place + 8);
                        hasMoved = true;
                    }
                }
            }
        }
    }

    moveUp(0);
    moveUp(1);
    moveUp(2);
    moveUp(3);
    for (let i = 0; i < board.length; i++) {
        if (!([0, 1, 2, 3].includes(i)) && document.getElementsByClassName(i)[0] && board[i] == board[i - 4]) {
            combine(i - 4, i);
            hasMoved = true;
            moveUp(0);
            moveUp(1);
            moveUp(2);
            moveUp(3);
        }
    }
    if (hasMoved == true) {
        slide(beforeBoard, board);
        createNewTile();
        checkForGameOver();
    }
}

function down() {
    let beforeBoard = [...board];
    let hasMoved = false;
    function moveDown(place) {
        for (let i = board.length - 1; i >= 0; i--) {
            if (document.getElementsByClassName(i)[0]) {
                if ([place, place + 4, place + 8].includes(i)) {
                    if (board[place + 12] == '' && !(place + 12 == i - 4)) {
                        move(i, place + 12);
                        hasMoved = true;
                    } else if (board[place + 8] == '' && !(place + 8 == i - 4)) {
                        move(i, place + 8);
                        hasMoved = true;
                    } else if (board[place + 4] == '' && !(place + 4 == i - 4)) {
                        move(i, place + 4);
                        hasMoved = true;
                    }
                }
            }
        }
    }

    moveDown(0);
    moveDown(1);
    moveDown(2);
    moveDown(3);
    for (let i = board.length - 1; i >= 0; i--) {
        if (!([12, 13, 14, 15].includes(i)) && document.getElementsByClassName(i)[0] && board[i] == board[i + 4]) {
            combine(i + 4, i);
            hasMoved = true;
            moveDown(0);
            moveDown(1);
            moveDown(2);
            moveDown(3);
        }
    }
    if (hasMoved == true) {
        slide(beforeBoard, board);
        createNewTile();
        checkForGameOver();
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {  
        left();
    }
    else if (e.key === 'ArrowRight') {
        right();
    }
    else if (e.key === 'ArrowUp') {
        up();
    }
    else if (e.key === 'ArrowDown') {
        down();
    }

    if (document.getElementById('cover').style.opacity > 0 && e.key === ' ') {
        newGame();
    }
});

window.addEventListener('touchstart', e => {
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
    let movedX = e.changedTouches[0].clientX - startingX;
    let movedY = e.changedTouches[0].clientY - startingY;
    if (Math.abs(movedX) > Math.abs(movedY)) {
        if (movedX > 0) {
            right();
        } else {
            left();
        }
    } else {
        if (movedY > 0) {
            down();
        } else {
            up();
        }
    }
});

function move(item, moveTo) {
    let tile = document.getElementsByClassName(item)[0];
    document.getElementById(`place${moveTo}`).appendChild(tile);
    board[moveTo] = tile.innerText;
    board[item] = '';
    tile.classList.add(moveTo);
    tile.classList.remove(item);
}

function slide(beforeBoard, afterBoard) {
    let allFrom = [];
    let allTo = [];
    for (let i = 0; i < afterBoard.length; i++) {
        if (beforeBoard[i] !== afterBoard[i]) {
            if (beforeBoard[i] !== '') {
                allFrom.push(i);
            }
            if (afterBoard[i] !== '') {
                allTo.push(i);
                if (document.getElementById(`place${i}`).children[0].classList.contains('new')) {
                    allTo.push(i);
                    document.getElementById(`place${i}`).children[0].classList.remove('new');
                }
            }
        }
    }
    // for (let i = 0; i < allTo.length; i++) {
    //     if (allFrom[i] !== allTo[i]) {
    //         console.log(`From: ${allFrom[i]} To: ${allTo[i]}`);
    //         let tile = document.getElementById(`place${allTo[i]}`).children[0];
    //         tile.style.left = document.getElementById(`place${allFrom[i]}`).offsetLeft + 'px';
    //         tile.style.top = document.getElementById(`place${allFrom[i]}`).offsetTop + 'px';
    //         tile.style.transition = `left ${slideTime / 1000}s ease, top ${slideTime / 1000}s ease`;
    //         requestAnimationFrame(() => {
    //             tile.style.left = document.getElementById(`place${allTo[i]}`).offsetLeft + 'px';
    //             tile.style.top = document.getElementById(`place${allTo[i]}`).offsetTop + 'px';
    //         });
    //     }
    // }
}

function newGame(gameOver) {
    if ((gameOver && document.getElementById('cover').style.opacity > 0) || !gameOver) {
        document.getElementById('cover').style.opacity = '0';
        document.getElementById('cover').style.height = '0';
        for (let i = 0; i < board.length; i++) {
            if (document.getElementById(`place${i}`).children[0]) {
                document.getElementById(`place${i}`).children[0].remove();
            }
        }
        board = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        score = 0;
        document.getElementById('scoreText').innerText = score;
        createNewTile();
        createNewTile();
    }
}

function checkForGameOver() {
    let canMove = false;
    for (let i = 0; i < board.length; i++) {
        if (![3, 7, 11, 15].includes(i) && board[i] == board[i + 1]) {
            canMove = true;
        }
        if (![12, 13, 14, 15].includes(i) && board[i] == board[i + 4]) {
            canMove = true;
        }
    }
    if (!canMove && !board.includes('')) {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                let currentOpacity = parseFloat(document.getElementById('cover').style.opacity) || 0;
                document.getElementById('cover').style.opacity = currentOpacity + 0.02;
            }, i * 10);
        }
        document.getElementById('cover').style.height = '100%';
        document.getElementById('finalScore').innerText = score;
        if (score > best) {
            document.getElementById('best').innerText = score;
            localStorage.setItem("best", score);
        }
    }
}
