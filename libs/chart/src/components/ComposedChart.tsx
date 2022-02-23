import React, { createContext, useContext, useReducer } from 'react'
interface Dispatch {
  type: string
  payload?: any
}
const initial = {
  activeIndex: -1,
  cId: null,
  event: null
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'HOVER':
      return { ...state, activeIndex: action.payload.activeIndex, cId: action.payload.cId, event: action.payload.event }
    default:
      return state
  }
}
const Context = createContext({ state: initial, dispatch: (value: Dispatch) => null })
export const useComposedChart = () => useContext(Context)
export const ComposedChart: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial)
  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
}
