const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// Ball stuff
const ballRadius = 10
const ballStartX = canvas.width / 2
const ballStartY = canvas.height / 2
let ballX = ballStartX
let ballY = ballStartY
let horizontalSpeed = 2
let verticalSpeed = 2

// Paddle stuff
const paddleHeight = 40
const paddleWidth = 10
const playerStartX = 0
const playerStartY = canvas.height / 2 - paddleHeight / 2
let playerX = playerStartX
let playerY = playerStartY

// General stuff
const defaultColor = '#0095DD'
const upperBoundary = canvas.height - ballRadius
const lowerBoundary = ballRadius
const leftBoundary = ballRadius
const rightBoundary = canvas.width - ballRadius


// Drawing functions
const drawBall = (x, y) => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}

const drawPaddle = (x, y) => {
    ctx.beginPath()
    ctx.rect(x, y, paddleWidth, paddleHeight)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}

// Collision detections
// Validate Horizontal/Vertical Direction - checks if direction needs to be reversed
const validateHorizontalDirection = (x, dx) => {
    if (x < leftBoundary || x > rightBoundary) { return -dx; }
    return dx;
}
const validateVerticalDirection = (y, dy) => {
    if (y < lowerBoundary || y > upperBoundary) { return -dy; }
    return dy;
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBall(ballX, ballY)
    drawPaddle(playerX, playerY)

    horizontalSpeed = validateHorizontalDirection(ballX, horizontalSpeed)
    verticalSpeed = validateVerticalDirection(ballY, verticalSpeed)

    ballX += horizontalSpeed
    ballY += verticalSpeed

    window.requestAnimationFrame(draw)
}


// Main
draw()
