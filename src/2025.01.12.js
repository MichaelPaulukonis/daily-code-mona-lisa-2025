/* global p5 */

const sketch = function (p) {
  let img
  let threshold = 128
  let backgroundColor
  let displayLayer
  let combinedLayer = null
  let dirty = false
  let invert = false
  let sizeRatio = 1.0
  const density = 1
  const displaySize = 600
  const outputSize = 1000
  const offset = {
    vertical: 0,
    horizontal: 0,
    verticalMax: 0,
    horizontalMax: 0
  }
  let colorPairs
  let blurAmount = 2
  let cellCount = 3
  let colorPairCount = 5
  let cellSlider
  let colorPairSlider

  function getRandomUniqueItem (arr, excludeItems) {
    const filteredArr = arr.filter(item => !excludeItems.includes(item))
    if (filteredArr.length === 0) {
      throw new RangeError('getRandomUniqueItem: no available items to select')
    }
    const randomIndex = Math.floor(Math.random() * filteredArr.length)
    return filteredArr[randomIndex]
  }

  const getColorPairs = () => {
    const colorPairs = []
    const usedColors = []
    const sourceColors = RISOCOLORS.map(r => r.color)
    for (let i = 0; i < colorPairCount; i++) {
      const color1 = getRandomUniqueItem(sourceColors, usedColors)
      usedColors.push(color1)
      const color2 = getRandomUniqueItem(sourceColors, usedColors)
      usedColors.push(color2)
      colorPairs.push([color1, color2])
    }
    return colorPairs
  }

  const scaleMethods = {
    fitToWidth: 'fitToWidth',
    fitToHeight: 'fitToHeight',
    fitToCanvas: 'fitToCanvas'
  }

  let scaleMethod = scaleMethods.fitToWidth

  const modal = {
    showHelp: false,
    showUI: true,
    processing: false,
    eraseMode: false,
    refit: false
  }

  p.preload = function () {
    img = p.loadImage('images/mona.crosshairs.png')
  }

  p.setup = function () {
    p.pixelDensity(density)
    const c = p.createCanvas(displaySize, displaySize)
    c.drop(handleFile)
    p.imageMode(p.CENTER)
    backgroundColor = p.color(255, 255, 255)
    p.background(backgroundColor)

    displayLayer = p.createGraphics(outputSize, outputSize)
    displayLayer.pixelDensity(density)
    displayLayer.imageMode(p.CENTER)
    colorPairs = getColorPairs() // Initialize color pairs outside the scope of buildCombinedLayer

    // Initialize slider for cell count
    cellSlider = p.createSlider(1, 25, cellCount)
    cellSlider.position(10, displaySize - 60)
    cellSlider.style('width', '200px')
    cellSlider.input(() => {
      cellCount = cellSlider.value()
      buildCombinedLayer(img)
    })

    // Initialize slider for color pair count
    colorPairSlider = p.createSlider(1, 20, colorPairCount)
    colorPairSlider.position(10, displaySize - 30)
    colorPairSlider.style('width', '200px')
    colorPairSlider.input(() => {
      colorPairCount = colorPairSlider.value()
      colorPairs = getColorPairs()
      buildCombinedLayer(img)
    })

    processImage(img)
  }

  p.draw = function () {
    if (modal.showHelp) {
      displayHelpScreen()
      return
    }
    if (modal.processing) {
      displayProcessingText()
      return
    }
    if (modal.refit) {
      processImage(img)
      return
    }
    specialKeys()
    if (displayLayer && dirty) {
      p.background(backgroundColor)
      p.image(displayLayer, p.width / 2, p.height / 2, p.width, p.height)
      dirty = false

      if (modal.showUI) {
        displayUI()
        cellSlider.show()
        colorPairSlider.show()
      } else {
        cellSlider.hide()
        colorPairSlider.hide()
      }
    }
  }

  const specialKeys = () => {
    const change = p.keyIsDown(p.SHIFT) ? 1 : 10

    if (p.keyIsDown(p.RIGHT_ARROW)) {
      sizeRatio = p.constrain(sizeRatio + change / 100, 0.01, 10)
      buildCombinedLayer(img)
    } else if (p.keyIsDown(p.LEFT_ARROW)) {
      sizeRatio = p.constrain(sizeRatio - change / 100, 0.01, 10)
      buildCombinedLayer(img)
    }

    if (p.keyIsDown(p.UP_ARROW)) {
      threshold = p.constrain(threshold + change, 0, 255)
      buildCombinedLayer(img)
    } else if (p.keyIsDown(p.DOWN_ARROW)) {
      threshold = p.constrain(threshold - change, 0, 255)
      buildCombinedLayer(img)
    }

    return false
  }

  p.keyPressed = () => handleKeys()

  const handleKeys = () => {
    if (p.key === 'c' || p.key === 'C') {
      colorPairs = getColorPairs() // Generate new color pairs when 'c' is pressed
      buildCombinedLayer(img)
      dirty = true
    } else if (p.key === 'b' || p.key === 'B') {
      if (p.key === 'b' && blurAmount > 0) {
        blurAmount-- // Decrease blur amount
      } else if (p.key === 'B' && blurAmount < 10) {
        blurAmount++ // Increase blur amount
      }
      buildCombinedLayer(img)
      dirty = true
    }
    if (p.key === 'i') {
      invert = !invert
      backgroundColor = invert ? p.color(0, 0, 0) : p.color(255, 255, 255)
      buildCombinedLayer(img)
      dirty = true
    }
    if (p.key === 'r') {
      threshold = 128
      sizeRatio = 1
      offset.horizontal = 0
      offset.vertical = 0
      buildCombinedLayer(img)
      dirty = true
    }
    if (p.key === '?') {
      modal.showHelp = !modal.showHelp
      dirty = true
    } else if (p.key === 'h' || p.key === 'H') {
      modal.showUI = !modal.showUI
      dirty = true
    } else if (p.key === 'f' || p.key === 'F') {
      // toggle fit method
      scaleMethod =
        scaleMethod === scaleMethods.fitToWidth
          ? scaleMethods.fitToHeight
          : scaleMethod === scaleMethods.fitToHeight
          ? scaleMethods.fitToCanvas
          : scaleMethods.fitToWidth
      modal.refit = true
      dirty = true
    } else if (p.key === 's' && (p.keyIsDown(p.CONTROL) || p.keyIsDown(91))) {
      p.save(displayLayer, generateFilename())
    } else if (p.key === '>') {
      if (scaleMethod === scaleMethods.fitToWidth) {
        offset.vertical = Math.min(offset.vertical + 100, offset.verticalMax)
      } else if (scaleMethod === scaleMethods.fitToHeight) {
        offset.horizontal = Math.min(
          offset.horizontal + 100,
          offset.horizontalMax
        )
      }
      dirty = true
      buildCombinedLayer(img)
    } else if (p.key === '<') {
      if (scaleMethod === scaleMethods.fitToWidth) {
        offset.vertical = Math.max(offset.vertical - 100, -offset.verticalMax)
      } else if (scaleMethod === scaleMethods.fitToHeight) {
        offset.horizontal = Math.max(
          offset.horizontal - 100,
          -offset.horizontalMax
        )
      }
      dirty = true
      buildCombinedLayer(img)
    }
    return false // Prevent default browser behavior
  }

  function generateFilename () {
    const d = new Date()
    return (
      'monochrome_image.' +
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

  let cachedImage = null
  let cachedThreshold = null
  const getContrastingImage = (img, threshold, color1, color2) => {
    if (cachedImage && cachedThreshold === threshold) {
      const newImg = cachedImage.get()
      applyColors(newImg, color1, color2)
      return newImg
    }

    const newImg = p.createImage(img.width, img.height)
    newImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
    newImg.filter(p.BLUR, blurAmount)
    newImg.filter(p.THRESHOLD, threshold / 256)

    const ctx = newImg.drawingContext
    const idata = ctx.getImageData(0, 0, img.width, img.height)
    const data = idata.data

    for (let i = 0, v; i < data.length; i += 4) {
      v = data[i]
      if (v < 30) v = 0 // compress grey to black (arbitrary threshold here)
      data[i + 3] = v
    }

    ctx.putImageData(idata, 0, 0)

    cachedImage = newImg.get()
    cachedThreshold = threshold

    applyColors(newImg, color1, color2)
    return newImg
  }

  const applyColors = (img, color1, color2) => {
    img.drawingContext.fillStyle = color1.toString()
    img.drawingContext.globalCompositeOperation = 'source-atop'
    img.drawingContext.fillRect(0, 0, img.width, img.height)

    img.drawingContext.fillStyle = color2.toString()
    img.drawingContext.globalCompositeOperation = 'destination-atop'
    img.drawingContext.fillRect(0, 0, img.width, img.height)
  }

  // zoom in/out https://stackoverflow.com/questions/70871986/p5-js-how-do-i-zoom-to-a-point-on-the-canvas
  const buildCombinedLayer = img => {
    let images = colorPairs.map(pair =>
      getContrastingImage(img, threshold, p.color(pair[0]), p.color(pair[1]))
    )

    displayLayer.background(255)
    const cellWidth = displayLayer.width / cellCount
    const cellHeight = displayLayer.height / cellCount
    displayLayer.imageMode(p.CENTER)

    const zoomedWidth = img.width * sizeRatio
    const zoomedHeight = img.height * sizeRatio
    let imgIndex = 0

    for (let y = 0; y < cellCount; y++) {
      for (let x = 0; x < cellCount; x++) {
        // const imgIndex = (y * cellCount + x) % images.length
        displayLayer.image(
          images[imgIndex],
          x * cellWidth + cellWidth / 2,
          y * cellHeight + cellHeight / 2,
          cellWidth,
          cellHeight,
          (img.width - zoomedWidth) / 2, // centers when zoom larger, incorrect when zoom smaller
          (img.height - zoomedHeight) / 2, // centers when zoom larger, incorrect when zoom smaller
          zoomedWidth,
          zoomedHeight
        )
        imgIndex = (imgIndex + 1) % images.length
        if (imgIndex === 0) {
          images = p.shuffle(images)
        }
      }
    }
    dirty = true
  }

  const calculateOffsetMax = function (img, size = outputSize) {
    switch (scaleMethod) {
      case scaleMethods.fitToWidth:
        return Math.max(
          Math.floor(((img.height * size) / img.width - size) / 2),
          0
        )

      case scaleMethods.fitToHeight:
        return Math.max(
          Math.floor(((img.width * size) / img.height - size) / 2),
          0
        )

      case scaleMethods.fitToCanvas:
      default:
        return 0
    }
  }

  function processImage (img) {
    modal.processing = false
    combinedLayer && combinedLayer.remove()
    combinedLayer = null
    offset.vertical = 0
    offset.horizontal = 0
    offset.verticalMax = 0
    offset.horizontalMax = 0

    const offsetMax = calculateOffsetMax(img, outputSize)

    if (scaleMethod === scaleMethods.fitToWidth) {
      offset.verticalMax = offsetMax
    } else if (scaleMethod === scaleMethods.fitToHeight) {
      offset.horizontalMax = offsetMax
    }

    buildCombinedLayer(img)
    modal.refit = false
    dirty = true
  }

  function handleFile (file) {
    if (file.type === 'image') {
      modal.processing = true
      img = null
      p.loadImage(file.data, loadedImg => {
        img = loadedImg
        processImage(loadedImg)
      })
    }
  }

  const displayUI = () => {
    const offsetAmount =
      scaleMethod === scaleMethods.fitToWidth
        ? offset.vertical
        : offset.horizontal
    const uiText = [
      `threshold: ${threshold}`,
      `blur amount: ${blurAmount}`,
      `zoom: ${((1 / sizeRatio) * 100).toFixed(0)}% - ${sizeRatio.toFixed(2)}`,
      `offset: ${offsetAmount}`,
      `fit method: ${scaleMethod}`,
      `invert: ${invert ? 'inverted' : 'normal'}`,
      `cell count: ${cellCount}`,
      `color pairs: ${colorPairCount}`
    ].filter(Boolean)

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
      b|B - Decrease|Increase blur amount
      h - Show/Hide UI
      r - Reset to default settings
      → - increase zoom
      ← - decrease zoom
      > - increase offset (h/v)
      < - decrease offset (h/v)
      ↑ - increase threshold
      ↓ - decrease threshold
      CMD-s - Save image
      `,
      70,
      70
    )
  }

  function displayProcessingText () {
    p.fill(p.color('#e75397'), 150)
    p.rect(50, 50, p.width - 100, 100, 10)

    p.fill(255)
    p.textSize(16)
    p.textAlign(p.CENTER, p.CENTER)
    p.text('Processing image, please wait...', p.width / 2, 100)
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap