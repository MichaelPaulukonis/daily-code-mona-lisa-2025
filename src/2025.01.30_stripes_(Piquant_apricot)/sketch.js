/* global p5 */

const sketch = p => {
  // the shader variable
  let camShader

  // the camera variable
  let cam
  let horizontal = false

  p.preload = () => {
    // load the shader
    camShader = p.loadShader('effect.vert', 'effect.frag')
  }

  p.setup = () => {
    // shaders require WEBGL mode to work
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.noStroke()

    // initialize the webcam at the window size
    cam = p.createCapture(p.VIDEO)
    cam.size(p.windowWidth, p.windowHeight)

    // hide the html element that createCapture adds to the screen
    cam.hide()
  }

  p.draw = () => {
    // shader() sets the active shader with our shader
    p.shader(camShader)

    // Calculate normalized position (0.0 to 1.0) based on height
    const linePosition = horizontal
      ? (p.frameCount % p.height) / p.height
      : (p.frameCount % p.width) / p.width

    // lets just send the cam to our shader as a uniform
    camShader.setUniform('tex0', cam)
    camShader.setUniform('line', linePosition)
    camShader.setUniform('horizontal', horizontal)

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height)
  }

  p.keyPressed = function () {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-stripes'))
    } else if (p.key === ' ') {
      horizontal = !horizontal
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
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

function generateFilename (prefix) {
  return `${prefix || 'mona'}-${timestamp()}.png`
}

new p5(sketch) // eslint-disable-line no-new, new-cap
