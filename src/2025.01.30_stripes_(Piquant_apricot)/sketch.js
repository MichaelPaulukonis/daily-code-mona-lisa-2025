/* global p5 */

// adapted from https://github.com/aferriss/p5jsShaderExamples.git
// 4_image-effects/4-5_stripes-from-image

const sketch = p => {
  let imgShader
  let img
  let horizontal = false
  let autoSave = false
  let autoSaveCount = 0
  let totalFrames = 0
  let frameOffset = 0
  let boxHeight = 0

  p.preload = () => {
    imgShader = p.loadShader('effect.vert', 'effect.frag')
    img = p.loadImage('images/mona-lisa-768x1000.png')
  }

  p.setup = () => {
    p.createCanvas(img.width, img.height, p.WEBGL)
    resizeCanvasToImage()
    p.noStroke()

    const displayPanel = p.createDiv('')
    displayPanel.id('displayPanel')
    displayPanel.style('background-color', 'rgba(0, 0, 0, 0.6)')
    displayPanel.style('border-radius', '10px')
    displayPanel.style('padding', '10px')
    displayPanel.style('color', 'white')
    displayPanel.style('font-size', '16px')
  }

  p.draw = () => {
    p.shader(imgShader)

    // Calculate normalized position (0.0 to 1.0) based on height
    const linePosition = horizontal
      ? ((p.frameCount - frameOffset) % p.height) / p.height
      : ((p.frameCount - frameOffset) % p.width) / p.width

    // lets just send the image to our shader as a uniform
    imgShader.setUniform('tex0', img)
    imgShader.setUniform('line', linePosition)
    imgShader.setUniform('horizontal', horizontal)

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height)

    if (autoSave && autoSaveCount < totalFrames) {
      p.saveCanvas(
        generateFilename(
          `mona-stripes_${String(autoSaveCount).padStart(4, '0')}`
        )
      )
      autoSaveCount++
    } else {
      autoSave = false
      p.frameRate(60)
    }
    showDisplayPanel()
  }

  const resizeCanvasToImage = () => {
    // Calculate dimensions maintaining aspect ratio
    let w = img.width
    let h = img.height
    const maxDim = 600

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = (maxDim * h) / w
        w = maxDim
      } else {
        w = (maxDim * w) / h
        h = maxDim
      }
    }

    p.resizeCanvas(Math.floor(w), Math.floor(h))
  }

  p.keyPressed = function () {
    if (p.key === 'A') {
      autoSave = !autoSave
      if (autoSave) {
        p.frameRate(5)
        totalFrames = Math.floor(horizontal ? p.width : p.height)
        autoSaveCount = 0
        frameOffset = p.frameCount
      } else {
        p.frameRate(60)
      }
    } else if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-stripes'))
    } else if (p.key === ' ' && !autoSave) {
      horizontal = !horizontal
    }
  }

  const showDisplayPanel = () => {
    const uiText = [
      `Autosave: ${autoSave}`,
      autoSave ? `Frame: ${autoSaveCount} / ${totalFrames}` : '',
      horizontal ? 'horizontal' : 'vertical',
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

function generateFilename (prefix, counter = null) {
  return `${prefix || 'mona'}-${timestamp()}.png`
}

new p5(sketch) // eslint-disable-line no-new, new-cap
