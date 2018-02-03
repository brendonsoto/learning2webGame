const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

// General stuff
const canvasWidth = canvas.width
const canvasHeight = canvas.height
const defaultColor = '#0095DD'

// Ball stuff
const ballRadius = 20
const ballStartX = canvasWidth / 2
const ballStartY = canvasHeight / 2

// Drawing functions
const drawBall = () => {
    ctx.beginPath()
    ctx.arc(ballStartX, ballStartY, 20, 0, Math.PI * 2)
    ctx.fillStyle = defaultColor
    ctx.fill()
    ctx.closePath()
}
