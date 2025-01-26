precision mediump float;
uniform sampler2D u_image;
uniform float levels;
varying vec2 v_texCoord;


void main() {
  vec4 color = texture2D(u_image, v_texCoord);

  // Posterize each color channel
  color.r = floor(color.r * levels) / levels;
  color.g = floor(color.g * levels) / levels;
  color.b = floor(color.b * levels) / levels;
    
  gl_FragColor = color;
}