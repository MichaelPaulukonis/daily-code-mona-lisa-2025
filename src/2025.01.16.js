// poorly adapted from https://github.com/constraint-systems/pal/

// see also https://github.com/glslify/glsl-halftone

let myShader
let img
let blurSlider
let threshLowSlider
let threshHighSlider
let threshLow = 0.2
let threshHigh = 0.8
let blurAmount = 1
let imgCopy
let cachedBlur = -1
let themeIndex = 0
let colorTheme = null
let pallette = null
let shift = 0
let numColors = 8 // Default number of colors

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

  themeIndex = Math.floor(random(themes.length))
  colorTheme = themes[themeIndex]
  setHues(colorTheme)

  blurSlider = createSlider(0, 10, blurAmount)
  blurSlider.position(10, windowHeight - 30)
  blurSlider.style('width', '200px')
  blurSlider.attribute('title', 'blur')
  blurSlider.input(() => {
    blurAmount = blurSlider.value()
  })

  threshLowSlider = createSlider(0.0, 1.0, threshLow, 0.1)
  threshLowSlider.position(10, windowHeight - 60)
  threshLowSlider.style('width', '200px')
  threshLowSlider.attribute('title', 'threshold low')
  threshLowSlider.input(() => {
    threshLowSlider.elt.value = Math.min(0.5, threshLowSlider.value())
    threshLow = threshLowSlider.value()
  })

  threshHighSlider = createSlider(0.0, 1.0, threshHigh, 0.1)
  threshHighSlider.position(10, windowHeight - 90)
  threshHighSlider.style('width', '200px')
  threshHighSlider.attribute('title', 'threshold high')
  threshHighSlider.input(() => {
    threshHighSlider.elt.value = Math.max(0.5, threshHighSlider.value())
    threshHigh = threshHighSlider.value()
  })
}

function setHues (picked) {
  const hues = picked.hues.map(k => chroma(k).gl().slice(0, 3))

  let arranged = rotateArray(
    [
      chroma(picked.bg).gl().slice(0, 3),
      chroma(picked.fg).gl().slice(0, 3),
      ...hues
    ],
    shift
  ).slice(0, numColors) // Limit the number of hues

  // Ensure the palette has exactly 8 elements
  while (arranged.length < 8) {
    arranged.push([0.0, 0.0, 0.0]) // Fill with black or any default color
  }

  // 6 hues from theme, plus foreground and background
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
  myShader.setUniform('u_numColors', numColors)
  myShader.setUniform('u_resolution', [1000, 1000])
  myShader.setUniform('u_thresh', [threshLow, threshHigh])
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
  } else if (key === 'j') {
    themeIndex = (themeIndex - 1) % themes.length
    colorTheme = themes[themeIndex]
    setHues(colorTheme)
  } else if (key === 'k') {
    themeIndex = (themeIndex + 1) % themes.length
    colorTheme = themes[themeIndex]
    setHues(colorTheme)
  } else if (key === 'r') {
    shift = 0
    setHues(colorTheme)
  } else if ('12345678'.indexOf(key) !== -1) {
    numColors = Number.parseInt(key, 10)
    setHues(colorTheme)
  }
}
