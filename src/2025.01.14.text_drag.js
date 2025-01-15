/* global p5 */

// https://editor.p5js.org/MichaelPaulukonis/sketches/0HnYk05JJ

class TextBox {
  constructor (p, x, y, text, fillColor = 255, textSize = 102) {
    this.p = p
    this.x = x
    this.y = y
    this.text = text
    this.fillColor = fillColor
    this.textSize = textSize
    this.w = this.p.textWidth(this.text)
    this.h = this.p.textAscent()
  }

  render () {
    this.p.fill(this.fillColor)
    this.p.noStroke()
    this.p.textSize(this.textSize)
    this.p.textAlign(this.p.LEFT, this.p.TOP)
    this.p.text(this.text, this.x, this.y)
    console.log(`${this.text} - x: ${this.x}, y: ${this.y}`)
  }

  containsMouse (x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
  }
}

const sketch = p => {
  let img
  let font
  let cellSize

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
  let textBox, textBoxLisa

  p.preload = () => {
    img = p.loadImage('assets/mona.png')
    font = p.loadFont('assets/TheGreatThunder-Kd4Z.ttf')
  }

  p.setup = () => {
    p.createCanvas(730, 720)
    cellSize = p.width / 2
    p.fill(255)
    p.textSize(102)
    p.textAlign(p.LEFT, p.TOP)
    p.textFont(font)
    textBox = new TextBox(
      p,
      (p.width - cellSize) / 2,
      (p.height - cellSize) / 2,
      'MONA',
      255,
      102
    )
    textBoxLisa = new TextBox(
      p,
      (p.width - cellSize) / 2,
      (p.height - cellSize) / 2,
      'LISA',
      255,
      132
    )
  }

  p.draw = () => {
    p.background(255)
    const dx = (p.width - cellSize) / 2
    const dy = (p.height - cellSize) / 2
    p.image(img, dx, dy, cellSize, cellSize)

    textBox.render()
    textBoxLisa.render()

    if (dragging) {
      p.noFill()
      p.stroke(255, 0, 0)
      p.rect(textBox.x, textBox.y, textBox.w, textBox.h)
      p.noStroke()
    }
  }

  p.mousePressed = () => {
    if (textBox.containsMouse(p.mouseX, p.mouseY)) {
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
    console.log(textBox)
  }

  p.keyPressed = () => {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-text'))
    }
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap