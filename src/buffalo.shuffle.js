// 2025.01.07

const sketch = p => {
  let img
  let grid = []
  let originalGrid = []
  let outputLayer
  let shuffleSlider
  const gridSize = 200
  const modal = {
    showHelp: false,
    showUI: true
  }
  let shuffleProbability = 0.8

  p.preload = () => {
    img = p.loadImage('images/mona.png')
  }

  p.setup = () => {
    const canvasWidth = p.windowWidth - 20
    const canvasHeight = (img.height / img.width) * canvasWidth
    p.createCanvas(canvasWidth, canvasHeight).drop(handleFile)
    outputLayer = p.createGraphics(img.width, img.height)
    divideImageIntoGrid()
    shuffleGrid()

    shuffleSlider = p.createSlider(0, 1, shuffleProbability, 0.01)
    shuffleSlider.position(10, p.height + 10)
    shuffleSlider.style('width', '200px')
    shuffleSlider.input(() => {
      shuffleProbability = shuffleSlider.value()
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
    for (let y = 0; y < img.height; y += gridSize) {
      for (let x = 0; x < img.width; x += gridSize) {
        const gridElement = { x: x, y: y }
        grid.push(gridElement)
        originalGrid.push(gridElement)
      }
    }
    // Ensure the last row and column are captured
    if (img.width % gridSize !== 0) {
      for (let y = 0; y < img.height; y += gridSize) {
        const gridElement = { x: img.width - (img.width % gridSize), y: y }
        grid.push(gridElement)
        originalGrid.push(gridElement)
      }
    }
    if (img.height % gridSize !== 0) {
      for (let x = 0; x < img.width; x += gridSize) {
        const gridElement = { x: x, y: img.height - (img.height % gridSize) }
        grid.push(gridElement)
        originalGrid.push(gridElement)
      }
    }
  }

  function shuffleGrid () {
    grid = [...originalGrid]
    for (let i = grid.length - 1; i > 0; i--) {
      if (p.random() < shuffleProbability) {
        let j = Math.floor(p.random(i + 1))
        ;[grid[i], grid[j]] = [grid[j], grid[i]]
      }
    }
  }

  function displayShuffledImage () {
    grid.forEach((part, index) => {
      let originalX = originalGrid[index].x
      let originalY = originalGrid[index].y
      outputLayer.image(
        img,
        part.x,
        part.y,
        gridSize,
        gridSize,
        originalX,
        originalY,
        gridSize,
        gridSize
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
    const uiText = [`Shuffle Amount: ${(shuffleProbability * 100).toFixed(0)}%`]

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

  p.keyPressed = () => {
    if (p.key === '?') {
      modal.showHelp = !modal.showHelp
    } else if (p.key === 'h' || p.key === 'H') {
      modal.showUI = !modal.showUI
    } else if (p.key === 'r' || p.key === 'R') {
      shuffleGrid()
    } else if (p.key === 'S') {
      p.save(outputLayer, 'shuffled_image.png')
    }
  }

  function handleFile (file) {
    if (file.type === 'image') {
      img = p.loadImage(file.data, () => {
        const canvasWidth = p.windowWidth - 20
        const canvasHeight = (img.height / img.width) * canvasWidth
        p.resizeCanvas(canvasWidth, canvasHeight)
        outputLayer = p.createGraphics(img.width, img.height)
        divideImageIntoGrid()
        shuffleGrid()
      })
    }
  }
}

new p5(sketch)
