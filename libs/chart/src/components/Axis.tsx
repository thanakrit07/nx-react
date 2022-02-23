import React, { useCallback } from 'react'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Group } from '@visx/group'
import { Text } from '@visx/text'

import numeral from 'numeral'
interface Props {
  innerHeight: number
  xScale: any
  yScale: any
  bottomNumTicks?: number
  leftNumTicks?: number
  bottomTickComponent?: (props: any) => JSX.Element
  margin?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  paddingInside?: number
  xAxisLabel?: string
  xAxisColor?: string
  yAxisLabel?: string
  yAxisColor?: string
  bottomTickValues?: unknown[]
  leftTickValues?: unknown[]
}
export const Axis: React.FC<Props> = React.memo(
  ({
    innerHeight,
    xScale,
    yScale,
    bottomNumTicks,
    leftNumTicks,
    bottomTickComponent,
    margin,
    paddingInside = 0,
    xAxisLabel,
    yAxisLabel,
    xAxisColor = 'var(--secondary)',
    yAxisColor = 'var(--b-grey)',
    leftTickValues,
    bottomTickValues
  }) => {
    const leftTickComponent = useCallback(
      ({ formattedValue, ...props }) => (
        <Text {...props} fontSize={10} fill={xAxisColor}>
          {formattedValue}
        </Text>
      ),
      [xAxisColor]
    )
    const leftTickFormat = useCallback((v) => numeral(v).format(v >= 1000 ? '0,0.0a' : '0.00'), [])
    const bottomTickFormat = useCallback((v: string) => v, [])
    return (
      <>
        <Text
          x={8}
          y={margin.top - 20}
          width={24}
          fill={xAxisColor}
          verticalAnchor="start"
          fontWeight={600}
          fontSize={10}
        >
          {yAxisLabel}
        </Text>
        <Text
          x={18}
          y={innerHeight + margin.top + 12}
          width={40}
          fill={yAxisColor}
          fontWeight={600}
          textAnchor="middle"
          verticalAnchor="start"
        >
          {xAxisLabel}
        </Text>
        <Group left={margin.left} top={margin.top}>
          <Group left={-4}>
            <AxisLeft
              scale={yScale}
              hideAxisLine
              hideTicks
              hideZero
              tickValues={leftTickValues}
              numTicks={leftNumTicks}
              tickFormat={leftTickFormat}
              tickComponent={leftTickComponent}
            />
          </Group>
          <Group left={paddingInside}>
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              hideTicks
              hideAxisLine
              numTicks={bottomNumTicks}
              rangePadding={8}
              tickValues={bottomTickValues}
              tickFormat={bottomTickFormat}
              tickComponent={bottomTickComponent}
            />
          </Group>
        </Group>
      </>
    )
  }
)
