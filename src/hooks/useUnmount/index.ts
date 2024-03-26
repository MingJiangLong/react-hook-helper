import { useEffect, useRef } from "react"
type Callback = () => void
export default function (cb?: Callback) {
  const cbRef = useRef<any>()
  cbRef.current = cb;
  useEffect(() => {
    return () => {
      typeof cbRef.current === "function" && cbRef.current()
    }
  }, [])
}
