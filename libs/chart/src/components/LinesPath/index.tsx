import { LinePath } from '@visx/shape'
import React, { Fragment, useMemo } from 'react'
import { AnimatePath } from './components/AnimatePath'
import { splitPath } from '../../utils/splitPath'
import { Value, LineInfo } from '../../type'
import { AnimateSharedLayout, motion } from 'framer-motion'
import { curveMonotoneX as curve } from '@visx/curve'

interface Props extends LineInfo {
  xScale: (label: string) => number
  yScale: (value: number) => number
  inView: boolean
  isCurve?: boolean
}
export const LinesPath: React.FC<Props> = React.memo(
  ({ isCurve = false, values, xScale, yScale, inView, color = '#222', dot = null }) => {
    const linesInfo = useMemo(() => {
      const result = splitPath(values)

      return result
    }, [values])

    return (
      <AnimateSharedLayout>
        <motion.g
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ opacity: 1, scaleX: 1, transition: { duration: 0.5 } }}
          style={{ originX: 0 }}
        >
          {linesInfo.map((lineInfo, index) => (
            <Fragment key={index}>
              <LinePath
                curve={isCurve ? curve : undefined}
                key={index}
                data={lineInfo}
                x={({ label }: Value) => {
                  return xScale(label) ?? 0
                }}
                y={({ value }: Value) => {
                  return yScale(value) ?? 0
                }}
                stroke={color}
                strokeWidth={1}
                shapeRendering="geometricPrecision"
                markerMid="url(#marker-circle)"
              >
                {({ path }) => {
                  return <AnimatePath d={path(lineInfo)} color={color} layoutId={`${index}`} />
                }}
              </LinePath>
              {lineInfo.map(
                (d) =>
                  dot && (
                    <motion.circle
                      layoutId={d?.label}
                      key={d?.label}
                      r={dot?.r ?? 4}
                      cx={xScale(d.label)}
                      cy={yScale(d.value)}
                      stroke={color}
                      fill={dot?.fill ?? color}
                    />
                  )
              )}
            </Fragment>
          ))}
        </motion.g>
      </AnimateSharedLayout>
    )
  }
)
