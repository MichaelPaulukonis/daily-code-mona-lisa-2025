// originally based on https://github.com/ronikaufman/poetical_computer_vision/tree/main/days21-31/day31
// converted to p5js by Amazon Q
// and then further abused and manipulated

const sketch = p => {
  let img

  p.preload = function () {
    img = p.loadImage('images/mona.png')
  }

  p.setup = function () {
    p.createCanvas(512, 512)
    img.resize(512, 512)
    p.noLoop()
  }

  p.draw = function () {
    for (let i = 0; i < 256; i++) {
      img = sharpen(img)
      img.filter(p.BLUR)
    }
    img = sharpen(img)
    p.image(img, 0, 0)

    p.save('result31.jpg')
  }

  function sharpen (img) {
    let res = p.createImage(img.width, img.height)

    // Load pixels for both images
    img.loadPixels()
    res.loadPixels()

    const w = img.width
    const h = img.height

    // Helper function to get brightness of a pixel at (x,y)
    function getBrightness (x, y) {
      const idx = (y * w + x) * 4
      const r = img.pixels[idx]
      const g = img.pixels[idx + 1]
      const b = img.pixels[idx + 2]
      return 0.299 * r + 0.587 * g + 0.114 * b
    }

    // Helper function to set a pixel at (x,y)
    function setPixel (x, y, val) {
      const idx = (y * w + x) * 4
      res.pixels[idx] = val
      res.pixels[idx + 1] = val
      res.pixels[idx + 2] = val
      res.pixels[idx + 3] = 255
    }

    for (let x = 1; x < w - 1; x++) {
      for (let y = 1; y < h - 1; y++) {
        const l = getBrightness(x - 1, y) // left
        const t = getBrightness(x, y - 1) // top
        const b = getBrightness(x, y + 1) // bottom
        const r = getBrightness(x + 1, y) // right
        const c = getBrightness(x, y) // center

        // Calculate sharpened value and clamp between 0 and 255
        const val = p.constrain(-1 * (l + t + b + r) + 5 * c, 0, 255)
        setPixel(x, y, val)
      }
    }

    // Copy edge pixels to avoid black border
    for (let x = 0; x < w; x++) {
      setPixel(x, 0, getBrightness(x, 0))
      setPixel(x, h - 1, getBrightness(x, h - 1))
    }
    for (let y = 0; y < h; y++) {
      setPixel(0, y, getBrightness(0, y))
      setPixel(w - 1, y, getBrightness(w - 1, y))
    }

    res.updatePixels()
    return res
  }
}

// Create a new instance of the sketch
new p5(sketch)
