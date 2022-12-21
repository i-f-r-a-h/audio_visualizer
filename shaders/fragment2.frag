precision mediump float;

varying vec3 vNormal;
varying float vNoise;
uniform float uTime;

// https://iquilezles.org/www/articles/palettes/palettes.html
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    // Try out different values.
    vec3 color1 = vec3(vNoise * 0.2, vNoise * 3.2, vNoise * 5.2);

    vec3 color2 = palette(
        vNormal.y,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.1, 0.5),
        vec3(1.0, 1.0, 0.5),
        vec3(0.8, 0.9, 0.3)
    );

    vec3 finalColor = mix(color1, color2, sin(uTime * 0.001));

    // Comment / uncomment for mix on/off.
    
    // One color.
    //gl_FragColor = vec4(color1, 1.0);

    // Mix.
    gl_FragColor = vec4(finalColor, 1.0);      
}