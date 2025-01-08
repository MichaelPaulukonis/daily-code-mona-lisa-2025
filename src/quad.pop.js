/* eslint no-labels: 0 */
// 2025.01.05

const sketch = function (p) {
  let img
  let threshold = 128
  let lastThreshold = null
  let backgroundColor
  let displayLayer
  let combinedLayer = null
  let bwCachedImage = null
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
    for (let i = 0; i < 5; i++) {
      const color1 = getRandomUniqueItem(RISOCOLORS, usedColors)
      usedColors.push(color1)
      const color2 = getRandomUniqueItem(RISOCOLORS, usedColors)
      usedColors.push(color2)
      colorPairs.push([color1.color, color2.color])
    }
    return colorPairs
  }

  const RISOCOLORS = [
    { name: 'APRICOT', color: [246, 160, 77] },
    { name: 'AQUA', color: [94, 200, 229] },
    { name: 'BLACK', color: [0, 0, 0] },
    { name: 'BLUE', color: [0, 120, 191] },
    { name: 'BRICK', color: [167, 81, 84] },
    { name: 'BRIGHTGOLD', color: [186, 128, 50] },
    { name: 'BRIGHTOLIVEGREEN', color: [180, 159, 41] },
    { name: 'BRIGHTRED', color: [241, 80, 96] },
    { name: 'BROWN', color: [146, 95, 82] },
    { name: 'BUBBLEGUM', color: [249, 132, 202] },
    { name: 'BURGUNDY', color: [145, 78, 114] },
    { name: 'CHARCOAL', color: [112, 116, 124] },
    { name: 'COPPER', color: [189, 100, 57] },
    { name: 'CORAL', color: [255, 142, 145] },
    { name: 'CORNFLOWER', color: [98, 168, 229] },
    { name: 'CRANBERRY', color: [209, 81, 122] },
    { name: 'CRIMSON', color: [228, 93, 80] },
    { name: 'DARKMAUVE', color: [189, 140, 166] },
    { name: 'EMERALD', color: [25, 151, 93] },
    { name: 'FLATGOLD', color: [187, 139, 65] },
    { name: 'FLUORESCENTGREEN', color: [68, 214, 44] },
    { name: 'FLUORESCENTORANGE', color: [255, 116, 119] },
    { name: 'FLUORESCENTPINK', color: [255, 72, 176] },
    { name: 'FLUORESCENTRED', color: [255, 76, 101] },
    { name: 'FLUORESCENTYELLOW', color: [255, 233, 22] },
    { name: 'FOREST', color: [81, 110, 90] },
    { name: 'GRANITE', color: [165, 170, 168] },
    { name: 'GRAPE', color: [108, 93, 128] },
    { name: 'GRASS', color: [57, 126, 88] },
    { name: 'GRAY', color: [146, 141, 136] },
    { name: 'GREEN', color: [0, 169, 92] },
    { name: 'HUNTERGREEN', color: [64, 112, 96] },
    { name: 'INDIGO', color: [72, 77, 122] },
    { name: 'IVY', color: [22, 155, 98] },
    { name: 'KELLYGREEN', color: [103, 179, 70] },
    { name: 'LAGOON', color: [47, 97, 101] },
    { name: 'LAKE', color: [35, 91, 168] },
    { name: 'LIGHTGRAY', color: [136, 137, 138] },
    { name: 'LIGHTLIME', color: [227, 237, 85] },
    { name: 'LIGHTMAUVE', color: [230, 181, 201] },
    { name: 'LIGHTTEAL', color: [0, 157, 165] },
    { name: 'MAHOGANY', color: [142, 89, 90] },
    { name: 'MARINERED', color: [210, 81, 94] },
    { name: 'MAROON', color: [158, 76, 110] },
    { name: 'MEDIUMBLUE', color: [50, 85, 164] },
    { name: 'MELON', color: [255, 174, 59] },
    { name: 'METALLICGOLD', color: [172, 147, 110] },
    { name: 'MIDNIGHT', color: [67, 80, 96] },
    { name: 'MINT', color: [130, 216, 213] },
    { name: 'MIST', color: [213, 228, 192] },
    { name: 'MOSS', color: [104, 114, 77] },
    { name: 'ORANGE', color: [255, 108, 47] },
    { name: 'ORCHID', color: [170, 96, 191] },
    { name: 'PAPRIKA', color: [238, 127, 75] },
    { name: 'PINE', color: [35, 126, 116] },
    { name: 'PLUM', color: [132, 89, 145] },
    { name: 'PUMPKIN', color: [255, 111, 76] },
    { name: 'PURPLE', color: [118, 91, 167] },
    { name: 'RAISIN', color: [119, 93, 122] },
    { name: 'RASPBERRYRED', color: [209, 81, 122] },
    { name: 'RED', color: [255, 102, 94] },
    { name: 'RISOFEDERALBLUE', color: [61, 85, 136] },
    { name: 'SCARLET', color: [246, 80, 88] },
    { name: 'SEABLUE', color: [0, 116, 162] },
    { name: 'SEAFOAM', color: [98, 194, 177] },
    { name: 'SKYBLUE', color: [73, 130, 207] },
    { name: 'SLATE', color: [94, 105, 94] },
    { name: 'SMOKYTEAL', color: [95, 130, 137] },
    { name: 'SPRUCE', color: [74, 99, 93] },
    { name: 'STEEL', color: [55, 94, 119] },
    { name: 'SUNFLOWER', color: [255, 181, 17] },
    { name: 'TEAL', color: [0, 131, 138] },
    { name: 'TOMATO', color: [210, 81, 94] },
    { name: 'TURQUOISE', color: [0, 170, 147] },
    { name: 'VIOLET', color: [157, 122, 210] },
    { name: 'WHITE', color: [255, 255, 255] },
    { name: 'WINE', color: [145, 78, 114] },
    { name: 'YELLOW', color: [255, 232, 0] },
    { name: 'BISQUE', color: [242, 205, 207] },
    { name: 'CLEARMEDIUM', color: [242, 242, 242] }
  ]

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
    img = p.loadImage('images/mona.png')
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
    processImage(img)
  }

  const setupCombinedBuffer = ({ width, height }) => {
    combinedLayer && combinedLayer.remove()
    combinedLayer = p.createGraphics(width, height)
    combinedLayer.elt.id = `combined.${p.frameCount}`
    combinedLayer.pixelDensity(density)
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

      if (modal.showUI) displayUI()
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
    if (p.key === 'i') {
      invert = !invert
      backgroundColor = invert ? p.color(0, 0, 0) : p.color(255, 255, 255)
      bwCachedImage = null
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

  const getContrastingImage = (img, threshold, color1, color2) => {
    const newImg = p.createImage(img.width, img.height)
    newImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)

    newImg.loadPixels()
    for (let y = 0; y < img.height * density; y++) {
      for (let x = 0; x < img.width * density; x++) {
        const index = (x + y * img.width * density) * 4
        const r = newImg.pixels[index]
        const g = newImg.pixels[index + 1]
        const b = newImg.pixels[index + 2]
        const avg = (r + g + b) / 3
        const color = avg > threshold ? color1 : color2

        newImg.pixels[index] = color.levels[0]
        newImg.pixels[index + 1] = color.levels[1]
        newImg.pixels[index + 2] = color.levels[2]
        newImg.pixels[index + 3] = 255 // full opacity
      }
    }
    newImg.updatePixels()
    bwCachedImage = newImg
    lastThreshold = threshold
    return newImg
  }

  const buildCombinedLayer = img => {
    const scaleRatio = calculateScaleRatio(img, outputSize)
    const scaledWidth = Math.round(img.width * scaleRatio)
    const scaledHeight = Math.round(img.height * scaleRatio)

    // const colorPairs = [
    //   [
    //     [255, 0, 0],
    //     [0, 255, 0]
    //   ], // Red and Green
    //   [
    //     [0, 0, 255],
    //     [255, 255, 0]
    //   ], // Blue and Yellow
    //   [
    //     [255, 165, 0],
    //     [0, 255, 255]
    //   ], // Orange and Cyan
    //   [
    //     [128, 0, 128],
    //     [255, 192, 203]
    //   ] // Purple and Pink
    // ]
    const colorPairs = getColorPairs()
    const images = colorPairs.map(pair =>
      getContrastingImage(img, threshold, p.color(pair[0]), p.color(pair[1]))
    )

    displayLayer.background(255)
    const halfWidth = displayLayer.width / 2
    const halfHeight = displayLayer.height / 2

    displayLayer.image(
      images[0],
      halfWidth / 2,
      halfHeight / 2,
      halfWidth,
      halfHeight
    )
    displayLayer.image(
      images[1],
      (3 * halfWidth) / 2,
      halfHeight / 2,
      halfWidth,
      halfHeight
    )
    displayLayer.image(
      images[2],
      halfWidth / 2,
      (3 * halfHeight) / 2,
      halfWidth,
      halfHeight
    )
    displayLayer.image(
      images[3],
      (3 * halfWidth) / 2,
      (3 * halfHeight) / 2,
      halfWidth,
      halfHeight
    )

    dirty = true
  }

  const calculateScaleRatio = function (img, size = outputSize) {
    // canvas size should be a square, normally
    // if not, we can reconsider everything
    switch (scaleMethod) {
      case scaleMethods.fitToWidth:
        return size / img.width

      case scaleMethods.fitToHeight:
        return size / img.height

      case scaleMethods.fitToCanvas:
      default:
        return size / Math.max(img.width, img.height)
    }
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
    if (!modal.refit) {
      bwCachedImage = null // this is not required for refit
    }
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

  const cropWhitespace = buffer => {
    buffer.loadPixels()
    let top = 0
    let bottom = buffer.height - 1
    let left = 0
    let right = buffer.width - 1

    // Find top boundary
    outer: for (let y = 0; y < buffer.height * density; y++) {
      for (let x = 0; x < buffer.width * density; x++) {
        const index = (x + y * buffer.width * density) * 4
        if (
          buffer.pixels[index] !== p.red(backgroundColor) ||
          buffer.pixels[index + 1] !== p.green(backgroundColor) ||
          buffer.pixels[index + 2] !== p.blue(backgroundColor)
        ) {
          top = y
          break outer
        }
      }
    }

    // Find bottom boundary
    outer: for (let y = buffer.height * density - 1; y >= 0; y--) {
      for (let x = 0; x < buffer.width * density; x++) {
        const index = (x + y * buffer.width * density) * 4
        if (
          buffer.pixels[index] !== p.red(backgroundColor) ||
          buffer.pixels[index + 1] !== p.green(backgroundColor) ||
          buffer.pixels[index + 2] !== p.blue(backgroundColor)
        ) {
          bottom = y
          break outer
        }
      }
    }

    // Find left boundary
    outer: for (let x = 0; x < buffer.width * density; x++) {
      for (let y = 0; y < buffer.height * density; y++) {
        const index = (x + y * buffer.width * density) * 4
        if (
          buffer.pixels[index] !== p.red(backgroundColor) ||
          buffer.pixels[index + 1] !== p.green(backgroundColor) ||
          buffer.pixels[index + 2] !== p.blue(backgroundColor)
        ) {
          left = x
          break outer
        }
      }
    }

    // Find right boundary
    outer: for (let x = buffer.width * density - 1; x >= 0; x--) {
      for (let y = 0; y < buffer.height * density; y++) {
        const index = (x + y * buffer.width * density) * 4
        if (
          buffer.pixels[index] !== p.red(backgroundColor) ||
          buffer.pixels[index + 1] !== p.green(backgroundColor) ||
          buffer.pixels[index + 2] !== p.blue(backgroundColor)
        ) {
          right = x
          break outer
        }
      }
    }

    const croppedWidth = right - left + 1
    const croppedHeight = bottom - top + 1
    const croppedImg = p.createImage(croppedWidth, croppedHeight)
    croppedImg.copy(
      buffer,
      left,
      top,
      croppedWidth,
      croppedHeight,
      0,
      0,
      croppedWidth,
      croppedHeight
    )
    return croppedImg
  }

  const displayUI = () => {
    const offsetAmount =
      scaleMethod === scaleMethods.fitToWidth
        ? offset.vertical
        : offset.horizontal
    const uiText = [
      `threshold: ${threshold}`,
      `zoom: ${(sizeRatio * 100).toFixed(0)}%`,
      `offset: ${offsetAmount}`,
      `fit method: ${scaleMethod}`,
      `invert: ${invert ? 'inverted' : 'normal'}`
    ].filter(Boolean)

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
