/* global p5 */

// TODO: autosave, UI, help, queryLocalFonts (search)

const sketch = p => {
  const canvasSize = 600
  const gridSize = 5 // count
  const letters = 'MONA LISA'.split('')
  const letterCells = []
  const targetSize = 2000 // pixels
  const cellSize = targetSize / gridSize
  let targetLayer
  let showGrid = false
  let showHelp = false
  let isPaused = false
  const fadeSpeed = 0.1 // Multiplier for fade speed

  // UI Parameters
  const controls = {
    fadeSpeed,
    letterSize: targetSize / gridSize / 2,
    backgroundColor: '#FFFFFF',
    letterColor: '#000000'
  }

  function setupUI () {
    // Create UI container
    const uiContainer = p.createDiv('')
    uiContainer.style('position', 'absolute')
    uiContainer.style('right', '10px')
    uiContainer.style('top', '10px')
    uiContainer.style('background', 'rgba(255,255,255,0.8)')
    uiContainer.style('padding', '10px')
    uiContainer.style('border-radius', '5px')

    // Fade Speed Slider
    p.createDiv('Fade Speed:').parent(uiContainer)
    const fadeSlider = p.createSlider(0.1, 10, fadeSpeed, 0.1)
    fadeSlider.parent(uiContainer)
    fadeSlider.input(() => (controls.fadeSpeed = fadeSlider.value()))

    // Letter Size Slider
    p.createDiv('Letter Size:').parent(uiContainer)
    const sizeSlider = p.createSlider(
      100,
      targetSize / gridSize,
      controls.letterSize,
      10
    )
    sizeSlider.parent(uiContainer)
    sizeSlider.input(() => {
      controls.letterSize = sizeSlider.value()
      targetLayer.textSize(controls.letterSize)
    })

    // Color Pickers
    p.createDiv('Background Color:').parent(uiContainer)
    const bgColorPicker = p.createColorPicker(controls.backgroundColor)
    bgColorPicker.parent(uiContainer)
    bgColorPicker.input(
      () => (controls.backgroundColor = bgColorPicker.value())
    )

    p.createDiv('Letter Color:').parent(uiContainer)
    const letterColorPicker = p.createColorPicker(controls.letterColor)
    letterColorPicker.parent(uiContainer)
    letterColorPicker.input(
      () => (controls.letterColor = letterColorPicker.value())
    )
  }

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
    setupUI()
    targetLayer = p.createGraphics(targetSize, targetSize)
    targetLayer.textAlign(p.CENTER, p.CENTER)
    targetLayer.textSize(targetSize / gridSize / 2)
    initializeLetterCells()
  }

  p.draw = () => {
    if (!isPaused) {
      targetLayer.background(255)
      updateLetterCells()
      drawGrid(targetLayer)
      p.image(targetLayer, 0, 0, canvasSize, canvasSize)
    }

    if (showHelp) {
      drawHelpScreen()
    }
  }

  function drawHelpScreen () {
    p.push()
    p.fill('rgba(0,0,0,0.8)')
    p.rect(0, 0, canvasSize, canvasSize)
    p.fill(255)
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)

    const helpText = [
      'CONTROLS:',
      'H - Toggle Help Screen',
      'G - Toggle Grid',
      'S - Save Canvas',
      'P - Pause/Resume Animation',
      '',
      'UI CONTROLS:',
      '- Adjust fade speed with slider',
      '- Change letter size',
      '- Modify background color',
      '- Change letter color',
      '',
      'Press H to close help'
    ]

    let y = 50
    helpText.forEach(line => {
      p.text(line, 50, y)
      y += 25
    })
    p.pop()
  }

  function initializeLetterCells () {
    for (let i = 0; i < letters.length; i++) {
      const x = (i % gridSize) * cellSize
      const y = p.floor(i / gridSize) * cellSize
      letterCells.push(createLetterCell(letters[i], x, y))
    }
  }

  function createLetterCell (letter, x, y) {
    return {
      letter: letter,
      x: x,
      y: y,
      alpha: 1.0,
      fadeOutTime: p.random(20, 200),
      fadeOutCounter: 0
    }
  }

  function updateLetterCells () {
    for (const cell of letterCells) {
      cell.fadeOutCounter += controls.fadeSpeed
      if (cell.fadeOutCounter >= cell.fadeOutTime) {
        cell.alpha -= (1 / cell.fadeOutTime) * controls.fadeSpeed
        if (cell.alpha <= 0) {
          relocateCell(cell)
        }
      }
    }
  }

  function relocateCell (cell) {
    let positions = []
    for (let i = 0; i < gridSize * gridSize; i++) {
      positions.push(i)
    }
    for (let otherCell of letterCells) {
      if (otherCell !== cell) {
        let pos = (otherCell.y / cellSize) * gridSize + otherCell.x / cellSize
        positions = positions.filter(p => p !== pos)
      }
    }
    let newPos = p.random(positions)
    let x = (newPos % gridSize) * cellSize
    let y = p.floor(newPos / gridSize) * cellSize
    Object.assign(cell, createLetterCell(cell.letter, x, y))
  }

  function drawGrid (layer) {
    if (showGrid) {
      layer.stroke(0)
      layer.strokeWeight(4)
      for (let i = 0; i <= gridSize; i++) {
        layer.line(i * cellSize, 0, i * cellSize, targetSize)
        layer.line(0, i * cellSize, targetSize, i * cellSize)
      }
    }
    layer.noStroke()
    for (let cell of letterCells) {
      layer.fill(
        p
          .color(controls.letterColor)
          .toString()
          .replace('255)', cell.alpha + ')')
      )
      layer.text(cell.letter, cell.x + cellSize / 2, cell.y + cellSize / 2)
    }
  }

  p.keyPressed = () => {
    if (p.key === 'S' || p.key === 's') {
      p.saveCanvas(targetLayer, generateFilename('mona'), 'png')
    } else if (p.key === 'G' || p.key === 'g') {
      showGrid = !showGrid
    } else if (p.key === 'H' || p.key === 'h') {
      showHelp = !showHelp
    } else if (p.key === 'P' || p.key === 'p') {
      isPaused = !isPaused
    }
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
}

new p5(sketch) // eslint-disable-line no-new, new-cap
