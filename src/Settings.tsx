import ButtonGroup from "./ButtonGroup"

type settings = {
  numberLines: number
  baseColor: number
  colorRange: number
  maxDistance: number
  sampleSize: number
  updateProperty: (f: any) => void
}

const createThreshold = (map: any[]) => (input: string) => {
  const [f1, f2, f3] = map
  input === "high" ? f1() : input === "med" ? f2() : f3()
}

const Settings = ({
  numberLines,
  baseColor,
  colorRange,
  maxDistance,
  sampleSize,
  updateProperty,
}: settings) => (
  <form className='settings'>
    <p>Controls</p>
    <div>
      <p>Number of lines</p>
      <ButtonGroup
        labels={["low", "med", "high"]}
        selected='med'
        onClick={(f: string) =>
          createThreshold([
            () => updateProperty({ numberLines: 300 }),
            () => updateProperty({ numberLines: 200 }),
            () => updateProperty({ numberLines: 100 }),
          ])(f)
        }
      />
    </div>
    <div>
      <p>Sample size</p>
      <ButtonGroup
        labels={["low", "med", "high"]}
        selected='med'
        onClick={(f: string) =>
          createThreshold([
            () => updateProperty({ sampleSize: 4000 }),
            () => updateProperty({ sampleSize: 2500 }),
            () => updateProperty({ sampleSize: 1000 }),
          ])(f)
        }
      />
    </div>
    <div>
      <p>Max distance lines</p>
      <ButtonGroup
        labels={["low", "med", "high"]}
        selected='med'
        onClick={(f: string) =>
          createThreshold([
            () => updateProperty({ maxDistance: 10 }),
            () => updateProperty({ maxDistance: 8 }),
            () => updateProperty({ maxDistance: 4 }),
          ])(f)
        }
      />
    </div>
    <div>
      <label htmlFor='baseColor'>Base color</label>
      <input
        id='baseColor'
        type='range'
        min={0.0}
        max={1.0}
        step={0.1}
        name='baseColor'
        value={baseColor}
        onChange={(input) =>
          updateProperty({ [input.target.name]: input.target.value })
        }
      />
      <span>{baseColor}</span>
    </div>
    <div>
      <label htmlFor='colorRange'>Color range</label>
      <input
        type='range'
        min={0.0}
        max={1.0}
        step={0.1}
        name='colorRange'
        value={colorRange}
        onChange={(input) =>
          updateProperty({ [input.target.name]: input.target.value })
        }
      />
      <span>{colorRange}</span>
    </div>
  </form>
)

export default Settings
