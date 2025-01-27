/* global p5 */

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

let sketch = function (p) {
  let colorImg
  let bwImg

  p.preload = function () {
    colorImg = p.loadImage('images/mona_square.jpeg')
    bwImg = p.loadImage('images/tow.zone.png')
  }

  p.setup = function () {
    p.createCanvas(colorImg.width, colorImg.height)
    p.noLoop()
  }

  p.draw = function () {
    p.background(255)

    p.image(bwImg, 0, 0)

    // Set the globalCompositeOperation to use the black-and-white image as a mask
    p.drawingContext.globalCompositeOperation = 'lighten'

    p.image(colorImg, 0, 0)

    // Reset the globalCompositeOperation to default
    p.drawingContext.globalCompositeOperation = 'source-over'
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
