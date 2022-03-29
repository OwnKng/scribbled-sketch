import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import { ShaderMaterial } from "three"
import { hsl2rgb } from "./shaders/hsl2rgb"

const vertexShader = `
    uniform float uTime; 

    varying vec2 vUv; 
    varying float vStrength; 
    varying float vTime; 

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv; 
        vStrength = position.z; 
        vTime = uTime; 
    }
`

const fragmentShader = `

    varying float vTime; 
    varying vec2 vUv; 
    varying float vStrength; 

    ${hsl2rgb}

    void main() {
        float strength = vStrength * 0.08; 

        vec3 color = hsl2rgb(0.6 + strength * 0.4, strength, strength);   

        gl_FragColor = vec4(color, 1.0);
    }
`

const Material = () => {
  const ref = useRef<ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    ref.current.uniforms.uTime.value = time
  })

  return (
    <shaderMaterial
      ref={ref}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={true}
    />
  )
}

export default Material
