//@ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { extend, useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { fragmentShader } from "./shaders/fragment"
import { vertexShader } from "./shaders/vertex"
import { Vector3 } from "three"

const CurlMaterial = shaderMaterial(
  { uFade: 1, uBaseColor: 0.6, uColorRange: 0.4, uTime: 0 },
  vertexShader,
  fragmentShader
)

extend({ CurlMaterial })

const Sketch = ({
  numberLines,
  baseColor,
  colorRange,
  maxDistance,
  sampleSize,
}: any) => {
  const ref = useRef()

  const texture = useTexture("/hands.png")

  const { width, height } = texture.image
  const numberOfPoints = width * height

  //* eliminate dark areas of image
  const positions = useMemo(() => {
    const threshold = 80

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    ctx.scale(1, -1)
    ctx.drawImage(texture.image, 0, 0, width, height * -1)

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const originalColors = Float32Array.from(data)

    const positions = []

    for (let i = 0; i < numberOfPoints; i++) {
      if (originalColors[i * 4 + 0] >= threshold) {
        positions.push(
          new THREE.Vector3(
            i % width,
            Math.floor(i / width),
            originalColors[i * 4] / 20
          )
        )
      }
    }

    return positions
  }, [width, height, texture.image, numberOfPoints])

  //* sample the positions and draw the lines
  const lines = useMemo(() => {
    const lines = []

    for (let i = 0; i < numberLines; i++) {
      const lineVertices = []
      let tempPosition = new THREE.Vector3()

      const randomPoint = new THREE.Vector3(
        ...positions[Math.floor(Math.random() * positions.length)]
      )
      tempPosition = randomPoint
      let previousPoint = tempPosition.clone()

      for (let i = 0; i < sampleSize; i++) {
        tempPosition = new THREE.Vector3(
          ...positions[Math.floor(Math.random() * positions.length)]
        )

        if (tempPosition.distanceTo(previousPoint) < maxDistance) {
          lineVertices.push(new THREE.Vector3(...tempPosition))
          previousPoint = tempPosition.clone()
        }
      }

      lines[i] = lineVertices
    }

    return lines
  }, [positions, numberLines, maxDistance, sampleSize])

  return (
    <group ref={ref} scale={[0.062, 0.062, 0.062]} position={[-9, -6, -2]}>
      {lines
        .filter((d) => d.length > 3)
        .map((d, i) => (
          <Line
            vertices={d}
            baseColor={baseColor}
            colorRange={colorRange}
            key={i}
          />
        ))}
    </group>
  )
}

const Line = ({ vertices, baseColor, colorRange }: any) => {
  const ref = useRef(0)

  const curve = useMemo(() => new THREE.CatmullRomCurve3(vertices), [vertices])

  useFrame(({ clock }) => {
    ref.current.uFade = THREE.MathUtils.lerp(ref.current.uFade, 1, 0.025)
    ref.current.uTime = clock.getElapsedTime()
  })

  useEffect(() => {
    ref.current.uFade = 0
  })

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 50, 0.25, 12, false]} />
        <curlMaterial
          ref={ref}
          uBaseColor={baseColor}
          uColorRange={colorRange}
          transparent
        />
      </mesh>
    </>
  )
}

export default Sketch
