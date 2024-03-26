import { useMemo, useState } from "react"
import useUpdate from "../useUpdate"

type Callback = () => void

export default function useStateValue<T = any>(
  initialValue: T
): {
  current: T
} {
  const forceUpdate = useUpdate()
  const state = useMemo(() => {
    return createProxy(
      {
        current: initialValue,
      },
      forceUpdate
    )
  }, [])
  return state
}

const proxyCache = new WeakMap()
function isProxiedValue(value: object) {
  return proxyCache.has(value)
}

function canValueBeProxied(value: unknown): value is object {
  if (Array.isArray(value)) return true
  if (Object.prototype.toString.call(value) === "[object Object]") return true
  return false
}

function isWritable(descriptor: any) {
  return descriptor?.configurable && descriptor?.writable
}
/**
 * 创建代理
 * @param value
 */
function createProxy<T extends Record<string, unknown> | Array<unknown>>(
  value: T,
  callback: Callback
) {
  if (isProxiedValue(value)) return proxyCache.get(value)

  const proxy = new Proxy(value, {
    get(target, p, receiver) {
      const ret = Reflect.get(target, p, receiver)
      if (!isWritable(Reflect.getOwnPropertyDescriptor(target, p))) return ret
      if (!canValueBeProxied(ret)) return ret
      return createProxy(ret as any, callback)
    },

    set(target, p, newValue) {
      let ret = Reflect.set(target, p, newValue)
      if (ret) {
        callback()
      }
      return ret
    },
    deleteProperty(target, p) {
      const ret = Reflect.deleteProperty(target, p)
      if (ret) {
        callback()
      }
      return ret
    },
  }) as T
  proxyCache.set(value, proxy)
  return proxy
}