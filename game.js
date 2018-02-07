const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// Ball stuff
const ballRadius = 10
const ballStartX = canvas.width / 2
const ballStartY = canvas.height / 2
const defaultHorizontalSpeed = -4
const defaultVerticalSpeed = -2
let ballX = ballStartX
let ballY = ballStartY
let horizontalSpeed = defaultHorizontalSpeed
let verticalSpeed = defaultVerticalSpeed

// Paddle stuff
const paddleHeight = 40
const paddleWidth = 10
const playerStartX = 0
const aiStartX = canvas.width - paddleWidth
const paddleStartY = canvas.height / 2 - paddleHeight / 2
let paddleSpeed = 2
let playerX = playerStartX
let playerY = paddleStartY
let aiX = aiStartX
let aiY = paddleStartY

// Event stuff
let isUpArrowPressed = false
let isDownArrowPressed = false

// General stuff
const defaultColor = '#0095DD'

// NOTE Are these necessary?
const upperBoundary = canvas.height - ballRadius
const lowerBoundary = ballRadius
const leftBoundary = ballRadius
const rightBoundary = canvas.width - ballRadius

let playerScore = 0
let aiScore = 0


// Drawing functions
const drawBall = (x, y) => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}

const resetBall = () => {
    horizontalSpeed = defaultHorizontalSpeed
    verticalSpeed = defaultVerticalSpeed
    ballX = ballStartX
    ballY = ballStartY
}

const drawPaddle = (x, y) => {
    ctx.beginPath()
    ctx.rect(x, y, paddleWidth, paddleHeight)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}

const resetPaddle = () => {
    playerX = playerStartX
    playerY = paddleStartY
}

// Collision detections
// Validate Horizontal/Vertical Direction - checks if direction needs to be reversed
const detectHorizontalCollisions = () => {
    const isBallInPlayerPaddle =
        ballX <= paddleWidth &&
        ballY >= playerY && ballY <= playerY + paddleHeight
    const isBallInAiPaddle =
        ballX >= aiX && ballX <= canvas.width &&
        ballY >= aiY && ballY <= aiY + paddleHeight

    // If the ball is hitting either paddle, reverse its direction
    if (isBallInPlayerPaddle || isBallInAiPaddle) { horizontalSpeed = -horizontalSpeed }

    // If the ball is on the player's side, but not hitting the paddle, then give a point to the AI and reset
    if (ballX <= paddleWidth && !isBallInPlayerPaddle) {
        aiScore++
        resetBall()
        resetPaddle()
    }

    // Otherwise, if the above is true for the AI, give the player a point and reset
    if (ballX >= canvas.width - paddleWidth && !isBallInAiPaddle) {
        playerScore++
        resetBall()
        resetPaddle()
    }
}

const validateVerticalDirection = (y, dy) => {
    if (y < lowerBoundary || y > upperBoundary) { return -dy; }
    return dy;
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBall(ballX, ballY)
    drawPaddle(playerX, playerY)
    drawPaddle(aiX, aiY)

    detectHorizontalCollisions()
    verticalSpeed = validateVerticalDirection(ballY, verticalSpeed)

    ballX += horizontalSpeed
    ballY += verticalSpeed

    if (isUpArrowPressed && playerY > 0) { playerY -= paddleSpeed }
    if (isDownArrowPressed && playerY < canvas.height - paddleHeight) { playerY += paddleSpeed }

    window.requestAnimationFrame(draw)
}


// Event listeners
const keydownHandler = (e) => {
    isUpArrowPressed = e.keyCode === 38
    isDownArrowPressed = e.keyCode === 40
}
const keyupHandler = (e) => {
    isUpArrowPressed = e.keyCode === 38 ? false : null
    isDownArrowPressed = e.keyCode === 40 ? false : null
}

document.addEventListener('keydown', keydownHandler)
document.addEventListener('keyup', keyupHandler)

// Main
draw()
