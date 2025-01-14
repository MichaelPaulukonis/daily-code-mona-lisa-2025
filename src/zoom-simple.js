const sketch = (p) => {
  let img
  let zoomFactor = 1

  p.preload = () => {
    img = p.loadImage('path/to/your/image.jpg') // Replace with the path to your image
  }

  p.setup = () => {
    p.createCanvas(600, 600)
  }

  p.draw = () => {
    p.background(255)
    const zoomedWidth = img.width * zoomFactor
    const zoomedHeight = img.height * zoomFactor
    const dx = (p.width - zoomedWidth) / 2
    const dy = (p.height - zoomedHeight) / 2
    p.image(img, dx, dy, zoomedWidth, zoomedHeight)
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