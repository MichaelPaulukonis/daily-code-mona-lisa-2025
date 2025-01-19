let targetImg
let originalImg
let noiseSlider
let noiseMax = 50
let chanceSlider
let chance = 0.0

function preload () {
  originalImg = loadImage('images/quad-pop-20250115.224353.038.png') // Load your image
}

function setup () {
  createCanvas(originalImg.width, originalImg.height)
  targetImg = createImage(originalImg.width, originalImg.height)
  noLoop()
  
  noiseSlider = createSlider(0, 100, noiseMax)
  noiseSlider.position(10, 30)
  noiseSlider.style('width', '200px')
  noiseSlider.input(() => {
    noiseMax = noiseSlider.value()
    buildImage(originalImg, targetImg)
  })
  
  chanceSlider = createSlider(0, 1, chance, 0.1)
  chanceSlider.position(10, 60)
  chanceSlider.style('width', '200px')
  chanceSlider.input(() => {
    chance = chanceSlider.value()
    buildImage(originalImg, targetImg)
  })

  buildImage(originalImg, targetImg)
}

function buildImage (orig, img) {
  img.copy(orig, 0, 0, orig.width, orig.height,
           0, 0, orig.width, orig.height)
  
  img.loadPixels()

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let index = (x + y * img.width) * 4
      let r = img.pixels[index]
      let g = img.pixels[index + 1]
      let b = img.pixels[index + 2]


      // Add noise
      let noiseFactor = random() < chance ? Math.floor(random(-noiseMax, noiseMax)) : 0
      img.pixels[index] = constrain(r + noiseFactor, 0, 255)
      img.pixels[index + 1] = constrain(g + noiseFactor, 0, 255)
      img.pixels[index + 2] = constrain(b + noiseFactor, 0, 255)
    }
  }

  img.updatePixels()
  background(255)
  image(img, 0, 0)
}
