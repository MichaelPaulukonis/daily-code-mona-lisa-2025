/* global p5 */

// https://editor.p5js.org/MichaelPaulukonis/sketches/DUTgioZpW

const sketch = p => {
  const words = 'MONA LISA '
  let font
  let currentIndex = 0
  let x, y
  let hue = 0
  let colorMode = 'hsv'
  let hueChange = 10
  let frameRateSlider, hueChangeSlider
  let targetLayer
  const targetSize = 720

  const modal = {
    autoSave: true,
    pause: false,
    showUi: true
  }

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
    font = p.loadFont('assets/MADE TOMMY Black_PERSONAL USE.otf')
  }

  p.setup = () => {
    p.createCanvas(targetSize, targetSize)
    targetLayer = p.createGraphics(targetSize, targetSize)
    p.background(255)
    p.textFont('Arial')

    targetLayer.background(255)
    targetLayer.textAlign(p.CENTER, p.CENTER)
    targetLayer.textSize(600)
    targetLayer.noFill()
    targetLayer.strokeWeight(20)
    targetLayer.textFont(font)

    x = targetLayer.width / 2
    y = targetLayer.height / 2 - 100

    frameRateSlider = p.createSlider(1, 60, 10)
    frameRateSlider.position(10, p.height + 10)
    frameRateSlider.attribute('title', 'Frame Rate')
    frameRateSlider.attribute('list', 'tickmarks')

    hueChangeSlider = p.createSlider(1, 100, hueChange)
    hueChangeSlider.position(10, p.height + 40)
    hueChangeSlider.attribute('title', 'Hue Change')
    hueChangeSlider.attribute('list', 'tickmarks')

    // Create datalist for tick-marks
    const datalist = p.createElement('datalist')
    datalist.attribute('id', 'tickmarks')
    for (let i = 0; i <= 100; i += 10) {
      datalist.child(p.createElement('option').attribute('value', i))
    }
    p.select('body').child(datalist)

    p.frameRate(1) // Set initial frame rate to 1 frame per second
  }

  p.draw = () => {
    p.frameRate(frameRateSlider.value())
    hueChange = hueChangeSlider.value()

    if (!modal.pause) {
      targetLayer.background(255, 50) // Fade the canvas before drawing the next letter

      if (colorMode === 'random') {
        targetLayer.stroke(p.color(p.random(255), p.random(255), p.random(255)))
      } else if (colorMode === 'hsv') {
        targetLayer.colorMode(p.HSB, 360, 100, 100)
        targetLayer.stroke(hue, 100, 100)
        hue = (hue + hueChange) % 360
        targetLayer.colorMode(p.RGB, 255)
      }

      targetLayer.text(words[currentIndex], x, y)
      currentIndex = (currentIndex + 1) % words.length

      p.image(targetLayer, 0, 0)
      if (modal.autoSave) {
        p.saveCanvas(targetLayer, generateFilename('ml.outline.letters'))
      }
    }

    if (modal.showUi) {
      displayUI()
    }
  }

  p.keyPressed = () => {
    if (p.key === 'S') {
      p.saveCanvas(targetLayer, generateFilename('ml.outline.letters'))
    } else if (p.key === 'A') {
      modal.autoSave = !modal.autoSave
    } else if (p.key === 'c') {
      colorMode = colorMode === 'random' ? 'hsv' : 'random'
    } else if (p.key === 'h') {
      modal.showUi = !modal.showUi
    } else if (p.key === 'p' || p.key === ' ') {
      modal.pause = !modal.pause
    }
    return false
  }

  function displayUI () {
    const uiText = [
      `Pause: ${modal.pause ? 'ON' : 'OFF'}`,
      `AutoSave: ${modal.autoSave ? 'ON' : 'OFF'}`,
      `FrameRate: ${frameRateSlider.value()}`,
      `Color Mode: ${colorMode}`,
      colorMode === 'hsv' ? `Hue: ${hue}` : '',
      colorMode === 'hsv' ? `Color rate: ${hueChange}` : ''
    ].filter(Boolean)

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
}

new p5(sketch) // eslint-disable-line no-new, new-cap
