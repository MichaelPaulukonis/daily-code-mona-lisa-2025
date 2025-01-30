/* global p5 */

const sketch = function (p) {
  let img

  p.preload = function () {
    img = p.loadImage('images/mona.png')
  }

  p.setup = function () {
    p.createCanvas(400, 400)
    img.resize(p.width, p.height)
    p.pixelDensity(1)
    p.noLoop()
  }

  p.draw = function () {
    img.resize(80, 80)
    for (let i = 0; i < 100; i++) {
      sharpen(img, p)
      img.filter(p.BLUR)
    }

    img.resize(p.width, p.height)
    img.filter(p.POSTERIZE, 2)
    p.image(img, 0, 0, p.width, p.height)
  }

  // Helper functions need to be inside the sketch scope
  function sharpen (img, p) {
    img.loadPixels()
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const result = convolution(x, y, matrix, matrixsize, img, p)
        const loc = (x + y * img.width) * 4
        img.pixels[loc] = result[0]
        img.pixels[loc + 1] = result[1]
        img.pixels[loc + 2] = result[2]
        img.pixels[loc + 3] = 255
      }
    }
    img.updatePixels()
  }

  function convolution (x, y, matrix, matrixsize, img, p) {
    let rtotal = 0.0
    let gtotal = 0.0
    let btotal = 0.0
    const offset = p.floor(matrixsize / 2)

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
}

const matrix = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1]
]
const matrixsize = 3

new p5(sketch) // eslint-disable-line no-new, new-cap
