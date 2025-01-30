// from https://editor.p5js.org/ronikaufman/sketches/6u4GiF24N

let img

function preload () {
  img = loadImage('images/mona.png')
}

function setup () {
  createCanvas(400, 400)
  img.resize(width, height)
  pixelDensity(1)
  // img.filter(GRAY)
  noLoop()
}

function draw () {
  img.resize(80, 80)
  for (let i = 0; i < 100; i++) {
    sharpen(img)
    img.filter(BLUR)
    // img.filter(BLUR, 0.86);

    // img.filter(POSTERIZE, 5)
  }
  // sharpen(img);
  // sharpen(img);
  // sharpen(img);
  // sharpen(img);
  // sharpen(img);

  // img.filter(THRESHOLD, 0.5)

  img.resize(width, height)
  img.filter(POSTERIZE, 2)
  // img.filter(THRESHOLD, 0.55)

  image(img, 0, 0, width, height)
}

// All the following after Shiffman
// https://github.com/shiffman/LearningProcessing-p5.js/blob/master/chp15_images_pixels/example_15_13_Convolution/sketch.js

// The convolution matrix for a "sharpen" effect stored as a 3 x 3 two-dimensional array.
var matrix = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1]
]
var matrixsize = 3

function sharpen (img) {
  img.loadPixels()
  // Begin our loop for every pixel
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Each pixel location (x,y) gets passed into a function called convolution()
      // The convolution() function returns a new color to be displayed.
      var result = convolution(x, y, matrix, matrixsize, img)
      var loc = (x + y * img.width) * 4
      img.pixels[loc] = result[0]
      img.pixels[loc + 1] = result[1]
      img.pixels[loc + 2] = result[2]
      img.pixels[loc + 3] = 255
    }
  }
  img.updatePixels()
}

function convolution (x, y, matrix, matrixsize, img) {
  var rtotal = 0.0
  var gtotal = 0.0
  var btotal = 0.0
  var offset = floor(matrixsize / 2)

  // Loop through convolution matrix
  for (var i = 0; i < matrixsize; i++) {
    for (var j = 0; j < matrixsize; j++) {
      // What pixel are we testing
      var xloc = x + i - offset
      var yloc = y + j - offset
      var loc = (xloc + img.width * yloc) * 4

      // Make sure we haven't walked off the edge of the pixel array
      // It is often good when looking at neighboring pixels to make sure we have not gone off the edge of the pixel array by accident.
      loc = constrain(loc, 0, img.pixels.length - 1)
      // Calculate the convolution
      // We sum all the neighboring pixels multiplied by the values in the convolution matrix.
      rtotal += img.pixels[loc] * matrix[i][j]
      gtotal += img.pixels[loc + 1] * matrix[i][j]
      btotal += img.pixels[loc + 2] * matrix[i][j]
      //console.log(img.pixels[loc    ], matrix[i][j]);
    }
  }

  // Make sure RGB is within range
  rtotal = constrain(rtotal, 0, 255)
  gtotal = constrain(gtotal, 0, 255)
  btotal = constrain(btotal, 0, 255)

  // Return an array with the three color values
  return [rtotal, gtotal, btotal]
}
