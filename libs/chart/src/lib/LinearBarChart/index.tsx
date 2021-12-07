import React, { useCallback, useMemo } from 'react'
import { ParentSize } from '@visx/responsive'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'
import { TickButton } from '../../components/TickButton'
import { useTooltip, TooltipWithBounds } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import { Bar, BarGroup } from '@visx/shape'
import numeral from 'numeral'
import { motion } from 'framer-motion'
import { Value, BarChartProps, TooltipProps } from '../../type'
import { DefaultTooltip } from '../../components/DefaultTooltip'
import { Axis } from '../../components/Axis'
import { Background } from '../../components/Background'

//utils
const getMinMax = (arr: number[]) => {
  return [Math.min(...arr), Math.max(...arr)]
}
const getXIndex = (values: Value[], label: string) => {
  return values.findIndex((value) => value.label === label)
}
const DefaultFormatTick = (label: string) => {
  return numeral(parseInt(label)).format('00')
}
export const LinearBarChart: React.FC<BarChartProps> = (props) => {
  return (
    <ParentSize>{({ width, height }) => <LinearBarChartSVG width={width} height={height} {...props} />}</ParentSize>
  )
}

let tooltipTimeout: number

interface LineChartSVGProps extends BarChartProps {
  width: number
  height: number
}
const LinearBarChartSVG: React.FC<LineChartSVGProps> = ({
  width,
  height,
  data,
  onClickTick,
  disabled,
  disabledByHour,
  baseColor,
  axisLineColor = 'transparent',
  backgroundColor = 'transparent',
  showOnly,
  referencesData = [],
  Tooltip = DefaultTooltip,
  xAxisLabel = 'Hr',
  yAxisLabel = 'THB',
  tickFormat = DefaultFormatTick
}) => {

  const [, max] = useMemo(
    () => getMinMax([...referencesData, data].flatMap(({ values }) => values.map(({ value }) => value))),
    [data, referencesData]
  )

  const margin = useMemo(() => ({ top: 48, bottom: 32, left: 48, right: 16 }), [])
  const innerWidth = useMemo(() => width - margin.left - margin.right, [margin.left, margin.right, width])
  const innerHeight = useMemo(() => height - margin.top - margin.bottom, [height, margin.bottom, margin.top])

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<TooltipProps>()

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.values.map(({ label }) => label),
        padding: 0.4,
        range: [0, innerWidth] // svg x-coordinates, svg x-coordinates increase left to right,
      }),
    [data.values, innerWidth]
  )
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, max < 6 ? 6 : max],
        range: [innerHeight, 0],
        nice:true
      }),
    [innerHeight, max]
  )
  const keysName = useMemo(() => [data, ...referencesData].map(({ name }) => name), [data, referencesData])
  const groupScale = scaleBand<string>({
    domain: keysName,
    padding: 0,
    range: [0, xScale.bandwidth()]
  })
  const colorScale = scaleOrdinal<string, string>({
    domain: keysName,
    range: [data, ...referencesData].map(({ color }) => color)
  })
  const groupData = useMemo(() => {
    return [data, ...referencesData].reduce((prev, curr) => {
      return curr.values.map(({ value, label }, index) => ({ label, ...prev[index], [curr.name]: value }))
    }, [])
  }, [data, referencesData])

  const activeTicks = useMemo(() => data.values.map(({ value }) => (value !== null ? true : false)), [data.values])

  const handleTooltipOnArea = useCallback(
    (index: number) => (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)

      const { y } = localPoint(event) || { x: 0 }
      const d = data.values[index]
      const allNothing = [...referencesData, data].every(({ values }) => {
        return values[index]?.value === null
      })
      if (allNothing) {
        hideTooltip()
      } else
        showTooltip({
          tooltipData: {
            data: [data, ...referencesData].map(({ values, ...rest }) => ({ value: values[index], ...rest })),
            label: d?.label,
          },
          tooltipLeft: xScale(d?.label) + margin.left,
          tooltipTop: y
        })
    },
    [data, hideTooltip, margin.left, referencesData, showTooltip, xScale]
  )

  const handleTooltipOnTick = useCallback(
    (index: number) => () => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)
      const d = data.values[index]

      showTooltip({
        tooltipData: {
          data: [data, ...referencesData].map(({ values, ...rest }) => ({ value: values[index], ...rest })),
          label: d?.label,
        },
        tooltipLeft: xScale(d?.label) + margin.left,
        tooltipTop: yScale(d?.value) + margin.top
      })
    },
    [data, margin.left, margin.top, referencesData, showTooltip, xScale, yScale]
  )

  const bottomTickComponent = useCallback(
    (props) => {
      const index = parseInt(props.formattedValue)
      return (
        <TickButton
          {...props}
          index={index}
          color={data.color}
          activeTicks={activeTicks}
          onClick={() => onClickTick(index)}
          showOnly={showOnly}
          disabled={disabled}
          baseColor={baseColor}
          disabledByHour={disabledByHour}
          onTouchStart={handleTooltipOnTick(index)}
          onTouchMove={handleTooltipOnTick(index)}
          onMouseMove={handleTooltipOnTick(index)}
          onMouseLeave={() => {
            tooltipTimeout = window.setTimeout(() => {
              hideTooltip()
            }, 300)
          }}
        >
          {tickFormat(props.formattedValue)}
        </TickButton>
      )
    },
    [
      activeTicks,
      baseColor,
      data.color,
      data.values,
      disabled,
      disabledByHour,
      handleTooltipOnTick,
      hideTooltip,
      onClickTick,
      showOnly
    ]
  )
  const numTicks = useMemo(() => {
    if (max === 0) return 4
    return max >= 6 ? 6 : Math.ceil(max)
  }, [max])

  if (width < 10) return null
  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} >
        {tooltipData && (
          <motion.g>
            <Bar
              x={tooltipLeft}
              y={margin.top}
              width={xScale.bandwidth()}
              height={innerHeight}
              fill="var(--disable-area)"
            />
          </motion.g>
        )}
        <Background
          numTicks={numTicks}
          margin={margin}
          axisLineColor={axisLineColor}
          backgroundColor={backgroundColor}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          yScale={yScale}
        />

        <Axis
          margin={margin}
          innerHeight={innerHeight}
          yScale={yScale}
          xScale={xScale}
          bottomNumTicks={data.values.length}
          leftNumTicks={numTicks}
          bottomTickComponent={bottomTickComponent}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
        />
        <Group left={margin.left} top={margin.top}>
          <BarGroup
            data={groupData}
            keys={keysName}
            height={innerHeight}
            x0={(d) => d.label}
            x0Scale={xScale}
            x1Scale={groupScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => (
                <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                  {barGroup.bars.map((bar) => {
                    return (
                      <motion.rect
                        key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                        initial={{ x: bar.x, y: bar.y, width: bar.width, height: 0, translateY: bar.height }}
                        animate={{ height: bar.height, translateY: 0 }}
                        transition={{ duration: 0.5 }}
                        fill={bar.color}
                      />
                    )
                  })}
                  <Bar
                    x={0}
                    y={0}
                    width={xScale.bandwidth()}
                    height={innerHeight}
                    fill="transparent"
                    onTouchStart={handleTooltipOnArea(barGroup.index)}
                    onTouchMove={handleTooltipOnArea(barGroup.index)}
                    onMouseMove={handleTooltipOnArea(barGroup.index)}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip()
                      }, 300)
                    }}
                  />
                </Group>
              ))
            }
          </BarGroup>
        </Group>
      </svg>

      {tooltipOpen && (
        <TooltipWithBounds key={tooltipData.data[0].name} top={tooltipTop} left={tooltipLeft}>
          <Tooltip {...tooltipData} />
        </TooltipWithBounds>
      )}
    </div>
  )
}
