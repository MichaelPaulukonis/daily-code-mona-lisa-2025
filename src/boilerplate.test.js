/* global p5 */

// Created by Amazon Q with the following instruction:
/**
Create a p5js sketch that will display a class-based "bouncing ball". 
On mousePressed a new ball will be created.
Also implement the below instructions as needed, including code snippets:
<boilerplate instructions followed>
It skipped code snippets for saving, and drew to the canvas
Replicating the existing objects on-save.
Which replicated the current state, but that only worked in this instance.
**/

const sketch = p => {
  // Configuration
  const canvasSize = 600
  const targetScale = 2
  let targetLayer
  let balls = []
  let showUI = true
  let showHelp = false

  const timestamp = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    const secs = String(d.getSeconds()).padStart(2, '0')
    const millis = String(d.getMilliseconds()).padStart(3, '0')
    return `${year}${month}${day}.${hour}${min}${secs}.${millis}`
  }

  function generateFilename (prefix) {
    return `${prefix || 'mona'}-${timestamp()}.png`
  }

  class Ball {
    constructor (x, y) {
      this.x = x
      this.y = y
      this.diameter = p.random(20, 50)
      this.speedX = p.random(-5, 5)
      this.speedY = p.random(-5, 5)
      this.color = p.color(p.random(255), p.random(255), p.random(255))
    }

    update () {
      this.x += this.speedX
      this.y += this.speedY

      // Bounce off edges
      if (this.x < this.diameter / 2 || this.x > p.width - this.diameter / 2) {
        this.speedX *= -1
      }
      if (this.y < this.diameter / 2 || this.y > p.height - this.diameter / 2) {
        this.speedY *= -1
      }
    }

    display () {
      p.fill(this.color)
      p.noStroke()
      p.ellipse(this.x, this.y, this.diameter)
    }
  }

  p.setup = () => {
    // Create and center canvas
    const canvas = p.createCanvas(canvasSize, canvasSize)
    const x = (p.windowWidth - canvasSize) / 2
    const y = (p.windowHeight - canvasSize) / 2
    canvas.position(x, y)

    // Create high-res target layer
    targetLayer = p.createGraphics(
      canvasSize * targetScale,
      canvasSize * targetScale
    )

    // Set default styles
    p.background(255)
    p.stroke(0)
    p.fill(255)
  }

  p.draw = () => {
    p.background(255)

    // Update and display all balls
    balls.forEach(ball => {
      ball.update()
      ball.display()
    })

    // Display UI and help screen if enabled
    if (showUI) {
      displayUI()
    }
    if (showHelp) {
      displayHelpScreen()
    }
  }

  p.mousePressed = () => {
    // Add new ball at mouse position
    balls.push(new Ball(p.mouseX, p.mouseY))
  }

  p.keyPressed = () => {
    switch (p.key.toLowerCase()) {
      case 'h':
        showUI = !showUI
        break
      case '?':
        showHelp = !showHelp
        break
      case 's':
        if (p.key === 'S') {
          saveCanvas()
        }
        break
      case 'c':
        balls = [] // Clear all balls
        break
    }
  }

  function displayUI () {
    const uiText = [
      `Number of Balls: ${balls.length}`,
      'Click to add balls',
      'Press C to clear'
    ]

    const boxWidth = 200
    const boxHeight = uiText.length * 20 + 20

    p.fill(0, 150)
    p.noStroke()
    p.rect(5, p.height - boxHeight - 5, boxWidth, boxHeight, 10)

    p.fill('white')
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)
    uiText.forEach((text, index) => {
      p.text(text, 10, p.height - boxHeight + 10 + index * 20)
    })
  }

  function displayHelpScreen () {
    p.fill(50, 150)
    p.rect(50, 50, p.width - 100, p.height - 100, 10)

    p.fill(255)
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)
    p.text(
      `
      Help Screen:

      ? - Show/Hide this help screen
      S - Save image
      h - Show/Hide UI
      c - Clear all balls
      Click - Add new ball
      `,
      70,
      70
    )
  }

  function saveCanvas () {
    // Draw current canvas state to high-res target layer
    targetLayer.background(255)
    targetLayer.scale(targetScale)
    balls.forEach(ball => {
      targetLayer.fill(ball.color)
      targetLayer.noStroke()
      targetLayer.ellipse(ball.x, ball.y, ball.diameter)
    })

    // Save the high-res version
    targetLayer.save(generateFilename('bouncing-balls'))
  }
}

// Initialize sketch
new p5(sketch) // eslint-disable-line no-new, new-cap
