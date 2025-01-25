// poorly adapted from https://github.com/constraint-systems/pal/

// This was not used for th 17th, it was incomplete

let myShader
let img

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

function preload () {
  // load each shader file (don't worry, we will come back to these!)
  myShader = loadShader('shader.vert', 'shader.frag')
  img = loadImage('images/mona.png')
}

function setup () {
  // the canvas has to be created with WEBGL mode
  createCanvas(600, 600, WEBGL)
}

function draw () {
  shader(myShader)
  myShader.setUniform('u_image', img)
  myShader.setUniform('iResolution', [1000, 1000])

  // plane(width, height);
  rect(0, 0, 600, 600)
}

function keyPressed () {
  if (key === 's') {
    saveCanvas(generateFilename('multi-color'))
  }
}
