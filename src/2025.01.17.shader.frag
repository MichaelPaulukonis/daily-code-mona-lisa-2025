// from https://www.shadertoy.com/view/MfKfDw

precision mediump float;
uniform vec3 iResolution;           // viewport resolution (in pixels)
uniform sampler2D u_image;          // input channel. XX = 2D/Cube

const float PI = acos(0.0) * 2.0;

void rotate(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

#define SCALE 50.0 // (pow(cos(iTime * 0.15), 4.0) * 88.0 + 8.0)

float dots(vec2 uv, float angle, sampler2D sampler, vec3 col) {
    rotate(uv, angle);
    
    vec2 samplePos = floor(uv + 0.5);
    rotate(samplePos, -angle);
    samplePos = samplePos / 96.0 * vec2(iResolution.y / iResolution.x, 1) + 0.5;
    
    vec3 textureCol = texture2D(sampler, samplePos + 0.2).rgb;
    
    float value;
    
    // key dots (black)
    if (col == vec3(0)) {
        value = (max(0.5 - textureCol.x, 0.0) + max(0.5 - textureCol.y, 0.0) + max(0.5 - textureCol.z, 0.0)) / 3.0;
        
    // normal cmy dots
    } else {
        value = dot(1.0 - textureCol, col);
        
        // area of circle --> radius
        value = sqrt(value / PI);
    }
    
    // clamp dot size (key fixes this)
    value = min(value, 0.5);
    
    return float(value > length(fract(uv - 0.5) - 0.5));
}

vec3 render(vec2 fragCoord) {
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);
    
    uv *= SCALE;
    
    vec3 col = 1.0 - vec3(
        dots(uv, -15.0 * PI / 180.0, u_image, vec3(1,0,0)) * 0.8,
        dots(uv, -75.0 * PI / 180.0, u_image, vec3(0,1,0)) * 0.8,
        dots(uv, 0.0 * PI / 180.0, u_image, vec3(0,0,1)) * 0.8
    );
    
    // key
    col -= float(dots(uv, -45.0 * PI / 180.0, u_image, vec3(0))) * 0.8;
    
    return col;
}

const float ANTI_ALIAS = 4.0;

void main() {

    vec3 col = vec3(0.0);
    
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv.y = 1.0 - uv.y;
    
    // anti aliasing
    for (float x = -0.5; x < 0.5; x += 1.0 / ANTI_ALIAS) {
        for (float y = -0.5; y < 0.5; y += 1.0 / ANTI_ALIAS) {
            col += render(gl_FragCoord.xy + vec2(x, y)) / (ANTI_ALIAS * ANTI_ALIAS);
        }
    }
    
    gl_FragColor = vec4(col,1.0);
}