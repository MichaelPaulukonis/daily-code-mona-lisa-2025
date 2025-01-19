// poorly adapted from https://github.com/constraint-systems/pal/

let myShader
let img
let blurSlider
let blurAmount = 1
let imgCopy
let cachedBlur = -1
let colorTheme = null
let pallette = null
let shift = 0
let shiftMax = 6

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
  myShader = loadShader('2025.01.16.shader.vert', '2025.01.16.shader.frag')
  img = loadImage('images/mona.png')
}

function setup () {
  // the canvas has to be created with WEBGL mode
  createCanvas(600, 600, WEBGL)

  colorTheme = random(themes)
  setHues(colorTheme)

  blurSlider = createSlider(0, 10, blurAmount)
  blurSlider.position(10, windowHeight - 30)
  blurSlider.style('width', '200px')
  blurSlider.input(() => {
    blurAmount = blurSlider.value()
  })
}

function setHues (picked) {
  let hues = rotateArray(
    picked.hues.map(k => chroma(k).gl().slice(0, 3)),
    shift
  )
  let arranged = [
    chroma(picked.bg).gl().slice(0, 3),
    chroma(picked.fg).gl().slice(0, 3),
    ...hues
  ]

  pallette = new Float32Array(arranged.flat())
}

function rotateArray (arr, shiftAmount) {
  // Handle empty array or no shift needed
  if (!arr.length || shiftAmount === 0) return arr

  // Normalize shift amount to array length
  const shift = shiftAmount % arr.length

  // Handle negative shifts
  const normalizedShift = shift >= 0 ? shift : arr.length + shift

  // Slice and concat to create rotated array
  return arr.slice(normalizedShift).concat(arr.slice(0, normalizedShift))
}

function draw () {
  if (cachedBlur !== blurAmount) {
    cachedBlur = blurAmount
    imgCopy = createImage(img.width, img.height)
    imgCopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
    imgCopy.filter(BLUR, blurAmount)
    imgCopy.filter(BLUR, blurAmount)
    
  }

  shader(myShader)
  myShader.setUniform('u_image', imgCopy)
  myShader.setUniform('u_palette', pallette)
  myShader.setUniform('u_resolution', [1000, 1000])
  myShader.setUniform('u_thresh', [0.1, 0.9]) // apply the shader to a rectangle taking up the full canvas

  // plane(width, height);
  rect(0, 0, 600, 600)
}

function keyPressed () {
  if (key === 's') {
    saveCanvas(generateFilename('multi-color'))
  } else if (key === 'c') {
    colorTheme = random(themes)
    setHues(colorTheme)
  } else if (key === 'h') {
    shift -= 1
    setHues(colorTheme)
  } else if (key === 'l') {
    shift += 1
    setHues(colorTheme)
  } else if (key === 'r') {
    shift = 0
    setHues(colorTheme)
  }
}
