precision mediump float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float frequency;
uniform float angle;
uniform bool cmyk_flag;

varying vec2 v_texCoord;

float aastep(float threshold, float value) {
    float afwidth = frequency * (1.0 / 1000.0);
    float minval = max(threshold - afwidth, 0.0);
    float maxval = min(threshold + afwidth, 1.0);
    return smoothstep(minval, minval, value);
}

vec2 rotate2D(vec2 v, float angdegree) {
    float c = cos(radians(angdegree));
    float s = sin(radians(angdegree));
    // v /= vec2(0.5);
    return mat2(c, -s, s, c) * v;
}

vec4 rgb2cmyki(vec3 c) {
    float w = max(max(c.r, c.g), c.b);
    return vec4((w - c.rgb) / w, 1.0 - w);
}

vec3 cmyki2rgb(vec4 c) {
    return (1.0 - c.rgb) * (1.0 - c.a);
}

float halftoneratio(vec2 st, float col, float frequency, float angdegree) {
    st *= vec2(1.0, iResolution.y / iResolution.x);
    st -= vec2(1.0);
    
    vec2 st2 = frequency * rotate2D(st, angdegree + angle);
    st2 += vec2(1.0);
    
    vec2 uv = 2.0 * fract(st2) - 1.0;
    uv *= 0.9;
    float newcol = aastep(0.0, sqrt(col) - length(uv));
    return newcol;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
      
    vec3 texcolor = texture2D(iChannel0, v_texCoord).xyz;
  
    vec3 rgbscreen;

    if (cmyk_flag) {
        vec4 cmyk = rgb2cmyki(texcolor);

        float k = halftoneratio(uv, cmyk.w, frequency, 45.0);
        float c = halftoneratio(uv, cmyk.x, frequency, 15.0);
        float m = halftoneratio(uv, cmyk.y, frequency, 75.0);
        float y = halftoneratio(uv, cmyk.z, frequency, 0.0);

        rgbscreen = cmyki2rgb(vec4(c, m, y, k));
    } else {
        vec3 texcol2 = (1.0 - texcolor);
        float r = halftoneratio(uv, texcol2.r, frequency, 15.0);
        float g = halftoneratio(uv, texcol2.g, frequency, 45.0);
        float b = halftoneratio(uv, texcol2.b, frequency, 0.0);
        rgbscreen = 1.0 - vec3(r, g, b);
    }

    gl_FragColor = vec4(rgbscreen, 1.0);
}
