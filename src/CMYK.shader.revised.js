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
  let frequencySlider
  let frequency = 150.0
  let angleSlider
  let angle = 0.0
  let dirty = true
  let autoRotate = false
  let autoFrequency = false
  let autoFreqDirection = -1
  let autoRotateDirection = -1
  let pause = false

  p.preload = () => {
    shaderProgram = p.loadShader('shader.vert', 'shader.frag')
    img = p.loadImage('images/mona-lisa-921x1200.png')
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

    p.resizeCanvas(w, h)

    // Update shader resolution uniform
    shaderProgram.setUniform('iResolution', [img.width, img.height])
    dirty = true
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL).drop(handleFile)
    p.shader(shaderProgram)
    resizeCanvasToImage()

    frequencySlider = p.createSlider(10, 300, frequency)
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
  }

  p.draw = () => {
    if (!pause) {
      if (autoFrequency) {
        if (frequency <= 10 || frequency >= 300) {
          autoFreqDirection *= -1
        }
        frequency = frequency + autoFreqDirection
        frequencySlider.value(frequency)
        dirty = true
      }
      if (autoRotate) {
        if (angle <= 0 || angle >= 360) {
          autoRotateDirection *= -1
        }
        angle = angle + autoRotateDirection
        angleSlider.value(angle)
        dirty = true
      }
    }

    if (!dirty) return

    shaderProgram.setUniform('iChannel0', img)
    shaderProgram.setUniform('frequency', frequency)
    shaderProgram.setUniform('angle', angle)
    p.rect(0, 0, p.width, p.height)
    dirty = false
  }

  p.keyPressed = () => {
    if (p.key === 'r' || p.key === 'R') {
      const direction = p.key === 'r' ? 1 : -1
      angle = (angle + direction) % 360
      angleSlider.value(angle)
      dirty = true
    } else if (p.key === 'f' || p.key === 'F') {
      const direction = p.key === 'f' ? 1 : -1
      frequency = (frequency + direction) % 300
      frequencySlider.value(frequency)
      dirty = true
    } else if (p.key === 'a') {
      autoRotate = !autoRotate
    } else if (p.key === 'A') {
      autoFrequency = !autoFrequency
    } else if (p.key === 'p' || p.key === 'P') {
      pause = !pause
    }
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-cmyk'))
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
}

new p5(sketch) // eslint-disable-line no-new, new-cap
