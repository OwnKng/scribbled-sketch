import { useState } from "react"

const ButtonGroup = ({ labels, selected, onClick = (f: any) => f }: any) => {
  const [state, setState] = useState<string>(selected)

  return (
    <div>
      {labels.map((label: string, i: number) => (
        <button
          key={`i-${label}`}
          name={label}
          className={state === label ? "active" : ""}
          onClick={(e) => {
            e.preventDefault()
            setState(label)
            onClick(label)
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default ButtonGroup
