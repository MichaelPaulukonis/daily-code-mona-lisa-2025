/* global p5 */

const sketch = p => {
  let img
  let cellCount = 10
  let circleColor
  let slider
  let colorPicker
  let transparencySlider
  let offscreen
  let dirty = true
  const modal = {
    showHelp: false,
    showUI: true
  }

  function generateFilename (prefix) {
    const d = new Date()
    return (
      prefix + '.' +
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
    circleColor = p.color(0, 255, 238)

    slider = p.createSlider(1, 25, cellCount)
    slider.position(10, imgHeight - 60)
    slider.style('width', '200px')
    slider.attribute('title', 'Cell Size')
    slider.input(() => {
      cellCount = 26 - slider.value()
      renderOffscreen()
    })

    colorPicker = p.createColorPicker(circleColor)
    colorPicker.position(220, imgHeight - 30)
    colorPicker.input(() => {
      updateCircleColor()
      renderOffscreen()
    })

    transparencySlider = p.createSlider(0, 255, 255)
    transparencySlider.position(10, imgHeight - 30)
    transparencySlider.style('width', '200px')
    transparencySlider.attribute('title', 'Transparency')
    transparencySlider.input(() => {
      updateCircleColor()
      renderOffscreen()
    })

    offscreen = p.createGraphics(img.width, img.height)
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

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const diameter = p.random(
          Math.min(cellSize, adjustedCellHeight) * 0.5,
          Math.min(cellSize, adjustedCellHeight)
        )
        offscreen.fill(circleColor)
        offscreen.ellipse(
          x * cellSize + cellSize / 2,
          y * adjustedCellHeight + adjustedCellHeight / 2,
          diameter,
          diameter
        )
      }
    }
    dirty = true
  }

  function updateCircleColor () {
    const color = p.color(colorPicker.value())
    const alpha = transparencySlider.value()
    circleColor = p.color(color.levels[0], color.levels[1], color.levels[2], alpha)
  }

  function drawUI () {
    const uiText = [
      `Cells count: ${cellCount}`,
      `Image Size: ${img.width} x ${img.height}`
    ]

    const boxWidth = 230
    const boxHeight = uiText.length * 20 + 20

    p.fill(0, 150)
    p.noStroke()
    p.rect(5, p.height - boxHeight - 65, boxWidth, boxHeight, 10)

    p.fill('white')
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)
    uiText.forEach((text, index) => {
      p.text(text, 10, p.height - boxHeight - 55 + index * 20)
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
      s - Save image
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
    } else if (p.key === 's') {
      saveImage()
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

  function saveImage () {
    p.save(offscreen, generateFilename('circle_grid'))
  }
}

new p5(sketch)
