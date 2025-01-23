/* global p5 */

// shaders converted from https://github.com/libretro/glsl-shaders/blob/master/misc/shaders/cmyk-halftone-dot.glsl

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

const sketch = p => {
  let shaderProgram
  let img
  let targetLayer
  let frequencySlider
  let frequency = 3.0
  let angleSlider
  let angle = 0.0
  let dirty = true
  let autoRotate = false
  let autoFrequency = false
  let autoFreqDirection = -1
  let autoRotateDirection = -1
  let pause = false
  let showCrosshairs = false
  let gridSize = 1
  let useCMYK = true
  let autoSave = false
  let autoSaveCount = 0

  p.preload = () => {
    shaderProgram = p.loadShader('shader.vert', 'shader.frag')
    img = p.loadImage('images/multi-color-20250119.194439.824.png')
    // img = p.loadImage('images/mona-lisa-6195291.png')
    // img = p.loadImage('images/PXL_20240902_192356810.jpg')
  }

  const resizeCanvasToImage = () => {
    const defaultMaxSize = 3000

    // large images throw error:
    // .WebGL-0x1040cfc4700] GL_INVALID_VALUE: Negative offset.
    // fails with image @ size 3468x2611
    // fails with image @ size 3264x2458
    // [.WebGL-0x10417e17100] GL_OUT_OF_MEMORY: Error: 0x00000505, in
    // ../../third_party/angle/src/libANGLE/renderer/gl/RenderbufferGL.cpp,
    // setStorageMultisample:83. Internal error: 0x00000505: Unexpected driver error.

    // The below usually solves for the above issues
    // BUT NOT ALWAYS
    if (img.width > defaultMaxSize || img.height > defaultMaxSize) {
      let newWidth = img.width
      let newHeight = img.height

      if (newWidth > newHeight) {
        newHeight = (defaultMaxSize * newHeight) / newWidth
        newWidth = defaultMaxSize
      } else {
        newWidth = (defaultMaxSize * newWidth) / newHeight
        newHeight = defaultMaxSize
      }

      const tempG = p.createGraphics(newWidth, newHeight)
      tempG.image(img, 0, 0, newWidth, newHeight)
      img = tempG
    }

    if (!targetLayer) {
      targetLayer = p.createGraphics(img.width, img.height, p.WEBGL)
      targetLayer.shader(shaderProgram)
    } else {
      targetLayer.resizeCanvas(img.width, img.height)
    }

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
    p.resizeCanvas(w, h)

    // Update shader resolution uniform
    shaderProgram.setUniform('iResolution', [img.width, img.height])
    dirty = true
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight).drop(handleFile)

    resizeCanvasToImage()

    // p.textFont('HELVETICA')

    frequencySlider = p.createSlider(1, 300, frequency)
    frequencySlider.position(10, 10)
    frequencySlider.attribute('title', 'frequency')
    frequencySlider.input(() => {
      frequency = frequencySlider.value()
      dirty = true
    })

    angleSlider = p.createSlider(0, 360, angle)
    angleSlider.position(10, 30)
    angleSlider.attribute('title', 'angle')
    angleSlider.input(() => {
      angle = angleSlider.value()
      dirty = true
    })

    // Create radio button group
    const radioGroup = p.createRadio()
    radioGroup.position(10, 50)
    radioGroup.option('CMYK', 'CMYK')
    radioGroup.option('RGB', 'RGB')
    radioGroup.selected('CMYK')
    radioGroup.style('width', '200px')
    radioGroup.changed(() => {
      useCMYK = radioGroup.value() === 'CMYK'
      dirty = true
    })
  }

  // more complicated values for autoRotate and autoFrequency

  p.draw = () => {
    if (!pause) {
      if (autoSave) {
        if (angle >= 360) {
          autoSave = false // Stop when we reach 360
          dirty = true
          p.frameRate(60)
          return
        }

        targetLayer.save(generateFilename(`mona-cmyk_${String(autoSaveCount).padStart(4, '0')}`))
        angle += 5 // Increment by 5 degrees
        angleSlider.value(angle)
        autoSaveCount++
        dirty = true
      } else if (autoRotate) {
        // atm, I prefer angle t contiously spin
        // if (angle <= 0 || angle >= 360) {
        //   autoRotateDirection *= -1
        // }
        angle = (angle + 1) % 360
        angleSlider.value(angle)
        dirty = true
      }
      if (autoFrequency) {
        if (frequency <= 1 || frequency >= 150) {
          autoFreqDirection *= -1
        }
        frequency = frequency + autoFreqDirection
        frequencySlider.value(frequency)
        dirty = true
      }
    }

    if (!dirty) return

    // Draw to the target layer
    targetLayer.shader(shaderProgram)
    shaderProgram.setUniform('iChannel0', img)
    shaderProgram.setUniform('frequency', Math.ceil(frequency / 2))
    shaderProgram.setUniform('angle', angle)
    shaderProgram.setUniform('cmyk_flag', useCMYK)
    targetLayer.rect(0, 0, targetLayer.width, targetLayer.height)

    p.clear()
    p.image(targetLayer, 0, 0, p.width, p.height)
    if (showCrosshairs) {
      displayGrid(p, gridSize)
    }
    displayUI()
    dirty = false
  }

  p.keyPressed = () => {
    if (p.key === 'c') {
      showCrosshairs = !showCrosshairs
      dirty = true
    } else if (showCrosshairs && p.key === ']') {
      gridSize = Math.min(10, gridSize + 1) // Limit to 10 for example
      dirty = true
    } else if (showCrosshairs && p.key === '[') {
      gridSize = Math.max(1, gridSize - 1)
      dirty = true
    } else if ((!autoRotate || pause) && (p.key === 'r' || p.key === 'R')) {
      const direction = p.key === 'r' ? 1 : -1
      angle = (angle + direction) % 360
      angleSlider.value(angle)
      dirty = true
    } else if (!(autoFrequency || pause) && (p.key === 'f' || p.key === 'F')) {
      const direction = p.key === 'f' ? 1 : -1
      frequency = ((frequency - 1 + direction + 300) % 300) + 1
      frequencySlider.value(frequency)
      dirty = true
    } else if (p.key === 'a') {
      autoRotate = !autoRotate
      dirty = true
    } else if (p.key === 'A') {
      autoFrequency = !autoFrequency
      dirty = true
    } else if (p.key === 'p' || p.key === ' ') {
      pause = !pause
    } else if (p.key === 'Q') {
      // Start autosave sequence
      autoSave = true
      p.frameRate(5)
      angle = 1 // Reset to start
      angleSlider.value(angle)
      autoSaveCount = 0
      autoRotate = false // Disable auto-rotate if it's on
      dirty = true
    } else if (p.key === 'S') {
      targetLayer.save(generateFilename('mona-cmyk'))
    }
  }

  const displayGrid = (p, gridSize = 1) => {
    // Ensure gridSize is at least 1
    gridSize = Math.max(1, Math.floor(gridSize))

    p.stroke(0)
    p.strokeWeight(1)

    // Draw vertical lines
    const xStep = p.width / (gridSize + 1)
    for (let i = 1; i <= gridSize; i++) {
      const x = xStep * i
      p.line(x, 0, x, p.height)
    }

    // Draw horizontal lines
    const yStep = p.height / (gridSize + 1)
    for (let i = 1; i <= gridSize; i++) {
      const y = yStep * i
      p.line(0, y, p.width, y)
    }
  }

  function handleFile (file) {
    if (file.type === 'image') {
      img = p.loadImage(file.data, () => {
        resizeCanvasToImage()
        console.log('Image loaded successfully')
      })
    } else {
      console.log('Not an image file!')
    }
  }

  const displayUI = () => {
    const uiText = [
      `frequency: ${Math.ceil(frequency / 2)}`,
      `angle: ${angle.toFixed(1)}°`,
      `image: ${img.width}x${img.height}`,
      `display: ${p.width}x${p.height}`,
      autoSave ? 'AUTO-SAVE ON' : '',
      autoRotate ? 'auto-rotate ON' : '',
      autoFrequency ? 'auto-frequency ON' : '',
      pause ? 'PAUSED' : ''
    ].filter(Boolean) // removes empty strings

    const boxWidth = 200
    const boxHeight = uiText.length * 20 + 20

    p.push()

    p.fill(0, 150)
    p.noStroke()
    p.rect(5, p.height - boxHeight - 5, boxWidth, boxHeight, 10)

    p.fill('white')
    p.textSize(16)
    p.textAlign(p.LEFT, p.TOP)
    uiText.forEach((text, index) => {
      p.text(text, 10, p.height - boxHeight + 5 + index * 20)
    })

    p.pop()
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
