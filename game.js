const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// General stuff
const canvasWidth = canvas.width
const canvasHeight = canvas.height
const defaultColor = '#0095DD'

// Ball stuff
const ballRadius = 10
const ballStartX = canvasWidth / 2
const ballStartY = canvasHeight / 2
let ballX = ballStartX
let ballY = ballStartY
let horizontalSpeed = 2
let verticalSpeed = 2

// Drawing functions
const drawBall = (x, y) => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}

const draw = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    drawBall(ballX, ballY)

    ballX += horizontalSpeed
    ballY += verticalSpeed

    window.requestAnimationFrame(draw)
}


// Main
draw()
