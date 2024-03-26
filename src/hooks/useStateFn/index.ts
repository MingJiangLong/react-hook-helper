import useStateValue from "../useStateValue"
import { useRef, useCallback } from "react"
type Callback<T = any> = (...args: Array<any>) => Promise<T>
export default function useStateFn(callback: Callback) {
  const loading = useStateValue(false)
  const callbackRef = useRef<Callback>(callback)
  const exec = useCallback(async (...args: any[]) => {
    try {
      loading.current = true
      await callbackRef.current(...args)
    } finally {
      loading.current = false
    }
  }, [])

  return [exec, loading.current]
}
