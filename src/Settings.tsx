import { useState } from "react"

type settings = {
  numberLines: number
  baseColor: number
  colorRange: number
  maxDistance: number
  sampleSize: number
}

const Settings = ({ updateSettings }: any) => {
  const [state, setState] = useState<settings>({
    numberLines: 200,
    baseColor: 0.6,
    colorRange: 0.4,
    maxDistance: 3,
    sampleSize: 2000,
  })

  const onChange = (input: any) => {
    setState({
      ...state,
      [input.target.name]: input.target.value,
    })
  }

  const onSubmit = (submit: any) => {
    submit.preventDefault()
    updateSettings(state)
  }

  const { numberLines, baseColor, colorRange, maxDistance, sampleSize } = state

  return (
    <form className='settings'>
      <input
        type='range'
        min={1}
        max={200}
        name='numberLines'
        value={numberLines}
        onChange={(input) => onChange(input)}
      />
      <input
        type='range'
        min={100}
        max={5000}
        step={100}
        name='sampleSize'
        value={sampleSize}
        onChange={(input) => onChange(input)}
      />
      <input
        type='range'
        min={0.0}
        max={1.0}
        step={0.05}
        name='baseColor'
        value={baseColor}
        onChange={(input) => onChange(input)}
      />
      <input
        type='range'
        min={0.0}
        max={1.0}
        step={0.05}
        name='colorRange'
        value={colorRange}
        onChange={(input) => onChange(input)}
      />
      <input
        type='range'
        min={1}
        max={10}
        step={1}
        name='maxDistance'
        value={maxDistance}
        onChange={(input) => onChange(input)}
      />
      <button type='submit' onClick={(submit) => onSubmit(submit)}>
        update
      </button>
    </form>
  )
}

export default Settings
