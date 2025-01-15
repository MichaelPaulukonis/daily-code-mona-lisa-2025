/* global p5 */

// https://editor.p5js.org/MichaelPaulukonis/sketches/0HnYk05JJ

const sketch = p => {
  let img
  let font

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

  let dragging = false
  let offsetX, offsetY
  let textBox = { x: 0, y: 0, w: 0, h: 0 }

  p.preload = () => {
    img = p.loadImage('assets/mona.png')
    font = p.loadFont('assets/TheGreatThunder-Kd4Z.ttf')
  }

  p.setup = () => {
    p.createCanvas(730, 720)
    p.fill(255)
    p.textSize(102)
    p.textAlign(p.LEFT, p.TOP)
    p.textFont(font)
    p.background(255)
    const cellSize = p.width / 2
    const dx = (p.width - cellSize) / 2
    const dy = (p.height - cellSize) / 2
    p.image(img, dx, dy, cellSize, cellSize)
    p.text('MONA', dx - 8, dy - 32)
    textBox = { x: dx - 8, y: dy - 32, w: p.textWidth('MONA'), h: p.textAscent() }
    
    p.textAlign(p.RIGHT, p.BOTTOM)
    p.textSize(132)
    p.text('LISA', cellSize + dx + 16, dy + cellSize + 30)

  }

  p.draw = () => {
    p.background(255)
    const cellSize = p.width / 2
    const dx = (p.width - cellSize) / 2
    const dy = (p.height - cellSize) / 2
    p.image(img, dx, dy, cellSize, cellSize)
    
    p.fill(255)
    p.textSize(102)
    p.textAlign(p.LEFT, p.TOP)
    p.text('MONA', textBox.x, textBox.y)
    p.textAlign(p.RIGHT, p.BOTTOM)
    p.textSize(132)
    p.text('LISA', cellSize + dx + 16, dy + cellSize + 30)
    
    if (dragging) {
      p.noFill()
      p.stroke(255, 0, 0)
      p.rect(textBox.x, textBox.y, textBox.w, textBox.h)
      p.noStroke()
    }
  }

  p.mousePressed = () => {
    if (p.mouseX > textBox.x && p.mouseX < textBox.x + textBox.w &&
        p.mouseY > textBox.y && p.mouseY < textBox.y + textBox.h) {
      dragging = true
      offsetX = p.mouseX - textBox.x
      offsetY = p.mouseY - textBox.y
    }
  }

  p.mouseDragged = () => {
    if (dragging) {
      textBox.x = p.mouseX - offsetX
      textBox.y = p.mouseY - offsetY
    }
  }

  p.mouseReleased = () => {
    dragging = false
  }

  p.keyPressed = () => {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-text'))
    }
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
