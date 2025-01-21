/* global p5 */

// shaders converted from https://github.com/libretro/glsl-shaders/blob/master/misc/shaders/cmyk-halftone-dot.glsl

const sketch = p => {
  let shaderProgram
  let img
  let dirty

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
    shaderProgram.setUniform('u_resolution', [img.width, img.height])
    dirty = true
  }

  p.preload = () => {
    // Load shader file
    shaderProgram = p.loadShader('shader.vert', 'shader.frag')
    img = p.loadImage('images/mona-lisa-6195291.png')
  }

  p.setup = () => {
    p.createCanvas(800, 800, p.WEBGL)
    p.noStroke()
    p.shader(shaderProgram)
    resizeCanvasToImage()

    shaderProgram.setUniform('iResolution', [img.width, img.height])
  }

  p.draw = () => {
    shaderProgram.setUniform('iChannel0', img)
    p.rect(0, 0, p.width, p.height)
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
