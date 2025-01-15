/* global p5 */

// https://editor.p5js.org/MichaelPaulukonis/sketches/0HnYk05JJ

class TextBox {
  constructor (p, x, y, text, font, fillColor = 255, textSize = 102) {
    this.p = p
    this.x = x
    this.y = y
    this.text = text
    this.font = font
    this.fillColor = fillColor
    this.textSize = textSize
    this.p.textFont(this.font)
    this.p.textSize(this.textSize)
    this.w = this.p.textWidth(this.text)
    this.h = this.p.textAscent()
    this.dragging = false
    this.offsetX = 0
    this.offsetY = 0
    this.strokeColor = this.p.color(this.p.random(255), this.p.random(255), this.p.random(255))
    this.slider = this.p.createSlider(10, 200, this.textSize)
    this.slider.position(this.x, this.y + this.h + 10)
    this.slider.input(() => this.updateTextSize(this.slider.value()))
  }

  updateTextSize (newSize) {
    this.textSize = newSize
    this.p.textSize(this.textSize)
    this.w = this.p.textWidth(this.text)
    this.h = this.p.textAscent()
    this.slider.position(this.x, this.y + this.h + 10)
  }

  render () {
    this.p.fill(this.fillColor)
    this.p.noStroke()
    this.p.textFont(this.font)
    this.p.textSize(this.textSize)
    this.p.textAlign(this.p.LEFT, this.p.TOP)
    this.p.text(this.text, this.x, this.y)

    if (this.dragging) {
      this.p.noFill()
      this.p.stroke(this.strokeColor)
      this.p.rect(this.x, this.y, this.w, this.h)
      this.p.noStroke()
    }
  }

  containsMouse (x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
  }
}

const sketch = p => {
  let img
  let font
  let cellWidth, cellHeight
  const textBoxes = []
  const displayWidth = 600

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

  p.preload = () => {
    img = p.loadImage('assets/mona.png')
    font = p.loadFont('assets/TheGreatThunder-Kd4Z.ttf')
  }

  p.setup = () => {
    const c = p.createCanvas(displayWidth, displayWidth)
    c.drop(handleFile)
    cellWidth = p.width / 2
    cellHeight = p.height / 2
    p.fill(255)
    p.textSize(102)
    p.textAlign(p.LEFT, p.TOP)
    p.textFont(font)
    const textBoxMona = new TextBox(
      p,
      (p.width - cellWidth) / 2,
      (p.height - cellHeight) / 2,
      'MONA',
      font,
      255,
      102
    )
    const textBoxLisa = new TextBox(
      p,
      (p.width - cellWidth) / 2 + 60,
      (p.height - cellHeight) / 2 + 60,
      'LISA',
      font,
      255,
      132
    )
    textBoxes.push(textBoxMona, textBoxLisa)
  }

  p.draw = () => {
    p.background(255)
    const dx = (p.width - cellWidth) / 2
    const dy = (p.height - cellHeight) / 2
    p.image(img, dx, dy, cellWidth, cellHeight)

    textBoxes.forEach(textBox => textBox.render())
  }

  p.mousePressed = () => {
    textBoxes.forEach(textBox => {
      if (textBox.containsMouse(p.mouseX, p.mouseY)) {
        textBox.dragging = true
        textBox.offsetX = p.mouseX - textBox.x
        textBox.offsetY = p.mouseY - textBox.y
      }
    })
  }

  p.mouseDragged = () => {
    textBoxes.forEach(textBox => {
      if (textBox.dragging) {
        textBox.x = p.mouseX - textBox.offsetX
        textBox.y = p.mouseY - textBox.offsetY
        textBox.slider.position(textBox.x, textBox.y + textBox.h + 10)
      }
    })
  }

  p.mouseReleased = () => {
    textBoxes.forEach(textBox => {
      textBox.dragging = false
    })
  }

  p.keyPressed = () => {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-text'))
    }
  }

  function handleFile (file) {
    if (file.type === 'image') {
      img = p.loadImage(file.data, () => {
        const aspectRatio = img.width / img.height
        if (aspectRatio > 1) {
          cellWidth = p.width * 0.7
          cellHeight = cellWidth / aspectRatio
        } else {
          cellHeight = p.height * 0.7
          cellWidth = cellHeight * aspectRatio
        }
        console.log('Image loaded successfully')
      })
    } else {
      console.log('Not an image file!')
    }
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap