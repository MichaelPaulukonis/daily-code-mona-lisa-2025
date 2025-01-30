/* global p5 */

// from https://editor.p5js.org/ronikaufman/sketches/6u4GiF24N

const sketch = function (p) {
  let workingImg
  let originalImg
  let monochrome = false
  let resizeSlider
  let iterationsSlider
  let blurSlider
  let blurAmount = 0.5
  let customBlur = false
  let processingSize = 80
  let boxHeight
  let iterations = 100

  function setupUI () {
    // Create UI container
    const uiContainer = p.createDiv('')
    uiContainer.style('position', 'absolute')
    uiContainer.style('right', '10px')
    uiContainer.style('top', '10px')
    uiContainer.style('background', 'rgba(255,255,255,0.8)')
    uiContainer.style('padding', '10px')
    uiContainer.style('border-radius', '5px')

    p.createDiv('color or B&W:').parent(uiContainer)
    const radioGroup = p.createRadio()
    radioGroup.option('color', 'Color')
    radioGroup.option('bw', 'B&W')
    radioGroup.selected('color')
    radioGroup.parent(uiContainer)
    radioGroup.changed(() => {
      monochrome = radioGroup.value() === 'bw'
      showDisplayPanel()
    })

    p.createDiv('Resize:').parent(uiContainer)
    resizeSlider = p.createSlider(20, 200, processingSize, 10)
    resizeSlider.parent(uiContainer)
    resizeSlider.input(() => {
      processingSize = resizeSlider.value()
      showDisplayPanel()
    })

    p.createDiv('Custom blur:').parent(uiContainer)
    const blurRadioGroup = p.createRadio()
    blurRadioGroup.option('on', 'On')
    blurRadioGroup.option('off', 'Off')
    blurRadioGroup.selected('off')
    blurRadioGroup.parent(uiContainer)
    blurRadioGroup.changed(() => {
      customBlur = blurRadioGroup.value() === 'on'
      showDisplayPanel()
    })

    p.createDiv('blur amount:').parent(uiContainer)
    blurSlider = p.createSlider(0.1, 4, blurAmount, 0.1)
    blurSlider.parent(uiContainer)
    blurSlider.input(() => {
      blurAmount = blurSlider.value()
      showDisplayPanel()
    })

    p.createDiv('Iterations:').parent(uiContainer)
    iterationsSlider = p.createSlider(5, 200, iterations, 5)
    iterationsSlider.parent(uiContainer)
    iterationsSlider.input(() => {
      iterations = iterationsSlider.value()
      showDisplayPanel()
    })

    p.createDiv('Generate:').parent(uiContainer)
    const generateButton = p.createButton('Generate')
    generateButton.parent(uiContainer)
    generateButton.mousePressed(generate)

    const displayPanel = p.createDiv('')
    displayPanel.id('displayPanel')
    displayPanel.style('background-color', 'rgba(0, 0, 0, 0.6)')
    displayPanel.style('border-radius', '10px')
    displayPanel.style('padding', '10px')
    displayPanel.style('color', 'white')
    displayPanel.style('font-size', '16px')
  }

  p.preload = function () {
    originalImg = p.loadImage('images/mona.png')
  }

  p.setup = function () {
    p.createCanvas(400, 400)
    originalImg.resize(p.width, p.height)
    workingImg = p.createImage(p.width, p.height)
    p.pixelDensity(1)
    p.noLoop()
    setupUI()
    generate()
  }

  p.keyPressed = function () {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-turing'))
    }
  }

  function generate () {
    workingImg.resize(processingSize, processingSize)
    workingImg.copy(originalImg, 0, 0, p.width, p.height, 0, 0, processingSize, processingSize)
    if (monochrome) {
      workingImg.filter(p.GRAY)
    }
    for (let i = 0; i < iterations; i++) {
      sharpen(workingImg, p)
      if (customBlur) {
        workingImg.filter(p.BLUR, blurAmount)
      } else {
        workingImg.filter(p.BLUR)
      }
    }

    workingImg.resize(p.width, p.height)
    workingImg.filter(p.POSTERIZE, 2)
    p.image(workingImg, 0, 0, p.width, p.height)
    showDisplayPanel()
  }

  function sharpen (img) {
    img.loadPixels()
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const result = convolution(x, y, matrix, matrixsize, img)
        const loc = (x + y * img.width) * 4
        img.pixels[loc] = result[0]
        img.pixels[loc + 1] = result[1]
        img.pixels[loc + 2] = result[2]
        img.pixels[loc + 3] = 255
      }
    }
    img.updatePixels()
  }

  function convolution (x, y, matrix, matrixsize, img) {
    let rtotal = 0.0
    let gtotal = 0.0
    let btotal = 0.0
    const offset = Math.floor(matrixsize / 2)

    for (let i = 0; i < matrixsize; i++) {
      for (let j = 0; j < matrixsize; j++) {
        const xloc = x + i - offset
        const yloc = y + j - offset
        let loc = (xloc + img.width * yloc) * 4

        loc = p.constrain(loc, 0, img.pixels.length - 1)
        rtotal += img.pixels[loc] * matrix[i][j]
        gtotal += img.pixels[loc + 1] * matrix[i][j]
        btotal += img.pixels[loc + 2] * matrix[i][j]
      }
    }

    rtotal = p.constrain(rtotal, 0, 255)
    gtotal = p.constrain(gtotal, 0, 255)
    btotal = p.constrain(btotal, 0, 255)

    return [rtotal, gtotal, btotal]
  }

  const showDisplayPanel = () => {
    const uiText = [
      `iterations: ${iterations}`,
      customBlur ? `blur: ${blurAmount}` : '',
      `resize: ${processingSize}`,
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

const matrix = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1]
]
const matrixsize = 3

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

new p5(sketch) // eslint-disable-line no-new, new-cap
