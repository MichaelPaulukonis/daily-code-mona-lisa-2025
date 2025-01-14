const sketch = p => {
  let img
  let zoomFactor = 1
  let step = 0
  let direction = 1
  const steps = [1, 0.75, 0.5, 0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 4, 3, 2, 1]
  const gridSize = 3
  const cellSize = 200
  let needsRedraw = true

  p.preload = () => {
    img = p.loadImage('images/mona.crosshairs.png')
  }

  p.setup = () => {
    p.createCanvas(600, 600)
    p.imageMode(p.CENTER)
    p.fill(0)
    p.stroke('white')
    p.strokeWeight(2)
    p.textSize(16)
    p.textAlign(p.CENTER, p.CENTER)
  }

  p.draw = () => {
    if (needsRedraw) {
      p.background(255)
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const sx = row * cellSize + cellSize / 2
          const sy = col * cellSize + cellSize / 2
          const zoomedCellWidth = cellSize * zoomFactor
          const zoomedCellHeight = cellSize * zoomFactor

          // const sx = col * cellSize
          // const sy = row * cellSize
          const dx = col * zoomedCellWidth
          const dy = row * zoomedCellHeight

          console.log(
            sx, sy, cellSize, cellSize,
            dx, dy, zoomedCellWidth, zoomedCellHeight,
            `${Math.round(zoomFactor * 100)}%`
          )
          p.image(
            img, sx, sy, cellSize, cellSize,
            dx, dy, zoomedCellWidth, zoomedCellHeight
          )

          p.text(`${Math.round(zoomFactor * 100)}%`, sx, sy + cellSize / 2 - 20)
        }
      }
      needsRedraw = false
    }

    if (p.frameCount % 60 === 0) {
      zoomFactor = steps[step]
      step += direction
      if (step === steps.length || step === -1) {
        direction *= -1
        step += direction
      }
      needsRedraw = true
    }
  }
}

new p5(sketch)
