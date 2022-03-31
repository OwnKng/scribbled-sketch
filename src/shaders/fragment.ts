import { hsl2rgb } from "./hsl2rgb"

export const fragmentShader = `
uniform float uFade;
uniform float uBaseColor; 
uniform float uColorRange; 

varying vec2 vUv; 
varying float vStrength; 

${hsl2rgb}

void main() {
    float strength = vStrength * 0.08; 

    float alpha = step(vUv.x, uFade);

    vec3 color = hsl2rgb(uBaseColor + strength * uColorRange, strength, strength);   

    gl_FragColor = vec4(color, alpha);
}
`
