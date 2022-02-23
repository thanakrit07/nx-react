import React from 'react'
import { Group } from '@visx/group'
import { GridRows } from '@visx/grid'
import { Line, Bar } from '@visx/shape'
interface Props {
  yScale: any
  innerWidth: number
  innerHeight: number
  axisLineColor: string
  backgroundColor: string
  numTicks?: number
  margin?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}
export const Background: React.FC<Props> = React.memo(
  ({ margin, yScale, innerWidth, innerHeight, axisLineColor, backgroundColor, numTicks }) => {
    return (
      <Group>
        <Group left={margin.left} top={margin.top}>
          <Bar x={-8} y={-1} width={innerWidth + 16} height={innerHeight} fill={backgroundColor} />
          <GridRows
            scale={yScale}
            width={innerWidth}
            height={innerHeight}
            strokeDasharray={'0.5rem'}
            stroke={axisLineColor}
            numTicks={numTicks}
          />
          <Line
            from={{ x: 4 - margin.left, y: innerHeight }}
            to={{ x: innerWidth + 8, y: innerHeight }}
            stroke={axisLineColor}
            strokeWidth={1}
            pointerEvents="none"
          />
        </Group>
      </Group>
    )
  }
)
