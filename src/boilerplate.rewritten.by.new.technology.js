/* Create a p5js sketch that will display a class-based "bouncing ball". 
On mousePressed a new ball will be created.

// Preferred Defaults for p5.js Sketches

// 1. Canvas and High-Resolution Setup
// - Default canvas size: 600x600
// - Center the canvas in the window
// - Create a larger off-screen pGraphics object ("targetLayer") at 2x resolution
// - Always render to targetLayer at high resolution
// - Scale and display targetLayer to visible canvas each frame

// 2. Color and Style
// - Default background color: 255 (white)
// - Default stroke color: 0 (black)
// - Default fill color: 255 (white)

// 3. Interaction
// - Enable keyboard interaction with default keyPressed function
// - Include key handling to save targetLayer with uppercase "S" key
// - Include a basic UI showing important parameters
// - Include key handling to show/hide UI with 'h' key
// - Include a basic help screen describing keys, toggle with '?' key

// 4. Code Structure
// - Use p5.js instance mode
// - Use standard-js style formatting
// - Organize code into functions and classes as needed
// - Use the following utility functions for file saving:
*/

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

// Example UI display function:
function displayUI() {
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

// Example help screen function:
function displayHelpScreen() {
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

/*
// 5. Comments and Documentation
// - Use comments to explain code functionality
// - Include function descriptions and parameter explanations

// 6. Error Handling
// - Include basic error handling for common issues

// 7. Initialization
// - Place "/* global p5 */" at top of file
// - Instantiate sketch with "new p5(sketch) // eslint-disable-line no-new, new-cap"
*/
