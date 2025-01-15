const sketch = p => {
  let img
  let zoomFactor = 1

  p.preload = () => {
    img = p.loadImage('images/mona.crosshairs.png')
  }

  p.setup = () => {
    p.createCanvas(600, 600)
    zoomFactor = p.width / img.width
    p.fill(0)
    p.stroke('white')
    p.strokeWeight(2)
    p.textSize(16)
    p.textAlign(p.CENTER, p.CENTER)
  }

  p.draw = () => {
    p.background(255)
    const zoomedWidth = img.width * zoomFactor
    const zoomedHeight = img.height * zoomFactor
    const dx = (p.width - zoomedWidth) / 2
    const dy = (p.height - zoomedHeight) / 2
    p.image(img, dx, dy, zoomedWidth, zoomedHeight)
    p.text(`${zoomFactor}`, p.width / 2, p.height - 20)
  }

  p.keyPressed = () => {
    if (p.key === '>') {
      zoomFactor *= 1.1
    } else if (p.key === '<') {
      zoomFactor /= 1.1
    }
  }
}

new p5(sketch)
