precision mediump float;

uniform float frequency;
uniform vec2 u_resolution;
uniform float angle;
uniform sampler2D u_texture;
varying vec2 vTexCoord;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float f = frequency;

  // Center the coordinates to the middle of the screen
  vec2 centered_st = st - 0.5;

  mat2 rotation_matrix = mat2(0.707, 0.707, -0.707, 0.707);
  mat2 base_rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

  vec3 texcolor = texture2D(u_texture, vTexCoord).rgb;
  vec3 black = texcolor;

  vec4 cmyk;
  cmyk.xyz = 1.0 - texcolor;
  cmyk.w = min(cmyk.x, min(cmyk.y, cmyk.z));

  vec2 Kst = f * base_rotation * rotation_matrix * centered_st;
  vec2 Kuv = 2.0 * fract(Kst + 0.5) - 1.0;
  float k = step(0.0, sqrt(cmyk.w) - length(Kuv));

  vec2 Cst = f * base_rotation * mat2(0.966, 0.259, -0.259, 0.966) * centered_st;
  vec2 Cuv = 2.0 * fract(Cst + 0.5) - 1.0;
  float c = step(0.0, sqrt(cmyk.x) - length(Cuv));
  
  vec2 Mst = f * base_rotation * mat2(0.966, -0.259, 0.259, 0.966) * centered_st;
  vec2 Muv = 2.0 * fract(Mst + 0.5) - 1.0;
  float m = step(0.0, sqrt(cmyk.y) - length(Muv));
  
  vec2 Yst = f * base_rotation * centered_st;
  vec2 Yuv = 2.0 * fract(Yst + 0.5) - 1.0;
  float y = step(0.0, sqrt(cmyk.z) - length(Yuv));

  vec3 rgbscreen = 1.0 - vec3(c, m, y);
  rgbscreen = mix(rgbscreen, black, k);

  gl_FragColor = vec4(rgbscreen, 1.0);
}
