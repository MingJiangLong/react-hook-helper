import { useReducer } from "react"

export default function useUpdate() {
  return useReducer(pre => ++pre, 0)[1]
}