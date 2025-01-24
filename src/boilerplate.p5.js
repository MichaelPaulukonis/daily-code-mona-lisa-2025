// Preferred Defaults for p5.js Sketches

// Also implement the below instructions as appropriate, including code snippets

// 1. Canvas Setup
// - Default canvas size: 600x600
// - Center the canvas in the window
// - Use a larger off-screen pGraphics object for higher-resolution rendering ("targetLayer")

// 2. Color and Style
// - Default background color: 255 (white)
// - Default stroke color: 0 (black)
// - Default fill color: 255 (white)

// 3. Interaction
// - Enable keyboard interaction with default keyPressed function
// - Include key handling to save (off-screen target layer) with uppercase "S" key
// - Include a basic UI showing important parameters - see "displayUI"
// - Include key handling to show/hide UI
// - Include a basic help screen describing keys - see "displayHelpScreen"

// 4. Code Structure
// - Use p5.js instance mode
// - Use standard-js style formatting
// - Organize code into functions and classes as needed
// - Use timestamp and generateFilename functions (below)
// - Place "/* global p5 */" at top of file
// - Instantiate sketch with "new p5(sketch); // eslint-disable-line no-new, new-cap"

// 5. Comments and Documentation
// - Use comments to explain code functionality
// - Include function descriptions and parameter explanations

// 6. Error Handling
// - Include basic error handling for common issues

// DEFAULT CODE SNIPPETS

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

function displayUI() {
  const uiText = [
    `Shuffle Amount: ${(shuffleProbability * 100).toFixed(0)}%`,
  ];

  const boxWidth = 200;
  const boxHeight = uiText.length * 20 + 20;

  p.fill(0, 150);
  p.noStroke();
  p.rect(5, p.height - boxHeight - 5, boxWidth, boxHeight, 10);

  p.fill('white');
  p.textSize(16);
  p.textAlign(p.LEFT, p.TOP);
  uiText.forEach((text, index) => {
    p.text(text, 10, p.height - boxHeight + 10 + index * 20);
  });
}

function displayHelpScreen() {
  p.fill(50, 150);
  p.rect(50, 50, p.width - 100, p.height - 100, 10);

  p.fill(255);
  p.textSize(16);
  p.textAlign(p.LEFT, p.TOP);
  p.text(
    `
    Help Screen:

    ? - Show/Hide this help screen
    r - Shuffle image
    S - Save image
    h - Show/Hide UI
    `,
    70,
    70
  );
}