import GlobalErrorHandle from "../../utils/GlobalError"
import useStateValue from "../useStateValue"

type Callback = () => Promise<void>

/**
 * 异步函数添加loading
 * @param callback !需要返回Promise
 * @param errorCallback 如果没传会使用GlobalError.handle 
 * @returns 
 */
export default function useLoading(
  callback: Callback,
  errorCallback?: (message: any) => void
) {
  const loading = useStateValue(false)

  async function exec() {
    try {
      if (loading.current) return
      loading.current = true
      await callback()
    } catch (error: any) {
      if (typeof errorCallback === "function") {
        return errorCallback(error)
      }

      if (typeof GlobalErrorHandle.handle === "function") {
        return GlobalErrorHandle.handle(error)
      }
      throw error
    } finally {
      loading.current = false
    }
  }
  return [exec, loading.current]
}
