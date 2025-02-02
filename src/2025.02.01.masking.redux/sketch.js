/* global p5 */
// elaboration of 01.26 masking

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

const sketch = function (p) {
  let colorImg
  let targetLayer
  let masks = []
  let gridSize
  let inset
  let cellWidth
  let cellHeight
  let insetWidth
  let insetHeight
  let scaleW
  let scaleH
  let scale
  let newWidth
  let newHeight
  let pause = false
  let cells = []
  let imageCells = []
  let usedMasks = []
  let autoSave = false
  let autoSaveCount = 0
  const totalFrames = 1000
  const imageCount = 10 // not the right name
  let boxHeight = 0

  class Cell {
    constructor ({ row, col }) {
      this.location = { row, col }
    }
  }

  class ImageCell extends Cell {
    constructor ({ row, col }, mask, lifetime) {
      super({ row, col })
      this.mask = mask
      this.lifetime = lifetime
    }
  }

  p.preload = function () {
    colorImg = p.loadImage('images/mona_square.jpeg')
    masks = [
      p.loadImage('images/5mg.logo.01.png'),
      p.loadImage('images/cows.duo.01.png'),
      p.loadImage('images/damien.hirst.01.png'),
      p.loadImage('images/fire.door.png'),
      p.loadImage('images/gottlieb.01.png'),
      p.loadImage('images/green.beans.01.png'),
      p.loadImage('images/john.deere.00.png'),
      p.loadImage('images/napster.png'),
      p.loadImage('images/pbs.png'),
      p.loadImage('images/peanuts.lucy.00.png'),
      p.loadImage('images/splat.00.png'),
      p.loadImage('images/splat.01.png'),
      p.loadImage('images/splat.03.png'),
      p.loadImage('images/thumbprint.01.png'),
      p.loadImage('images/tow.zone.png'),
      p.loadImage('images/vcs.01.png')
    ]
  }

  function initializeCells () {
    const shuffledCells = p.shuffle(cells)
    imageCells = shuffledCells
      .slice(0, imageCount)
      .map((cell, index) => new ImageCell(cell.location, masks[index], Math.round(p.random(3, 20))))
    usedMasks = masks.slice(0, imageCells.length)
  }

  function setGridValues () {
    gridSize = 5
    inset = 20
    cellWidth = targetLayer.width / gridSize
    cellHeight = targetLayer.height / gridSize

    insetWidth = cellWidth - inset * 2
    insetHeight = cellHeight - inset * 2

    scaleW = insetWidth / masks[0].width
    scaleH = insetHeight / masks[0].height
    scale = Math.min(scaleW, scaleH, 1)

    newWidth = masks[0].width * scale
    newHeight = masks[0].height * scale

    cells = []
    // Create an array of all possible cell positions
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        cells.push(new Cell({ row, col }))
      }
    }
  }

  p.setup = function () {
    targetLayer = p.createGraphics(colorImg.width, colorImg.height)
    p.createCanvas(600, 600).drop(handleFile)
    p.frameRate(15)

    setGridValues()

    const displayPanel = p.createDiv('')
    displayPanel.id('displayPanel')
    displayPanel.style('background-color', 'rgba(0, 0, 0, 0.6)')
    displayPanel.style('border-radius', '10px')
    displayPanel.style('padding', '10px')
    displayPanel.style('color', 'white')
    displayPanel.style('font-size', '16px')
  }

  function updateTargetLayer () {
    targetLayer.background(255)

    if (imageCells.length === 0) {
      initializeCells()
    } else {
      const emptyCells = cells.filter(
        cell => !imageCells.some(ic => ic.location === cell.location)
      )

      let defunctCount = 0
      imageCells.forEach(ic => {
        ic.lifetime--
        if (ic.lifetime <= 0) {
          emptyCells.push(new Cell(ic.location))
          imageCells = imageCells.filter(c => c !== ic)
          defunctCount++
        }
      })

      for (let i = 0; i < defunctCount; i++) {
        const newLocation = p.random(emptyCells).location
        const unusedMasks = masks.filter(mask => !usedMasks.includes(mask))
        const newMask = p.random(unusedMasks)
        const lifetime = Math.round(p.random(3, 20))
        const newCell = new ImageCell(newLocation, newMask, lifetime)
        imageCells.push(newCell)
        usedMasks = imageCells.map(sp => sp.mask)
      }
    }

    imageCells.forEach(({ location, mask }) => {
      const cellX = location.col * cellWidth
      const cellY = location.row * cellHeight

      const maskX = cellX + inset + (insetWidth - newWidth) / 2
      const maskY = cellY + inset + (insetHeight - newHeight) / 2

      targetLayer.push()
      targetLayer.drawingContext.save()
      targetLayer.drawingContext.beginPath()
      targetLayer.drawingContext.rect(
        cellX + inset,
        cellY + inset,
        insetWidth,
        insetHeight
      )
      targetLayer.drawingContext.clip()

      // Use the associated mask
      targetLayer.image(mask, maskX, maskY, newWidth, newHeight)

      targetLayer.drawingContext.globalCompositeOperation = 'lighten'
      targetLayer.image(
        colorImg,
        cellX + inset,
        cellY + inset,
        insetWidth,
        insetHeight
      )

      targetLayer.drawingContext.restore()
      targetLayer.pop()
    })
  }

  p.draw = function () {
    if (!pause) {
      updateTargetLayer()
      p.image(targetLayer, 0, 0, p.width, p.height)
      if (autoSave) {
        if (autoSaveCount >= totalFrames) {
          autoSave = false
          p.frameRate(60)
          return
        }

        targetLayer.save(
          generateFilename(
            `mona-masks_${String(autoSaveCount).padStart(4, '0')}`
          )
        )
        autoSaveCount++
      }
    }
    showDisplayPanel()
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
    } else if (p.key === 'S') {
      p.save(generateFilename('mona-masks'))
    } else if (p.key === 'r') {
      initializeCells()
    } else if (p.key === ' ') {
      pause = !pause
    }
  }

  p.mouseClicked = () => {
    updateTargetLayer()
  }

  function handleFile (file) {
    if (file.type === 'image') {
      p.loadImage(file.data, img => {
        masks.push(img)
        updateTargetLayer()
        console.log('Image loaded successfully')
      })
    } else {
      console.log('Not an image file!')
    }
  }

  const showDisplayPanel = () => {
    const uiText = [
      `Autosave: ${autoSave}`,
      autoSave ? `Frame: ${autoSaveCount} / ${totalFrames}` : '',
      `masks: ${masks.length}`,
      `canvas: ${p.width}x${p.height}`
    ].filter(Boolean) // removes empty strings

    const displayPanel = document.getElementById('displayPanel')
    displayPanel.innerHTML = '' // Clear previous content

    uiText.forEach(text => {
      const textElement = document.createElement('div')
      textElement.textContent = text
      displayPanel.appendChild(textElement)
    })

    // Calculate boxHeight based on the content
    boxHeight = displayPanel.clientHeight
    displayPanel.style.position = 'absolute'
    displayPanel.style.left = '5px'
    displayPanel.style.top = `${p.height - boxHeight - 5}px`
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
