import { useEffect } from "react"

type Callback = () => void
export default function (cb?: Callback) {
  useEffect(() => {
    cb?.()
  }, [])
}
