//@ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { extend, useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { fragmentShader } from "./shaders/fragment"
import { vertexShader } from "./shaders/vertex"

const CurlMaterial = shaderMaterial(
  { uFade: 1, uBaseColor: 0.6, uColorRange: 0.4 },
  vertexShader,
  fragmentShader
)

extend({ CurlMaterial })

const Panel = () => {
  const { viewport } = useThree()

  const texture = useTexture("head.png")
  const { width, height } = texture.image
  const numberOfPoints = width * height

  const threshold = 60

  const [, setState] = useState(1)

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
    <>
      <mesh onClick={() => setState((prevState) => (prevState === 1 ? 0 : 1))}>
        <planeBufferGeometry args={[viewport.width, viewport.height, 1, 1]} />
        <meshBasicMaterial color='black' opacity={0} transparent />
      </mesh>
      <group scale={[0.1, 0.1, 0.1]} position={[-4, -4.5, -2]}>
        {lines
          .filter((d) => d.length > 5)
          .map((d, i) => (
            <Tube vertices={d} key={i} />
          ))}
      </group>
    </>
  )
}

const Tube = ({ vertices }) => {
  const ref = useRef(0)

  const curve = useMemo(() => new THREE.CatmullRomCurve3(vertices), [vertices])

  useFrame(
    () =>
      (ref.current.uFade = THREE.MathUtils.lerp(ref.current.uFade, 1, 0.025))
  )

  useEffect(() => {
    ref.current.uFade = 0
  })

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 500, 0.125, 12, false]} />
        <curlMaterial ref={ref} transparent />
      </mesh>
    </>
  )
}

export default Panel
