import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import "./App.css"
import Panel from "./Panel"

const App = () => {
  return (
    <div className='App'>
      <Canvas>
        <Suspense fallback={null}>
          <Panel />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
