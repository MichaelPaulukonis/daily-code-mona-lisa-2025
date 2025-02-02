/* global p5 */

// with elements from https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-19_slitscan
// and https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-20_mosaic

const sketch = p => {
  let bounceLayer
  let mosaicShader
  let slitScan
  let img
  let imgX, imgY
  let noiseOffsetX = 0
  let noiseOffsetY = 1000

  const pastFrames = []
  const numFrames = 128
  let step, windowStep

  let pfWidth = 512
  let pfHeight = 512

  p.preload = () => {
    mosaicShader = p.loadShader('effect.vert', 'effect.frag')
    img = p.loadImage('images/mona_square.jpeg')
  }

  p.setup = () => {
    const maxDim = 600
    let w = img.width
    let h = img.height

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = (maxDim * h) / w
        w = maxDim
      } else {
        w = (maxDim * w) / h
        h = maxDim
      }
    }

    pfWidth = w * 0.5
    pfHeight = h * 0.5

    p.createCanvas(w, h, p.WEBGL)
    p.noStroke()
    p.shader(mosaicShader)
    slitScan = p.createGraphics(w, h)
    bounceLayer = p.createGraphics(w, h)

    imgX = (p.width - img.width * 1.1) / 2
    imgY = (p.height - img.height * 1.1) / 2

    step = pfHeight / numFrames
    windowStep = p.height / numFrames

    for (let i = 0; i < numFrames; i++) {
      const pg = p.createGraphics(pfWidth, pfHeight)
      pastFrames.push(pg)
    }
  }

  const bounce = layer => {
    layer.background(255)

    const noiseX = p.noise(noiseOffsetX) * 2 - 1
    const noiseY = p.noise(noiseOffsetY) * 2 - 1

    imgX += noiseX
    imgY += noiseY

    imgX = p.constrain(imgX, -img.width * 0.1, 0)
    imgY = p.constrain(imgY, -img.height * 0.1, 0)

    layer.image(img, imgX, imgY, img.width * 1.1, img.height * 1.1)

    noiseOffsetX += 0.04
    noiseOffsetY += 0.07
  }

  p.draw = () => {
    bounce(bounceLayer)
    // draw the current camera frame in the first element of the array
    pastFrames[0].image(bounceLayer, 0, 0, pfWidth, pfHeight)
    // const offsetX = (pfWidth - bounceLayer.width) / 2
    // const offsetY = (pfHeight - bounceLayer.height) / 2
    // pastFrames[0].image(
    //   bounceLayer,
    //   offsetX,
    //   offsetY,
    //   pfWidth, pfHeight
    // )
    // draw our slit scan to the screen
    // we loop through all the frames and draw a slice at each step along the y axis
    for (let i = 0; i < pastFrames.length; i++) {
      slitScan.image(
        pastFrames[i],
        0,
        windowStep * i,
        p.width,
        windowStep,
        0,
        step * i,
        pfWidth,
        step
      )
    }

    // move every element forward by 1, except the last element
    // this is important to keep the frames cycling
    // otherwise we'd just see one frame updating at a time
    for (let i = 0; i < pastFrames.length - 1; i++) {
      pastFrames[i] = pastFrames[i + 1]
    }

    // move the last element to the beginning
    pastFrames[pastFrames.length - 1] = pastFrames[0]

    mosaicShader.setUniform('tex0', slitScan)
    mosaicShader.setUniform('resolution', [p.width, p.height])

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height)
  }

  p.keyPressed = function () {
    if (p.key === 'S') {
      p.saveCanvas(generateFilename('mona-slit-mosaic'))
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

function generateFilename (prefix, counter = null) {
  return `${prefix || 'mona'}-${timestamp()}.png`
}

new p5(sketch) // eslint-disable-line no-new, new-cap
