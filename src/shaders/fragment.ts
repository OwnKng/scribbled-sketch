import { hsl2rgb } from "./hsl2rgb"

export const fragmentShader = `
uniform float uFade;
uniform float uBaseColor; 
uniform float uColorRange;
uniform float uTime;  

varying vec2 vUv; 
varying float vStrength; 

${hsl2rgb}

void main() {
    float wave = sin(uTime * 0.25) * 0.5 + 0.5; 
    wave = smoothstep(wave - 0.025, wave, vUv.x) + 1.0 - smoothstep(wave, wave + 0.025, vUv.x); 
    wave = wave - 1.0; 
    wave *= 0.2; 

    float strength = vStrength * 0.07 - 0.1; 

    float alpha = step(vUv.x, uFade);

    vec3 color = hsl2rgb(uBaseColor + strength * uColorRange, strength + wave, strength + wave);   

    gl_FragColor = vec4(color, alpha);
}
`
