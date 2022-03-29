import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { ShaderMaterial } from "three"
import { lerp } from "three/src/math/MathUtils"
import { hsl2rgb } from "./shaders/hsl2rgb"

const vertexShader = `
    varying vec2 vUv; 
    varying float vStrength; 
    varying float vTime; 

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vUv = uv; 
        vStrength = position.z; 
    }
`

const fragmentShader = `
    uniform float uTime;

    varying vec2 vUv; 
    varying float vStrength; 

    ${hsl2rgb}

    void main() {
        float strength = vStrength * 0.08; 

        float alpha = step(vUv.x, uTime);

        vec3 color = hsl2rgb(0.6 + strength * 0.4, strength, strength);   

        gl_FragColor = vec4(color, alpha);
    }
`

const Material = ({ reset }: any) => {
  const ref = useRef<ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: reset },
    }),
    [reset]
  )

  useFrame(({ clock }) => {
    ref.current.uniforms.uTime.value = lerp(
      ref.current.uniforms.uTime.value,
      1,
      0.05
    )
  })

  useEffect(() => {
    ref.current.uniforms.uTime.value = 0
  }, [reset])

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
