import { motion } from 'framer-motion'
import React from 'react'

interface Props {
  d: string
  color: string
  layoutId: string
}
export const AnimatePath: React.FC<Props> = React.memo(({ d, color, layoutId }) => {
  if (d === '') return null
  return <motion.path stroke={color} strokeWidth={1.6} d={d} fill="transparent" />
})
