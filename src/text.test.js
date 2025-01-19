/* global p5 */

// https://editor.p5js.org/MichaelPaulukonis/sketches/sGnW8FUdE

// https://www.1001fonts.com/asterisp-font.html

class TextBox {
  constructor (p, x, y, text, font, fillColor = 255, textSize = 102) {
    this.p = p
    this.x = x
    this.y = y
    this.text = text
    this.index = 0
    this.font = font
    this.fillColor = fillColor
    this.textSize = textSize
    this.p.textFont(this.font)
    this.p.textSize(this.textSize)
    this.w = this.p.textWidth(this.text[0])
    this.h = this.p.textAscent()
    this.dragging = false
    this.offsetX = 0
    this.offsetY = 0
    this.strokeColor = this.p.color(
      this.p.random(255),
      this.p.random(255),
      this.p.random(255)
    )
    this.slider = this.p.createSlider(10, 500, this.textSize)
    this.slider.position(this.x, this.y + this.h + 10)
    this.slider.input(() => this.updateTextSize(this.slider.value()))
  }

  updateTextSize (newSize) {
    this.textSize = newSize
    this.p.textSize(this.textSize)
    this.w = this.p.textWidth(this.text[0])
    this.h = this.p.textAscent()
    this.slider.position(this.x, this.y + this.h + 10)
  }

  render () {
    this.p.fill(this.fillColor)
    // this.p.noStroke();
    this.p.stroke(0)
    this.p.textFont(this.font)
    this.p.textSize(this.textSize)
    this.p.textAlign(this.p.LEFT, this.p.TOP)
    this.p.text(this.text[this.index], this.x, this.y)
    this.index = (this.index + 1) % this.text.length

    if (this.dragging) {
      this.p.noFill()
      this.p.stroke(this.strokeColor)
      this.p.rect(this.x, this.y, this.w, this.h)
      this.p.noStroke()
    }
  }

  containsMouse (x, y) {
    return (
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
    )
  }
}

const sketch = p => {
  let font
  const displayWidth = 600
  // const alpha = 'abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXY'
  const alpha = 'fghijklmnopqrstuv'

  p.preload = () => {
    font = p.loadFont('assets/Asterisp Alpha.otf')
  }

  p.setup = () => {
    p.createCanvas(displayWidth, displayWidth)
    p.noLoop()
  }

  p.draw = () => {
    p.background(255)
    const dx = p.width / 2
    const dy = p.height / 2
    p.textAlign(p.CENTER, p.CENTER)
    p.textFont(font)
    p.text(alpha, dx, dy)
    p.textFont('Helevtica')
    p.text(alpha, dx, dy + 30)
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
