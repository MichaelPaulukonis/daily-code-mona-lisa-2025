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

  p.preload = () => {
    img = p.loadImage('assets/mona.png')
    font = p.loadFont('assets/TheGreatThunder-Kd4Z.ttf')
  }

  p.setup = () => {
    p.noLoop()
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
    p.textAlign(p.RIGHT, p.BOTTOM)
    p.textSize(132)
    p.text('LISA', cellSize + dx + 16, dy + cellSize + 30)
    p.saveCanvas(generateFilename('mona-text'))
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
