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

const sketch = function (p) {
  let colorImg
  let bwImg

  p.preload = function () {
    colorImg = p.loadImage('images/mona_square.jpeg')
    bwImg = p.loadImage('images/tow.zone.png')
  }

  p.setup = function () {
    p.createCanvas(colorImg.width, colorImg.height).drop(handleFile)
    p.noLoop()
  }

  p.draw = function () {
    paint()
  }

  function paint () {
    p.background(255)

    // Calculate scaling to fit mask within canvas
    const scaleW = p.width / bwImg.width
    const scaleH = p.height / bwImg.height
    const scale = Math.min(scaleW, scaleH, 1) // Don't scale up, only down if needed

    // Calculate new dimensions
    const newWidth = bwImg.width * scale
    const newHeight = bwImg.height * scale

    // Calculate center position
    const maskX = (p.width - newWidth) / 2
    const maskY = (p.height - newHeight) / 2

    // Draw the centered, scaled mask
    p.image(bwImg, maskX, maskY, newWidth, newHeight)

    p.drawingContext.globalCompositeOperation = 'lighten'
    p.image(colorImg, 0, 0)
    p.drawingContext.globalCompositeOperation = 'source-over'
  }

  p.keyPressed = () => {
    if (p.key === 'S') {
      p.save(generateFilename('mona-mask'))
    }
  }

  function handleFile (file) {
    if (file.type === 'image') {
      bwImg = p.loadImage(file.data, () => {
        paint()
        console.log('Image loaded successfully')
      })
    } else {
      console.log('Not an image file!')
    }
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
