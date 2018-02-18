const menu = document.getElementById('menu')
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
let requestId

// Ball stuff
const ballRadius = 10
const ballStartX = canvas.width / 2
const ballStartY = canvas.height / 2
const defaultHorizontalSpeed = -2
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
const paddleDivision = 4 // Used to section out parts of the paddle to effect the ball's speed
let paddleSpeed = 3
let playerX = playerStartX
let playerY = paddleStartY
let aiX = aiStartX
let aiY = paddleStartY

// Event stuff
let isUpArrowPressed = false
let isDownArrowPressed = false

// General stuff
const defaultColor = '#0095DD'
const winningScore = 11
let playerScore = 0
let aiScore = 0
let isPaused = false
let hasGameStarted = false


// Drawing functions
const drawBall = (x, y) => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}

const resetBall = () => {
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

const drawScore = () => {
    ctx.font = '24px Impact'
    ctx.fillStyle = '#000'
    ctx.fillText(playerScore, canvas.width * .25, paddleHeight)
    ctx.fillText(aiScore, canvas.width * .75, paddleHeight)
}

const drawNet = () => {
    ctx.beginPath()
    ctx.setLineDash([5, 15])
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.strokeStyle = defaultColor
    ctx.stroke()
}

const drawWinningMessage = () => {
    ctx.font = '36 Impact'
    ctx.fillStyle = '#000'

    if (playerScore === winningScore) {
        ctx.fillText('You won!', canvas.width * .25, canvas.height * .5)
    } else {
        ctx.fillText('You lost :(', canvas.width * .75, canvas.height * .5)
    }

    window.cancelAnimationFrame(requestId)
}

const drawPauseMessage = () => {
    ctx.font = '32 Impact'
    ctx.fillStyle = '#000'
    ctx.fillText('Paused', canvas.width * .4, canvas.height * .4)
}

// Collision detections
const determineSpinFromPaddle = (paddleY) => {

    // If the ball is within 4 pixels of the middle of the paddle, just let the ball go straight
    if (ballY >= paddleY + paddleHeight / 2 + 2 && ballY <= paddleY + paddleHeight / 2 - 2) {
        verticalSpeed = 0
    }

    // If the ball is in the middle of the paddle, just give a little boost
    else if (ballY >= paddleY + paddleDivision * 2 && ballY <= paddleY + paddleDivision * 3) {
        verticalSpeed = verticalSpeed
    }

    // If the ball is in between the edge of the paddle and the middle, give it a bigger boost
    else if (ballY >= paddleY + paddleDivision && ballY <= paddleY + paddleHeight - paddleDivision) {
        verticalSpeed = verticalSpeed > 0 ? 3 : -3
    }

    // If it's on the edge, give it a big boost
    else {
        verticalSpeed = verticalSpeed > 0 ? 4 : -4
    }
}

// Validate Horizontal/Vertical Direction - checks if direction needs to be reversed

const detectHorizontalCollisions = () => {
    const isBallInPlayerPaddle =
        ballX <= paddleWidth &&
        ballY >= playerY && ballY <= playerY + paddleHeight
    const isBallInAiPaddle =
        ballX >= aiX && ballX <= canvas.width &&
        ballY >= aiY && ballY <= aiY + paddleHeight

    // If the ball is hitting either paddle, reverse its direction
    if (isBallInPlayerPaddle || isBallInAiPaddle) { horizontalSpeed *= -1 }

    if (isBallInPlayerPaddle) { determineSpinFromPaddle(playerY) }
    if (isBallInAiPaddle) { determineSpinFromPaddle(aiY) }



    // If the ball is on the player's side, but not hitting the paddle, then give a point to the AI and reset
    if (ballX <= paddleWidth && !isBallInPlayerPaddle) {
        aiScore++
        horizontalSpeed = defaultHorizontalSpeed
        resetBall()
        resetPaddle()
    }

    // Otherwise, if the above is true for the AI, give the player a point and reset
    if (ballX >= canvas.width - paddleWidth && !isBallInAiPaddle) {
        playerScore++
        horizontalSpeed = defaultHorizontalSpeed * -1
        resetBall()
        resetPaddle()
    }
}

const validateVerticalDirection = (y, dy) => {
    if (y < ballRadius || y > canvas.height - ballRadius) { return -dy }
    return dy
}

// Basic AI - just moves up if the ball is above it or down if ball is below
const moveAI = () => {
    if (ballY >= aiY) { aiY += paddleSpeed }
    else if (ballY <= aiY) { aiY -= paddleSpeed }
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawNet()
    drawScore()
    drawBall(ballX, ballY)
    drawPaddle(playerX, playerY)
    drawPaddle(aiX, aiY)

    if (playerScore === winningScore || aiScore === winningScore) {
        drawWinningMessage()
        return
    }

    if (isPaused) {
        drawPauseMessage()
        window.cancelAnimationFrame(requestId)
        return
    }

    detectHorizontalCollisions()
    verticalSpeed = validateVerticalDirection(ballY, verticalSpeed)

    ballX += horizontalSpeed
    ballY += verticalSpeed
    moveAI()

    if (isUpArrowPressed && playerY > 0) { playerY -= paddleSpeed }
    if (isDownArrowPressed && playerY < canvas.height - paddleHeight) { playerY += paddleSpeed }

    requestId = window.requestAnimationFrame(draw)
}


// Event listeners
const keydownHandler = (e) => {
    if (e.keyCode === 13 && !hasGameStarted) {
        requestId = window.requestAnimationFrame(draw)
        hasGameStarted = true
        menu.classList.add('hidden')
    } 

    isUpArrowPressed = e.keyCode === 38
    isDownArrowPressed = e.keyCode === 40

    if (e.keyCode === 80) {
        if (isPaused) {
            // resume game
            isPaused = false
            requestId = window.requestAnimationFrame(draw)
        } else {
            isPaused = true
        }
    }
}
const keyupHandler = (e) => {
    isUpArrowPressed = e.keyCode === 38 ? false : null
    isDownArrowPressed = e.keyCode === 40 ? false : null
}

document.addEventListener('keydown', keydownHandler)
document.addEventListener('keyup', keyupHandler)

// Main
// requestId = window.requestAnimationFrame(draw)
