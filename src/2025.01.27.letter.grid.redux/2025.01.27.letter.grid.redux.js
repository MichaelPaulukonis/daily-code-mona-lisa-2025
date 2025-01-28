/* global p5 */

// TODO: autosave, queryLocalFonts (search)

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
  const initialFadeSpeed = 1 // Multiplier for fade speed
  const fonts = {} // Store loaded fonts
  let randomFont = false
  let randomColor = false
  let autoSave = false
  let autoSaveCount = 0

  const fontlist = [
    'ATARCC.ttf',
    'Go 2 Old Western.ttf',
    'MADE TOMMY ExtraBold.otf',
    'Marlboro.ttf',
    'Old Town Regular.ttf',
    'Pixel Gosub.otf',
    'couture-bld.otf'
  ]

  // UI Parameters
  const controls = {
    fadeSpeed: initialFadeSpeed,
    letterSize: (targetSize / gridSize) * 2,
    backgroundColor: '#FFFFFF',
    letterColor: '#14D7CA',
    letterAlpha: 255,
    currentFont: fontlist[0]
  }

  class LetterCell {
    constructor (x, y, letter) {
      this.x = x
      this.y = y
      this.letter = letter
      this.alpha = controls.letterAlpha
      this.font = controls.currentFont
      this.fadeOutTime = p.random(0.05, 5)
      this.color = p.color(controls.letterColor)
      this.size = controls.letterSize
    }
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
    const fadeSlider = p.createSlider(1, 10, initialFadeSpeed, 1)
    fadeSlider.parent(uiContainer)
    fadeSlider.input(() => (controls.fadeSpeed = fadeSlider.value()))

    // Letter Size Slider
    p.createDiv('Letter Size:').parent(uiContainer)
    const sizeSlider = p.createSlider(
      100,
      (targetSize / gridSize) * 2,
      controls.letterSize,
      10
    )
    sizeSlider.parent(uiContainer)
    sizeSlider.input(() => {
      controls.letterSize = sizeSlider.value()
    })

    // Font Selector
    p.createDiv('Font:').parent(uiContainer)
    const fontSelect = p.createSelect()
    fontSelect.parent(uiContainer)

    // Add all fonts to the dropdown
    fontlist.forEach(font => {
      fontSelect.option(font)
    })

    // Handle font changes
    fontSelect.changed(() => {
      controls.currentFont = fontSelect.value()
      targetLayer.textFont(fonts[controls.currentFont])
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

  p.preload = () => {
    fontlist.forEach(font => {
      fonts[font] = p.loadFont(`fonts/${font}`)
    })
  }

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
    setupUI()
    targetLayer = p.createGraphics(targetSize, targetSize)
    targetLayer.textAlign(p.CENTER, p.CENTER)
    targetLayer.textSize(targetSize / gridSize / 2)
    targetLayer.textFont(fonts[controls.currentFont])
    initializeLetterCells()
  }

  p.draw = () => {
    if (!isPaused) {
      targetLayer.background(controls.backgroundColor)
      updateLetterCells()
      drawGrid(targetLayer)
      p.image(targetLayer, 0, 0, canvasSize, canvasSize)
      if (autoSave) {
        targetLayer.save(
          generateFilename(
            `mona-letters_${String(autoSaveCount).padStart(4, '0')}`
          )
        )
      }
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
      '- Select font from dropdown',
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
    return new LetterCell(x, y, letter)
  }

  function updateLetterCells () {
    for (const cell of letterCells) {
      cell.alpha -= cell.fadeOutTime * controls.fadeSpeed
      if (cell.alpha <= 0) {
        relocateCell(cell)
      }
      cell.color.setAlpha(cell.alpha)
    }
  }
  function relocateCell (cell) {
    let positions = []
    for (let i = 0; i < gridSize * gridSize; i++) {
      positions.push(i)
    }
    for (const otherCell of letterCells) {
      if (otherCell !== cell) {
        const pos = (otherCell.y / cellSize) * gridSize + otherCell.x / cellSize
        positions = positions.filter(p => p !== pos)
      }
    }
    const newPos = p.random(positions)
    const x = (newPos % gridSize) * cellSize
    const y = p.floor(newPos / gridSize) * cellSize

    // Instead of using Object.assign, create a new cell with random properties
    const newCell = createLetterCell(cell.letter, x, y)

    if (randomFont) {
      newCell.font = p.random(fontlist)
    }
    if (randomColor) {
      newCell.color = p.color(
        p.random(255), // R
        p.random(255), // G
        p.random(255) // B
      )
    }

    // Copy the new properties to the existing cell
    Object.assign(cell, newCell)
  }

  const drawCell = (cell, graphics) => {
    graphics.textFont(fonts[cell.font])
    graphics.fill(cell.color)
    graphics.textSize(cell.size)
    graphics.text(cell.letter, cell.x + cellSize / 2, cell.y + cellSize / 2)
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
    for (const cell of letterCells) {
      drawCell(cell, layer)
    }
  }

  p.keyPressed = () => {
    if (p.key === 'A') {
      autoSave = !autoSave
      if (autoSave) {
        p.frameRate(5)
        autoSaveCount = 0
      } else {
        p.frameRate(60)
      }
    } else if (p.key === 'r') {
      randomColor = !randomColor
    } else if (p.key === 'R') {
      randomFont = !randomFont
    } else if (p.key === 'S' || p.key === 's') {
      targetLayer.save(generateFilename('mona-letters'))
    } else if (p.key === 'G' || p.key === 'g') {
      showGrid = !showGrid
    } else if (p.key === 'H' || p.key === 'h') {
      showHelp = !showHelp
    } else if (p.key === ' ') {
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
