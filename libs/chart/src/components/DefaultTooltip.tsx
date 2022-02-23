import React from 'react'
import styled from 'styled-components'

import { TooltipProps } from '..'

const ColorBox = styled.div`
  width: 1em;
  height: 1em;

  border-radius: 0.25rem;
  border: 1px solid #ffffff;
`
const BoxAndValue = styled.div`
  display: grid;
  grid-gap: 0.25rem;
  grid-template-columns: max-content max-content;
  font-size: 0.75rem;

  padding: 0.125rem;
  p {
    font-weight: 800;

    margin: 0;
    font-size: 0.75rem;
  }
`

export const DefaultTooltip: React.FC<TooltipProps> = React.memo(({ data }) => {
  return (
    <div>
      {data?.map(({ color, value }, index) => {
        if (value.value === null) return null
        return (
          <BoxAndValue key={`boxAndValue - ${index}`}>
            <ColorBox style={{ background: color }} />
            <p className="label">{`${value.value}`}</p>
          </BoxAndValue>
        )
      })}
    </div>
  )
})
