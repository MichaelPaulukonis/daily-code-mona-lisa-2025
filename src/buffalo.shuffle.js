// 2025.01.07

const sketch = p => {
  let img // original
  let gridImg // cropped to evenly divide into grid
  let grid = []
  let originalGrid = []
  let outputLayer
  let shuffleSlider
  let cellSizeSlider
  let cellSize = 200
  const modal = {
    showHelp: false,
    showUI: true
  }
  let shuffleProbability = 0.8

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

  function createGridFittingImage () {
    const newWidth = img.width - (img.width % cellSize)
    const newHeight = img.height - (img.height % cellSize)
    gridImg = p.createImage(newWidth, newHeight)
    gridImg.copy(img, 0, 0, newWidth, newHeight, 0, 0, newWidth, newHeight)
  }

  p.preload = () => {
    img = p.loadImage('images/mona.png', img => {
      createGridFittingImage()
    })
  }

  p.setup = () => {
    const canvasWidth = p.windowWidth - 20
    const canvasHeight = p.windowHeight - 20
    const aspectRatio = gridImg.width / gridImg.height

    let finalCanvasWidth, finalCanvasHeight

    if (canvasWidth / aspectRatio <= canvasHeight) {
      finalCanvasWidth = canvasWidth
      finalCanvasHeight = canvasWidth / aspectRatio
    } else {
      finalCanvasWidth = canvasHeight * aspectRatio
      finalCanvasHeight = canvasHeight
    }

    p.createCanvas(finalCanvasWidth, finalCanvasHeight).drop(handleFile)

    outputLayer = p.createGraphics(gridImg.width, gridImg.height)
    divideImageIntoGrid()
    shuffleGrid()

    shuffleSlider = p.createSlider(0, 1, shuffleProbability, 0.01)
    shuffleSlider.position(10, p.height - 60)
    shuffleSlider.style('width', '200px')
    shuffleSlider.attribute('title', 'Shuffle Amount')
    shuffleSlider.input(() => {
      shuffleProbability = shuffleSlider.value()
      shuffleGrid()
    })

    cellSizeSlider = p.createSlider(10, 500, cellSize, 10)
    cellSizeSlider.position(10, p.height - 30)
    cellSizeSlider.style('width', '200px')
    cellSizeSlider.attribute('title', 'Cell Size')
    cellSizeSlider.input(() => {
      cellSize = cellSizeSlider.value()
      createGridFittingImage()
      const canvasWidth = p.windowWidth - 20
      const canvasHeight = p.windowHeight - 20
      const aspectRatio = gridImg.width / gridImg.height

      let finalCanvasWidth, finalCanvasHeight

      if (canvasWidth / aspectRatio <= canvasHeight) {
        finalCanvasWidth = canvasWidth
        finalCanvasHeight = canvasWidth / aspectRatio
      } else {
        finalCanvasWidth = canvasHeight * aspectRatio
        finalCanvasHeight = canvasHeight
      }

      p.resizeCanvas(finalCanvasWidth, finalCanvasHeight)
      outputLayer = p.createGraphics(gridImg.width, gridImg.height)
      divideImageIntoGrid()
      shuffleGrid()
    })
  }

  p.draw = () => {
    p.background(255)
    outputLayer.background(255)
    displayShuffledImage()
    p.image(outputLayer, 0, 0, p.width, p.height)

    if (modal.showHelp) {
      displayHelpScreen()
    }

    if (modal.showUI) {
      displayUI()
    }
  }

  function divideImageIntoGrid () {
    grid = []
    originalGrid = []
    for (let y = 0; y < gridImg.height; y += cellSize) {
      for (let x = 0; x < gridImg.width; x += cellSize) {
        const gridElement = { x, y }
        grid.push(gridElement)
        originalGrid.push(gridElement)
      }
    }
  }

  function shuffleGrid () {
    grid = [...originalGrid]
    for (let i = grid.length - 1; i > 0; i--) {
      if (p.random() < shuffleProbability) {
        const j = Math.floor(p.random(i + 1))
        ;[grid[i], grid[j]] = [grid[j], grid[i]]
      }
    }
  }

  function displayShuffledImage () {
    grid.forEach((part, index) => {
      const originalX = originalGrid[index].x
      const originalY = originalGrid[index].y
      outputLayer.image(
        gridImg,
        part.x,
        part.y,
        cellSize,
        cellSize,
        originalX,
        originalY,
        cellSize,
        cellSize
      )
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
      r - Shuffle image
      S - Save image
      h - Show/Hide UI
      `,
      70,
      70
    )
  }

  function displayUI () {
    const uiText = [
      `Image Size: ${gridImg.width} x ${gridImg.height}`,
      `Shuffle Amount: ${(shuffleProbability * 100).toFixed(0)}%`,
      `Cell Size: ${cellSize}`
    ]

    const boxWidth = 200
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

  p.keyPressed = () => {
    if (p.key === '?') {
      modal.showHelp = !modal.showHelp
    } else if (p.key === 'h' || p.key === 'H') {
      modal.showUI = !modal.showUI
    } else if (p.key === 'r' || p.key === 'R') {
      shuffleGrid()
    } else if (p.key === 'S') {
      p.save(outputLayer, generateFilename('buffalo_shuffle'))
    }
  }

  function handleFile (file) {
    if (file.type === 'image') {
      img = p.loadImage(file.data, () => {
        createGridFittingImage()
        const canvasWidth = p.windowWidth - 20
        const canvasHeight = p.windowHeight - 20
        const aspectRatio = gridImg.width / gridImg.height

        let finalCanvasWidth, finalCanvasHeight

        if (canvasWidth / aspectRatio <= canvasHeight) {
          finalCanvasWidth = canvasWidth
          finalCanvasHeight = canvasWidth / aspectRatio
        } else {
          finalCanvasWidth = canvasHeight * aspectRatio
          finalCanvasHeight = canvasHeight
        }

        p.resizeCanvas(finalCanvasWidth, finalCanvasHeight)
        outputLayer = p.createGraphics(gridImg.width, gridImg.height)
        divideImageIntoGrid()
        shuffleGrid()
      })
    }
  }
}

new p5(sketch)