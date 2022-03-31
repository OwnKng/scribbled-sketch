export const vertexShader = `
    varying vec2 vUv; 
    varying float vStrength; 

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv; 
        vStrength = position.z; 
    }
`
