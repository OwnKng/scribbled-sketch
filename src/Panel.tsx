//@ts-nocheck
import { useMemo, useState } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import Material from "./Material"

const Panel = () => {
  const texture = useTexture("head.png")
  const { width, height } = texture.image
  const numberOfPoints = width * height
  const threshold = 60

  const [state, setState] = useState(0)

  const [originalColors] = useMemo(() => {
    let numVisible = 0

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    ctx.scale(1, -1)
    ctx.drawImage(texture.image, 0, 0, width, height * -1)

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const originalColors = Float32Array.from(data)

    for (let i = 0; i < numberOfPoints; i++) {
      if (originalColors[i * 4 + 0] >= threshold) numVisible++
    }

    return [originalColors, numVisible]
  }, [width, height, texture.image, numberOfPoints])

  const [positions] = useMemo(() => {
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

    return [positions]
  }, [width, originalColors, numberOfPoints])

  const lines = useMemo(() => {
    const lines = []

    for (let i = 0; i < 200; i++) {
      const lineVertices = []
      const threshold = 3
      let tempPosition = new THREE.Vector3()

      const randomPoint = new THREE.Vector3(
        ...positions[Math.floor(Math.random() * positions.length)]
      )
      tempPosition = randomPoint
      let previousPoint = tempPosition.clone()

      for (let i = 0; i < 2500; i++) {
        tempPosition = new THREE.Vector3(
          ...positions[Math.floor(Math.random() * positions.length)]
        )

        if (tempPosition.distanceTo(previousPoint) < threshold) {
          lineVertices.push(new THREE.Vector3(...tempPosition))
          previousPoint = tempPosition.clone()
        }
      }

      lines[i] = lineVertices
    }

    return lines
  }, [positions])

  return (
    <group
      scale={[0.1, 0.1, 0.1]}
      position={[-4, -4.5, -2]}
      onClick={() => setState((prevVal) => (prevVal === 0 ? 1 : 0))}
    >
      {lines
        .filter((d) => d.length > 5)
        .map((d, i) => (
          <Tube vertices={d} key={i} reset={state} />
        ))}
    </group>
  )
}

const Tube = ({ vertices, reset }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(vertices), [vertices])

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 1000, 0.125, 12, false]} />
        <Material reset={reset} />
      </mesh>
    </>
  )
}

export default Panel
