precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_thresh;
uniform vec3 u_palette[8];
uniform int u_numColors;
varying vec2 v_texCoord;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main() {
  vec4 color = texture2D(u_image, v_texCoord);
  vec3 hsv = rgb2hsv(color.rgb);
  float lum = dot(color.rgb, vec3(0.2125, 0.7154, 0.0721));
  float bg = dot(color.rgb, u_palette[0]);
  float fg = dot(color.rgb, u_palette[1]);
  vec3 hued = vec3(1.0, 1.0, 1.0);
  if(lum <= u_thresh[0]) {
    if(bg <= fg) {
      hued = u_palette[0];
    } else {
      hued = u_palette[1];
    }
  } else if(lum >= u_thresh[1]) {
    if(bg <= fg) {
      hued = u_palette[1];
    } else {
      hued = u_palette[0];
    }
  } else if(color.r == color.g && color.g == color.b) {
    if(lum >= 0.5) {
      if(bg <= fg) {
        hued = u_palette[0];
      } else {
        hued = u_palette[1];
      }
    } else {
      if(bg <= fg) {
        hued = u_palette[1];
      } else {
        hued = u_palette[0];
      }
    }
  } else {
    float step = 1.0 / float(u_numColors + 1);
    if(hsv[0] <= step) {
      hued = u_palette[2];
    } else if(hsv[0] <= 2.0 * step) {
      hued = u_palette[3];
    } else if(hsv[0] <= 3.0 * step) {
      hued = u_palette[4];
    } else if(hsv[0] <= 4.0 * step) {
      hued = u_palette[5];
    } else if(hsv[0] <= 5.0 * step) {
      hued = u_palette[6];
    } else {
      hued = u_palette[7];
    }
  }
  gl_FragColor = vec4(hued, 1.0);
}