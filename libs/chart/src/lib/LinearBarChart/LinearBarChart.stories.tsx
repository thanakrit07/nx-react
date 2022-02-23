import { LinearBarChart } from '.'
import React from 'react'
import numeral from 'numeral'
export default {
  component: LinearBarChart,
  title: 'Charts / Bar Chart / Linear',
  argTypes: {
    backgroundColor: { control: 'color' },
    axisLineColor: { control: 'color' },
    baseColor: { control: 'color' }
  }
}

const defaultArgs = {
  showOnly: false,

  axisLineColor: 'var(--disable-text)',
  baseColor: 'var(--dark-blue-grey)',
  data: {
    name: 'first',
    values: [...new Array(24)].map((_, i) => ({
      label: numeral(i).format('00'),
      value: Math.round(Math.random() * 15)
    })),
    color: 'red'
  }
}

const Template = (args) => (
  <div style={{ width: '45rem', height: '15rem', border: '1px solid black', background: 'white' }}>
    <LinearBarChart {...args} />
  </div>
)

export const Linear = Template.bind({})

Linear.args = {
  ...defaultArgs,
  referencesData: [
    {
      name: 'second',
      values: [...new Array(24)].map((_, i) => ({
        label: numeral(i).format('00'),
        value: Math.round(Math.random() * 18)
      })),
      color: 'blue'
    }
  ]
}

export const Diagonal = Template.bind({})

Diagonal.args = {
  ...defaultArgs,
  data: {
    name: 'first',
    values: [
      { label: '0', value: 15 },
      { label: '1', value: 1 },
      { label: '2', value: 0 },
      { label: '3', value: 0 }
    ],
    color: 'red'
  }
}

export const HaveManyNull = Template.bind({})

HaveManyNull.args = {
  ...defaultArgs,
  data: {
    name: 'first',
    values: [
      { label: '07', value: 15 },
      { label: '08', value: 15 },
      { label: '09', value: null },
      { label: '10', value: null },
      { label: '11', value: 12 },
      { label: '12', value: null },
      { label: '13', value: 9 },
      { label: '19', value: 12 }
    ],
    color: 'red'
  }
}
export const Complex = Template.bind({})

Complex.args = {
  ...defaultArgs,
  data: {
    name: 'first',
    values: [...new Array(24)].map((_, i) => ({
      label: numeral(i).format('00'),
      value: Math.round(Math.random() * 15)
    })),
    color: 'red',

    dot: {
      fill: 'red',
      r: 6
    }
  },
  referencesData: [
    {
      name: 'mid',
      values: [...new Array(24)].map((_, i) => ({
        label: numeral(i).format('00'),
        value: Math.round(Math.random() * 30)
      })),
      color: 'green',

      dot: {
        fill: 'green',
        r: 4
      }
    },
    {
      name: 'last',
      values: [...new Array(24)].map((_, i) => ({
        label: numeral(i).format('00'),
        value: Math.round(Math.random() * 8)
      })),
      color: 'blue',

      dot: {
        fill: 'white',
        r: 8
      }
    }
  ]
}
