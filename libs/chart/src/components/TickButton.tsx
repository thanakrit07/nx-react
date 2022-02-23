import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { TickRendererProps } from '@visx/axis'
const G = styled.g<{ color: string; baseColor: string; rectStroke: string }>`
  ${({ color, baseColor, rectStroke }) => css`
    cursor: pointer;

    text {
      font-size: 12px;
      text-anchor: middle;
      fill: ${baseColor};
      user-select: none;
      font-weight: bold;
    }
    rect {
      fill: transparent;
      stroke-width: 1;
      stroke: ${baseColor};
      stroke: ${rectStroke};
    }
    &:hover {
      text {
        fill: ${color};
      }
      rect {
        stroke: ${color};
      }
    }
  `}
`

const ActiveG = styled.g<{ color: string }>`
  ${({ color }) => css`
    cursor: pointer;
    text {
      font-size: 12px;
      text-anchor: middle;
      fill: #ffffff;
      user-select: none;
    }
    rect {
      fill: ${color};
      stroke: ${color};
    }
  `}
`

const DisabledG = styled.g`
  text {
    font-size: 12px;
    text-anchor: middle;
    fill: #ffffff;
    user-select: none;
    font-weight: bold;
  }
  rect {
    fill: var(--light-periwinkle);
    stroke-width: 1;
    stroke: var(--light-periwinkle);
  }
`
const OutlineDisabledG = styled.g`
  text {
    font-size: 12px;
    text-anchor: middle;
    fill: var(--light-periwinkle);
    user-select: none;
  }
  rect {
    fill: #ffffff;
    stroke-width: 1;
    stroke: var(--light-periwinkle);
  }
`

const ShowOnlyG = styled.g`
  text {
    font-size: 12px;
    text-anchor: middle;
    fill: var(--b-grey);
    user-select: none;
  }
  rect {
    fill: var(--disable-area);
    stroke-width: 1;
    stroke: var(--disable-area);
  }
`

interface Props extends TickRendererProps {
  index: number
  showOnly?: boolean
  disabled?: boolean
  disabledByHour?: number[]
  baseColor?: string
  rectStroke?: string
  activeTicks?: boolean[]
  children: string
}
export const TickButton: React.FC<Props> = React.memo((props) => {
  const {
    index,
    x,
    y,
    formattedValue,
    disabled,
    disabledByHour,
    color,
    activeTicks,
    baseColor,
    rectStroke,
    showOnly,
    onClick,
    onTouchStart,
    onTouchMove,
    onMouseMove,
    onMouseLeave,
    children
  } = props

  const isDisabled = disabled || disabledByHour?.includes(index)

  const gProps = useMemo(
    () => ({
      transform: `translate(${x},${y + 8})`,
      color,
      onTouchStart,
      onTouchMove,
      onMouseMove,
      onMouseLeave
    }),
    [color, onMouseLeave, onMouseMove, onTouchMove, onTouchStart, x, y]
  )
  const rectProps = {
    width: `calc(${children.length}ch + 6px)`,
    height: 20,
    style: { transform: `translateX(-${children.length / 2}ch)` },
    x: -3,
    y: -18,
    rx: 4,
    ry: 4
  }
  if (showOnly) {
    return (
      <ShowOnlyG {...gProps} className={`disabled`} data-testid={`tick-show-only-${formattedValue}`}>
        <rect {...rectProps} />
        <text x={0} y={-3} dy={0}>
          {children}
        </text>
      </ShowOnlyG>
    )
  } else if (isDisabled) {
    if (activeTicks[index])
      return (
        <DisabledG {...gProps} className={`disabled`} data-testid={`tick-disabled-value-${formattedValue}`}>
          <rect {...rectProps} />
          <text x={0} y={-3} dy={0}>
            {children}
          </text>
        </DisabledG>
      )
    else
      return (
        <OutlineDisabledG {...gProps} className={`normal`} data-testid={`tick-disabled-none-${formattedValue}`}>
          <rect {...rectProps} />
          <text x={0} y={-3} dy={0}>
            {children}
          </text>
        </OutlineDisabledG>
      )
  } else if (activeTicks[index])
    return (
      <ActiveG {...gProps} className={`active`} data-testid={`tick-active-${formattedValue}`} onClick={onClick}>
        <rect {...rectProps} />
        <text x={0} y={-3} dy={0}>
          {children}
        </text>
      </ActiveG>
    )
  return (
    <G
      {...gProps}
      baseColor={baseColor}
      rectStroke={rectStroke}
      className={`normal`}
      data-testid={`tick-${formattedValue}`}
      onClick={onClick}
    >
      <rect {...rectProps} />
      <text x={0} y={-3} dy={0}>
        {children}
      </text>
    </G>
  )
})
