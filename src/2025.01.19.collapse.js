/* global p5 */

const sketch = p => {
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

  let originalImage
  let targetLayer
  let topOffset = 0
  let animationComplete = false
  const incr = 5
  let autoSave = true

  p.preload = () => {
    originalImage = p.loadImage('images/mona.png')
  }

  p.setup = () => {
    p.frameRate(5)
    // Calculate scaled dimensions maintaining aspect ratio
    let scaledW = originalImage.width
    let scaledH = originalImage.height
    const maxDim = 600

    if (scaledW > maxDim || scaledH > maxDim) {
      if (scaledW > scaledH) {
        scaledH = (maxDim * scaledH) / scaledW
        scaledW = maxDim
      } else {
        scaledW = (maxDim * scaledW) / scaledH
        scaledH = maxDim
      }
    }

    canvas = p.createCanvas(scaledW, scaledH)
    targetLayer = p.createGraphics(originalImage.width, originalImage.height)
    targetLayer.image(originalImage, 0, 0)
  }

  p.draw = () => {
    if (animationComplete) return

    targetLayer.clear()

    const halfHeight = Math.floor(originalImage.height / 2)

    // Calculate remaining height for each half
    const remainingHeight = halfHeight - topOffset

    p.background(255)

    if (remainingHeight <= 0) {
      animationComplete = true

      if (autoSave) {
        p.saveCanvas(generateFilename('mona-collapse'))
      }
      return
    }

    // Draw top half
    targetLayer.image(
      originalImage,
      0,
      topOffset, // start drawing this many pixels from the top
      originalImage.width,
      remainingHeight, // destination width, height
      0,
      0,
      originalImage.width,
      remainingHeight
    )

    // Draw bottom half
    targetLayer.image(
      originalImage,
      0,
      halfHeight, // start at the middle
      originalImage.width,
      remainingHeight, // destination width, height
      0,
      halfHeight + topOffset, // source x, y
      originalImage.width,
      remainingHeight // source width, height
    )

    p.image(targetLayer, 0, 0, p.width, p.height)

    topOffset += incr

    if (autoSave) {
      p.saveCanvas(generateFilename('mona-collapse'))
    }
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
