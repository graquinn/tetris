document.addEventListener('DOMContentLoaded', () => {

    //global variables 
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button') 
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    let currentPosition = 4
    let currentRotation = 0
    const colors = [
        'orange',
        'pink',
        'blue',
        'yellow',
        'green'
    ]
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0


    console.log(squares)

    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    
    const zTetromino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [width, width+1, 1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width*2+1, width+2],
        [width, width+1, 1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

//randomly select tetromino and its first rotation
let random = Math.floor(Math.random()*theTetrominoes.length)
console.log(random)

let current = theTetrominoes[random][currentRotation] 

//draw the tetromino

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//undraw the tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })   
}

//make the tetromino move down every second
// timerId = setInterval(moveDown, 1000)

//assign functions to keycodes
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
}

//move down function
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

//freeze function 
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }

}

//move the tetromino left ,unless at the edge or there is a blockage
function moveLeft() {
    undraw()
    const isALeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isALeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }

    draw()
        
}
// move the tetromino right unless it is at edge or there is a blockage
function moveRight() {
    undraw() 
    const isARightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isARightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }

    draw()
}
//check functions to see if tetromino can turn or if it is too close to wall
//check if the next rotation will go thru the wall
function wallCheck() {
    let nextRotation = (currentRotation + 1)
    if (nextRotation === current.length){
        nextRotation = 0
    } 
    let curClosestToLeft = current.reduce(leftWallReducer, width)

    let nextPiece = theTetrominoes[random][nextRotation]
    let nextClosestLeft = nextPiece.reduce(leftWallReducer, width)
    let nextClosestRight = nextPiece.reduce(rightWallReducer, 0)
    while (nextClosestLeft === 0 && nextClosestRight === width-1){
        //this means we are shifting right or lft depending on the current position and which wall it is closest to
        if (curClosestToLeft < width/2){
            currentPosition++
        } else {
            currentPosition--
        }
        nextClosestLeft = nextPiece.reduce(leftWallReducer, width)
        nextClosestRight = nextPiece.reduce(rightWallReducer, 0)
    } 
    current = nextPiece
    currentRotation = nextRotation

}

//function for reduce - right wall of grid (get tetromino piece closest to right wall)
function rightWallReducer(currentMaximum, currentValue) {
    let positionInBoard = (currentPosition + currentValue) % width
    if (positionInBoard > currentMaximum){
        return positionInBoard
    } else {
        return currentMaximum
    }
}

//function for reduce - left wall of grid (get tetromino piece closest to left wall)
function leftWallReducer(currentMinimum, currentValue) {
    let positionInBoard = (currentPosition + currentValue) % width
    if (positionInBoard < currentMinimum){
        return positionInBoard
    } else {
        return currentMinimum
    } 
}

//rotate the tetromino
function rotate() {
    undraw()
    wallCheck()
    draw()
}


//show the up-next tetromino in the mini-grid


//tetrominoes w/o rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [displayWidth*2, displayWidth*2+1, displayWidth+1, displayWidth+2],
    [displayWidth, displayWidth+1, 1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
]
//display the same in the mini-grid display

function displayShape() {
    //remove any trace of a tetromino from the entire gride
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

//add functionality to the button
startBtn.addEventListener('click', () => {
    if(timerId) {
        clearInterval(timerId)
        timerId = null
        document.removeEventListener('keyup', control)
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
        document.addEventListener('keyup', control)
    }
})

//add score function
function addScore() {
    for(let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

//game over
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = "game over!"
        clearInterval(timerId)
    }
}

}) 

//create a second level that moves faster w/ music and a new background color


let dingosBark = "I love you snubbert!"


