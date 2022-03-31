import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import "./App.css"
import Panel from "./Panel"
import Settings from "./Settings"

const App = () => {
  const [state, setState] = useState()

  return (
    <div className='App'>
      <Canvas>
        <Suspense fallback={null}>
          <Panel {...state} />
        </Suspense>
      </Canvas>
      <Settings updateSettings={setState} />
    </div>
  )
}

export default App
