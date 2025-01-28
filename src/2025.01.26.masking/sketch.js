/* global p5 */

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

const sketch = function (p) {
  let colorImg
  let bwImg
  let masks = []

  p.preload = function () {
    colorImg = p.loadImage('images/mona_square.jpeg')
    masks = [
      p.loadImage('images/splat.00.png'),
      p.loadImage('images/splat.01.png'),
      p.loadImage('images/thumbprint.01.png'),
      p.loadImage('images/tow.zone.png'),
      p.loadImage('images/vcs.01.png'),
      p.loadImage('images/watch.more.tv.png'),
      p.loadImage('images/gottlieb.01.png'),
      p.loadImage('images/green.beans.01.png'),
      p.loadImage('images/napster.png'),
      p.loadImage('images/pbs.png'),
      p.loadImage('images/peanuts.lucy.00.png')
    ]
  }

  p.setup = function () {
    p.createCanvas(colorImg.width, colorImg.height).drop(handleFile)
    p.noLoop()
  }

  p.draw = function () {
    paint()
  }

  function paint () {
    p.background(255)

    const gridSize = 4
    const inset = 20
    const cellWidth = p.width / gridSize
    const cellHeight = p.height / gridSize

    const insetWidth = cellWidth - inset * 2
    const insetHeight = cellHeight - inset * 2

    const scaleW = insetWidth / masks[0].width
    const scaleH = insetHeight / masks[0].height
    const scale = Math.min(scaleW, scaleH, 1)

    const newWidth = masks[0].width * scale
    const newHeight = masks[0].height * scale

    // Create an array of all possible cell positions
    const positions = []
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        positions.push({ row, col })
      }
    }

    // Randomly shuffle the positions
    const shuffledPositions = p.shuffle(positions)

    // Only use as many positions as we have masks
    const selectedPositions = shuffledPositions.slice(0, masks.length)

    // Draw only in selected positions
    selectedPositions.forEach((pos, index) => {
      const cellX = pos.col * cellWidth
      const cellY = pos.row * cellHeight

      const maskX = cellX + inset + (insetWidth - newWidth) / 2
      const maskY = cellY + inset + (insetHeight - newHeight) / 2

      p.push()
      p.drawingContext.save()
      p.drawingContext.beginPath()
      p.drawingContext.rect(
        cellX + inset,
        cellY + inset,
        insetWidth,
        insetHeight
      )
      p.drawingContext.clip()

      // Use each mask exactly once
      p.image(masks[index], maskX, maskY, newWidth, newHeight)

      p.drawingContext.globalCompositeOperation = 'lighten'
      p.image(colorImg, cellX + inset, cellY + inset, insetWidth, insetHeight)
      p.drawingContext.globalCompositeOperation = 'source-over'

      p.drawingContext.restore()
      p.pop()
    })
  }

  p.keyPressed = () => {
    if (p.key === 'S') {
      p.save(generateFilename('mona-mask'))
    }
  }

  p.mouseClicked = () => {
    paint()
  }

  function handleFile (file) {
    if (file.type === 'image') {
      p.loadImage(file.data, img => {
        masks.push(img)
        paint()
        console.log('Image loaded successfully')
      })
    } else {
      console.log('Not an image file!')
    }
  }
}

new p5(sketch) // eslint-disable-line no-new, new-cap
