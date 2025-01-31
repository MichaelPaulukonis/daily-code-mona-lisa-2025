/* global p5 */

// adapted from https://github.com/aferriss/p5jsShaderExamples.git
// 4_image-effects/4-5_stripes-from-image

const sketch = p => {
  let imgShader
  let img
  let horizontal = false

  p.preload = () => {
    imgShader = p.loadShader('effect.vert', 'effect.frag')
    img = p.loadImage('images/mona-lisa-768x1000.png')
  }

  p.setup = () => {
    p.createCanvas(img.width, img.height, p.WEBGL)
    resizeCanvasToImage()
    p.noStroke()
  }

  p.draw = () => {
    p.shader(imgShader)

    // Calculate normalized position (0.0 to 1.0) based on height
    const linePosition = horizontal
      ? (p.frameCount % p.height) / p.height
      : (p.frameCount % p.width) / p.width

    // lets just send the image to our shader as a uniform
    imgShader.setUniform('tex0', img)
    imgShader.setUniform('line', linePosition)
    imgShader.setUniform('horizontal', horizontal)

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height)
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
    // shaderProgram.setUniform('u_resolution', [img.width, img.height])
  }
  
  p.keyPressed = function () {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-stripes'))
    } else if (p.key === ' ') {
      horizontal = !horizontal
    }
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
