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
  let showGrid = false // Default to hidden
  let autoSave = false
  let autoSaveCount = -1
  const autoSaveFrameSkip = 5
  let autoSaveFirstFrame // for autoSave skip
  let paused = false

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
    targetLayer = p.createGraphics(targetSize, targetSize)
    targetLayer.textAlign(p.CENTER, p.CENTER)
    targetLayer.textSize(targetSize / gridSize / 2)
    initializeLetterCells()
  }

  p.draw = () => {
    if (paused) return

    targetLayer.background(255)
    updateLetterCells()
    drawGrid(targetLayer)
    p.image(targetLayer, 0, 0, canvasSize, canvasSize)

    // TODO: how to capture the first frame
    if (autoSave && (p.frameCount - autoSaveFirstFrame) % autoSaveFrameSkip === 0) {
      autoSaveCount++
      if (autoSaveCount <= 200) {
        targetLayer.save(
          generateFilename(
            `mona-letter-grid_${String(autoSaveCount).padStart(4, '0')}`
          )
        )
      } else {
        autoSave = false
        p.frameRate(60)
        autoSaveCount = -1
      }
    }
  }

  function initializeLetterCells () {
    letterCells.length = 0
    for (let i = 0; i < letters.length; i++) {
      const x = (i % gridSize) * cellSize
      const y = p.floor(i / gridSize) * cellSize
      letterCells.push(createLetterCell(letters[i], x, y))
    }
  }

  function createLetterCell (letter, x, y) {
    return {
      letter,
      x,
      y,
      alpha: 255,
      fadeOutTime: p.random(20, 200),
      fadeOutCounter: 0
    }
  }

  function updateLetterCells () {
    for (const cell of letterCells) {
      cell.fadeOutCounter++
      if (cell.fadeOutCounter >= cell.fadeOutTime) {
        cell.alpha -= 255 / cell.fadeOutTime
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
    for (const otherCell of letterCells) {
      if (otherCell !== cell) {
        const pos = (otherCell.y / cellSize) * gridSize + otherCell.x / cellSize
        positions = positions.filter(p => p !== pos)
      }
    }
    const newPos = p.random(positions)
    const x = (newPos % gridSize) * cellSize
    const y = p.floor(newPos / gridSize) * cellSize
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
    for (const cell of letterCells) {
      layer.fill(0, cell.alpha)
      layer.text(cell.letter, cell.x + cellSize / 2, cell.y + cellSize / 2)
    }
  }

  p.keyPressed = () => {
    if (p.key === 'a') {
      autoSave = !autoSave
      if (autoSave) {
        initializeLetterCells()
        p.frameRate(10)
        autoSaveCount = -1
        autoSaveFirstFrame = p.frameCount - 1 // so we can save the first frame
      } else {
        p.frameRate(60)
      }
    } else if (p.key === 'r' || p.key === 'R') {
      initializeLetterCells()
    } else if (p.key === 'S') {
      p.saveCanvas(targetLayer, generateFilename('mona-letter-grid'), 'png')
    } else if (p.key === 'G' || p.key === 'g') {
      showGrid = !showGrid
    } else if (p.key === ' ') {
      paused = !paused
      if (paused) {
        p.noLoop()
      } else {
        p.loop()
      }
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
