export type Value = { label: string; value: number }

export interface LineInfo {
  name: string
  values: Value[]
  color: string
  dot?: { r?: number; fill?: string } | null
}
export interface BarInfo {
  name: string
  values: Value[]
  color: string
}

export interface TooltipProps {
  data: (Omit<LineInfo, 'values'> & { value: Value })[]
  label?: string
  index?: number
}

export interface LineChartProps extends ChartProps {
  data: LineInfo
  referencesData: LineInfo[]
  isCurve?: boolean
}
export interface BarChartProps extends ChartProps {
  data?: BarInfo
  referencesData?: BarInfo[]
}

export type BasicChartProps = {
  axisLineColor?: string
  backgroundColor?: string
}
export type ChartProps = BasicChartProps & {
  onClickTick?: (value: number) => void
  tickFormat?: (label: string) => string
  disabled?: boolean
  disabledByHour?: number[]
  baseColor?: string
  rectStroke?: string
  showOnly?: boolean
  Tooltip?: React.FC<TooltipProps>
  xAxisLabel?: string
  yAxisLabel?: string
  disabledTooltip?: boolean
}
