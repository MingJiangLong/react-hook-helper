type GlobalErrorDesc = {
  handle?: (error: any) => void
  updateHandle: (callback: (error: any) => void) => void
}

const GlobalError: GlobalErrorDesc = {
  handle: undefined,
  updateHandle(callback) {
    this.handle = callback
  },
}

export default GlobalError
