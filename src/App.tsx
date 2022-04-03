import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import "./App.css"
import Settings from "./Settings"
import Sketch from "./Sketch"

const App = () => {
  const [state, setState] = useState({
    numberLines: 200,
    baseColor: 0.8,
    colorRange: 0.3,
    maxDistance: 8,
    sampleSize: 2500,
  })

  return (
    <div className='App'>
      <Canvas>
        <Suspense fallback={null}>
          <Sketch {...state} />
        </Suspense>
      </Canvas>
      <Settings
        {...state}
        updateProperty={(property: any) => setState({ ...state, ...property })}
      />
    </div>
  )
}

export default App
