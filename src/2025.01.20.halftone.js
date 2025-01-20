/* global p5 */

// shaders converted from https://github.com/libretro/glsl-shaders/blob/master/misc/shaders/cmyk-halftone-dot.glsl

const sketch = p => {
  let shaderProgram
  let img
  let frequencySlider
  let frequency = 100.0
  let angleSlider
  let angle = 40.5

  p.preload = () => {
    shaderProgram = p.loadShader('shader.vert', 'shader.frag')
    img = p.loadImage('images/mona.png')
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.shader(shaderProgram)
    shaderProgram.setUniform('u_resolution', [img.width, img.height])

    frequencySlider = p.createSlider(1, 300, frequency)
    frequencySlider.position(10, 10)
    frequencySlider.input(() => {
      frequency = frequencySlider.value()
    })

    angleSlider = p.createSlider(0, 360, angle)
    angleSlider.position(10, 30)
    angleSlider.input(() => {
      angle = angleSlider.value()
    })
  }

  p.draw = () => {
    shaderProgram.setUniform('u_texture', img)
    shaderProgram.setUniform('frequency', frequency)
    shaderProgram.setUniform('angle', p.radians(angle))
    p.rect(0, 0, p.width, p.height)
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
