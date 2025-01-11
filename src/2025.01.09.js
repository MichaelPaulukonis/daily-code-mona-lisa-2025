/* global p5 */

const sketch = p => {
  let img
  let cellCount = 10
  const cellCountMax = 20
  let circleColor
  let squareColor
  let cellCountSlider
  let colorPicker
  let transparencySlider
  let minFactorSlider, maxFactorSlider
  let minFactor = 0.1
  let maxFactor = 1.0
  let offscreen
  let dirty = true
  const modal = {
    showHelp: false,
    showUI: true
  }

  function generateFilename (prefix) {
    const d = new Date()
    return (
      prefix +
      '.' +
      d.getFullYear() +
      '.' +
      (d.getMonth() + 1) +
      '.' +
      d.getDate() +
      d.getHours() +
      d.getMinutes() +
      d.getSeconds() +
      '.png'
    )
  }

  p.preload = () => {
    img = p.loadImage('images/mona.png')
  }

  p.setup = () => {
    const canvasWidth = p.windowWidth - 20
    const canvasHeight = p.windowHeight - 20
    const scaleFactor = Math.min(
      canvasWidth / img.width,
      canvasHeight / img.height
    )
    const imgWidth = img.width * scaleFactor
    const imgHeight = img.height * scaleFactor

    p.createCanvas(imgWidth, imgHeight)
    circleColor = p.color(140, 0, 255)

    cellCountSlider = p.createSlider(1, cellCountMax, cellCount)
    cellCountSlider.position(10, imgHeight - 60)
    cellCountSlider.style('width', '200px')
    cellCountSlider.attribute('title', 'Cell Size')
    cellCountSlider.input(() => {
      cellCount = cellCountMax + 1 - cellCountSlider.value()
      renderOffscreen()
    })

    colorPicker = p.createColorPicker(circleColor)
    colorPicker.position(220, imgHeight - 30)
    colorPicker.input(() => {
      updateColors()
      renderOffscreen()
    })

    transparencySlider = p.createSlider(0, 255, 126)
    transparencySlider.position(10, imgHeight - 30)
    transparencySlider.style('width', '200px')
    transparencySlider.attribute('title', 'Transparency')
    transparencySlider.input(() => {
      updateColors()
      renderOffscreen()
    })

    minFactorSlider = p.createSlider(0.1, 3.0, minFactor, 0.1)
    minFactorSlider.position(10, imgHeight - 90)
    minFactorSlider.style('width', '200px')
    minFactorSlider.attribute('title', 'Min Factor')
    minFactorSlider.input(() => {
      minFactor = minFactorSlider.value()
      minFactor = Math.min(minFactor, maxFactor)
      minFactorSlider.value(minFactor)
      renderOffscreen()
    })

    maxFactorSlider = p.createSlider(0.1, 3.0, maxFactor, 0.1)
    maxFactorSlider.position(220, imgHeight - 90)
    maxFactorSlider.style('width', '200px')
    maxFactorSlider.attribute('title', 'Max Factor')
    maxFactorSlider.input(() => {
      maxFactor = maxFactorSlider.value()
      maxFactor = Math.max(maxFactor, minFactor)
      maxFactorSlider.value(maxFactor)
      renderOffscreen()
    })

    offscreen = p.createGraphics(img.width, img.height)
    updateColors()
    renderOffscreen()
  }

  p.draw = () => {
    const scaleFactor = Math.min(p.width / img.width, p.height / img.height)
    const imgWidth = img.width * scaleFactor
    const imgHeight = img.height * scaleFactor

    if (dirty) {
      p.background(255)
      p.image(offscreen, 0, 0, imgWidth, imgHeight)
      dirty = false
    }

    if (modal.showUI) {
      drawUI()
    }

    if (modal.showHelp) {
      displayHelpScreen()
    }
  }

  function renderOffscreen () {
    offscreen.image(img, 0, 0, img.width, img.height)
    const cellSize = img.width / cellCount
    const cols = cellCount
    const rows = Math.floor(img.height / cellSize)
    const adjustedCellHeight = img.height / rows

    const diameterMin = Math.min(cellSize, adjustedCellHeight) * minFactor
    const diameterMax = Math.min(cellSize, adjustedCellHeight) * maxFactor

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const noiseValue = p.noise(x * 0.8, y * 0.8, p.frameCount)
        const diameter = p.map(noiseValue, 0, 1, diameterMin, diameterMax)
        const sideLength = (diameter * Math.sqrt(2)) / 2
        offscreen.fill(circleColor)
        offscreen.ellipse(
          x * cellSize + cellSize / 2,
          y * adjustedCellHeight + adjustedCellHeight / 2,
          diameter,
          diameter
        )
        offscreen.fill(squareColor)
        offscreen.square(
          x * cellSize + (cellSize - sideLength) / 2,
          y * adjustedCellHeight + (adjustedCellHeight - sideLength) / 2,
          sideLength
        )
      }
    }
    dirty = true
  }

  function updateColors () {
    const color = p.color(colorPicker.value())
    const alpha = transparencySlider.value()
    circleColor = p.color(
      color.levels[0],
      color.levels[1],
      color.levels[2],
      alpha
    )
    squareColor = p.color(
      255 - circleColor.levels[0],
      255 - circleColor.levels[1],
      255 - circleColor.levels[2],
      circleColor.levels[3] / 0.75
    )
  }

  function drawUI () {
    const uiText = [
      `Cells count: ${cellCount}`,
      `Image Size: ${img.width} x ${img.height}`,
      `Min Factor: ${minFactor.toFixed(1)}`,
      `Max Factor: ${maxFactor.toFixed(1)}`
    ]

    const boxWidth = 230
    const boxHeight = uiText.length * 20 + 20

    p.fill(0, 150)
    p.noStroke()
    p.rect(5, p.height - boxHeight - 95, boxWidth, boxHeight, 10)

    p.fill('white')
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)
    uiText.forEach((text, index) => {
      p.text(text, 10, p.height - boxHeight - 85 + index * 20)
    })
  }

  function displayHelpScreen () {
    p.fill(50, 150)
    p.rect(50, 50, p.width - 100, p.height - 100, 10)

    p.fill(255)
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)
    p.text(
      `
      Help Screen:

      ? - Show/Hide this help screen
      r - Re-render image
      S - Save image
      u - Show/Hide UI
      `,
      70,
      70
    )
  }

  p.keyPressed = () => {
    if (p.key === 'h') {
      modal.showUI = !modal.showUI
      dirty = true
    } else if (p.key === 'S') {
      saveImage(offscreen)
    } else if (p.key === 'p') {
      p.saveCanvas(generateFilename('circle_grid'))
    } else if (p.key === 'r') {
      renderOffscreen()
      dirty = true
    } else if (p.key === '?') {
      modal.showHelp = !modal.showHelp
      dirty = true
    } else if (p.key === 'u') {
      modal.showUI = !modal.showUI
      dirty = true
    }
  }

  function saveImage (layer) {
    p.save(layer, generateFilename('circle_grid'))
  }
}

new p5(sketch)
  